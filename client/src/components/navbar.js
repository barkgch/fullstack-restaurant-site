import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../img/logo.png";
import { AuthContext } from "../context/auth.context.js";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav>
      <Link to={"/"} className="nav-brand">
        <img src={Logo} className="logo" />
      </Link>
      <div className="nav-items">
        <div className="nav-item">
          <Link to={"/"} className="nav-link">
            Home
          </Link>
        </div>
        <div className="nav-item">
          <Link to={"/locations"} className="nav-link">
            Locations
          </Link>
        </div>
        <div className="nav-item">
          <Link to={"/menu"} className="nav-link">
            Menu
          </Link>
        </div>
        <div className="nav-item">
          <Link to={"/reservation"} className="nav-link">
            Reservations
          </Link>
        </div>
        <div className="nav-item">
          <Link to={"/specialreservation"} className="nav-link">
            Special Reservation
          </Link>
        </div>
        <div className="nav-item">
          <Link to={"/employee"} className="nav-link">
            Employee Home
          </Link>
        </div>
      </div>
      {currentUser ? (
        <div className="nav-account">
          <Link to={`/account/${currentUser.id}`} className="nav-link">
            My Account
          </Link>
          /
          <span onClick={handleLogout} className="nav-link nav-logout">
            Logout
          </span>
        </div>
      ) : (
        <div className="nav-account">
          <Link to={"/login"} className="nav-link">
            Login
          </Link>
          /
          <Link to={"/register"} className="nav-link">
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
