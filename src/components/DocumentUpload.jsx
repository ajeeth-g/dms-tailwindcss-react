import { CalendarDays, FileType2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { v4 as uuidv4 } from "uuid";
import { getDataModel } from "../services/dataService";
import { createAndSaveDMSDetails } from "../services/dmsService";
import { readFileAsBase64 } from "../utils/soapUtils";

const initialFormState = {
  REF_SEQ_NO: -1, // Document reference from parent document
  SERIAL_NO: 0,   // Sequential number per file (set later)
  DOCUMENT_NO: "", // From parent document or can be overridden
  DOCUMENT_DESCRIPTION: "",
  DOC_SOURCE_FROM: "",
  DOC_RELATED_TO: "",
  DOC_RELATED_CATEGORY: "",
  DOC_REF_VALUE: "",
  USER_NAME: "",
  COMMENTS: "",
  DOC_TAGS: "",
  FOR_THE_USERS: "",
  EXPIRY_DATE: "", // May be provided per file
  DOC_DATA: "",
  DOC_NAME: "",
  DOC_EXT: "",
  FILE_PATH: "",
};

const DocumentUpload = ({ modalRef, selectedDocument }) => {
  // SOAP parameter states for category lookup
  const [dataModelName] = useState("SYNM_DMS_DOC_CATEGORIES");
  const [whereCondition] = useState("");
  const [orderby] = useState("");

  // Category data state
  const [categoryData, setCategoryData] = useState([]);
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch category data on component mount
  useEffect(() => {
    const fetchCategoryDataModel = async () => {
      try {
        const response = await getDataModel({
          dataModelName,
          whereCondition,
          orderby,
        });
        setCategoryData(response);
      } catch (err) {
        console.error("Error fetching data model:", err);
      }
    };
    fetchCategoryDataModel();
  }, [dataModelName, whereCondition, orderby]);

  // Dropzone configuration
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({
          file,
          preview: file.type.startsWith("image")
            ? URL.createObjectURL(file)
            : null,
          name: file.name,
          size: (file.size / 1024).toFixed(2) + " KB",
          category: "", // To be selected by the user
          progress: 0,
          expiryDate: "", // Captured per file
        })),
      ]);
    },
    multiple: true,
  });

  // Remove a file at a given index
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Update file category for a given file
  const handleCategoryChange = (index, category) => {
    setFiles((prevFiles) =>
      prevFiles.map((file, i) =>
        i === index ? { ...file, category } : file
      )
    );
  };

  // Simulated progress update for UI feedback
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

  useEffect(() => {
    files.forEach((file, index) => {
      if (file.progress === 0) startUpload(index);
    });
  }, [files]);

  // Sequentially upload each file to the service
  const handleSave = async () => {
    setErrorMsg("");
    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      try {
        // Convert file to base64
        const base64Data = await readFileAsBase64(currentFile.file);

        // Build payload for SOAP service.
        // Combining selectedDocument details with file-specific data.
        const payload = {
          REF_SEQ_NO: selectedDocument.REF_SEQ_NO, // From parent document
          SERIAL_NO: i + 1, // Sequential number per file
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
          EXPIRY_DATE: currentFile.expiryDate || "", // File-specific expiry date
          DOC_DATA: base64Data, // Base64 encoded file content
          DOC_NAME: currentFile.name,
          DOC_EXT: currentFile.name.split(".").pop(),
          FILE_PATH: "", // Populate if needed
        };

        // Call the SOAP service for this file's details
        const response = await createAndSaveDMSDetails(payload);
        console.log(
          `File ${currentFile.name} uploaded successfully.`,
          response
        );
      } catch (error) {
        console.error(`Error uploading file ${currentFile.name}:`, error);
        setErrorMsg(`Error uploading file ${currentFile.name}: ${error.message}`);
        // Optionally break to stop further uploads
        break;
      }
    }
    // If all files processed without error, reset and close modal
    if (!errorMsg) {
      setFiles([]);
      modalRef.current?.close();
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
                            <label htmlFor={`document_type_${index}`} className="text-xs">
                              Document Type
                            </label>
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
                            {categoryData.map((category) => (
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
                            <label htmlFor={`expiry_${index}`} className="text-xs">
                              Document Expiry Date
                            </label>
                          </div>
                          <input
                            type="date"
                            name={`expiry_${index}`}
                            id={`expiry_${index}`}
                            value={file.expiryDate}
                            onChange={(e) => {
                              const newDate = e.target.value;
                              setFiles((prevFiles) =>
                                prevFiles.map((f, i) =>
                                  i === index ? { ...f, expiryDate: newDate } : f
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
                Save
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DocumentUpload;
