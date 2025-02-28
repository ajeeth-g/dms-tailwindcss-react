import React, { useState } from "react";
import { saveDMSMaster } from "./services/dmsCreateAndSaveDmsMaster";

const Test = () => {
  const [formData, setFormData] = useState({
    REF_SEQ_NO: "",
    DOCUMENT_NO: "",
    DOCUMENT_DESCRIPTION: "",
    DOC_SOURCE_FROM: "",
    DOC_RELATED_TO: "",
    DOC_RELATED_CATEGORY: "",
    DOC_REF_VALUE: "",
    USER_NAME: "",
    COMMENTS: "",
    DOC_TAGS: "",
    FOR_THE_USERS: "",
    EXPIRY_DATE: "",
    REF_TASK_ID: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await saveDMSMaster(formData);
    console.log("Server Response:", response);
    alert("Data Submitted Successfully!");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">DMS Master Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block text-gray-700 font-semibold">{key}</label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Test;
