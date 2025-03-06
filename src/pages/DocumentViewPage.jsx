import { motion } from "framer-motion";
import { Edit, FileText, View } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import TaskForm from "../components/TaskForm";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { getDataModel } from "../services/dataService";
import { getDocMasterList } from "../services/dmsService";
import { getAllActiveUsers } from "../services/employeeService";
import { formatDateTime } from "../utils/dateUtils";
import { getNameFromEmail } from "../utils/emailHelpers";

export default function DocumentViewPage() {
  const [docsData, setDocsData] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState({});
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const modalRef = useRef(null);
  const [assignedTask, setAssignedTask] = useState(null);
  const { auth } = useAuth();
  const UserName = getNameFromEmail(auth.email);

  // Task assignment state
  const [taskData, setTaskData] = useState({
    userName: UserName.toUpperCase(),
    taskName: "",
    taskSubject: "",
    relatedTo: "",
    assignedTo: "",
    creatorReminderOn: formatDateTime(new Date()),
    assignedDate: formatDateTime(new Date()),
    targetDate: formatDateTime(new Date(Date.now() + 86400000)), // +1 day
    remindOnDate: formatDateTime(new Date()),
  });

  // Fetch documents from master
  const fetchDmsMaster = useCallback(async () => {
    setLoadingDocs(true);
    setError(null);
    try {
      const response = await getDocMasterList("", auth.email);
      setDocsData(response?.length > 0 ? response : []);
      if (!response?.length) setError("No documents available.");
    } catch (err) {
      console.error("Error fetching dms master:", err);
      setError(err.message || "Error fetching dms master.");
    } finally {
      setLoadingDocs(false);
    }
  }, [auth.email]);

  useEffect(() => {
    fetchDmsMaster();
  }, [fetchDmsMaster]);

  // Fetch all active users list
  const fetchUsers = useCallback(async () => {
    try {
      const userData = await getAllActiveUsers(auth.email);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error("Error fetching all active users:", err);
      setUsers([]);
    }
  }, [auth.email]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Download & view documents
  const handleViewDocs = async (refSeqNo) => {
    setLoadingDownload((prev) => ({ ...prev, [refSeqNo]: true }));
    setError(null);
    try {
      const response = await getDataModel(
        {
          dataModelName: "SYNM_DMS_DETAILS",
          whereCondition: `ref_seq_no = ${refSeqNo}`,
          orderby: "",
        },
        auth.email
      );

      if (!response?.length) {
        throw new Error("No documents found.");
      }

      response.forEach((doc, index) => {
        if (Array.isArray(doc.DOC_DATA)) {
          const blob = new Blob([new Uint8Array(doc.DOC_DATA)], {
            type: "application/octet-stream",
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download =
            doc.DOC_NAME || `document_${refSeqNo}_${index + 1}.bin`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        }
      });
    } catch (err) {
      console.error("Error downloading documents:", err);
      setError("Failed to download documents.");
    } finally {
      setLoadingDownload((prev) => ({ ...prev, [refSeqNo]: false }));
    }
  };

  // Callback function to receive created task from TaskForm
  const handleTaskCreated = (newTask) => {
    setAssignedTask(newTask);
  };

  // Handle dropdown select. Now we also pass the document details.
  const handleEmployeeSelect = (doc, event) => {
    const { name, value } = event.target;
    // Update taskData with the selected document details
    setTaskData((prev) => ({
      ...prev,
      taskName: doc.DOCUMENT_DESCRIPTION,
      relatedTo: doc.DOC_RELATED_TO,
      [name]: value,
    }));
    modalRef.current?.showModal();
  };

  // Update task data from TaskForm
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {loadingDocs ? (
        <div className="flex justify-center items-start">
          <LoadingSpinner className="loading loading-spinner loading-lg" />
        </div>
      ) : docsData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {docsData.map((doc) => (
            <motion.div
              key={doc.REF_SEQ_NO}
              whileHover={{ scale: 1.05 }}
              className="card card-compact bg-neutral shadow-xl"
            >
              <div className="card-body">
                <div className="flex items-start gap-1">
                  <FileText className="w-10 h-10 text-blue-400" />
                  <div>
                    <h2 className="card-title">{doc.DOCUMENT_DESCRIPTION}</h2>
                    <p className="text-sm text-gray-500">{doc.USER_NAME}</p>
                    <p className="text-sm text-gray-500">
                      Due: {doc.EXPIRY_DATE}
                    </p>
                  </div>
                </div>
                <div className="card-actions items-center justify-between gap-1">
                  <Button
                    className="btn btn-primary btn-sm"
                    icon={<View className="h-4 w-4" />}
                    label={
                      loadingDownload[doc.REF_SEQ_NO]
                        ? "Loading..."
                        : "View Docs"
                    }
                    onClick={() => handleViewDocs(doc.REF_SEQ_NO)}
                    disabled={loadingDownload[doc.REF_SEQ_NO]}
                  />
                  <select
                    name="assignedTo"
                    className="select select-bordered select-sm"
                    onChange={(e) => handleEmployeeSelect(doc, e)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Assign
                    </option>
                    {users.map((user) => (
                      <option key={user.user_name} value={user.user_name}>
                        {user.user_name}
                      </option>
                    ))}
                  </select>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-center text-gray-400">No documents available.</p>
        </div>
      )}

      {/* Render the created task details with an edit icon if assignedTask exists */}
      {assignedTask && (
        <div className="mt-6 flex items-center gap-2 p-4 bg-base-100 shadow rounded">
          <span className="text-lg font-semibold">
            Assigned to: {assignedTask.AssignedUser}
          </span>
          <button
            className="btn btn-ghost btn-square"
            onClick={() => modalRef.current?.showModal()}
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>
      )}
      <TaskForm
        modalRef={modalRef}
        users={users}
        taskData={taskData}
        onTaskChange={handleTaskChange}
        onTaskCreated={handleTaskCreated}
      />
    </>
  );
}
