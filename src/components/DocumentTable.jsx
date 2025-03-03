import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";
import defaultIcon from "../assets/default-doc-icon.png";
import excelIcon from "../assets/excel-icon.png";
import pdfIcon from "../assets/pdf-icon.png";
import pptIcon from "../assets/ppt-icon.png";
import wordIcon from "../assets/word-icon.png";
import { useAuth } from "../context/AuthContext";
import { getDataModel } from "../services/dataService";
import LoadingSpinner from "./common/LoadingSpinner";
import DocumentUpload from "./DocumentUpload";
import { deleteDMSMaster } from "../services/dmsService";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileUp,
  Trash2,
} from "lucide-react";

const DocumentTable = ({ fetchDataRef, globalFilter, setGlobalFilter }) => {
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const modalRef = useRef(null);
  const [sorting, setSorting] = useState([{ id: "REF_SEQ_NO", desc: true }]);
  const { auth } = useAuth();

  // Fetch master data and attach a stable UUID to each row
  const fetchMasterData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getDataModel(
        {
          dataModelName: "SYNM_DMS_MASTER",
          whereCondition: "",
          orderby: "",
        },
        auth.email
      );
      // Ensure response is an array. If it's not, set it to an empty array.
      const dataArray = Array.isArray(response) ? response : [];
      // Enrich data: attach an empty array for uploadedDocs if not present, and add a uuid
      const enriched = dataArray.map((doc) => ({
        ...doc,
        // Ensure that uploadedDocs is an array. If it's not, fallback to an empty array.
        uploadedDocs: Array.isArray(doc.uploadedDocs) ? doc.uploadedDocs : [],
        uuid: uuidv4(),
      }));
      setMasterData(enriched);
      setError(null);
      return enriched;
    } catch (err) {
      console.error("Error fetching master data:", err);
      setError(err.message || "Error fetching data");
      return [];
    } finally {
      setLoading(false);
    }
  }, [auth.email]);

  // Fetch document details for a given ref_seq_no
  const fetchDetailsForRef = useCallback(
    async (ref_seq_no) => {
      try {
        const details = await getDataModel(
          {
            dataModelName: "SYNM_DMS_DETAILS",
            whereCondition: `ref_seq_no = ${ref_seq_no}`,
            orderby: "",
          },
          auth.email
        );
        return details;
      } catch (err) {
        console.error(
          `Error fetching details for ref_seq_no ${ref_seq_no}:`,
          err
        );
        return [];
      }
    },
    [auth.email]
  );

  // Load master data then fetch details for each row
  const loadData = useCallback(async () => {
    const master = await fetchMasterData();
    if (master && master.length > 0) {
      const updatedData = await Promise.all(
        master.map(async (doc) => {
          const details = await fetchDetailsForRef(doc.REF_SEQ_NO);
          return {
            ...doc,
            uploadedDocs: details && details.length > 0 ? details : [],
          };
        })
      );
      setMasterData(updatedData);
    }
  }, [fetchMasterData, fetchDetailsForRef]);

  // Initial data load on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Expose fetch function to parent via ref for external refresh after upload
  useEffect(() => {
    if (fetchDataRef) {
      fetchDataRef.current = loadData;
    }
  }, [fetchDataRef, loadData]);

  // Modal open handler
  const handleEdit = useCallback((doc) => {
    setSelectedDocument(doc);
    if (modalRef.current) {
      modalRef.current.showModal();
    } else {
      console.error("Modal element not found");
    }
  }, []);

  // After upload, update the table row with new documents.
  const handleUploadComplete = useCallback((refSeqNo, newDocs) => {
    setMasterData((prevData) =>
      prevData.map((doc) =>
        doc.REF_SEQ_NO === refSeqNo
          ? { ...doc, uploadedDocs: [...doc.uploadedDocs, ...newDocs] }
          : doc
      )
    );
  }, []);

  // Delete handler for document removal
  const handleDelete = useCallback(
    async (doc) => {
      if (!window.confirm("Are you sure you want to delete this document?"))
        return;
      try {
        const payload = {
          USER_NAME: doc.USER_NAME,
          REF_SEQ_NO: doc.REF_SEQ_NO,
        };
        await deleteDMSMaster(payload, auth.email);
        setMasterData((prevData) =>
          prevData.filter((item) => item.REF_SEQ_NO !== doc.REF_SEQ_NO)
        );
      } catch (error) {
        console.error("Deletion error:", error);
        alert("Failed to delete the document. Please try again.");
      }
    },
    [auth.email]
  );

  // Helper: Get icon image based on document extension
  const getDocImage = useCallback((docItem) => {
    const ext = docItem.DOC_EXT ? docItem.DOC_EXT.toLowerCase() : "";
    switch (ext) {
      case "pdf":
        return pdfIcon;
      case "xls":
      case "xlsx":
        return excelIcon;
      case "doc":
      case "docx":
        return wordIcon;
      case "ppt":
      case "pptx":
        return pptIcon;
      default:
        if (ext.match(/(png|jpe?g|gif)$/)) {
          return docItem.thumbnail ? docItem.thumbnail : defaultIcon;
        }
        return defaultIcon;
    }
  }, []);

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        header: "Ref No",
        accessorKey: "REF_SEQ_NO",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Document Name",
        accessorKey: "DOCUMENT_DESCRIPTION",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Uploader",
        accessorKey: "USER_NAME",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <div className="avatar">
              <div className="mask mask-circle h-8 w-8">
                <img
                  src="https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg"
                  alt="Uploader"
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">
                {row.getValue("USER_NAME")}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "Related to",
        accessorKey: "DOC_RELATED_TO",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Remarks",
        accessorKey: "COMMENTS",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Status",
        accessorKey: "DOCUMENT_STATUS",
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <p className="badge badge-error text-xs font-medium">Not Yet</p>
          ),
      },
      {
        header: "Action",
        cell: ({ row }) => {
          const doc = row.original;
          return (
            <div className="flex gap-2">
              {doc.uploadedDocs && doc.uploadedDocs.length > 0 ? (
                <div
                  className="avatar-group -space-x-6 rtl:space-x-reverse cursor-pointer"
                  onClick={() => handleEdit(doc)}
                >
                  {doc.uploadedDocs.slice(0, 3).map((d, i) => (
                    <div key={i} className="avatar">
                      <div className="w-8">
                        <img src={getDocImage(d)} alt="Document icon" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
              <button
                className="btn btn-ghost btn-circle text-red-600"
                onClick={() => handleDelete(doc)}
                title="Delete Document"
              >
                <Trash2 />
              </button>
            </div>
          );
        },
      },
    ],
    [handleEdit, handleDelete, getDocImage]
  );

  // Global filter function
  const globalFilterFn = useCallback((row, columnId, filterValue) => {
    return Object.values(row.original)
      .filter((val) => typeof val === "string" || typeof val === "number")
      .some((val) =>
        String(val).toLowerCase().includes(String(filterValue).toLowerCase())
      );
  }, []);

  // Initialize TanStack table
  const table = useReactTable({
    data: masterData,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-xs table-zebra">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="12" className="text-center py-4">
                  <LoadingSpinner className="loading loading-spinner loading-lg" />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="12" className="text-center text-red-500 py-4">
                  Error: {error}
                </td>
              </tr>
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.original.uuid}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={`${row.original.uuid}-${cell.column.id}`}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center py-4">
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="join">
          <button
            className="join-item btn btn-md"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </button>
          <button
            className="join-item btn btn-md"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </button>
          <button className="join-item btn btn-md">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </button>
          <button
            className="join-item btn btn-md"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </button>
          <button
            className="join-item btn btn-md"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-md whitespace-nowrap">Go to page:</span>
          <input
            type="number"
            placeholder="Page number"
            className="input input-bordered input-sm w-20"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
          <select
            className="select select-bordered select-sm"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal for Document Upload */}
      <DocumentUpload
        modalRef={modalRef}
        selectedDocument={selectedDocument}
        onUploadComplete={handleUploadComplete}
      />
    </>
  );
};

export default DocumentTable;
