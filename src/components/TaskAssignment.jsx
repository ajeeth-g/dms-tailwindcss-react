import { motion } from "framer-motion";
import { FileText, View } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { getAllUsers } from "../api/getAllUsers";
import { formatDateTime } from "../utils/dateUtils";
import TaskForm from "./TaskForm";
import Button from "./common/Button";
import { getDataModel } from "../services/dataService";
import LoadingSpinner from "./common/LoadingSpinner";

export default function TaskAssignment() {
  // States for SOAP parameters (if needed for re-fetching)
  const [dataModelName] = useState("SYNM_DMS_MASTER");
  const [whereCondition] = useState("");
  const [orderby] = useState("");

  // Data & loading/error states
  const [docsData, setDocsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  // State for selected document (for modal editing)
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const modalRef = useRef(null);

  // Fetch the data model on component mount
  useEffect(() => {
    const fetchDmsDetailsDataModel = async () => {
      setLoading(true);
      try {
        const response = await getDataModel({
          dataModelName,
          whereCondition,
          orderby,
        });
        setDocsData(response);

        console.log(response);

        setError(null);
      } catch (err) {
        console.error("Error fetching data model:", err);
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchDmsDetailsDataModel();
  }, [dataModelName, whereCondition, orderby]);

  // State for task form data
  const [taskData, setTaskData] = useState({
    taskName: "Project Plan",
    taskSubject: "",
    relatedTo: "HR",
    assignedTo: "",
    creatorReminderOn: formatDateTime(new Date()),
    assignedDate: formatDateTime(new Date()),
    targetDate: formatDateTime(new Date(Date.now() + 86400000)), // 1 day from now
    remindOnDate: formatDateTime(new Date()),
  });

  const handleEmployeeSelect = (event, docId) => {
    console.log(event, docId);

    const { name, value } = event.target;

    // Update taskData without overwriting the whole state
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Get the selected employee from the users list
    const selectedEmployee = users.find(
      (emp) => String(emp.user_name) === value
    );

    if (modalRef.current) {
      modalRef.current.showModal();
    } else {
      console.error("Modal element not found");
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const userData = await getAllUsers();
      if (userData) setUsers(userData);
    };
    fetchUsers();
  }, []); // Run only once when the component mounts

  // Function to update taskData from child components (if needed)
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="grid grid-cols-12 gap-4 place-items-center">
            <LoadingSpinner className="loading loading-dots loading-md" />
          </div>
        ) : (
          docsData.map((doc) => (
            <motion.div
              key={uuidv4()}
              className="bg-gradient-to-t from-gray-800 to-gray-900 shadow-lg rounded-2xl p-6 border border-gray-700"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-14 h-14 text-blue-400" />
                <div>
                  <h3 className="text-xl font-medium">
                    {doc.DOCUMENT_DESCRIPTION}
                  </h3>
                  <p className="text-xs text-gray-400">{doc.USER_NAME}</p>
                  <p className="text-xs text-gray-400">
                    Due: {doc.EXPIRY_DATE}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 items-center gap-2 mt-4">
                <Button
                  className="btn btn-neutral btn-sm"
                  icon={<View className="h-4 w-4" />}
                  label="View Docs"
                />
                <select
                  name="assignedTo"
                  className="select select-bordered select-sm text-center"
                  onChange={(event) => handleEmployeeSelect(event, uuidv4())}
                  defaultValue=""
                >
                  <option className="ml-5" value="" disabled>
                    Assign
                  </option>
                  {users.map((user) => (
                    <option key={uuidv4()} value={user.user_name}>
                      {user.user_name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <TaskForm
        modalRef={modalRef}
        data={taskData}
        onTaskChange={handleTaskChange}
      />
    </>
  );
}
