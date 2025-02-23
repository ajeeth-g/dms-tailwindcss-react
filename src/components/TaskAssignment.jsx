import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, FileText } from "lucide-react";
import TaskForm from "./TaskForm";

const documents = [
  { id: 1, name: "Project Plan.pdf", branch: "HR", dueDate: "2025-02-28" },
  {
    id: 2,
    name: "Financial Report.xlsx",
    branch: "Finance",
    dueDate: "2025-03-05",
  },
  { id: 3, name: "Policy Update.docx", branch: "Legal", dueDate: "2025-03-10" },
];

const employees = [
  {
    id: 1,
    name: "John Doe",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "https://randomuser.me/api/portraits/women/48.jpg",
  },
  {
    id: 3,
    name: "Michael Brown",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
  },
];

export default function TaskAssignment() {
  const [assignments, setAssignments] = useState([]);

  const handleAssign = (docId, empId) => {
    const doc = documents.find((d) => d.id === docId);
    const emp = employees.find((e) => e.id === empId);
    setAssignments([...assignments, { document: doc, employee: emp }]);
  };

  return (
    <div className="p-6 bg-gray-800 shadow-lg rounded-xl border border-gray-700">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold">Assign Documents</h2>
        <TaskForm />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <motion.div
            key={doc.id}
            className="p-4 bg-gray-900 rounded-lg shadow-md border border-gray-700"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-md font-medium">{doc.name}</h3>
                <p className="text-sm text-gray-500">{doc.branch} Department</p>
                <p className="text-sm text-yellow-500">Due: {doc.dueDate}</p>
              </div>
            </div>
            <div className="mt-3">
              <select
                className="w-full bg-gray-700 text-white p-2 rounded"
                onChange={(e) => handleAssign(doc.id, parseInt(e.target.value))}
              >
                <option value="">Assign to...</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-6">Assigned Documents</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((assign, index) => (
          <motion.div
            key={index}
            className="p-4 bg-gray-900 rounded-lg shadow-md border border-gray-700 flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={assign.employee.image}
              alt={assign.employee.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h4 className="text-md font-medium">{assign.document.name}</h4>
              <p className="text-sm text-gray-400">
                Assigned to: {assign.employee.name}
              </p>
              <p className="text-sm text-yellow-500">
                Due: {assign.document.dueDate}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
