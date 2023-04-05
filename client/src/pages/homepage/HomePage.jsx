import React from "react";
import { Header, Footer } from "../../containers";

import "./homepage.css";

const HomePage = () => {
  return (
    <div>
      <Header />
      <div className="HomePage-Content">
        <div className="nosServices">
          <p>
            Nous vous aidons à trouver une recette facile à faire chez vous
            parmis vos recettes préférées.
          </p>
          <p>
            Une roue vous permettra de tirer une recette au sort. Vous aurez
            aussi la possiblités d'organiser les repas de la semaine à l'aide du
            calendrier.
          </p>
          <p>
            Une notification vous parviendra avec la liste de tous les
            ingrédients à acheter afin de réaliser la recette au mieux.
          </p>
          <p>
            Chaque recette est accompagnées d'une liste d'instructions
            détaillées afin d'être accompagné tout au long de la réalisation de
            celle-ci.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
