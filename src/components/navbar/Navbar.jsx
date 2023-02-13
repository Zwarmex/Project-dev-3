import React from "react";
import "./navbar.css";
import login from "../../assets/login.png";
import { NavLink } from "react-router-dom";
/*
const Navbar = ({ isConnected }) => {
  const handleClickMenu = () => {};
  const handleClickLogin = () => {
    return <LoginPage />;
  };

  return (
    <div className="recipe__navbar-container">
      <div className="recipe__navbar-title">
        <p>Recipe's App</p>
      </div>
      <div className="recipe__navbar-links">
        <a href="#">Home</a>
        <a href="#marketplace">Market Place</a>
        <a href="#wheel">Recipe's wheel</a>
        {isConnected ? <a href="#calendar">Calendar</a> : ""}
        {isConnected ? (
          <a href="#menu" onClick={() => handleClickMenu()}>
            <img src={login} alt="login" />
          </a>
        ) : (
          <a href="#login" onClick={() => handleClickLogin()}>
            <img src={login} alt="login" />
          </a>
        )}
      </div>
    </div>
  );
};*/
const Navbar = ({ isConnected }) => {
  const handleClickMenu = () => {
    alert("clicke, menu");
  };

  return (
    <div className="recipe__navbar-container">
      <div className="recipe__navbar-title">
        <p>Recipe's App</p>
      </div>
      <div className="recipe__navbar-links">
        <ul className="recipe__navbar-links__ul">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/marketplace">Market Place</NavLink>
          </li>
          <li>
            <NavLink to="/wheel">Recipe's wheel</NavLink>
          </li>
          <li>
            {isConnected ? (
              <img src={login} alt="login" onClick={() => handleClickMenu()} />
            ) : (
              <NavLink to="/login">
                <img src={login} alt="login" />
              </NavLink>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
