import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { doConnection } from "../services/connectionService";
import { getEmployeeImage, getEmployeeNameAndId } from "../services/employeeService";
import { doConnectionPublic, getServiceURL } from "../services/publicService";
import { getNameFromEmail } from "../utils/emailHelpers";

const Login = () => {
  const [email, setEmail] = useState("gopi@demo.com");
  const [password, setPassword] = useState("pass@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, setUserData } = useAuth();

  // Memoized login handler to prevent re-creation on each render.
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Invalid credentials!");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Connect to public service.
      const publicConnection = await doConnectionPublic(email);
      if (publicConnection === "Invalid domain on Client Connection Data") {
        setError("Public connection failed: Invalid domain.");
        setLoading(false);
        return;
      }

      // Step 2: Retrieve dynamic client URL.
      const clientURL = await getServiceURL(email);
      if (!clientURL || !clientURL.startsWith("http")) {
        setError("Failed to retrieve a valid client URL.");
        setLoading(false);
        return;
      }

      // Update global state with client URL.
      setUserData(prev => ({ ...prev, ClientURL: clientURL }));

      // Step 3: Connect to client service.
      const clientConnection = await doConnection(clientURL, email);
      // (Optionally validate clientConnection if needed)

      // Step 4: Retrieve employee details.
      const userName = getNameFromEmail(email);
      const employeeData = await getEmployeeNameAndId(userName, email, clientURL);
      if (!employeeData || !employeeData.length) {
        setError("Employee details not found.");
        setLoading(false);
        return;
      }
      const empNo = employeeData[0].EMP_NO;
      const employeeImage = await getEmployeeImage(empNo, clientURL);

      // Assemble user data.
      const userDataPayload = {
        token: "dummy-token", // Replace with actual token if available
        email,
        Current_User_Login: email,
        Current_User_Name: employeeData[0].USER_NAME,
        Current_User_EmpNo: empNo,
        Current_User_ImageData: employeeImage,
        ClientURL: clientURL,
      };

      // Save user data and login.
      login(userDataPayload);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, password, login, setUserData, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center primary-content">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-2xl shadow-lg max-w-sm w-full text-white">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <label className="input input-bordered flex items-center gap-2">
              <Mail />
              <input
                type="email"
                className="grow"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="relative">
            <label className="input input-bordered flex items-center gap-2">
              <KeyRound />
              <input
                type={showPassword ? "text" : "password"}
                className="grow"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </label>
          </div>
          {error && (
            <div className="bg-red-500 text-white p-2 mb-4 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner className="loading loading-spinner loading-md" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <p className="text-center text-gray-300 text-sm mt-4">
          Don't have an account?{" "}
          <a href="#" className="text-blue-300">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
