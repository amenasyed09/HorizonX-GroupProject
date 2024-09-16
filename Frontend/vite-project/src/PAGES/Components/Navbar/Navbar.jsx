import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const username = Cookies.get("username");
    if (username) {
      setIsLoggedIn(true);
    }
  });

  const handleLogout = () => {
    Cookies.remove("username"); 
    setIsLoggedIn(false); 
    navigate("/"); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={'/'}>
          <h1>HorizonX</h1>
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to={'/allProperties'}>Buy</Link>
        </li>
        <li>
          <Link to={'/newProperty'}>Sell</Link>
        </li>
        <li>
          <Link to={'/rentProperties'}>Rent</Link>
        </li>
      </ul>
      <div className="navbar-buttons">
        {isLoggedIn ? (
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <>
            <Link to="/login">
              <button className="login-btn">Log in</button>
            </Link>
            <Link to="/signup">
              <button className="signup-btn">Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
