import { CalendarDays, FileType2, X, Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { getDataModel } from "../services/dataService";
import { createAndSaveDMSDetails, deleteDMSDetails } from "../services/dmsService";
import { readFileAsBase64 } from "../utils/soapUtils";
import LoadingSpinner from "./common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

const DocumentUpload = ({ modalRef, selectedDocument, onUploadComplete }) => {
  const { auth } = useAuth();

  // For category lookup
  const [dataModelName] = useState("SYNM_DMS_DOC_CATEGORIES");
  const [whereCondition] = useState("");
  const [orderby] = useState("");
  const [categoryData, setCategoryData] = useState([]);

  // Pending files for the current document.
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset files when a new document is selected.
  useEffect(() => {
    setFiles([]);
    setErrorMsg("");
  }, [selectedDocument]);

  // Fetch category data on mount.
  useEffect(() => {
    const fetchCategoryDataModel = async () => {
      try {
        const response = await getDataModel(
          { dataModelName, whereCondition, orderby },
          auth.email
        );
        // Ensure that categoryData is an array of valid objects
        const validCategories = Array.isArray(response)
          ? response.filter((item) => item && item.CATEGORY_NAME)
          : [];
        setCategoryData(validCategories);
      } catch (err) {
        console.error("Error fetching data model:", err);
      }
    };
    fetchCategoryDataModel();
  }, [dataModelName, whereCondition, orderby, auth.email]);

  // Only allow specific MIME types.
  const allowedMimeTypes = {
    "image/*": [],
    "application/pdf": [],
    "application/vnd.ms-excel": [],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
  };

  // List of disallowed file extensions.
  const disallowedExtensions = ["exe", "bat", "sh", "msi", "js"];

  // Configure the dropzone.
  const { getRootProps, getInputProps } = useDropzone({
    accept: allowedMimeTypes,
    multiple: true,
    onDrop: (acceptedFiles) => {
      // Filter files based on extension.
      const validFiles = acceptedFiles.filter((file) => {
        const ext = file.name.split(".").pop().toLowerCase();
        if (disallowedExtensions.includes(ext)) {
          setErrorMsg(`File type not allowed: ${file.name}`);
          return false;
        }
        return true;
      });
      setFiles((prevFiles) => [
        ...prevFiles,
        ...validFiles.map((file) => ({
          file,
          preview:
            file.type.startsWith("image") || file.type === "application/pdf"
              ? URL.createObjectURL(file)
              : null,
          name: file.name,
          size: (file.size / 1024).toFixed(2) + " KB",
          category: "",
          progress: 0,
          expiryDate: "",
        })),
      ]);
    },
  });

  // Cancel (remove) a pending file.
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Update the category for a pending file.
  const handleCategoryChange = (index, category) => {
    setFiles((prevFiles) =>
      prevFiles.map((file, i) => (i === index ? { ...file, category } : file))
    );
  };

  // Simulated progress update for each file.
  const startUpload = (index) => {
    let progress = 0;
    const interval = setInterval(() => {
      setFiles((prevFiles) =>
        prevFiles.map((file, i) =>
          i === index ? { ...file, progress: progress + 10 } : file
        )
      );
      progress += 10;
      if (progress >= 100) clearInterval(interval);
    }, 300);
  };

  // Start upload progress for pending files.
  useEffect(() => {
    files.forEach((file, index) => {
      if (file.progress === 0) startUpload(index);
    });
  }, [files]);

  // Sequentially upload each pending file.
  const handleSave = async () => {
    setErrorMsg("");
    setIsSubmitting(true);
    let newDocs = [];
    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      try {
        // Convert file to base64.
        const base64Data = await readFileAsBase64(currentFile.file);
        // Build payload using selectedDocument details plus file data.
        const payload = {
          REF_SEQ_NO: selectedDocument.REF_SEQ_NO,
          SERIAL_NO: i + 1,
          DOCUMENT_NO: selectedDocument.DOCUMENT_NO || "",
          DOCUMENT_DESCRIPTION: selectedDocument.DOCUMENT_DESCRIPTION || "",
          DOC_SOURCE_FROM: selectedDocument.DOC_SOURCE_FROM || "",
          DOC_RELATED_TO: selectedDocument.DOC_RELATED_TO || "",
          DOC_RELATED_CATEGORY: selectedDocument.DOC_RELATED_CATEGORY || "",
          DOC_REF_VALUE: selectedDocument.DOC_REF_VALUE || "",
          USER_NAME: selectedDocument.USER_NAME || "",
          COMMENTS: selectedDocument.COMMENTS || "",
          DOC_TAGS: selectedDocument.DOC_TAGS || "",
          FOR_THE_USERS: selectedDocument.FOR_THE_USERS || "",
          EXPIRY_DATE: currentFile.expiryDate || "",
          DOC_DATA: base64Data,
          DOC_NAME: currentFile.name,
          DOC_EXT: currentFile.name.split(".").pop(),
          FILE_PATH: "",
        };

        // Upload the file.
        const response = await createAndSaveDMSDetails(payload, auth.email);
        console.log(
          `File ${currentFile.name} uploaded successfully.`,
          response
        );
        // Prepare a document object to update the parent table.
        newDocs.push({
          thumbnail: currentFile.preview,
          DOC_NAME: currentFile.name,
          DOC_EXT: payload.DOC_EXT,
          // Optionally store SERIAL_NO if available from the response.
          SERIAL_NO: payload.SERIAL_NO,
          // You may also store a download URL if your backend provides one.
          downloadUrl: response.downloadUrl || currentFile.preview,
        });
      } catch (error) {
        console.error(`Error uploading file ${currentFile.name}:`, error);
        setErrorMsg(
          `Error uploading file ${currentFile.name}: ${error.message}`
        );
        break;
      }
    }
    setIsSubmitting(false);
    // Update only the selected document's uploadedDocs.
    if (newDocs.length > 0) {
      onUploadComplete(selectedDocument.REF_SEQ_NO, newDocs);
    }
    // Do not clear the pending files so that the user can still see the uploaded ones.
  };

  // Download handler: Create a temporary link to download the file.
  const handleDownload = (doc) => {
    const link = document.createElement("a");
    link.href = doc.downloadUrl || doc.thumbnail || "#";
    link.download = doc.DOC_NAME;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete handler for an uploaded document.
  const handleDeleteUploadedDoc = async (doc, index) => {
    if (
      !window.confirm(`Are you sure you want to delete ${doc.DOC_NAME}?`)
    )
      return;
    try {
      // Assuming SERIAL_NO is provided in doc or use index + 1 as fallback.
      const payload = {
        USER_NAME: selectedDocument.USER_NAME,
        REF_SEQ_NO: selectedDocument.REF_SEQ_NO,
        SERIAL_NO: doc.SERIAL_NO || index + 1,
      };
      await deleteDMSDetails(payload, auth.email);
      // Remove the document from the selectedDocument's uploadedDocs list.
      const updatedDocs = selectedDocument.uploadedDocs.filter(
        (_, i) => i !== index
      );
      // Here, you might need to call a callback to update the parent state.
      // For simplicity, we'll assume selectedDocument is mutable.
      selectedDocument.uploadedDocs = updatedDocs;
      // Optionally force a re-render if required by calling a parent's refresh function.
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete document.");
    }
  };

  return (
    <>
      <dialog ref={modalRef} id="document_attachment" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => modalRef.current.close()}
          >
            <X />
          </button>
          <h3 className="font-bold text-lg">Add Documents</h3>
          <div className="divider"></div>

          <div className="flex justify-between mb-3">
            <h6 className="flex items-center gap-2 font-semibold">
              Reference No:
              <span className="badge badge-primary">
                {selectedDocument?.REF_SEQ_NO}
              </span>
            </h6>
            <h6 className="flex items-center gap-2 font-semibold">
              Document Name:
              <span className="badge badge-primary">
                {selectedDocument?.DOCUMENT_DESCRIPTION}
              </span>
            </h6>
          </div>

          {/* Display uploaded documents for the current REF_SEQ_NO only */}
          {selectedDocument?.uploadedDocs &&
            selectedDocument.uploadedDocs.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Uploaded Documents:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.uploadedDocs.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 border rounded"
                    >
                      <img
                        src={
                          doc.thumbnail ||
                          (doc.DOC_EXT === "pdf"
                            ? "/path/to/pdfIcon.png"
                            : "/path/to/defaultIcon.png")
                        }
                        alt={doc.DOC_NAME}
                        className="w-8 h-8"
                      />
                      <span className="text-sm">{doc.DOC_NAME}</span>
                      <button
                        className="btn btn-xs"
                        title="Download Document"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download />
                      </button>
                      <button
                        className="btn btn-xs btn-error"
                        title="Delete Document"
                        onClick={() => handleDeleteUploadedDoc(doc, index)}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {errorMsg && (
            <div className="alert alert-error mb-3">
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="p-4 border-dashed border-2 border-gray-300 rounded-lg mb-3">
            <div {...getRootProps()} className="p-4 text-center cursor-pointer">
              <input {...getInputProps()} />
              <p>Drag & drop files here, or click to select files</p>
            </div>
          </div>

          {files.length > 0 && (
            <div className="flex flex-wrap">
              {files.map((file, index) => (
                <div key={index} className="flex items-center p-2 rounded mb-2">
                  <div className="card card-compact bg-neutral text-neutral-content w-72">
                    <div className="card-body">
                      <div className="card-actions justify-end">
                        <button
                          className="btn btn-square btn-sm"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {file.preview && (
                          <div className="mask mask-squircle w-8">
                            <img src={file.preview} alt="preview" />
                          </div>
                        )}
                        <div className="flex-1 flex-col">
                          <p className="font-semibold">{file.name}</p>
                          <span className="text-xs opacity-70">
                            ({file.size})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2 w-full">
                        <div className="w-full">
                          <div className="flex items-center gap-1 mb-2">
                            <FileType2 className="h-4 w-4" />
                            <label className="text-xs">Document Type</label>
                          </div>
                          <select
                            className="select select-bordered select-sm w-full max-w-xs bg-neutral text-neutral-content"
                            value={file.category}
                            onChange={(e) =>
                              handleCategoryChange(index, e.target.value)
                            }
                          >
                            <option disabled value="">
                              Select Type
                            </option>
                            {Array.isArray(categoryData) &&
                              categoryData
                                .filter((category) => category)
                                .map((category) => (
                                  <option
                                    key={uuidv4()}
                                    value={category.CATEGORY_NAME}
                                  >
                                    {category.CATEGORY_NAME}
                                  </option>
                                ))}
                          </select>
                        </div>

                        <div className="w-full">
                          <div className="flex items-center gap-1 mb-2">
                            <CalendarDays className="h-4 w-4" />
                            <label className="text-xs">
                              Document Expiry Date
                            </label>
                          </div>
                          <input
                            type="date"
                            value={file.expiryDate}
                            onChange={(e) => {
                              const newDate = e.target.value;
                              setFiles((prevFiles) =>
                                prevFiles.map((f, i) =>
                                  i === index
                                    ? { ...f, expiryDate: newDate }
                                    : f
                                )
                              );
                            }}
                            className="input input-bordered input-sm w-full bg-neutral text-neutral-content"
                          />
                        </div>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div
                          className="bg-blue-500 h-2.5 w-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(file.progress, 100)}%` }}
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
              ))}
            </div>
          )}

          <div className="modal-action">
            <div className="flex justify-end gap-4">
              <button className="btn" onClick={() => modalRef.current.close()}>
                Close
              </button>
              <button
                className="btn btn-success"
                onClick={handleSave}
                disabled={files.length === 0}
              >
                Upload Document
                {isSubmitting ? (
                  <LoadingSpinner className="loading loading-spinner loading-md" />
                ) : (
                  ""
                )}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DocumentUpload;
