import "./favoritepage.css";
import { Container, Box, Typography } from "@mui/material";
import { UserContext } from "../../components";
import { useParams } from "react-router-dom";

import React, { useEffect, useState, useContext } from "react";
import { LoadingHamster, RecipeItem } from "../../components";
const FavoritePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastId, setLastId] = useState(0);
  const { idRec } = useParams();
  const { idUser } = useContext(UserContext);

  const fetchFavoritesRecipes = async () => {
    setLoading(true);
    try {
      const result = await fetch(
        `https://recipesappfunctions.azurewebsites.net/api/user/${idUser}/favoritesRecipes`
      );
      const favoritesrecipes = await result.json();
      console.log(favoritesrecipes);
      const data = await fetch(
        `https://recipesappfunctions.azurewebsites.net/api/recipes`
      );
      const recipes = await data.json();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await fetch(
        "https://recipesappfunctions.azurewebsites.net/api/categories"
      );
      const categories = await data.json();
      setCategories(categories);
    } catch {
    } finally {
      setLoading(false);
    }
  };
  const fetchRecipes = async (lastId, idCat, topValue) => {
    const lastIdString = lastId ? `lastId=${lastId}` : "";
    const categoryString = idCat ? `idCat=${idCat}` : "";
    const topString = topValue ? `top=${topValue}` : "";
    setLoading(true);
    try {
      const data = await fetch(
        `https://recipesappfunctions.azurewebsites.net/api/recipes?${lastIdString}&${topString}&${categoryString}`
      );

      const newRecipes = await data.json();
      const recipesUpdated = [...recipes, ...newRecipes];
      const lastIdUpdated = recipesUpdated[recipesUpdated.length - 1].idRec;

      setRecipes(recipesUpdated);
      setLastId(lastIdUpdated);
    } catch {
    } finally {
      setLoading(false);
    }
  };
  const handleScroll = (e) => {
    const { scrollLeft, clientWidth, scrollWidth } = e.currentTarget;

    if (scrollWidth - scrollLeft === clientWidth) {
      fetchRecipes(lastId);
    }
  };
  useEffect(() => {
    fetchCategories();
    fetchRecipes();
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
