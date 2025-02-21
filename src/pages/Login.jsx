import { Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = ({ setUser }) => {
  const { setUserDetails } = useAuth();
  const [email, setEmail] = useState("demo@istreams.com");
  const [password, setPassword] = useState("pass@123");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Use the demo credentials for now
    if (email === "demo@istreams.com" && password === "pass@123") {
      setUserDetails(email, password);
      setUser(true);

      alert(`Welcome back, ${email}!`);
      navigate("/dashboard");
    } else {
      alert("Invalid credentials!");
    }
  };

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
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
          >
            Sign In
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
