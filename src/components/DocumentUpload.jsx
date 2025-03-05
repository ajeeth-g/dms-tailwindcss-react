import { CalendarDays, FileType2, Trash2, View, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/AuthContext";
import { getDataModel } from "../services/dataService";
import {
  createAndSaveDMSDetails,
  deleteDMSDetails,
} from "../services/dmsService";
import { convertServiceDate } from "../utils/dateUtils";
import { getFileIcon } from "../utils/getFileIcon";
import { readFileAsBase64 } from "../utils/soapUtils";
import Button from "./common/Button";
import LoadingSpinner from "./common/LoadingSpinner";

const DocumentUpload = ({ modalRefUpload, selectedDocument }) => {
  const { auth } = useAuth();
  const [existingDocs, setExistingDocs] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryData, setCategoryData] = useState([]);

  // Fetch existing documents and categories
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDocument?.REF_SEQ_NO) return;

      setIsLoadingDocs(true);
      setFetchError("");

      try {
        // Fetch existing documents
        const docsResponse = await getDataModel(
          {
            dataModelName: "SYNM_DMS_DETAILS",
            whereCondition: `REF_SEQ_NO = ${selectedDocument.REF_SEQ_NO}`,
            orderby: "",
          },
          auth.email
        );

        // Handle different response formats
        const receivedDocs = Array.isArray(docsResponse)
          ? docsResponse
          : docsResponse?.Data || [];

        setExistingDocs(receivedDocs);

        // Fetch document categories
        const categoriesResponse = await getDataModel(
          {
            dataModelName: "SYNM_DMS_DOC_CATEGORIES",
            whereCondition: "",
            orderby: "",
          },
          auth.email
        );

        const receivedCategories = Array.isArray(categoriesResponse)
          ? categoriesResponse.filter((item) => item?.CATEGORY_NAME)
          : [];

        setCategoryData(receivedCategories);
      } catch (err) {
        console.error("Fetch error:", err);
        setFetchError("Failed to load documents");
      } finally {
        setIsLoadingDocs(false);
      }
    };

    fetchData();
  }, [selectedDocument?.REF_SEQ_NO, auth.email]);

  const allowedMimeTypes = {
    "image/*": [],
    "application/pdf": [],
    "application/vnd.ms-excel": [],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
  };

  const disallowedExtensions = ["exe", "bat", "sh", "msi", "js"];

  const { getRootProps, getInputProps } = useDropzone({
    accept: allowedMimeTypes,
    multiple: true,
    onDrop: (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => {
        const ext = file.name.split(".").pop().toLowerCase();
        return !disallowedExtensions.includes(ext);
      });
      setFiles((prev) => [
        ...prev,
        ...validFiles.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: (file.size / 1024).toFixed(2) + " KB",
          DOC_RELATED_CATEGORY: "",
          EXPIRY_DATE: "",
          progress: 0,
        })),
      ]);
    },
  });

  const refreshDocuments = async () => {
    try {
      const response = await getDataModel(
        {
          dataModelName: "SYNM_DMS_DETAILS",
          whereCondition: `REF_SEQ_NO = ${selectedDocument.REF_SEQ_NO}`,
          orderby: "",
        },
        auth.email
      );
      const updatedDocs = Array.isArray(response)
        ? response
        : response?.Data || [];
      setExistingDocs(updatedDocs);
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  const handleSave = async () => {
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // Calculate next serial number
      const maxSerial = existingDocs.reduce(
        (max, doc) => Math.max(max, doc.SERIAL_NO || 0),
        0
      );
      let currentSerial = maxSerial;

      for (const [index, file] of files.entries()) {
        currentSerial += 1;
        const base64Data = await readFileAsBase64(file.file);

        const payload = {
          REF_SEQ_NO: selectedDocument.REF_SEQ_NO,
          SERIAL_NO: currentSerial,
          DOCUMENT_NO: selectedDocument.DOCUMENT_NO || "",
          DOCUMENT_DESCRIPTION: selectedDocument.DOCUMENT_DESCRIPTION || "",
          DOC_SOURCE_FROM: selectedDocument.DOC_SOURCE_FROM || "",
          DOC_RELATED_TO: selectedDocument.DOC_RELATED_TO || "",
          DOC_RELATED_CATEGORY: file.DOC_RELATED_CATEGORY || "",
          DOC_REF_VALUE: selectedDocument.DOC_REF_VALUE || "",
          USER_NAME: auth.email,
          COMMENTS: selectedDocument.COMMENTS || "",
          DOC_TAGS: selectedDocument.DOC_TAGS || "",
          FOR_THE_USERS: selectedDocument.FOR_THE_USERS || "",
          EXPIRY_DATE: file.EXPIRY_DATE || "",
          DOC_DATA: base64Data,
          DOC_NAME: file.name,
          DOC_EXT: file.name.split(".").pop(),
          FILE_PATH: "",
        };

        await createAndSaveDMSDetails(payload, auth.email);
      }

      await refreshDocuments();
      setFiles([]);
      modalRefUpload.current?.close();
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMsg(`Upload failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = (doc) => {
    try {
      if (doc.DOC_DATA) {
        const byteCharacters = atob(doc.DOC_DATA);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], {
          type: `application/${doc.DOC_EXT}`,
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = doc.DOC_NAME;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download document");
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete ${doc.DOC_NAME}?`)) return;

    try {
      await deleteDMSDetails(
        {
          USER_NAME: selectedDocument.USER_NAME || auth.email,
          REF_SEQ_NO: selectedDocument.REF_SEQ_NO,
          SERIAL_NO: doc.SERIAL_NO,
        },
        auth.email
      );

      await refreshDocuments();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete document");
    }
  };

  return (
    <dialog ref={modalRefUpload} className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center justify-between gap-2 w-full">
            <span className="flex items-center gap-2 font-semibold">
              Reference No:
              <span className="badge badge-primary">
                {selectedDocument?.REF_SEQ_NO}
              </span>
            </span>
            <span className="flex items-center gap-2 font-semibold">
              <span className="badge badge-primary">
                {selectedDocument?.DOCUMENT_DESCRIPTION} | {existingDocs.length}{" "}
                files
              </span>
            </span>
          </div>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={() => modalRefUpload.current?.close()}
          >
            <X />
          </button>
        </div>

        {fetchError && (
          <div className="alert alert-error mb-4">
            <span>{fetchError}</span>
          </div>
        )}

        <div className="rounded-lg p-6 mb-2 bg-base-200">
          <div {...getRootProps()} className="text-center cursor-pointer">
            <input {...getInputProps()} />
            <p className="text-gray-500">
              Drag & drop files or click to select
            </p>
          </div>
        </div>

        {isLoadingDocs ? (
          <LoadingSpinner />
        ) : existingDocs.length > 0 ? (
          <div>
            <div className="flex flex-wrap gap-2">
              {existingDocs.map((doc, index) => (
                <div
                  key={`${doc.REF_SEQ_NO}-${doc.SERIAL_NO}`}
                  className="flex items-center rounded"
                >
                  <div className="card card-compact bg-neutral text-neutral-content w-72">
                    <div className="card-body">
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-start gap-1">
                          <img
                            src={getFileIcon(doc.DOC_EXT)}
                            alt="Document type"
                            className="w-8 h-8"
                          />
                          <div className="flex-1">
                            <h5 className="text-md font-medium truncate">
                              {doc.DOC_NAME}
                            </h5>
                            <div className="text-xs text-gray-500">
                              <span>Type: {doc.DOC_EXT}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            icon={<View size={18} />}
                            onClick={() => handleDownload(doc)}
                            tooltip="View"
                            variant="ghost"
                          />
                          <Button
                            icon={<Trash2 size={18} />}
                            onClick={() => handleDelete(doc)}
                            tooltip="Delete"
                            variant="error"
                            className="text-red-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-1 my-2">
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <FileType2 className="h-4 w-4" />
                            <label className="text-xs">Document Category</label>
                          </div>
                          <select
                            disabled
                            className="select select-bordered select-sm w-full"
                            value={doc.DOC_RELATED_CATEGORY || ""}
                            onChange={(e) =>
                              setExistingDocs((docs) =>
                                docs.map((item, i) =>
                                  i === index
                                    ? {
                                        ...item,
                                        DOC_RELATED_CATEGORY: e.target.value,
                                      }
                                    : item
                                )
                              )
                            }
                            required
                          >
                            <option value="">Select Category</option>
                            {categoryData.map((category) => (
                              <option
                                key={category.CATEGORY_NAME}
                                value={category.CATEGORY_NAME}
                              >
                                {category.CATEGORY_NAME}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <CalendarDays className="h-4 w-4" />
                            <label className="text-xs">
                              Document Expiry Date
                            </label>
                          </div>
                          <input
                            disabled
                            type="date"
                            className="input input-bordered input-sm w-full"
                            value={convertServiceDate(doc.EXPIRY_DATE)}
                            onChange={(e) =>
                              setExistingDocs((docs) =>
                                docs.map((item, i) =>
                                  i === index
                                    ? { ...item, EXPIRY_DATE: e.target.value }
                                    : item
                                )
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-center text-gray-500">
            No documents found for this reference
          </div>
        )}

        <div className="divider my-1"></div>

        {files.length > 0 && (
          <div>
            <div className="flex flex-wrap">
              {files.map((file, index) => (
                <div key={index} className="flex items-center p-2 rounded mb-2">
                  <div className="card card-compact bg-neutral text-neutral-content w-72">
                    <div className="card-body">
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex items-center gap-1">
                          {file.preview && (
                            <img
                              src={file.preview}
                              alt="Preview"
                              className="w-8 h-8 object-cover rounded"
                            />
                          )}
                          <div className="flex flex-col items-start">
                            <span className="text-md font-medium truncate">
                              {file.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {file.size}
                            </span>
                          </div>
                        </div>

                        <button
                          className="btn btn-circle btn-ghost btn-xs"
                          onClick={() =>
                            setFiles((f) => f.filter((_, i) => i !== index))
                          }
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex-1 flex-col">
                        <div className="grid grid-cols-1 gap-2 my-2">
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <FileType2 className="h-4 w-4" />
                              <label className="text-xs">
                                Document Category
                              </label>
                            </div>
                            <select
                              className="select select-bordered select-sm w-full"
                              value={file.category}
                              onChange={(e) =>
                                setFiles((f) =>
                                  f.map((item, i) =>
                                    i === index
                                      ? {
                                          ...item,
                                          DOC_RELATED_CATEGORY: e.target.value,
                                        }
                                      : item
                                  )
                                )
                              }
                              required
                            >
                              <option value="">Select Category</option>
                              {categoryData.map((category) => (
                                <option
                                  key={category.CATEGORY_NAME}
                                  value={category.CATEGORY_NAME}
                                >
                                  {category.CATEGORY_NAME}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <CalendarDays className="h-4 w-4" />
                              <label className="text-xs">
                                Document Expiry Date
                              </label>
                            </div>
                            <input
                              type="date"
                              className="input input-bordered input-sm w-full"
                              value={file.expiryDate}
                              onChange={(e) =>
                                setFiles((f) =>
                                  f.map((item, i) =>
                                    i === index
                                      ? { ...item, EXPIRY_DATE: e.target.value }
                                      : item
                                  )
                                )
                              }
                            />
                          </div>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div
                            className="bg-blue-500 h-2.5 w-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(file.progress, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-xs opacity-30">
                          {file.progress < 100
                            ? `Uploading... ${file.progress}%`
                            : "Upload Completed ✅"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-action">
          <div className="flex justify-end gap-3 w-full">
            <button
              className="btn btn-ghost"
              onClick={() => modalRefUpload.current?.close()}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {isSubmitting ? (
                <>
                  Uploading...
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                </>
              ) : (
                `Upload ${files.length} File${files.length !== 1 ? "s" : ""}`
              )}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default DocumentUpload;
