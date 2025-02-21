import { FilePlus2 } from "lucide-react";
import { useRef, useState } from "react";
import Button from "../components/common/Button";
import SearchInput from "../components/common/SearchInput";
import DocumentForm from "../components/DocumentForm";
import DocumentTable from "../components/DocumentTable";

const UploadDocumentPage = () => {
  const modalRef = useRef(null);
  
  const [tableData, setTableData] = useState([]);

  return (
    <>
      <div className="flex items-end justify-between gap-4 mb-8">
        <SearchInput />
        <Button
          className="btn btn-success"
          icon={<FilePlus2 className="h-4 w-4" />}
          onClick={() => modalRef.current.showModal()}
          label="Add Document"
        />
      </div>

      <DocumentForm modalRef={modalRef} setTableData={setTableData} />

      <DocumentTable data={tableData} />
    </>
  );
};

export default UploadDocumentPage;