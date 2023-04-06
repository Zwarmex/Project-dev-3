import React from "react";
import "./aboutus.css";

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <h1>Qui sommes-nous ?</h1>
      <p>
        Nous sommes 4 étudiants de deuxième année en technologie de
        l'informatique à l'Ephec de Louvain-La-Neuve. Dans le cadre de notre
        cours de développemennt, nous devions trouver un client afin d'apporter
        une solution au problème posé par celui-ci.
      </p>
      <p>
        Nous avons donc décidé de choisir Isaline en tant que cliente. Le
        problème était qu'elle ne savait souvent pas quoi faire pour manger.
        Nous avons donc décidé de créer une application qui lui permettrait de
        mettre des recettes dans ses favoris et de laisser une roue choisir son
        repas du jour.
      </p>
    </div>
  );
};

export default AboutUs;
