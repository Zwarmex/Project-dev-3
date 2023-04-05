import React from "react";
import "./footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer">
        <div className="banner">
          <p>
            Mail :{" "}
            <a href="mailto:recipesapp-admin@gmail.com">
              recipesapp-admin@gmail.com
            </a>{" "}
          </p>
          <p>
            Github :{" "}
            <a href="https://github.com/Zwarmex/Project-dev-3">Projet-dev-3</a>
          </p>
        </div>
        <div className="actionButton">
          <div className="contactus">
            <NavLink to="/contact-us">
              <button className="contact-us">Contactez nous</button>
            </NavLink>
          </div>
          <div className="aboutus">
            <NavLink to="/about-us">
              <button className="about-us">Qui sommes-nous ?</button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
