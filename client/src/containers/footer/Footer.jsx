import React from "react";
import "./footer.css";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="banner">
        <p>Mail : test@test.com</p>
        <p>Tel : +32478956895</p>
      </div>
      <div className="actionButton">
        <div className="contactus">
          <NavLink to="/contact-us">
            <button>Contactez nous</button>
          </NavLink>
        </div>
        <div className="aboutus">
          <NavLink to="/about-us">
            <button>Qui sommes-nous ?</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Footer;
