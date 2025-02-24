import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileText, UserPen } from "lucide-react";
import TaskForm from "./TaskForm";
import Button from "./common/Button";
import getAllUsers from "../services/employeeService";

const documents = [
  { id: 1, name: "Project Plan", branch: "HR", dueDate: "2025-02-28" },
  {
    id: 2,
    name: "Financial Report",
    branch: "Finance",
    dueDate: "2025-03-05",
  },
  { id: 3, name: "Policy Update", branch: "Legal", dueDate: "2025-03-10" },
  { id: 4, name: "Pan Update", branch: "Legal", dueDate: "2025-03-10" },
];

const employees = [
  {
    id: 1,
    name: "ANEES",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 2,
    name: "GOPI",
    image: "https://randomuser.me/api/portraits/women/48.jpg",
  },
  {
    id: 3,
    name: "MUBARAK",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
  },
];

export default function TaskAssignment() {
  const taskFormRef = useRef(null);
  const [assignments, setAssignments] = useState({});
  const [users, setUsers] = useState([]);
  const [taskData, setTaskData] = useState({
    taskSubject: "",
    taskName: "",
    relatedTo: "",
    assignedTo: "",
    creatorReminderOn: new Date().toISOString().slice(0, 16),
    assignedDate: new Date().toISOString().slice(0, 16),
    targetDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16), // Adds 1 day
    remindOnDate: new Date().toISOString().slice(0, 16),
    responseMessage: "",
  });

  const handleEmployeeSelect = (event, docId) => {
    const { name, value } = event.target;

    // Update task data without overwriting existing state
    setTaskData((prev) => ({
      ...prev, // Keep previous state values
      [name]: value,
    }));

    const selectedEmployee = employees.find(
      (emp) => emp.id === parseInt(event.target.value)
    );

    const doc = documents.find((d) => d.id === docId);

    if (selectedEmployee && doc) {
      const updatedTaskData = {
        taskName: doc.name,
        assignedDate: doc.dueDate,
        selectedEmployee: selectedEmployee.name,
      };

      // Update taskData immediately
      setTaskData(updatedTaskData);

      setAssignments((prev) => ({
        ...prev,
        [docId]: selectedEmployee,
      }));

      taskFormRef.current?.openModal({
        documentName: doc.name,
        dueDate: doc.dueDate,
        selectedEmployee: selectedEmployee.name,
      });
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const userData = await getAllUsers("gopi@demo.com");
      if (userData) setUsers(userData);
    };
    fetchUsers();
  }, []);

  // Function to update taskData from child
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value, // Update the corresponding field in taskData
    }));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            className="bg-gray-800 bg-opacity-50 shadow-lg rounded-xl p-6 border border-gray-700"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-14 h-14 text-blue-400" />
              <div>
                <h3 className="text-xl font-medium">{doc.name}</h3>
                <p className="text-xs text-gray-400">{doc.branch} Department</p>
                <p className="text-xs text-gray-400">Due: {doc.dueDate}</p>
              </div>
            </div>

            <div className="mt-3">
              {!assignments[doc.id] ? (
                <select
                  className="select select-bordered select-sm w-full mt-2"
                  onChange={(event) => handleEmployeeSelect(event, doc.id)}
                >
                  <option value="" disabled>
                    Assign to...
                  </option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center justify-between gap-3 p-3 border border-gray-700 rounded-lg bg-gray-900 shadow-md">
                  <div className="flex items-center gap-3">
                    <img
                      src={assignments[doc.id].image}
                      alt="Assigned Employee"
                      className="w-8 h-8 rounded-full border border-gray-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        {assignments[doc.id].name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Due: {doc.dueDate}
                      </p>
                    </div>
                  </div>

                  <Button
                    className="btn btn-success btn-sm"
                    icon={<UserPen className="h-4 w-4" />}
                    label="Edit"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Single TaskForm outside the loop */}
      <TaskForm
        ref={taskFormRef}
        data={taskData}
        onTaskChange={handleTaskChange}
      />
    </>
  );
}
