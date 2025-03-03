import { Route, Routes } from "react-router-dom";
import TaskAssignment from "./components/TaskAssignment";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import UploadDocumentPage from "./pages/UploadDocumentPage";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="document-list" element={<UploadDocumentPage />} />
        <Route path="Document" element={<TaskAssignment />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
