import React from "react";
import Login from "../pages/Login";
import Layout from "./Layout";

const ProtectedLayout = ({ user, setUser }) => {
  return user ? <Layout /> : <Login setUser={setUser} />;
};

export default ProtectedLayout;
