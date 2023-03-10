import React from "react";
import "./navbar.css";
import login from "../../assets/login.png";
import { NavLink } from "react-router-dom";

const Navbar = ({ isConnected }) => {
  const handleClickMenu = () => {
    alert("clicked menu");
  };

  return (
    <div className="recipe__navbar-container">
      <div className="recipe__navbar-title">
        <p>
          <NavLink to="/">
            Recipe's App
          </NavLink>
        </p>
      </div>
      <div className="recipe__navbar-links">
        <ul className="recipe__navbar-links__ul">
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
          ) : (
            null
          )}
          <li className="recipe__navbar-links__li">
            {isConnected ? (
              <img className="recipe__navbar-links__li-img" src={login} alt="login" onClick={() => handleClickMenu()} />
            ) : (
              <NavLink to="/login">
                <img className="recipe__navbar-links__li-img" src={login} alt="login"/>
              </NavLink>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
