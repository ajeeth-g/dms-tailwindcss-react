import Logo from "../../assets/logo-light.png";

const Sidebar = () => {
  return (
    <div className="min-h-screen p-2 text-white">
      <div className="h-26 w-26 rounded-md overflow-hidden">
        <img
          src={Logo}
          alt="iStreams ERP Solutions"
          className="h-full w-full object-cover"
        />
      </div>

      <ul className="menu mt-4">
        <li>
          <a>Dashboard</a>
        </li>
        <li>
          <details open>
            <summary>Upload</summary>
            <ul>
              <li>
                <a>Archive</a>
              </li>
              <li>
                <a>Uploaded</a>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <a>Tasks</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
