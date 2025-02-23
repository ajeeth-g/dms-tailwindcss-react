import React from "react";

const StatCard = ({ name, value, color, icon: IconComponent }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700">
      <div className="px-4 py-5 sm:p-6">
        <span className="flex items-center text-sm font-medium text-gray-400">
          {IconComponent && (
            <IconComponent size={20} className="mr-2" style={{ color }} />
          )}
          {name}
        </span>
        <p className="mt-1 text-3xl font-semibold text-gray-100">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
