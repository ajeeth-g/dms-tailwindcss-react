import React from "react";
import { Navigate } from "react-router-dom";
import { getUserEmail } from "../context/AuthContext";
import Layout from "./Layout";

const ProtectedLayout = () => {
  const email = getUserEmail();

  if (!email) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
};

export default ProtectedLayout;
