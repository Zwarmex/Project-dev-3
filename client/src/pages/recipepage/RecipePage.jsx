import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './recipepage.css';
import { Rating, Typography } from '@mui/material';

const RecipePage = () => {
	const [recipe, setRecipe] = useState([]);
	const { id } = useParams();

	const fetchRecipe = async () => {
		const data = await fetch(
			`https://recipesappfunctions.azurewebsites.net/api/recipe/${id}`
		);

		await data.json().then((recipeArray) => {
			setRecipe(recipeArray[0]);
			console.log(recipeArray[0]);
		});
		// setRecipe(recipe);
	};

	useEffect(() => {
		fetchRecipe();
	}, []);

	return (
		<>
			<h1 className='recipe__title'>
				{recipe.labelRec} ({recipe.numberOfPersonsRec} pers.)
			</h1>
			<div className='recipe__rating-container'>
				<Typography component='legend'>Difficulté :</Typography>
				{recipe.difficultyRec ? (
					<Rating
						className='recipe__rating-stars'
						name='difficulty'
						value={recipe.difficultyRec}
						size='large'
						readOnly
					/>
				) : null}
			</div>
			<img
				src={recipe.imgRec === undefined ? null : recipe.imgRec}
				alt={recipe.labelRec}
				className='recipe__img'
			/>
			<hr />
			<div className='recipe__steps-container'>
				<h1 className='recipe__steps-title'>Étapes ({recipe.timeRec} min.):</h1>
				<p>{recipe.stepsRec}</p>
			</div>
		</>
	);
	// Your component logic and rendering here
};
export default RecipePage;
