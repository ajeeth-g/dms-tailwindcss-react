import { Link } from "react-router-dom";
import Logo from "../../assets/logo-light.png";
import {
  ExternalLink,
  FileSearch,
  FileText,
  FileUp,
  Grid,
  Grid2X2,
  LayoutDashboard,
  LayoutGrid,
  LayoutPanelLeft,
  ListTodo,
  Users,
} from "lucide-react";

const Sidebar = ({ isOpen }) => {
  return (
    <aside
      className={`${
        isOpen ? "w-full max-w-56" : "w-0"
      } min-h-screen bg-base-300 text-base-content transition-all duration-300 overflow-hidden`}
    >
      <Link
        to="https://cloud.istreams-erp.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-2 px-2 mt-4"
      >
        {/* Logo Container */}
        <div className="h-14 w-full rounded-md overflow-hidden flex justify-center items-center">
          <img
            src={Logo}
            alt="iStreams ERP Solutions"
            className="h-full w-full object-fill"
          />
        </div>
      </Link>

      <div className="divider mt-2 mb-0"></div>

      <div className="px-2 pt-2">
        <h6 className="text-xs text-gray-500 font-bold py-2">MENU</h6>
        {/* Navigation Menu */}
        <ul className="menu menu-md w-full p-0">
          <li>
            <Link
              to="/"
              className="text-lg rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/my-team"
              className="text-lg rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <Users className="h-5 w-5" />
              My Team
            </Link>
          </li>
          <li>
            <Link
              to="/category-view"
              className="text-lg rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <LayoutGrid className="h-5 w-5" />
              Category View
            </Link>
          </li>
          <li>
            <Link
              to="/document-list"
              className="text-lg rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <FileText className="h-5 w-5" />
              Document List
            </Link>
          </li>
          <li>
            <Link
              to="/document-view"
              className="text-lg rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <FileSearch className="h-5 w-5" />
              Document View
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
