import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        {/* You can replace this with an actual logo image */}
        <Link to={'/'}>
        
        <h1>HorizonX</h1>
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to={'/allProperties'}>
            <a>Buy</a>
          </Link>
        </li>
        <li>
          <Link to={'/newProperty'}>
            <a>Sell</a>
          </Link>
        </li>
        <li>
          <a>Rent</a>
        </li>
      </ul>
      <div className="navbar-buttons">
        <Link to={"/login"}>
          <button className="login-btn">Log in</button>
        </Link>
        <Link to={"/signup"}>
          <button className="signup-btn">Sign Up</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
