import { FileUp } from "lucide-react";
import { useRef, useState } from "react";
import DocumentUpload from "./DocumentUpload";

const DocumentTable = ({ data = [] }) => {
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
      <div className="overflow-x-auto w-auto h-screen">
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
            {data.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  No documents details found.
                </td>
              </tr>
            ) : (
              data.map((doc, index) => (
                <tr key={index}>
                  <td>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </td>
                  <td className="text-end">1</td>
                  <td>#{doc.refSeqNo}</td>
                  <td>
                    <div>
                      <div className="font-bold">{doc.documentDescription}</div>
                      <div className="text-sm opacity-50">
                        uploaded {doc.expiryDate}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-secondary badge-sm">
                      {doc.docRelatedCategory}
                    </span>
                  </td>
                  <td>{doc.branch}</td>
                  <td>Manager</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <div className="avatar">
                        <div className="mask mask-circle h-8 w-8">
                          <img
                            src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid"
                            alt="Document Type"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">
                          {doc.documentDescription.length > 12
                            ? `${doc.documentDescription.slice(0, 12)}...`
                            : doc.documentDescription}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-xs opacity-50">Add files</span>
                  </td>
                  <td>
                    <span className="badge badge-warning badge-outline badge-xs">
                      Review
                    </span>
                  </td>
                  <td>Remarks</td>
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
        <DocumentUpload modalRef={modalRef} />
      )}
    </>
  );
};

export default DocumentTable;
