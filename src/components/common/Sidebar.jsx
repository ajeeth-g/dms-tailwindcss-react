import {
  FileSearch,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logo-transparent.jpg";

const Sidebar = ({ isOpen }) => {
  return (
    <aside
      className={`${
        isOpen ? "w-full max-w-48" : "w-0"
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

      <div className="px-2">
        {/* Navigation Menu */}

        <ul className="menu menu-md w-full p-0">
          <li className="menu-title text-xs">MENU</li>
          <li>
            <Link
              to="/"
              className="text-sm rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/my-team"
              className="text-sm rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <Users className="h-5 w-5" />
              My Team
            </Link>
          </li>
          <li>
            <Link
              to="/category-view"
              className="text-sm rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <LayoutGrid className="h-5 w-5" />
              Category View
            </Link>
          </li>
          <li>
            <Link
              to="/document-list"
              className="text-sm rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
            >
              <FileText className="h-5 w-5" />
              Document List
            </Link>
          </li>
          <li>
            <Link
              to="/document-view"
              className="text-sm rounded-full py-3 px-5 mb-2 hover:bg-gray-800 transition"
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
