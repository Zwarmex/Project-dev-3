import React, { useContext, useEffect, useState } from 'react';
import { LoadingHamster, RecipeItem, UserContext } from '../../components';
import './userrecipespage.css';
import { Box, Typography, Container } from '@mui/material';
const UserRecipesPage = () => {
	const { idUser } = useContext(UserContext);
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const fetchRecipes = async () => {
		try {
			setLoading(true);
			const data = await fetch(
				`https://recipesappfunctions.azurewebsites.net/api/user/${idUser}/recipes`,
				{
					method: 'get',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			const recipes = await data.json();
			setRecipes(recipes);
		} catch {
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchRecipes();
		// eslint-disable-next-line
	}, []);
	return (
		<Container>
			<Box className='user__recipes-title-container'>
				<Typography component='p' variant='h4'>
					Vos recettes :
				</Typography>
			</Box>
			{recipes.length > 0 ? (
				<Box className='user__recipes-container scrollbar'>
					{recipes.map((recipe, recipeIndex) => {
						return (
							<Box key={recipeIndex} className='user__recipes-item'>
								<RecipeItem recipe={recipe} />
							</Box>
						);
					})}
				</Box>
			) : (
				<Box className='user__recipes-empty-message'>
					{loading && <LoadingHamster />}
					{!loading && (
						<Typography>Il n'y a pas de recettes pour le moment.</Typography>
					)}
				</Box>
			)}
		</Container>
	);
};

export default UserRecipesPage;
