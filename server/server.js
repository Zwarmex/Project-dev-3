const MarmitonQueryBuilder = require("marmiton-api"); 
const RECIPE_PRICE = require("marmiton-api");
const RECIPE_DIFFICULTY = require("marmiton-api");
const searchRecipes = require("marmiton-api");

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

async function marmiton_query()
{
    const qb = new MarmitonQueryBuilder();
    // A query builder is provided to make complex queries
    const query = qb
    .withTitleContaining('soja')
    .withoutOven()
    .withPrice(RECIPE_PRICE.CHEAP)
    .takingLessThan(45)
    .withDifficulty(RECIPE_DIFFICULTY.EASY)
    .build()
    // Fetch the recipes
    const recipes = await searchRecipes(query);
    return recipes;
}

app.get('/marmiton', (req, res) => {
    res.json({ json: marmiton_query() });
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});