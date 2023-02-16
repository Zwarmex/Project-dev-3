import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbarmenu.css";

const NavbarMenu = () => {
  return (
    <div className="menu-container">
      <ul className="menu">
        <li>
          <NavLink to="/profile">Profile</NavLink>
        </li>
        <li>
          <NavLink to="/settings">Settings</NavLink>
        </li>
        <li>
          <NavLink to="/logout">Logout</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default NavbarMenu;
