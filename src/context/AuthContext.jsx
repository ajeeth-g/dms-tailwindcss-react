import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

// Create the context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, email: null });
  const [userData, setUserData] = useState({
    SrvURL: "http://103.168.19.35/iStWebPublic/iStreamsSmartPublic.asmx",
    ClientURL: null,
    doConnectionParameter: null,
    Current_User_Login: null,
    Current_User_Name: null,
    Current_User_EmpNo: null,
    Current_User_EmpName: null,
    Current_User_ImageData: null,
    Client_Username: null,
    SelectedDashBoardID: null,
    SelectedDashBoardPage: null,
    SelectedDashBoardModule: null,
    CompanyCode: "1",
    BranchCode: "1",
  });

  // Load stored auth and userData from localStorage on mount only
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem("auth");
      const storedUserData = localStorage.getItem("userData");
      if (storedAuth && storedUserData) {
        setAuth(JSON.parse(storedAuth));
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error("Error parsing stored data:", error);
    }
  }, []);

  // Memoized login to avoid unnecessary re-renders
  const login = useCallback((data) => {
    const authData = { token: data.token, email: data.email };
    setAuth(authData);
    localStorage.setItem("auth", JSON.stringify(authData));

    const newUserData = { ...userData, ...data };
    setUserData(newUserData);
    localStorage.setItem("userData", JSON.stringify(newUserData));
  }, [userData]);

  // Memoized logout function
  const logout = useCallback(() => {
    const resetData = {
      SrvURL: "http://103.168.19.35/iStWebPublic/iStreamsSmartPublic.asmx",
      ClientURL: null,
      doConnectionParameter: null,
      Current_User_Login: null,
      Current_User_Name: null,
      Current_User_EmpNo: null,
      Current_User_EmpName: null,
      Current_User_ImageData: null,
      Client_Username: null,
      SelectedDashBoardID: null,
      SelectedDashBoardPage: null,
      SelectedDashBoardModule: null,
      CompanyCode: "1",
      BranchCode: "1",
    };
    setUserData(resetData);
    setAuth({ token: null, email: null });
    localStorage.removeItem("auth");
    localStorage.removeItem("userData");
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Helper function to get the current user's email from localStorage.
export const getUserEmail = () => {
  try {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth).email : null;
  } catch (error) {
    console.error("Error parsing stored auth:", error);
    return null;
  }
};
