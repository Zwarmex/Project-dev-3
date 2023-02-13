import React from "react";
import "./navbar.css";
import login from "../../assets/login.png";

const Navbar = () => {
  return (
    <div className="recipe__navbar-container">
      <div className="recipe__navbar-title">
        <p>Recipe's App</p>
      </div>
      <div className="recipe__navbar-links">
        <a href="#">Home</a>
        <a href="#about">About Us</a>
        <a href="#contact">Contact Us</a>
        <a href="#login">
          <img src={login} alt="login" />
        </a>
      </div>
    </div>
  );
};

export default Navbar;
