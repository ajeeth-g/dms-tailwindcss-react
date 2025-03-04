import { Route, Routes } from "react-router-dom";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";
import DocumentListPage from "./pages/DocumentListPage";
import DocumentViewPage from "./pages/DocumentViewPage";
import CategoryViewPage from "./pages/CategoryViewPage";
import MyTeamPage from "./pages/MyTeamPage";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="my-team" element={<MyTeamPage />} />
        <Route path="category-view" element={<CategoryViewPage />} />
        <Route path="document-list" element={<DocumentListPage />} />
        <Route path="document-view" element={<DocumentViewPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
