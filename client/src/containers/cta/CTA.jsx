import React from "react";
import "./cta.css";
import { NavLink } from "react-router-dom";

const CTA = () => {
  return (
    <NavLink to="/login">
      <button>Rejoignez nous !</button>
    </NavLink>
  );
};

export default CTA;
