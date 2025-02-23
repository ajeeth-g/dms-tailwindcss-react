import React, { useEffect, useState } from "react";
import {
  AlignLeft,
  CloudSun,
  CloudMoon,
  Maximize,
  Minimize,
  FilePlus2,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";

const Navbar = ({ toggleSidebar }) => {
  const [theme, settheme] = React.useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "cmyk"
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggle = (e) => {
    if (e.target.checked) {
      settheme("dark");
    } else {
      settheme("cmyk");
    }
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const localTheme = localStorage.getItem("theme");
    document.querySelector("html").setAttribute("data-theme", localTheme);
  }, [theme]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="navbar bg-base-300 text-base-content">
      <div className="navbar-start">
        <button className="btn btn-ghost btn-circle" onClick={toggleSidebar}>
          <AlignLeft />
        </button>
        <Link to="/" className="btn btn-ghost text-xl">
          Document Management System
        </Link>
      </div>
      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <label className="swap swap-rotate">
            {/* this hidden checkbox controls the state */}
            <input
              type="checkbox"
              className="theme-controller"
              value="synthwave"
              onChange={handleToggle}
              checked={theme === "dark"}
            />

            {/* sun icon */}
            <CloudSun className="swap-off h-5 w-5" />

            {/* moon icon */}
            <CloudMoon className="swap-on h-5 w-5" />
          </label>
        </button>

        <button className="btn btn-ghost btn-circle" onClick={toggleFullScreen}>
          {isFullscreen ? (
            <Minimize className="h-5 w-5" />
          ) : (
            <Maximize className="h-5 w-5" />
          )}
        </button>

        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost flex items-center gap-1 px-2"
          >
            <div className="avatar">
              <div className="w-10 h-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://www.shutterstock.com/image-photo/head-shot-portrait-close-smiling-600nw-1714666150.jpg"
                />
              </div>
            </div>

            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold">Gopi</span>
              <span className="text-xs text-gray-400">gopi@demo.com</span>
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
