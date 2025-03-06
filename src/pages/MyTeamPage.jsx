import React, { useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import { useAuth } from "../context/AuthContext";
import {
  getAllActiveUsers,
  getEmployeeImage,
} from "../services/employeeService";
import LoadingSpinner from "../components/common/LoadingSpinner";

const MyTeamPage = () => {
  const { auth } = useAuth();
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndImages = async () => {
      try {
        // Fetch user data
        const userData = await getAllActiveUsers(auth.email);
        let usersArray = [];

        // Process user data as before
        if (userData && Array.isArray(userData.data)) {
          usersArray = userData.data;
        } else if (userData && Array.isArray(userData)) {
          usersArray = userData;
        } else {
          usersArray = userData ? [userData] : [];
        }

        // Fetch images for all users
        const usersWithImages = await Promise.all(
          usersArray.map(async (user) => {
            try {
              const imageData = await getEmployeeImage(user.emp_no, auth.email);

              return {
                ...user,
                image: imageData
                  ? `data:image/jpeg;base64,${imageData}`
                  : "https://placehold.co/600x400/000000/FFFFFF.png",
              };
            } catch (error) {
              console.error(
                `Error fetching image for user ${user.emp_no}:`,
                error
              );
              return {
                ...user,
                image: "/placeholder-user.png", // Ensure fallback here too
              };
            }
          })
        );

        setUsersData(usersWithImages);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndImages();
  }, [auth.email]);

  // Rest of the component remains the same
  return loading ? (
    <div className="flex justify-center items-start">
      <LoadingSpinner className="loading loading-spinner loading-lg" />
    </div>
  ) : usersData.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {usersData.map((user, index) => (
        <TeamCard key={index} user={user} />
      ))}
    </div>
  ) : (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-400">No users found</p>
    </div>
  );
};

export default MyTeamPage;
