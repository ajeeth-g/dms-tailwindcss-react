import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "./Layout";

const ProtectedLayout = () => {
  const { auth } = useAuth();

  // If no token or email exists, user is not authenticated
  if (!auth?.token || !auth?.email) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
};

export default ProtectedLayout;
