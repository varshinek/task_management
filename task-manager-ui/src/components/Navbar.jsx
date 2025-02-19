import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaLowVision, FaExclamationTriangle, FaFire, FaSignOutAlt } from "react-icons/fa"; 
import Dashboard_icon from ".././assets/icons/dashboard-icon.svg";
import Logout_icon from ".././assets/icons/logout-icon.svg";
import useResponsive from "../hooks/useResponsive";
import { MdMenu } from "react-icons/md";

export default function Navbar({ token, setToken }) {
  const { isMobile } = useResponsive();
  
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <nav className="md:text-3xl text-gray-700 rounded-lg shadow-md flex flex-col gap-3 items-start w-max min-w-[14vw] h-full bg-white backdrop-blur-md lg:ml-0 sm:ml-20vw">
      <p className="text-black p-2 text-2xl w-full font-inria-serif flex justify-center border-bottom-black">
        {isMobile ? <MdMenu /> : "Task Manager"}
      </p>

      {token ? (
        <div className="flex flex-col justify-between h-full w-full py-2 space-y-4 font-inria-serif">
          <div className="flex flex-col gap-3">
            {/* Dashboard */}
            <NavLink to="/dashboard" className={({ isActive }) => `${isActive && "link active"} p-2 font-light flex w-full text-base items-center gap-2`}>
              <img src={Dashboard_icon} className="aspect-square w-6" alt="dashboard icon" /> 
              <span>Dashboard</span>
            </NavLink>

            {/* Low Priority */}
            <NavLink to="/tasks/low" className={({ isActive }) => `${isActive && "link active"} p-2 font-light flex w-full text-base items-center gap-2`}>
              <FaLowVision className="w-6 h-6 text-blue-500" /> 
              <span>Low Priority</span>
            </NavLink>

            {/* Medium Priority */}
            <NavLink to="/tasks/medium" className={({ isActive }) => `${isActive && "link active"} p-2 font-light flex w-full text-base items-center gap-2`}>
              <FaExclamationTriangle className="w-6 h-6 text-yellow-500" /> 
              <span>Medium Priority</span>
            </NavLink>

            {/* High Priority */}
            <NavLink to="/tasks/high" className={({ isActive }) => `${isActive && "link active"} p-2 font-light flex w-full text-base items-center gap-2`}>
              <FaFire className="w-6 h-6 text-red-500" /> 
              <span>High Priority</span>
            </NavLink>
          </div>

          {/* Logout */}
          <div className="border-top-black w-full flex items-center p-2">
            <p className="flex text-base justify-center gap-3 cursor-pointer" onClick={handleLogout}>
              <img src={Logout_icon} className="aspect-square w-6" alt="logout icon" /> 
              <span> Logout </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <NavLink to="/login" className="font-light">Login</NavLink>
          <NavLink to="/signup" className="font-light">Signup</NavLink>
        </div>
      )}
    </nav>
  );
}
