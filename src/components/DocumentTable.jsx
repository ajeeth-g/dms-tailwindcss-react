import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileUp,
} from "lucide-react";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import DocumentUpload from "./DocumentUpload";
import { getDataModel } from "../services/dataService";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
} from "@tanstack/react-table";
import LoadingSpinner from "./common/LoadingSpinner";
import { parseServiceDate } from "../utils/soapUtils";

const DocumentTable = ({ fetchDataRef }) => {
  // States for SOAP parameters (if needed for re-fetching)
  const [dataModelName] = useState("SYNM_DMS_MASTER");
  const [whereCondition] = useState("");
  const [orderby] = useState("");

  // Data & loading/error states
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for selected document (for modal editing)
  const [selectedDocument, setSelectedDocument] = useState(null);
  const modalRef = useRef(null);

  // Fetch the data model on component mount
  const fetchDmsMasterDataModel = async () => {
    setLoading(true);
    try {
      const response = await getDataModel({
        dataModelName,
        whereCondition,
        orderby,
      });
      setTableData(response);
      setError(null);
    } catch (err) {
      console.error("Error fetching data model:", err);
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchDmsMasterDataModel();
  }, [dataModelName, whereCondition, orderby]);

  // Expose fetch function to parent via ref
  useEffect(() => {
    if (fetchDataRef) {
      fetchDataRef.current = fetchDmsMasterDataModel;
    }
  }, [fetchDataRef]);

  const handleEdit = (doc) => {
    setSelectedDocument(doc);
    if (modalRef.current) {
      modalRef.current.showModal();
    } else {
      console.error("Modal element not found");
    }
  };

  // Define columns for document fields
  const columns = useMemo(
    () => [
      {
        header: "S.No",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Ref No",
        accessorKey: "REF_SEQ_NO",
        cell: (info) => `#${info.getValue()}`,
      },
      {
        header: "Document Name",
        accessorKey: "DOCUMENT_DESCRIPTION",
      },
      {
        header: "Expiry Date",
        accessorKey: "EXPIRY_DATE",
        cell: (info) => (info.getValue() ? info.getValue() : "No Expiry"),
      },
      {
        header: "Uploader",
        accessorKey: "USER_NAME",
      },
      {
        header: "Remarks",
        accessorKey: "COMMENTS",
        cell: (info) => (info.getValue() ? info.getValue() : "-"),
      },
      {
        header: "Action",
        cell: ({ row }) => (
          <div
            className="tooltip tooltip-left tooltip-info"
            data-tip="Attach Documents"
          >
            <button
              className="btn btn-ghost btn-circle"
              onClick={() => handleEdit(row.original)}
            >
              <FileUp />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  // Create the table instance using TanStack Table hooks
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
  });

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table table-xs table-zebra table-pin-rows table-pin-cols">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
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
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover">
                  {row.getVisibleCells().map((cell) => {
                    // Render the cell value
                    const renderedCell = flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    );

                    // Convert React element to string if needed
                    let cellValue =
                      typeof renderedCell === "string"
                        ? renderedCell
                        : React.isValidElement(renderedCell) &&
                          typeof renderedCell.props.children === "string"
                        ? renderedCell.props.children
                        : renderedCell;

                    // Process date format
                    cellValue =
                      typeof cellValue === "string" &&
                      cellValue.startsWith("/Date(")
                        ? parseServiceDate(cellValue)
                        : cellValue;

                    return <td key={cell.id}>{cellValue}</td>;
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        {/* Pagination Buttons */}
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

        {/* Go-to-Page and Page Size Controls */}
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

      {/* Modal Component */}
      <DocumentUpload modalRef={modalRef} selectedDocument={selectedDocument} />
    </>
  );
};

export default DocumentTable;
