import React, { useState } from "react";
import "./navbar.css";
import login from "../../assets/login.png";
import { NavLink } from "react-router-dom";
import { NavbarMenu } from "../";

const Navbar = ({ isConnected }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleClickMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-title">
          <p>
            <NavLink to="/">Recipe's App</NavLink>
          </p>
        </div>
        <div className="navbar-links">
          <ul className="navbar-links__ul">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "activeLink" : undefined
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/marketplace"
                className={({ isActive }) =>
                  isActive ? "activeLink" : undefined
                }
              >
                Market Place
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wheel"
                className={({ isActive }) =>
                  isActive ? "activeLink" : undefined
                }
              >
                Recipe's wheel
              </NavLink>
            </li>
            {isConnected ? (
              <li>
                <NavLink
                  to="/calendar"
                  className={({ isActive }) =>
                    isActive ? "activeLink" : undefined
                  }
                >
                  Calendar
                </NavLink>
              </li>
            ) : null}
            <li className="navbar-links__li">
              {isConnected ? (
                <img
                  className="navbar-links__li-img"
                  src={login}
                  alt="login"
                  onClick={() => handleClickMenu()}
                />
              ) : (
                <NavLink to="/login">
                  <img
                    className="navbar-links__li-img"
                    src={login}
                    alt="login"
                  />
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
      {menuOpen ? (
        <div className="navbar__menu">
          <NavbarMenu />
        </div>
      ) : undefined}
    </>
  );
};

export default Navbar;
