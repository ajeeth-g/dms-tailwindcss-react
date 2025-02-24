import { FileUp } from "lucide-react";
import { useRef, useState } from "react";
import DocumentUpload from "./DocumentUpload";

const DocumentTable = ({ tableData = [] }) => {
  const modalRef = useRef(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (doc) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
    document.getElementById("document_attachment").showModal();
  };

  return (
    <>
      <div className="overflow-x-auto w-auto">
        <table className="table table-xs table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>S.No</th>
              <th>Ref No</th>
              <th>Document Name</th>
              <th>Category</th>
              <th>Branch/Division</th>
              <th>Received From</th>
              <th>Upload By</th>
              <th>No. of Files</th>
              <th>Status</th>
              <th>Remarks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  No documents details found.
                </td>
              </tr>
            ) : (
              tableData.map((doc, index) => (
                <tr key={index}>
                  <td>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </td>
                  <td className="text-end">1</td>
                  <td>#{doc.REF_SEQ_NO}</td>
                  <td>
                    <div>
                      <div className="font-bold">
                        {doc.DOCUMENT_DESCRIPTION}
                      </div>
                      <div className="text-sm opacity-50">
                        uploaded {doc.EXPIRY_DATE}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-secondary badge-sm">
                      {doc.DOC_RELATED_CATEGORY}
                    </span>
                  </td>
                  <td>TRI Chennai</td>
                  <td>TRI Dubai</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <div className="avatar">
                        <div className="mask mask-circle h-8 w-8">
                          <img
                            src="data:image/jpeg;base64,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"
                            alt="Uploader name goes here..."
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">Anees</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs opacity-50">Add files</span>
                  </td>
                  <td>
                    <span className="badge badge-accent badge-xs">
                      Processing
                    </span>
                  </td>
                  <td> {doc.COMMENTS} </td>
                  <td>
                    <div
                      className="tooltip tooltip-left tooltip-info"
                      data-tip="Attach Documents"
                    >
                      <button
                      className="btn btn-ghost btn-circle"
                        onClick={() => handleEdit(doc)}
                      >
                        <FileUp />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedDocument && (
        <DocumentUpload
          modalRef={modalRef}
          selectedDocument={selectedDocument}
        />
      )}
    </>
  );
};

export default DocumentTable;
