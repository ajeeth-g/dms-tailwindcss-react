import { motion } from "framer-motion";
import { FileText, View } from "lucide-react";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getDataModel } from "../services/dataService";
import { getAllUsers } from "../services/employeeService";
import { formatDateTime } from "../utils/dateUtils";
import TaskForm from "../components/TaskForm";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function DocumentViewPage() {
  const [docsData, setDocsData] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState({});
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const modalRef = useRef(null);
  const { auth } = useAuth();

  // Fetch documents from API
  const fetchDmsDetailsDataModel = useCallback(async () => {
    setLoadingDocs(true);
    setError(null);
    try {
      const response = await getDataModel(
        {
          dataModelName: "SYNM_DMS_MASTER",
          whereCondition: "",
          orderby: "",
        },
        auth.email
      );
      setDocsData(response?.length > 0 ? response : []);
      if (!response?.length) setError("No documents available.");
    } catch (err) {
      console.error("Error fetching data model:", err);
      setError(err.message || "Error fetching documents.");
    } finally {
      setLoadingDocs(false);
    }
  }, [auth.email]);

  useEffect(() => {
    fetchDmsDetailsDataModel();
  }, [fetchDmsDetailsDataModel]);

  // Fetch users list
  const fetchUsers = useCallback(async () => {
    try {
      const userData = await getAllUsers(auth.email);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error("Error fetching users:", err);
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
          link.download = doc.DOC_NAME || `document_${refSeqNo}_${index + 1}.bin`;
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

  // Task assignment state
  const [taskData, setTaskData] = useState({
    taskName: "Project Plan",
    taskSubject: "",
    relatedTo: "HR",
    assignedTo: "",
    creatorReminderOn: formatDateTime(new Date()),
    assignedDate: formatDateTime(new Date()),
    targetDate: formatDateTime(new Date(Date.now() + 86400000)), // +1 day
    remindOnDate: formatDateTime(new Date()),
  });

  // Handle dropdown select
  const handleEmployeeSelect = (event) => {
    const { name, value } = event.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
    modalRef.current?.showModal();
  };

  // Handle task data updates
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadingDocs ? (
          <div className="grid place-items-center">
            <LoadingSpinner className="loading loading-dots loading-md" />
          </div>
        ) : docsData.length > 0 ? (
          docsData.map((doc) => (
            <motion.div
              key={doc.REF_SEQ_NO}
              className="bg-gradient-to-t from-gray-800 to-gray-900 shadow-lg rounded-2xl p-6 border border-gray-700"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-14 h-14 text-blue-400" />
                <div>
                  <h3 className="text-xl font-medium">{doc.DOCUMENT_DESCRIPTION}</h3>
                  <p className="text-xs text-gray-400">{doc.USER_NAME}</p>
                  <p className="text-xs text-gray-400">Due: {doc.EXPIRY_DATE}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  className="btn btn-neutral btn-sm"
                  icon={<View className="h-4 w-4" />}
                  label={loadingDownload[doc.REF_SEQ_NO] ? "Loading..." : "View Docs"}
                  onClick={() => handleViewDocs(doc.REF_SEQ_NO)}
                  disabled={loadingDownload[doc.REF_SEQ_NO]}
                />
                <select
                  name="assignedTo"
                  className="select select-bordered select-sm text-center"
                  onChange={handleEmployeeSelect}
                  defaultValue=""
                >
                  <option value="" disabled>Assign</option>
                  {users.map((user) => (
                    <option key={user.user_name} value={user.user_name}>
                      {user.user_name}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </motion.div>
          ))
        ) : (
          <p className="text-center text-gray-400">No documents available.</p>
        )}
      </div>
      <TaskForm modalRef={modalRef} data={taskData} onTaskChange={handleTaskChange} />
    </>
  );
}
