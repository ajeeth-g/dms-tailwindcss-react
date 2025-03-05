import React, { useEffect, useState } from "react";
import TeamCard from "../components/TeamCard";
import { useAuth } from "../context/AuthContext";
import { getAllUsers, getEmployeeImage } from "../services/employeeService";

const MyTeamPage = () => {
  const { auth } = useAuth();
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getAllUsers(auth.email);
        let usersArray = [];
        if (userData && Array.isArray(userData.data)) {
          usersArray = userData.data;
        } else if (userData && Array.isArray(userData)) {
          usersArray = userData;
        } else {
          usersArray = userData ? [userData] : [];
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {usersData.length > 0 ? (
        usersData.map((user, index) => <TeamCard key={index} user={user} />)
      ) : (
        <p className="text-gray-400">No users found</p>
      )}
    </div>
  );
};

export default MyTeamPage;
