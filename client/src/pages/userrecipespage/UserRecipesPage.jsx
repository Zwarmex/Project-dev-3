import React, { useContext, useEffect, useState } from 'react';
import { RecipeItem, UserContext } from '../../components';
import './userrecipespage.css';
const UserRecipesPage = () => {
	const { idUser } = useContext(UserContext);
	const [recipes, setRecipes] = useState([]);
	const fetchRecipes = async () => {
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
	};
	useEffect(() => {
		fetchRecipes();
		//eslint-disable-next-line
	}, []);
	return (
		<>
			<h1 className='user__recipes-title'>Vos recettes :</h1>
			<div className='user__recipes-container'>
				{recipes.map((recipe, recipeIndex) => {
					return (
						<div key={recipeIndex} className='user__recipes-item'>
							<RecipeItem recipe={recipe} />
						</div>
					);
				})}
			</div>
		</>
	);
};

export default UserRecipesPage;