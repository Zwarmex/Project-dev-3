import "./favoritepage.css";
import { Container, Box, Typography } from "@mui/material";
import React, { useEffect, useState, useContext } from "react";
import { LoadingHamster, RecipeItem, UserContext } from "../../components";

const FavoritePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(0);
  const { idUser } = useContext(UserContext);

  const fetchFavoritesRecipes = async () => {
    setLoading(true);
    try {
      const result = await fetch(
        `https://recipesappfunctions.azurewebsites.net/api/user/${idUser}/favoritesRecipes`,
        {
          headers: {
            "x-functions-key":
              "dLciv3NwRJcYeSIsPaUl2aaaJb6aYoAY3NtlnNZAHBPVAzFusKw_9A==",
          },
        }
      );
      const favoritesRecipes = await result.json();
      console.log(favoritesRecipes);
      let localRecipes = [];
      for (let index = 0; index < favoritesRecipes.length; index++) {
        const idRec = favoritesRecipes[index].idRec;
        const data = await fetch(
          `https://recipesappfunctions.azurewebsites.net/api/recipe/${idRec}`,
          {
            headers: {
              "x-functions-key":
                "dLciv3NwRJcYeSIsPaUl2aaaJb6aYoAY3NtlnNZAHBPVAzFusKw_9A==",
            },
          }
        );
        let recipe = await data.json();
        localRecipes.push(recipe);
      }
      setRecipes(localRecipes);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await fetch(
        "https://recipesappfunctions.azurewebsites.net/api/categories",
        {
          headers: {
            "x-functions-key":
              "dLciv3NwRJcYeSIsPaUl2aaaJb6aYoAY3NtlnNZAHBPVAzFusKw_9A==",
          },
        }
      );
      const categories = await data.json();
      setCategories(categories);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFavoritesRecipes();
  }, []);

  return (
    <Container component="div" className="marketplace__container">
      {recipes.length !== 0 && categories.length !== 0 ? (
        <Box>
          {categories.map((category, categoryIndex) => (
            <Box key={categoryIndex} className="marketplace__row">
              <Typography component="p" variant="h4">
                {category.labelCat}
              </Typography>
              <Box
                className="marketplace__recipes-array-container scrollbars"
                // onScroll={handleScroll}
              >
                {recipes.map((recipe, recipeIndex) =>
                  recipe.idCat === category.idCat ? (
                    <RecipeItem key={recipeIndex} recipe={recipe} />
                  ) : null
                )}
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box className="marketplace__no-recipe__container">
          {(loading && <LoadingHamster />) ||
            (!loading && <h1>NO RECIPES...</h1>)}
        </Box>
      )}
    </Container>
  );
};

export default FavoritePage;
