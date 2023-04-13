import { Container, CssBaseline } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LoadingHamster, RecipeItem } from '../../components';
import './marketpage.css';

const MarketPage = () => {
	const [recipes, setRecipes] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchCategories = async () => {
		setLoading(true);
		try {
			const data = await fetch(
				'https://recipesappfunctions.azurewebsites.net/api/categories?top=10'
			);
			const categories = await data.json();
			setCategories(categories);
		} catch {
		} finally {
			setLoading(false);
		}
	};

	const fetchRecipes = async () => {
		setLoading(true);
		try {
			const data = await fetch(
				'https://recipesappfunctions.azurewebsites.net/api/recipes?idCat=1&top=10'
			);

			const recipes = await data.json();
			setRecipes(recipes);
		} catch {
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
		fetchRecipes();
	}, []);

	return (
		<Container component='div' className='marketplace__container'>
			<CssBaseline />
			{recipes.length !== 0 && categories.length !== 0 ? (
				<Container disableGutters>
					{categories.map((category, categoryIndex) => (
						<React.Fragment key={categoryIndex}>
							<h1>{category.labelCat}</h1>
							<div className='recipe__marketplace-row'>
								{recipes.map((recipe, recipeIndex) =>
									recipe.idCat === category.idCat ? (
										<RecipeItem key={recipeIndex} recipe={recipe} />
									) : null
								)}
							</div>
						</React.Fragment>
					))}
				</Container>
			) : (
				<div className='marketplace__no-recipe__container'>
					{(loading && <LoadingHamster />) ||
						(!loading && <h1>NO RECIPES...</h1>)}
				</div>
			)}
		</Container>
	);
};

export default MarketPage;
