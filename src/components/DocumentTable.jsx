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
import LoadingSpinner from "./common/LoadingSpinner";
import DocumentUpload from "./DocumentUpload";
import { deleteDMSMaster, getDocMasterList } from "../services/dmsService";
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
  FilePen,
  FileStack,
  FileUp,
  Pencil,
  SquarePenIcon,
  Trash2,
  Upload,
} from "lucide-react";
import DocumentForm from "./DocumentForm";

const DocumentTable = ({ fetchDataRef, globalFilter, setGlobalFilter }) => {
  const [masterData, setMasterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const modalRefForm = useRef(null);
  const modalRefUpload = useRef(null);
  const [sorting, setSorting] = useState([{ id: "REF_SEQ_NO", desc: true }]);
  const { auth } = useAuth();

  const fetchDocsMasterList = useCallback(async () => {
    setLoading(true);
    try {
      const docsPayload = {
        WhereCondition: "",
        orderby: "",
        IncludeEmpImage: true,
      };
      const response = await getDocMasterList(docsPayload, auth.email);
      const dataArray = Array.isArray(response) ? response : [];
      const enriched = dataArray.map((doc) => ({
        ...doc,
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

  // Load master data
  const loadData = useCallback(async () => {
    const master = await fetchDocsMasterList();
    setMasterData(master);
  }, [fetchDocsMasterList]);

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

  // Open the DocumentUpload modal
  const handleOpenUpload = useCallback((doc) => {
    setSelectedDocument(doc);
    if (modalRefUpload.current) {
      modalRefUpload.current.showModal();
    } else {
      console.error("Modal element not found");
    }
  }, []);

  // Open the DocumentForm modal (button next to delete)
  const handleOpenForm = useCallback((doc) => {
    setSelectedDocument(doc);
    if (modalRefForm.current) {
      modalRefForm.current.showModal();
    } else {
      console.error("Form modal element not found");
    }
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

  const columns = useMemo(
    () => [
      {
        header: "Ref No",
        size: 80,
        accessorKey: "REF_SEQ_NO",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Document Name",
        size: 300,
        accessorKey: "DOCUMENT_DESCRIPTION",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Uploader",
        size: 200,
        accessorKey: "USER_NAME",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <div>
              <p className="text-xs font-semibold">
                {row.getValue("USER_NAME")}
              </p>
            </div>
          </div>
        ),
      },
      {
        header: "Related to",
        size: 100,
        accessorKey: "DOC_RELATED_TO",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Remarks",
        size: 250,
        accessorKey: "COMMENTS",
        cell: (info) => info.getValue() || "-",
      },
      {
        header: "Status",
        size: 100,
        accessorKey: "DOCUMENT_STATUS",
        cell: (info) =>
          info.getValue() ? (
            info.getValue()
          ) : (
            <span className="badge badge-error text-xs font-medium">
              Not Yet
            </span>
          ),
      },
      {
        header: "Docs",
        accessorKey: "NO_OF_DOCUMENTS",
        size: 50,
        cell: (info) => (
          <div className="flex items-center gap-1">
            {info.getValue() > 0 ? (
              <>
                <span className="badge badge-success text-xs font-medium">
                  {info.getValue()}
                </span>
                <button
                  className="btn btn-ghost btn-circle btn-sm"
                  onClick={() => handleOpenUpload(info.row.original)}
                >
                  <FilePen className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                className="btn btn-ghost btn-circle btn-sm"
                onClick={() => handleOpenUpload(info.row.original)}
              >
                <Upload className="h-4 w-4" />
              </button>
            )}
          </div>
        ),
      },
      {
        header: "Action",
        size: 50,
        cell: ({ row }) => {
          const doc = row.original;
          return (
            <div className="flex items-center gap-1">
              <button
                className="btn btn-ghost btn-circle btn-sm"
                onClick={() => handleOpenForm(doc)}
              >
                <SquarePenIcon className="h-4 w-4" />
              </button>
              <button
                className="btn btn-ghost btn-circle btn-sm text-red-600"
                onClick={() => handleDelete(doc)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [handleDelete, handleOpenUpload, handleOpenForm]
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
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.column.getSize() }}
                  >
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
                    <td
                      key={`${row.original.uuid}-${cell.column.id}`}
                      style={{ width: cell.column.getSize() }}
                    >
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="join">
          <button
            className="join-item btn btn-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </button>
          <button
            className="join-item btn btn-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </button>
          <button className="join-item btn btn-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </button>
          <button
            className="join-item btn btn-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </button>
          <button
            className="join-item btn btn-sm"
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

      <DocumentForm
        modalRefForm={modalRefForm}
        selectedDocument={selectedDocument}
      />

      {/* Modal for Document Upload */}
      <DocumentUpload
        modalRefUpload={modalRefUpload}
        selectedDocument={selectedDocument}
      />
    </>
  );
};

export default DocumentTable;
