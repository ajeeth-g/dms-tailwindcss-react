import React, { createContext, useContext, useState } from "react";

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [domain, setDomain] = useState("");

  const setUserDetails = (email, password) => {
    setEmail(email);
    setPassword(password);

    // Extract domain from email
    const extractedDomain = email.split("@")[1];
    
    setDomain(extractedDomain);
  };

  return (
    <AuthContext.Provider value={{ email, password, domain, setUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
