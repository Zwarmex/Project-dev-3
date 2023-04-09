import React from "react";
import "./header.css";
import { CTA } from "..";

const Header = () => {
  return (
    <div className="header-container">
      <h1>Bienvenue sur Recipe's App</h1>
      <p>
        Pas le temps de réfléchir à quoi acheter, ou à quoi manger ? <br />
        Envie découvrir de bonnes recettes de manière simple ?
      </p>
      <CTA />
    </div>
  );
};

export default Header;
