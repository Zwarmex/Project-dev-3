const express = require("express");
const router = express.Router();

router.get("/marketplace", (req, res) => {
  const str = [
    {
      name: "Gateau en chocolat",
      duration: 45,
      intructions: "Casser oeuf. Mélanger lait et farine.",
    },
    {
      name: "Gateau en chocolat",
      duration: 45,
      intructions: "Casser oeuf. Mélanger lait et farine.",
    },
    {
      name: "Gateau en chocolat",
      duration: 45,
      intructions: "Casser oeuf. Mélanger lait et farine.",
    },
    {
      name: "Pate carbonara",
      duration: 30,
      intructions: "Cuire lardons, etc...",
    },
    {
      name: "Pain Perdu",
      duration: 30,
      intructions: "Casser les oeufs",
    },
    {
      name: "Pain Perdu",
      duration: 30,
      intructions: "Casser les oeufs",
    },
    {
      name: "Pain Perdu",
      duration: 30,
      intructions: "Casser les oeufs",
    },
  ];
  res.end(JSON.stringify(str));
});

router.post("/addMarketplace", (req, res) => {
  res.end("NA");
});

module.exports = router;
