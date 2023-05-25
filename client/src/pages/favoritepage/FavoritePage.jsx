import './favoritepage.css';
import { Container, Box, Typography } from '@mui/material';
import React, { useEffect, useState, useContext } from 'react';
import { LoadingHamster, RecipeItem, UserContext } from '../../components';
import { useNavigate } from 'react-router-dom';

const FavoritePage = () => {
	const [recipes, setRecipes] = useState([]);
	const navigate = useNavigate;
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const { idUser, tokenJWT, logout } = useContext(UserContext);

	const fetchFavoritesRecipes = async () => {
		setLoading(true);
		try {
			const result = await fetch(
				`https://recipesappfunctions.azurewebsites.net/api/user/${idUser}/favoritesRecipes`,
				{
					headers: {
						authorization: tokenJWT,
					},
				}
			);
			if (result.ok) {
				const favoritesRecipes = await result.json();
				let localRecipes = [];
				for (let index = 0; index < favoritesRecipes.length; index++) {
					const { idRec } = favoritesRecipes[index];
					const data = await fetch(
						`https://recipesappfunctions.azurewebsites.net/api/recipe/${idRec}`,
						{
							headers: {
								authorization: tokenJWT,
							},
						}
					);
					if (data.ok) {
						let recipe = await data.json();
						localRecipes.push(recipe);
					} else if (data.status === 401) {
						logout();
						navigate('/');
					}
				}
				setRecipes(localRecipes);
			} else if (result.status === 401) {
				logout();
				navigate('/');
			}
		} catch {
		} finally {
			setLoading(false);
		}
	};

	const fetchCategories = async () => {
		setLoading(true);
		try {
			const data = await fetch(
				'https://recipesappfunctions.azurewebsites.net/api/categories'
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
		//eslint-disable-next-line
	}, []);

	return (
		<Container component='div' className='marketplace__container'>
			{recipes.length !== 0 && categories.length !== 0 ? (
				<Box>
					{categories.map((category, categoryIndex) => (
						<Box key={categoryIndex} className='marketplace__row'>
							<Typography component='p' variant='h4'>
								{category.labelCat}
							</Typography>
							<Box
								className='marketplace__recipes-array-container scrollbars'
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
				<Box className='marketplace__no-recipe__container'>
					{(loading && <LoadingHamster />) ||
						(!loading && <h1>NO RECIPES...</h1>)}
				</Box>
			)}
		</Container>
	);
};

export default FavoritePage;
