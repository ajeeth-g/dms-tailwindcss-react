import {
  CalendarDays,
  FileType2,
  X,
  Download,
  Trash2,
  View,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { getDataModel } from "../services/dataService";
import {
  createAndSaveDMSDetails,
  deleteDMSDetails,
} from "../services/dmsService";
import { readFileAsBase64 } from "../utils/soapUtils";
import LoadingSpinner from "./common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import pdfIcon from "../assets/pdf-icon.png";
import defaultIcon from "../assets/default-doc-icon.png";
import Button from "./common/Button";

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
            DataModelName: "SYNM_DMS_DOC_CATEGORIES",
            WhereCondition: "",
            Orderby: "",
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
          category: "",
          progress: 0,
          expiryDate: "",
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
          DOC_RELATED_CATEGORY: file.category || "",
          DOC_REF_VALUE: selectedDocument.DOC_REF_VALUE || "",
          USER_NAME: selectedDocument.USER_NAME || auth.email,
          COMMENTS: selectedDocument.COMMENTS || "",
          DOC_TAGS: selectedDocument.DOC_TAGS || "",
          FOR_THE_USERS: selectedDocument.FOR_THE_USERS || "",
          EXPIRY_DATE: file.expiryDate || "",
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
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => modalRefUpload.current?.close()}
        >
          <X />
        </button>

        <h3 className="font-bold text-lg mb-4">Document Manager</h3>

        <div className="flex justify-between mb-6">
          <div className="badge badge-lg badge-primary">
            REF: {selectedDocument?.REF_SEQ_NO}
          </div>
          <div className="badge badge-lg badge-secondary">
            Current Documents: {existingDocs.length}
          </div>
        </div>

        {fetchError && (
          <div className="alert alert-error mb-4">
            <span>{fetchError}</span>
          </div>
        )}

        <div className="border-2 border-dashed rounded-lg p-4 mb-6 bg-base-200">
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
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">Existing Documents</h4>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {existingDocs.map((doc, index) => (
                <div
                  key={`${doc.REF_SEQ_NO}-${doc.SERIAL_NO}`}
                  className="card bg-base-100 shadow-sm"
                >
                  <div className="card-body p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={doc.DOC_EXT === "pdf" ? pdfIcon : defaultIcon}
                        alt="Document type"
                        className="w-12 h-12"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium truncate">{doc.DOC_NAME}</h5>
                        <div className="text-sm text-gray-500">
                          <p>Type: {doc.DOC_EXT}</p>
                          <p>Serial: {doc.SERIAL_NO}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
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
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No documents found for this reference
          </div>
        )}

        {files.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-4">New Uploads</h4>
            <div className="space-y-4">
              {files.map((file, index) => (
                <div key={index} className="card bg-base-100 shadow-sm">
                  <div className="card-body p-4">
                    <div className="flex items-start gap-4">
                      {file.preview && (
                        <img
                          src={file.preview}
                          alt="Preview"
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {file.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {file.size}
                          </span>
                          <button
                            className="ml-auto btn btn-xs btn-ghost"
                            onClick={() =>
                              setFiles((f) => f.filter((_, i) => i !== index))
                            }
                          >
                            <X size={14} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <select
                            className="select select-bordered select-sm"
                            value={file.category}
                            onChange={(e) =>
                              handleCategoryChange(index, e.target.value)
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

                          <input
                            type="date"
                            className="input input-bordered input-sm"
                            value={file.expiryDate}
                            onChange={(e) =>
                              setFiles((f) =>
                                f.map((item, i) =>
                                  i === index
                                    ? { ...item, expiryDate: e.target.value }
                                    : item
                                )
                              )
                            }
                          />
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500">
                          {file.progress}% uploaded
                        </div>
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
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={files.length === 0 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner className="w-4 h-4 mr-2" />
                  Uploading...
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
