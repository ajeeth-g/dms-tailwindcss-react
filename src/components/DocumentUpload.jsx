import { CalendarDays, FileType2, Hash, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAuth } from "../context/AuthContext";

const DocumentUpload = ({ modalRef, selectedDocument }) => {
  const { domain } = useAuth();
  const [files, setFiles] = useState([]);

  const handleSave = async () => {
    const formData = new FormData();

    // Loop through files and append each file under the same 'file' field
    files.forEach((file) => {
      formData.append("file", file.file);
    });

    // Append other data
    formData.append("domainName", domain);
    formData.append("refNo", selectedDocument.REF_SEQ_NO);
    formData.append("category", files[0].category || "Other");

    // Log FormData to verify contents
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Files uploaded:", result);
        setIsModalOpen(false);
        document.getElementById("document_attachment").close();
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const onDrop = async (acceptedFiles) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) => ({
        file,
        preview: file.type.startsWith("image")
          ? URL.createObjectURL(file)
          : null,
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        category: "", // Add category if needed later
        progress: 0,
      })),
    ]);
  };

  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (index, category) => {
    setFiles(
      files.map((file, i) => (i === index ? { ...file, category } : file))
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

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

  return (
    <>
      <dialog ref={modalRef} id="document_attachment" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add Documents</h3>
          <div className="divider"></div>

          <div className="flex justify-between mb-3">
            <h6 className="flex items-center gap-2 font-semibold">
              Reference No:
              <span className="badge badge-primary">
                {selectedDocument.REF_SEQ_NO}
              </span>
            </h6>
            <h6 className="flex items-center gap-2 font-semibold">
              Document Name:
              <span className="badge badge-primary">
                {selectedDocument.DOCUMENT_DESCRIPTION}
              </span>
            </h6>
          </div>

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
                            <img src={file.preview} />
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
                            <label htmlFor="DOCUMENT_NO" className="text-xs">
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
                            <option value="ID Proof">ID Proof</option>
                            <option value="Resume">Resume</option>
                            <option value="Certificate">Certificate</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>

                        <div className="w-full">
                          <div className="flex items-center gap-1 mb-2">
                            <CalendarDays className="h-4 w-4" />
                            <label htmlFor="DOCUMENT_NO" className="text-xs">
                              Document Expiry Date
                            </label>
                          </div>
                          <input
                            type="date"
                            name="DOCUMENT_NO"
                            id="DOCUMENT_NO" // Added id
                            placeholder="Enter document ref no"
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
            <form method="dialog">
              <div className="flex justify-end gap-4">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
                <button
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={files.length === 0}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default DocumentUpload;
