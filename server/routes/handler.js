const express = require("express");
const router = express.Router();

router.get("/marketplace", (req, res) => {
  const recipes = [
    {
      name: "Gateau en chocolat",
      duration: 45,
      instructions: "Casser oeuf. Mélanger lait et farine."
    },
    {
      name: "Tarte aux pommes",
      duration: 60,
      instructions: "Éplucher et couper les pommes."
    },
    {
      name: "Salade César",
      duration: 20,
      instructions: "Couper la salade et les tomates."
    },    
    {
      name: "Pate carbonara",
      duration: 30,
      instructions: "Cuire lardons, etc..."
    },
    {
      name: "Pain Perdu",
      duration: 30,
      instructions: "Casser les oeufs"
    },
    {
      name: "Poulet rôti",
      duration: 90,
      instructions: "Préchauffer le four. Assaisonner le poulet."
    },
    {
      name: "Pâtes à la bolognaise",
      duration: 30,
      instructions: "Faire cuire les pâtes. Faire revenir la viande hachée avec l'oignon et l'ail."
    },
  ];
  res.end(JSON.stringify(recipes));
});

router.post("/addMarketplace", (req, res) => {
  res.end("NA");
});

module.exports = router;
