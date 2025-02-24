import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  // Function to generate breadcrumb items from the current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter((path) => path);
    let pathUrl = "";

    return paths.map((path, index) => {
      pathUrl += `/${path}`;
      const isLast = index === paths.length - 1;

      return (
        <li key={path}>
          {!isLast ? <Link to={pathUrl}>{path}</Link> : <span>{path}</span>}
        </li>
      );
    });
  };

  return (
    <div className="flex items-end justify-between w-full mb-6">
      <h1 className="text-3xl font-medium">
        {location.pathname.split("/").pop() || "Home"}
      </h1>
      <div className="breadcrumbs text-sm">
        <ul className="flex gap-2">
          <li>
            <Link to="/">Home</Link>
          </li>
          {generateBreadcrumbs()}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumb;
