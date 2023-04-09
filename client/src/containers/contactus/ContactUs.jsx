import React from "react";
import "./contactus.css";

const ContactUs = () => {
  return (
    <form className="contact-form">
      <h1>Formulaire de contact</h1>
      <label htmlFor="name">Nom :</label>
      <input type="text" name="name" />
      <label htmlFor="email">Email :</label>
      <input type="email" name="email" id="email" />
      <label htmlFor="message">Votre message :</label>
      <textarea
        name="message"
        id="message"
        cols="30"
        rows="10"
        placeholder="Votre message..."
      ></textarea>
      <input type="submit" value="Envoyer" className="send-btn" />
    </form>
  );
};

export default ContactUs;
