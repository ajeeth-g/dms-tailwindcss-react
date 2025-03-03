// DocumentThumbnails.js
import React, { useState } from "react";

const DocumentThumbnails = ({ documents }) => {
  const [showAll, setShowAll] = useState(false);

  // Display up to 3 thumbnails
  const visibleDocs = documents.slice(0, 3);
  const extraCount = documents.length - visibleDocs.length;

  return (
    <div>
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setShowAll(true)}
      >
        {visibleDocs.map((doc, index) => (
          <div
            key={doc.id || index}
            className={`w-8 h-8 rounded-full border-2 border-white overflow-hidden ${
              index > 0 ? "-ml-2" : ""
            }`}
          >
            <img
              src={doc.thumbnailUrl}
              alt={doc.name}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
        {extraCount > 0 && (
          <div className="-ml-2 w-8 h-8 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-xs text-white">
            +{extraCount}
          </div>
        )}
      </div>

      {/* Modal to show all documents */}
      {showAll && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-4 rounded-md w-96">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">Uploaded Documents</h4>
              <button
                onClick={() => setShowAll(false)}
                className="btn btn-sm btn-ghost"
              >
                Close
              </button>
            </div>
            <ul className="space-y-2">
              {documents.map((doc, idx) => (
                <li key={doc.id || idx} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={doc.thumbnailUrl}
                      alt={doc.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <span>{doc.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentThumbnails;
