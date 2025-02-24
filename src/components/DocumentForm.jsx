import React, { useState } from "react";
import { GlobalVariables } from "../config/globalVariables";
import { saveService } from "../services/saveService";
import { convertDataModelToString } from "../utils/dataModelConverter";
import {
  CalendarDays,
  Clock3,
  Link,
  FileText,
  Folder,
  Loader,
  LocateFixed,
  MessageSquare,
  User2,
  UserRound,
  Hash,
} from "lucide-react";

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
          EXPIRY_DATE: "",
          VERIFIED_BY: "",
          VERIFIED_DATE: "",
          REF_TASK_ID: "",
          DOCUMENT_STATUS: "",
        }));

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
      <dialog ref={modalRef} id="create-task" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-lg flex-1">Add Document Details</h3>
            <div className="flex items-center  gap-2">
              <span className="badge badge-primary text-xs font-semibold">
                Document Reference ID: (New)
              </span>
              <button
                type="button"
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => modalRef.current.close()}
              >
                ✕
              </button>
            </div>
          </div>
          <div className="divider my-2"></div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-1 mx-2">
              {/* Left Side - Document Form */}
              <div className="col-span-2">
                <div className="max-h-[450px] overflow-y-auto min-h-0 p-2">
                  {/* Fields Section */}
                  <div className="grid grid-cols-2 gap-4 mt-1">
                    {/* Document Number */}
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <Hash className="h-4 w-4" />
                        <label htmlFor="DOCUMENT_NO" className="text-xs">
                          Document Ref No
                        </label>
                      </div>
                      <input
                        type="text"
                        name="DOCUMENT_NO"
                        id="DOCUMENT_NO" // Added id
                        placeholder="Enter document ref no"
                        value={formData.DOCUMENT_NO}
                        onChange={handleChange}
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    {/* Document Name */}
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <label
                          htmlFor="DOCUMENT_DESCRIPTION"
                          className="text-xs"
                        >
                          Document Name
                        </label>
                      </div>
                      <input
                        type="text"
                        name="DOCUMENT_DESCRIPTION"
                        id="DOCUMENT_DESCRIPTION" // Added id
                        placeholder="Enter document name"
                        value={formData.DOCUMENT_DESCRIPTION}
                        onChange={handleChange}
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    {/* Related To */}
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <Link className="h-4 w-4" />
                        <label htmlFor="DOC_RELATED_TO" className="text-xs">
                          Related To
                        </label>
                      </div>

                      <select
                        name="DOC_RELATED_TO"
                        id="DOC_RELATED_TO"
                        value={formData.DOC_RELATED_TO}
                        onChange={handleChange}
                        className="select select-bordered select-sm w-full"
                      >
                        <option value="" disabled>
                          Select related to
                        </option>
                        <option value="Invoice">HR</option>
                        <option value="Contract">Accounts</option>
                        <option value="Report">QS</option>
                        <option value="Memo">Estimation</option>
                        <option value="Other">Projects</option>
                      </select>
                    </div>

                    {/* Related Category */}
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <Folder className="h-4 w-4" />
                        <label
                          htmlFor="DOC_RELATED_CATEGORY"
                          className="text-xs"
                        >
                          Related Category
                        </label>
                      </div>
                      <select
                        name="DOC_RELATED_CATEGORY"
                        id="DOC_RELATED_CATEGORY"
                        value={formData.DOC_RELATED_CATEGORY}
                        onChange={handleChange}
                        className="select select-bordered select-sm w-full"
                      >
                        <option value="" disabled>
                          Select related category
                        </option>
                        <option value="Invoice">HRMS</option>
                        <option value="Contract">Passport</option>
                        <option value="Report">Visa</option>
                        <option value="Memo">Supplier Invoice</option>
                        <option value="Report">QS</option>
                        <option value="Report">Credit Notes</option>
                        <option value="Other">Sales Invoice</option>
                      </select>
                    </div>

                    {/* Expiry Date */}
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        <label htmlFor="EXPIRY_DATE" className="text-xs">
                          Expiry Date
                        </label>
                      </div>
                      <input
                        type="date"
                        name="EXPIRY_DATE"
                        id="EXPIRY_DATE" // Added id
                        value={formData.EXPIRY_DATE}
                        onChange={handleChange}
                        className="input input-bordered input-sm w-full"
                      />
                    </div>

                    {/* Remarks */}
                    <div className="flex flex-wrap items-center gap-3 w-full">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <label htmlFor="COMMENTS" className="text-xs">
                          Remarks
                        </label>
                      </div>
                      <input
                        type="text"
                        name="COMMENTS"
                        id="COMMENTS" // Added id
                        placeholder="Add remarks"
                        value={formData.COMMENTS}
                        onChange={handleChange}
                        className="input input-bordered input-sm w-full"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="modal-action">
                    <button type="submit" className="btn btn-success">
                      Create Document
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Activity Section */}
              <div className="col-span-1 rounded-lg p-4 shadow-2xl max-h-[400px] overflow-y-auto min-h-0">
                <h2 className="text-base font-medium mb-3">Others:</h2>

                {/* Fields Section */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-1 text-gray-500">
                      <LocateFixed className="h-4 w-4" />
                      <label className="text-sm">Document Received From</label>
                    </div>
                    <p className="text-sm font-medium">TRI Dubai</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-1 text-gray-500">
                      <LocateFixed className="h-4 w-4" />
                      <label className="text-sm">
                        Document Reference Value
                      </label>
                    </div>
                    <p className="text-sm font-medium">TRI Dubai</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-1 text-gray-500">
                      <UserRound className="h-4 w-4" />
                      <label className="text-sm">Uploader Name</label>
                    </div>
                    <p className="text-sm font-medium">Aneesh</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-1 text-gray-500">
                      <LocateFixed className="h-4 w-4" />
                      <label className="text-sm">Verified by</label>
                    </div>
                    <p className="text-sm font-medium">Santhosh</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock3 className="h-4 w-4" />
                      <label className="text-sm">Verified date</label>
                    </div>
                    <p className="text-sm font-medium">TRI Dubai</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-1 text-gray-500">
                      <LocateFixed className="h-4 w-4" />
                      <label className="text-sm">Reference Task ID</label>
                    </div>
                    <p className="text-sm font-medium">#SPK-2212</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Loader className="h-4 w-4" />
                      <label className="text-sm">Document Status</label>
                    </div>
                    <p className="badge badge-success text-xs font-medium">
                      Processing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default DocumentForm;
