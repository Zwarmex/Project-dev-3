import { Container, Box, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { LoadingHamster, RecipeItem, UserContext } from '../../components';
import './marketpage.css';
import { useNavigate } from 'react-router-dom';

const MarketPage = () => {
	const [recipes, setRecipes] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const [lastId, setLastId] = useState(0);
	const { idUser, tokenJWT, logout } = useContext(UserContext);
	const navigate = useNavigate('/');

	const tokenVerification = async () => {
		if (idUser) {
			const response = await fetch(
				`${process.env.REACT_APP_API_END_POINT}user/jwtVerif`,
				{
					headers: {
						authorization: tokenJWT,
					},
				}
			);
			if (!response.ok) {
				logout();
				navigate('/login');
			}
		}
	};
	const fetchCategories = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_END_POINT}categories`
			);
			if (response.ok) {
				const categories = await response.json();
				setCategories(categories.result);
			}
		} catch {
		} finally {
			setLoading(false);
		}
	};
	const fetchRecipes = async (lastId, idCat, topValue) => {
		const lastIdString = lastId ? `lastId=${lastId}` : '';
		const categoryString = idCat ? `idCat=${idCat}` : '';
		const topString = topValue ? `top=${topValue}` : '';
		setLoading(true);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_END_POINT}recipes?${lastIdString}&${topString}&${categoryString}`
			);
			if (response.ok) {
				const data = await response.json();
				const recipesUpdated = [...recipes, ...data.result];
				const lastIdUpdated = recipesUpdated[recipesUpdated.length - 1].idRec;

				setRecipes(recipesUpdated);
				setLastId(lastIdUpdated);
			}
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
		tokenVerification();
		fetchCategories();
		fetchRecipes();
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
								onScroll={handleScroll}>
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

export default MarketPage;
