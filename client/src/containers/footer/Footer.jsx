import React from "react";
import "./footer.css";
import { ContactUs, AboutUs } from "../index";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__aboutus">
        <AboutUs />
      </div>
      <div className="footer__contactus">
        <ContactUs />
      </div>
    </div>
  );
};

export default Footer;
