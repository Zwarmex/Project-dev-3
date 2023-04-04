import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="banner">
        <p>Mail : test@test.com</p>
        <p>Tel : +32478956895</p>
      </div>
      <div className="actionButton">
        <div className="contactus">Contactez nous</div>
        <div className="aboutus">Qui somme-nous ?</div>
      </div>
    </div>
  );
};

export default Footer;
