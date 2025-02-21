import React, { useState } from "react";
import { GlobalVariables } from "../config/globalVariables";
import { saveService } from "../services/saveService";
import { convertDataModelToString } from "../utils/dataModelConverter";

const DocumentForm = ({ modalRef, setTableData }) => {
  const [formData, setFormData] = useState({
    REF_SEQ_NO: 1001,
    DOCUMENT_NO: "",
    DOCUMENT_DESCRIPTION: "",
    DOC_SOURCE_FROM: "",
    DOC_RELATED_TO: "",
    DOC_RELATED_CATEGORY: "",
    DOC_REF_VALUE: "",
    USER_NAME: "",
    ENT_DATE: "",
    COMMENTS: "",
    DOC_TAGS: "",
    FOR_THE_USERS: "",
    EXPIRY_DATE: "",
    VERIFIED_BY: "",
    VERIFIED_DATE: "",
    REF_TASK_ID: "",
    DOCUMENT_STATUS: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.DOCUMENT_DESCRIPTION.trim()) {
      alert("Please enter a document description!");
      return;
    }

    try {
      const newRefNo = formData.REF_SEQ_NO;

      const newDocument = {
        ...formData,
        REF_SEQ_NO: newRefNo,
        USER_NAME: GlobalVariables.currentUserName,
        ENT_DATE: new Date().toISOString(),
      };

      const formattedData = convertDataModelToString(
        "SYNM_DMS_MASTER",
        newDocument
      );

      // API Call
      const response = await saveService(formattedData);

      if (response) {
        setTableData((prevTableData) => [...prevTableData, newDocument]);

        // Reset form but retain the next reference number
        setFormData((prevData) => ({
          ...prevData,
          REF_SEQ_NO: prevData.REF_SEQ_NO + 1,
          DOCUMENT_NO: "",
          DOCUMENT_DESCRIPTION: "",
          DOC_SOURCE_FROM: "",
          DOC_RELATED_TO: "",
          DOC_RELATED_CATEGORY: "",
          DOC_REF_VALUE: "",
          USER_NAME: GlobalVariables.currentUserName,
          ENT_DATE: new Date().toISOString(),
          COMMENTS: "",
          DOC_TAGS: "",
          FOR_THE_USERS: "",
          EXPIRY_DATE: null,
          VERIFIED_BY: "",
          VERIFIED_DATE: null,
          REF_TASK_ID: null,
          DOCUMENT_STATUS: "",
        }));

        alert(`Document saved successfully with Ref No: ${newRefNo}`);

        if (modalRef.current) {
          modalRef.current?.close();
        }
      } else {
        console.log("Failed to submit data. Please try again.");
      }
    } catch (error) {
      console.log(`An error occurred: ${error.message}`);
    }
  };

  return (
    <>
      <dialog ref={modalRef} id="add-document-details" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => modalRef.current.close()}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add Document Details</h3>
          <div className="divider"></div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <div className="grid grid-cols-4 gap-4">
                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Document Number</span>
                  <input
                    type="text"
                    name="DOCUMENT_NO"
                    value={formData.DOCUMENT_NO}
                    onChange={handleChange}
                    placeholder="Enter document number"
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Document Description</span>
                  <input
                    type="text"
                    name="DOCUMENT_DESCRIPTION"
                    value={formData.DOCUMENT_DESCRIPTION}
                    onChange={handleChange}
                    placeholder="Enter document description"
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Document Source From</span>
                  <input
                    type="text"
                    name="DOC_SOURCE_FROM"
                    value={formData.DOC_SOURCE_FROM}
                    onChange={handleChange}
                    placeholder="Enter document source"
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Related To</span>
                  <select
                    name="DOC_RELATED_TO"
                    value={formData.DOC_RELATED_TO}
                    onChange={handleChange}
                    className="select select-bordered"
                  >
                    <option value="" disabled>
                      Select Related to
                    </option>
                    <option value="Active">Related 1</option>
                    <option value="Inactive">Related 1</option>
                  </select>
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Related Category</span>
                  <select
                    name="DOC_RELATED_CATEGORY"
                    value={formData.DOC_RELATED_CATEGORY}
                    onChange={handleChange}
                    className="select select-bordered"
                  >
                    <option value="" disabled>
                      Select Related Category
                    </option>
                    <option value="Active">Related Category 1</option>
                    <option value="Inactive">Related Category 2</option>
                  </select>
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Document Reference Value</span>
                  <input
                    type="text"
                    name="DOC_REF_VALUE"
                    value={formData.DOC_REF_VALUE}
                    onChange={handleChange}
                    placeholder="Enter reference value"
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Uploader Name</span>
                  <input
                    type="text"
                    name="USER_NAME"
                    value={formData.USER_NAME}
                    onChange={handleChange}
                    placeholder="Enter uploader name"
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Document Tags</span>
                  <input
                    type="text"
                    name="ENT_DATE"
                    value={formData.ENT_DATE}
                    onChange={handleChange}
                    placeholder="Enter tags"
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">For The Users</span>
                  <input
                    type="text"
                    name="FOR_THE_USERS"
                    value={formData.FOR_THE_USERS}
                    onChange={handleChange}
                    placeholder="Enter user details"
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Expiry Date</span>
                  <input
                    type="date"
                    name="EXPIRY_DATE"
                    value={formData.EXPIRY_DATE}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Verified By</span>
                  <input
                    type="text"
                    name="VERIFIED_BY"
                    value={formData.VERIFIED_BY}
                    onChange={handleChange}
                    placeholder="Enter verified by"
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Verified Date</span>
                  <input
                    type="date"
                    name="VERIFIED_DATE"
                    value={formData.VERIFIED_DATE}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Reference Task ID</span>
                  <input
                    type="number"
                    name="REF_TASK_ID"
                    value={formData.REF_TASK_ID}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Document Status</span>
                  <select
                    name="DOCUMENT_STATUS"
                    value={formData.DOCUMENT_STATUS}
                    onChange={handleChange}
                    className="select select-bordered"
                  >
                    <option value="" disabled>
                      Select Status
                    </option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>

                <label className="form-control w-full max-w-xs">
                  <span className="label-text">Comments</span>
                  <textarea
                    name="COMMENTS"
                    value={formData.COMMENTS}
                    onChange={handleChange}
                    placeholder="Enter comments"
                    className="textarea textarea-bordered w-full"
                  ></textarea>
                </label>
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => modalRef.current.close()}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-success">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default DocumentForm;
