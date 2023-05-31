import React from "react";
import { Header, Footer, AboutUs, ContactUs } from "../../containers";

import "./homepage.css";
import { Box, Typography } from "@mui/material";

const HomePage = () => {
  return (
    <Box>
      <Header />
      <Box className="HomePage__service-container">
        <Typography component="p" variant="h4">
          Petite description de nos services
        </Typography>
        <Box className="description-services">
          <Typography component="p">
            Nous vous aidons à trouver une recette facile à faire chez vous
            parmis vos recettes préférées.
            <br />
            Une roue vous permettra detirer une recette au sort.
            <br />
            Vous aurez aussi la possiblités d'organiser les repas de la semaine
            à l'aide du calendrier.
            <br />
            Une notification vous parviendra avec la liste de tous les
            ingrédients à acheter afin de réaliser la recette au mieux.
            <br />
            Chaque recette est accompagnées d'une liste d'instructions
            détaillées afin d'être accompagné tout au long de la réalisation de
            celle-ci.
          </Typography>
        </Box>
      </Box>
      <AboutUs />
      <ContactUs />
      <Footer />
    </Box>
  );
};

export default HomePage;
