import React from "react";
import { getNameFromEmail } from "../utils/emailHelpers";
import { useAuth } from "../context/AuthContext";

const Greeting = () => {
  const { email } = useAuth();
  const UserName = getNameFromEmail(email);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-4 p-7 rounded-2xl shadow-lg border border-gray-700">
      {/* Avatar Section */}
      <div className="w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-gray-700">
        <img
          alt="User Avatar"
          src="https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Welcome Message */}
      <div className="animate-fade-in">
        <h2 className="text-4xl font-semibold text-white">
          Welcome Back, <span className="text-indigo-400">{UserName}</span>! 👋
        </h2>
        <p className="text-sm text-gray-400 mt-1">Today is {currentDate}</p>
      </div>
    </div>
  );
};

export default Greeting;
