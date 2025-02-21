import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import UploadDocumentPage from "./pages/UploadDocumentPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import Sidebar from "./components/common/Sidebar";
import Breadcrumb from "./components/common/Breadcrumb";
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";
import TaskForm from "./components/TaskForm";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <AuthProvider>
      <Router>
        {user ? (
          // If user is logged in, show main layout
          <div className="flex">
            {/* Sidebar */}
            <div
              className={`${
                isSidebarOpen ? "w-48" : "w-0"
              } bg-indigo-950 text-white transition-all duration-300 overflow-hidden`}
            >
              <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col min-h-screen">
              <Navbar toggleSidebar={toggleSidebar} />
              <div className="flex-1 m-5">
                <Breadcrumb />
                <div className="divider"></div>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </div>
        ) : (
          // If user is NOT logged in, show login page
          <Routes>
            <Route path="/" element={<Login setUser={setUser} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        )}
      </Router>
    </AuthProvider>
  );
};

export default App;
