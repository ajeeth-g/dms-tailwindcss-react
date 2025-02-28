import React, { useState } from "react";
import { saveDMSDetails } from "./services/DMS_CreateAndSave_DMS_Details";

const DMSForm = () => {
  const [formData, setFormData] = useState({
    REF_SEQ_NO: "",
    SERIAL_NO: "",
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
    DOC_DATA: "",
    DOC_NAME: "",
    DOC_EXT: "",
    FILE_PATH: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await saveDMSDetails(formData);
    console.log("Server Response:", response);
    alert("Details Data Submitted Successfully!");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h2>DMS Document Upload</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", fontWeight: "bold" }}>
              {key.replace(/_/g, " ")}
            </label>
            <input
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        ))}
        <button
          type="submit"
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "100%",
            fontSize: "16px",
          }}
        >
          Send SOAP Request
        </button>
      </form>
    </div>
  );
};

export default DMSForm;
