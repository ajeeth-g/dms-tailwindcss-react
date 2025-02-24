import React, { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/common/Footer";
import Breadcrumb from "../components/common/Breadcrumb";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`${
          isSidebarOpen ? "w-56" : "w-0"
        } bg-base-300 text-base-content transition-all duration-300 overflow-hidden`}
      >
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-grow p-6 overflow-auto h-screen">
          <Breadcrumb />
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
