import React from "react";
import "./contactus.css";

const ContactUs = () => {
  return (
    <div className="contactus">
      <h1>
        Contact Us
        </h1>
      <p>
        You can contact us by sending an email at <a className="contact__link" href="sa.lambert@students.ephec.be">sa.lambert@students.ephec.be</a> if you encountered an issue. 
        You can also open an issue on this github : <a className="contact__link" href="https://github.com/Zwarmex/Project-dev-3">Zwarmex/Project-dev-3</a>
      </p>
    </div>
  );};

export default ContactUs;
