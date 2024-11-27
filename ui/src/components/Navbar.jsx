import { Link } from "react-router-dom";
import { getUserType } from "../pages/LoginPage";
import Logout from "./Logout";

const Navbar = () => {
  const userType = getUserType();
  return (
    <>
      <nav className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-2xl font-bold">
            <Link to="/home">BookMyConsult</Link>
          </div>
          <ul className="flex space-x-4 text-white font-bold">
            {userType == "user" ? (
              <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/add-appointment">Appointment</Link></li>
              <li><Link to="/doctors">Doctors</Link></li>
              </>
            ) : (
              <>
              <li><Link to="/doctors">Doctors</Link></li>
              <li><Link to="/add-user">Add User</Link></li>
              <li><Link to="/add-doctor">Add Doctors</Link></li>
              </>
            ) }
          </ul>
          <Logout />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
