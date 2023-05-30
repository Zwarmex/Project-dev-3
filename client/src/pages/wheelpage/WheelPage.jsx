import React, { useState, useContext, useEffect } from 'react';
import './wheelpage.css';
import { RecipeItem, UserContext, LoadingHamster } from '../../components';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const WheelPage = () => {
	const navigate = useNavigate();
	const { idUser, tokenJWT, logout, setTokenJWT } = useContext(UserContext);
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(null);

	const fetchRecipes = async () => {
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
				console.log(dataFR.result);
				localStorage.setItem('tokenJWT', dataFR.tokenJWT);
				setTokenJWT(dataFR.tokenJWT);
				const favoritesRecipes = await dataFR.result;
				let localRecipes = [];
				for (let index = 0; index < favoritesRecipes.length; index++) {
					const idRec = favoritesRecipes[index].idRec;
					const responseR = await fetch(
						`${process.env.REACT_APP_API_END_POINT}recipe/${idRec}`
					);
					if (responseR.ok) {
						const dataR = await responseR.json();
						localRecipes.push(dataR.result);
					}
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
	const startAnimation = () => {
		const fixedRotations = 2;
		const extraFullRotations = Math.floor(Math.random() * 3) + 1;
		const totalRotations =
			recipes.length * (fixedRotations + extraFullRotations);
		const initialRotationTime = 50;

		const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

		const rotationTime = (iteration) => {
			const progress = iteration / (totalRotations + recipes.length);
			const easedProgress = easeOutCubic(progress);
			return initialRotationTime + easedProgress * initialRotationTime * 2;
		};

		for (let i = 0; i < totalRotations; i++) {
			setTimeout(() => {
				setSelectedIndex(i % recipes.length);
			}, i * rotationTime(i));
		}

		const randomIndex = Math.floor(Math.random() * recipes.length);
		const extraIterations =
			(randomIndex - (totalRotations % recipes.length) + recipes.length) %
			recipes.length;
		const totalIterations = totalRotations + extraIterations + 1;

		for (let i = totalRotations; i < totalIterations; i++) {
			setTimeout(() => {
				setSelectedIndex(i % recipes.length);
			}, i * rotationTime(i));
		}
	};

	useEffect(() => {
		fetchRecipes();
		//eslint-disable-next-line
	}, []);

	return (
		<Container id='wheel__page-container'>
			{recipes.length > 0 ? (
				<Box>
					<Box id='wheel-container'>
						{recipes.map((recipe, index) => {
							const angle = (360 / recipes.length) * index;
							const selected = selectedIndex === index ? 'selected-recipe' : '';
							return (
								<Box
									key={index}
									className={`wheel-items ${selected}`}
									style={{
										'--rotation-angle': `${angle}deg`,
									}}>
									<RecipeItem recipe={recipe} disabled={!selected} />
								</Box>
							);
						})}
					</Box>
					<Box id='wheel__button-container'>
						<Button
							id='wheel__button-start'
							onClick={startAnimation}
							variant='contained'
							color='warning'>
							Lancez l'animation
						</Button>
					</Box>
				</Box>
			) : (
				<Box id='wheel__recipes-empty-message'>
					{(loading && <LoadingHamster />) ||
						(!loading && (
							<Typography>Il n'y a pas de recettes pour le moment.</Typography>
						))}
				</Box>
			)}
		</Container>
	);
};

export default WheelPage;
