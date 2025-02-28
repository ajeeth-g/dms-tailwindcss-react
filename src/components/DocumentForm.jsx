import {
  CalendarDays,
  Clock3,
  FileText,
  Folder,
  Hash,
  Link,
  Loader,
  LocateFixed,
  MessageSquare,
  UserRound,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { createAndSaveDMSMaster } from "../services/dmsService";
import LoadingSpinner from "./common/LoadingSpinner";

// Centralized initial form state
const initialFormState = {
  REF_SEQ_NO: -1,
  DOCUMENT_NO: "",
  DOCUMENT_DESCRIPTION: "",
  DOC_SOURCE_FROM: "",
  DOC_RELATED_TO: "",
  DOC_RELATED_CATEGORY: "",
  DOC_REF_VALUE: "",
  USER_NAME: "",
  COMMENTS: "", // Optional: Remarks
  DOC_TAGS: "",
  FOR_THE_USERS: "",
  EXPIRY_DATE: "", // Optional: Expiry Date
  REF_TASK_ID: 0,
};

const DocumentForm = ({ modalRef }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate required fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.DOCUMENT_NO.trim())
      newErrors.DOCUMENT_NO = "Document Ref No is required";
    if (!formData.DOCUMENT_DESCRIPTION.trim())
      newErrors.DOCUMENT_DESCRIPTION = "Document Name is required";
    if (!formData.DOC_RELATED_TO.trim())
      newErrors.DOC_RELATED_TO = "Related To is required";
    if (!formData.DOC_RELATED_CATEGORY.trim())
      newErrors.DOC_RELATED_CATEGORY = "Related Category is required";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Do not submit if there are errors
    }
    setIsSubmitting(true);
    try {
      const response = await createAndSaveDMSMaster(formData);
      console.log("Server Response:", response);
      if (response) {
        // Reset form but retain the next reference number
        setFormData(initialFormState);
        modalRef.current?.close();
      } else {
        console.error("Failed to submit data. Please try again.");
      }
    } catch (error) {
      console.log(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog ref={modalRef} id="create-task" className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-xl">
            Reference ID :
            <span className="badge badge-primary ml-1">
              {formData.REF_SEQ_NO === -1 ? "(New)" : formData.REF_SEQ_NO}
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost"
              onClick={() => modalRef.current.close()}
            >
              <X />
            </button>
          </div>
        </div>
        <div className="divider my-1"></div>

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
                      id="DOCUMENT_NO"
                      placeholder="Enter document ref no"
                      value={formData.DOCUMENT_NO}
                      onChange={handleChange}
                      className="input input-bordered input-sm w-full"
                    />
                    {errors.DOCUMENT_NO && (
                      <p className="text-red-500 text-xs">
                        {errors.DOCUMENT_NO}
                      </p>
                    )}
                  </div>

                  {/* Document Name */}
                  <div className="flex flex-wrap items-center gap-3 w-full">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <label htmlFor="DOCUMENT_DESCRIPTION" className="text-xs">
                        Document Name
                      </label>
                    </div>
                    <input
                      type="text"
                      name="DOCUMENT_DESCRIPTION"
                      id="DOCUMENT_DESCRIPTION"
                      placeholder="Enter document name"
                      value={formData.DOCUMENT_DESCRIPTION}
                      onChange={handleChange}
                      className="input input-bordered input-sm w-full"
                    />
                    {errors.DOCUMENT_DESCRIPTION && (
                      <p className="text-red-500 text-xs">
                        {errors.DOCUMENT_DESCRIPTION}
                      </p>
                    )}
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
                      <option value="HR">HR</option>
                      <option value="Accounts">Accounts</option>
                      <option value="QS">QS</option>
                      <option value="Estimation">Estimation</option>
                      <option value="Projects">Projects</option>
                    </select>
                    {errors.DOC_RELATED_TO && (
                      <p className="text-red-500 text-xs">
                        {errors.DOC_RELATED_TO}
                      </p>
                    )}
                  </div>

                  {/* Related Category */}
                  <div className="flex flex-wrap items-center gap-3 w-full">
                    <div className="flex items-center gap-1">
                      <Folder className="h-4 w-4" />
                      <label htmlFor="DOC_RELATED_CATEGORY" className="text-xs">
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
                      <option value="HRMS">HRMS</option>
                      <option value="Passport">Passport</option>
                      <option value="Visa">Visa</option>
                      <option value="Supplier Invoice">Supplier Invoice</option>
                      <option value="QS">QS</option>
                      <option value="Credit Notes">Credit Notes</option>
                      <option value="Sales Invoice">Sales Invoice</option>
                    </select>
                    {errors.DOC_RELATED_CATEGORY && (
                      <p className="text-red-500 text-xs">
                        {errors.DOC_RELATED_CATEGORY}
                      </p>
                    )}
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
                      id="EXPIRY_DATE"
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
                      id="COMMENTS"
                      placeholder="Add remarks"
                      value={formData.COMMENTS}
                      onChange={handleChange}
                      className="input input-bordered input-sm w-full"
                    />
                  </div>
                </div>

                {/* Action Button */}
                <div className="modal-action">
                  <button type="submit" className="btn btn-success">
                    Create Document
                    {isSubmitting ? (
                      <LoadingSpinner className="loading loading-spinner loading-md" />
                    ) : (
                      ""
                    )}
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
                    <label className="text-sm">Document Reference Value</label>
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
  );
};

export default DocumentForm;
