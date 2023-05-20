import React, { useContext, useEffect, useState } from 'react';
import { LoadingHamster, RecipeItem, UserContext } from '../../components';
import './userrecipespage.css';
import { Box, Typography, Container, Button } from '@mui/material';
const UserRecipesPage = () => {
	const { idUser, tokenJWT } = useContext(UserContext);
	const [recipes, setRecipes] = useState([]);
	const [loading, setLoading] = useState(false);
	const [disabledMoreButton, setDisabledMoreButton] = useState(false);
	const [lastId, setLastId] = useState(0);
	const fetchRecipes = async (lastId, topValue) => {
		try {
			setLoading(true);
			const topString = topValue ? `top=${topValue}` : '';
			const lastIdString = lastId ? `lastId=${lastId}` : '';
			const data = await fetch(
				`https://recipesappfunctions.azurewebsites.net/api/user/${idUser}/recipes?${topString}&${lastIdString}`,
				{
					headers: {
						authorization: tokenJWT,
					},
				}
			);
			const newRecipes = await data.json();
			const recipesUpdated = [...recipes, ...newRecipes];
			const lastIdUpdated = recipesUpdated[recipesUpdated.length - 1].idRec;
			if (lastId === lastIdUpdated) {
				setDisabledMoreButton(true);
			}
			setRecipes(recipesUpdated);
			setLastId(lastIdUpdated);
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
			<Box id='user__recipes-title-container'>
				<Typography component='p' variant='h4'>
					Vos recettes :
				</Typography>
			</Box>
			{recipes.length > 0 ? (
				<Box>
					<Box id='user__recipes-container' className='scrollbars'>
						{recipes.map((recipe, recipeIndex) => {
							return (
								<Box key={recipeIndex} className='user__recipes-item'>
									<RecipeItem recipe={recipe} />
								</Box>
							);
						})}
					</Box>
					<Box id='user__recipes-more-button-container'>
						<Button
							id='user__recipes-more-button-item'
							disabled={disabledMoreButton}
							onClick={() => {
								fetchRecipes(lastId);
							}}>
							<Typography>Plus</Typography>
						</Button>
					</Box>
				</Box>
			) : (
				<Box id='user__recipes-empty-message'>
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
