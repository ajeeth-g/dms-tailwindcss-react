import React, { createContext, useContext, useEffect, useState } from "react";

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(null);

  // On mount, load the user from localStorage if available.
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setEmail(parsedUser.email); // Extract email from object
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }, []);

  const login = (userEmail) => {
    const userData = { email: userEmail };
    setEmail(userEmail);
    localStorage.setItem("user", JSON.stringify(userData)); // Store as JSON object
  };

  const logout = () => {
    setEmail(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// Helper function to get the current user's email from localStorage.
export const getUserEmail = () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      return JSON.parse(storedUser).email; // Extract email safely
    } catch (error) {
      console.error("Error parsing stored user:", error);
    }
  }
  return null;
};
