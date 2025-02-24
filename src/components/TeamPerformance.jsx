import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const teams = [
  {
    id: 1,
    name: "Gopi",
    data: [
      { month: "Jan", value: 10 },
      { month: "Feb", value: 20 },
      { month: "Mar", value: 40 },
      { month: "Apr", value: 50 },
      { month: "May", value: 30 },
      { month: "Jun", value: 45 },
      { month: "Jul", value: 60 },
    ],
  },
  {
    id: 2,
    name: "Aneesh",
    data: [
      { month: "Jan", value: 5 },
      { month: "Feb", value: 15 },
      { month: "Mar", value: 25 },
      { month: "Apr", value: 35 },
      { month: "May", value: 55 },
      { month: "Jun", value: 65 },
      { month: "Jul", value: 75 },
    ],
  },
  {
    id: 3,
    name: "Arafath",
    data: [
      { month: "Jan", value: 12 },
      { month: "Feb", value: 22 },
      { month: "Mar", value: 32 },
      { month: "Apr", value: 42 },
      { month: "May", value: 52 },
      { month: "Jun", value: 62 },
      { month: "Jul", value: 72 },
    ],
  },
  {
    id: 4,
    name: "harish",
    data: [
      { month: "Jan", value: 8 },
      { month: "Feb", value: 18 },
      { month: "Mar", value: 28 },
      { month: "Apr", value: 38 },
      { month: "May", value: 48 },
      { month: "Jun", value: 58 },
      { month: "Jul", value: 68 },
    ],
  },
];

export default function TeamPerformance() {
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex overflow-hidden bg-gray-800 bg-opacity-50 shadow-lg rounded-xl border border-gray-700">
      {/* Left Sidebar */}
      <div className="w-2/5 max-h-80 overflow-y-auto p-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-100">
            My Teams Performance
          </h2>
          <p className="text-sm text-gray-500">
            Teams with task graph analysis
          </p>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-md w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="space-y-2 mt-4">
            {filteredTeams.map((team) => (
              <motion.div
                key={team.id}
                whileHover={{ scale: 1.05 }}
                className={`rounded-box w-full cursor-pointer ${
                  selectedTeam.id === team.id
                    ? "bg-primary text-white"
                    : "bg-base-100"
                }`}
                onClick={() => setSelectedTeam(team)}
              >
                <ul className="menu bg-base-200 rounded-box w-full">
                  <li>
                    <a>{team.name}</a>
                  </li>
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="w-4/5 p-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={selectedTeam.data}>
            <XAxis dataKey="month" stroke="#555" />
            <YAxis stroke="#555" />
            <Tooltip />
            <Legend />
            <CartesianGrid strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#9b59b6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
