import './favoritepage.css';
import { Container, Box, Typography } from '@mui/material';
import React, { useEffect, useState, useContext } from 'react';
import { LoadingHamster, RecipeItem, UserContext } from '../../components';
import { useNavigate } from 'react-router-dom';

const FavoritePage = () => {
	const navigate = useNavigate();
	const [recipes, setRecipes] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	const { idUser, tokenJWT, setTokenJWT, logout } = useContext(UserContext);

	const tokenVerification = async () => {
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
	};
	const fetchFavoritesRecipes = async () => {
		setLoading(true);
		try {
			const responseFR = await fetch(
				`${process.env.REACT_APP_API_END_POINT}user/${idUser}/favoritesRecipes`,
				{
					headers: {
						authorization: tokenJWT,
					},
				}
			);
			if (responseFR.ok) {
				const dataFR = await responseFR.json();
				setTokenJWT(dataFR.tokenJWT);
				localStorage.setItem('tokenJWT', dataFR.tokenJWT);

				const favoritesRecipes = dataFR.result;
				let localRecipes = [];
				for (let index = 0; index < favoritesRecipes.length; index++) {
					const idRec = favoritesRecipes[index].idRec;
					const responseR = await fetch(
						`${process.env.REACT_APP_API_END_POINT}recipe/${idRec}`
					);
					const dataR = await responseR.json();
					localRecipes.push(dataR.result);
				}
				setRecipes(localRecipes);
			} else if (responseFR.status === 401) {
				logout();
				navigate('/login');
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
				`${process.env.REACT_APP_API_END_POINT}categories`
			);
			const categories = await data.json();
			setCategories(categories.result);
		} catch {
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		tokenVerification();
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
