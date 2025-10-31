import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/ironhack-logo.png';
import profileIcon from '../assets/profile-icon.png';
import { AuthContext } from '../context/auth.context';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const userId = user?._id || 'guest';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="IronRecipes Logo" className="navbar-logo" />
        </Link>
      </div>

      <div className="navbar-center">
        <h1 className="navbar-title">IRONRECIPES</h1>
      </div>

      <div className="navbar-right">
        <Link to={`/Profile/${userId}`}>
          <img src={profileIcon} alt="Profile" className="navbar-profile" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
