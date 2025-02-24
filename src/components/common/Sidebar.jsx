import { Link } from "react-router-dom";
import Logo from "../../assets/logo-light.png";
import { ExternalLink, FileUp, LayoutPanelLeft, ListTodo } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="min-h-screen">
      <Link
        to="https://cloud.istreams-erp.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-2 px-2 mt-4"
      >
        {/* Logo Container */}
        <div className="h-14 w-14 rounded-full overflow-hidden flex justify-center items-center">
          <img
            src={Logo}
            alt="iStreams ERP Solutions"
            className="h-full w-full object-fill"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-0">
          <p className="text-3xl font-semibold tracking-wide">iStreams</p>
          <p className="flex items-center gap-1 text-xs text-gray-400">
            TRI Dubai <ExternalLink className="h-3 w-3" />
          </p>
        </div>
      </Link>

      <div className="divider mt-2 mb-0"></div>

      <div className="px-2 pt-2">
        <h6 className="text-xs text-gray-500 font-bold py-2">MENU</h6>
        {/* Navigation Menu */}
        <ul className="menu menu-md w-full max-w-xs p-0">
          <li>
            <Link
              to="/"
              className="text-lg rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <LayoutPanelLeft className="h-5 w-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/Upload"
              className="text-lg rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <FileUp className="h-5 w-5" />
              Upload Docs
            </Link>
          </li>
          <li>
            <Link
              to="/Document"
              className="text-lg rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <ListTodo className="h-5 w-5" />
              Documents
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
