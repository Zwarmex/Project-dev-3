import React from "react";
import "./cta.css";
import { NavLink } from "react-router-dom";
import { Button, Typography } from "@mui/material";

const CTA = () => {
  return (
    <NavLink to="/login">
      <button>Rejoignez nous !</button>
    </NavLink>
  );
};

export default CTA;
