import React, { useContext, useEffect, useState } from 'react';
import { LoadingHamster, RecipeItem, UserContext } from '../../components';
import './userrecipespage.css';
import { Typography } from '@mui/material';
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
		<>
			<h1 className='user__recipes-title'>Vos recettes :</h1>
			{recipes.length > 0 ? (
				<div className='user__recipes-container'>
					{recipes.map((recipe, recipeIndex) => {
						return (
							<div key={recipeIndex} className='user__recipes-item'>
								<RecipeItem recipe={recipe} />
							</div>
						);
					})}
				</div>
			) : (
				<div className='user__recipes-empty-message'>
					{loading && <LoadingHamster />}
					{!loading && (
						<Typography>Il n'y a pas de recettes pour le moment.</Typography>
					)}
				</div>
			)}
		</>
	);
};

export default UserRecipesPage;
