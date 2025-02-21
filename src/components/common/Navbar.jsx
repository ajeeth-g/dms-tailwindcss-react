import React, { useEffect, useState } from 'react'
import { AlignLeft, MessageSquare, CloudSun, CloudMoon, Maximize, Minimize } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    const [theme, settheme] = React.useState(localStorage.getItem("theme") ? localStorage.getItem("theme") : "cmyk");
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleToggle = (e) => {
        if (e.target.checked) {
            settheme("dark")
        } else {
            settheme("cmyk")
        }
    }

    useEffect(() => {
        localStorage.setItem("theme", theme);
        const localTheme = localStorage.getItem("theme");
        document.querySelector("html").setAttribute("data-theme", localTheme);
    }, [theme])


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
    }

    return (
        <div className="navbar bg-base-300 text-base-content">
            <div className="navbar-start">
                <button className="btn btn-ghost btn-circle" onClick={toggleSidebar}>
                    <AlignLeft />
                </button>
                <a className="btn btn-ghost text-xl">Document Management System</a>
            </div>
            <div className="navbar-end">
                <button className="btn btn-ghost btn-circle">
                    <label className="swap swap-rotate">
                        {/* this hidden checkbox controls the state */}
                        <input type="checkbox" className="theme-controller" value="synthwave" onChange={handleToggle} checked={theme === "dark"} />

                        {/* sun icon */}
                        <CloudSun className='swap-off h-5 w-5' />

                        {/* moon icon */}
                        <CloudMoon className='swap-on h-5 w-5' />
                    </label>
                </button>

                <button className="btn btn-ghost btn-circle" onClick={toggleFullScreen} >
                    {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>

                <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <MessageSquare className="h-5 w-5" />
                        <span className="badge badge-xs badge-primary indicator-item"></span>
                    </div>
                </button>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-5 h-5 rounded-full">
                            <img
                                alt="Tailwind CSS Navbar component"
                                src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar
