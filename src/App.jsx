import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import UploadDocumentPage from "./pages/UploadDocumentPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedLayout from "./layouts/ProtectedLayout";
import TaskForm from "./components/TaskForm";
import TaskAssignment from "./components/TaskAssignment";

const App = () => {
  const [user, setUser] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/"
            element={<ProtectedLayout user={user} setUser={setUser} />}
          >
            <Route index element={<Dashboard />} />
            <Route path="Upload" element={<UploadDocumentPage />} />
            <Route path="Document" element={<TaskAssignment />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
