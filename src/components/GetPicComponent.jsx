import React, { useState } from "react";
import doConnection from "../services/doConnection";
import getpic from "../services/getpic";

const GetPicComponent = () => {
  const [loginUserName, setLoginUserName] = useState("gopi@demo.com");
  const [empNo, setEmpNo] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [status, setStatus] = useState("");

  const fetchPicture = async () => {
    setStatus("Connecting...");

    // Step 1: Do connection
    const connectionResult = await doConnection(loginUserName);

    if (connectionResult === "SUCCESS") {
      setStatus("Connected! Fetching Picture...");

      // Step 2: Fetch Employee Picture
      const imgSrc = await getpic(empNo);

      console.log("Fetched Image URL:", imgSrc);

      if (imgSrc) {
        setImageSrc(imgSrc);
        setStatus("Image fetched successfully!");
      } else {
        setStatus("No image found!");
      }
    } else {
      setStatus("Connection failed! Cannot fetch picture.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Fetch Employee Picture</h2>

      {/* Employee Number Input */}
      <input
        type="text"
        placeholder="Enter Employee No"
        value={empNo}
        onChange={(e) => setEmpNo(e.target.value)}
        className="border p-2 mr-2"
      />

      {/* Fetch Button */}
      <button
        onClick={fetchPicture}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Get Picture
      </button>

      {/* Status Message */}
      <p className="mt-2 text-gray-700">{status}</p>

      {/* Display Image */}
      {imageSrc && (
        <div className="mt-4">
          <h3 className="text-md font-bold">Employee Picture:</h3>
          <img
            src={imageSrc}
            alt="Employee"
            className="mt-2 border rounded shadow-lg w-32 h-32"
          />
        </div>
      )}
    </div>
  );
};

export default GetPicComponent;
