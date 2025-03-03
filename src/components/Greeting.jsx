import React from "react";
import { getNameFromEmail } from "../utils/emailHelpers";
import { useAuth } from "../context/AuthContext";
import { hexToBase64 } from "../utils/hexToBase64";

const Greeting = () => {
  const { auth, userData } = useAuth();

  const UserName = getNameFromEmail(auth.email);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const imageSrc = userData.Current_User_ImageData
    ? `data:image/bmp;base64,${hexToBase64(userData.Current_User_ImageData)}`
    : "https://via.placeholder.com/150";

  return (
    <div className="flex items-center gap-4 p-7 rounded-2xl shadow-lg border border-gray-700">
      {/* Avatar Section */}
      <div className="w-20 h-20 rounded-full overflow-hidden shadow-md border-2 border-gray-700">
        <img
          alt="User Avatar"
          src={imageSrc}
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
