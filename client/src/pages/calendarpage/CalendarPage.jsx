import 'react-calendar/dist/Calendar.css';
import './calendarpage.css';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import {
	LoadingBars,
	LoadingHamster,
	RecipeItem,
	UserContext,
} from '../../components';
import { Typography, Button, Box, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CalendarPage = () => {
	const { idUser, mailUser, tokenJWT, setTokenJWT, logout } =
		useContext(UserContext);
	const navigate = useNavigate();
	const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
	const [errorMessage, setErrorMessage] = useState('');
	const [infoMessage, setInfoMessage] = useState('');
	const [lastId, setLastId] = useState(0);
	const [recipes, setRecipes] = useState([]);
	const [savedSelectedRecipe, setSavedSelectedRecipe] = useState(null);
	const [recipesLoading, setRecipesLoading] = useState(false);
	const [mailLoading, setMailLoading] = useState(false);
	const [errorStatus, setErrorStatus] = useState(false);
	const [infoStatus, setInfoStatus] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [disableMore, setDisableMore] = useState(false);

	const fetchRecipes = async (lastId, topValue) => {
		const lastIdString = lastId ? `lastId=${lastId}` : '';
		const topString = topValue ? `top=${topValue}` : '';
		try {
			if (!disableMore) {
				setRecipesLoading(true);
				const data = await fetch(
					`${process.env.REACT_APP_API_END_POINT}user/${idUser}/recipes?${lastIdString}&${topString}`,
					{
						headers: {
							authorization: tokenJWT,
						},
					}
				);
				if (data.ok) {
					setTokenJWT(data.tokenJWT);
					const newRecipes = await data.result.json();
					const recipesUpdated = [...recipes, ...newRecipes];
					const lastIdUpdated = recipesUpdated[recipesUpdated.length - 1].idRec;
					if (lastId === lastIdUpdated) {
						setDisableMore(true);
					}
					setRecipes(recipesUpdated);
					setLastId(lastIdUpdated);
				} else if (data.status === 401) {
					logout();
					navigate('/login');
				}
			}
		} catch {
		} finally {
			setRecipesLoading(false);
		}
	};
	const sendRecipeEmail = async (recipe) => {
		setMailLoading(true);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_END_POINT}sendRecipeMail/${mailUser}`,
				{
					method: 'POST',
					headers: {
						authorization: tokenJWT,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						recipe: JSON.stringify({
							recipe,
						}),
						date: date,
						idUser: idUser,
					}),
				}
			);
			if (response.ok) {
				setTokenJWT(response.tokenJWT);
				setInfoMessage('Mail envoyé avec succès');
				setInfoStatus(true);
				setEmailSent(true);
			} else if (response.status === 401) {
				logout();
				navigate('/login');
			} else {
				setErrorMessage('Problèmes de connection...');
				setErrorStatus(true);
			}
		} catch {
			setErrorMessage('Problèmes de connection...');
			setErrorStatus(true);
		} finally {
			setMailLoading(false);
		}
	};
	const handleSetDate = (selectedDate) => {
		// Format the date as YYYY-MM-DD
		const formattedDate = selectedDate.toLocaleDateString('en-CA');
		setDate(formattedDate);
	};
	const handleSelectRecipe = (selectedRecipe) => {
		if (selectedRecipe === savedSelectedRecipe) {
			setSavedSelectedRecipe(null);
		} else {
			setSavedSelectedRecipe(selectedRecipe);
		}
	};
	const handleSendRecipe = () => {
		resetInfosAndErrors();
		const confirmSend = window.confirm(
			`Voulez vous réellement recevoir "${
				savedSelectedRecipe.labelRec
			}" pour le ${new Date(date).toLocaleDateString('fr-FR')} par mail ?`
		);
		if (confirmSend) {
			sendRecipeEmail(savedSelectedRecipe);
		}
	};
	const handleScroll = (e) => {
		const { scrollLeft, clientWidth, scrollWidth } = e.currentTarget;

		if (scrollWidth - scrollLeft === clientWidth) {
			fetchRecipes(lastId);
		}
	};

	const resetInfosAndErrors = () => {
		setErrorStatus(false);
		setInfoStatus(false);
	};

	useEffect(() => {
		fetchRecipes();
		//eslint-disable-next-line
	}, []);

	return (
		<Container>
			<Box id='calendar__title-container'>
				<Typography component='p' variant='h4'>
					Planifier votre prochain repas :
				</Typography>
			</Box>
			<Box id='calendar__error-container'>
				{errorStatus && <Typography color='error'>{errorMessage}</Typography>}
				{infoStatus && <Typography>{infoMessage}</Typography>}
			</Box>
			<Box id='calendar__calendar-container'>
				<Calendar onChange={handleSetDate} value={date} locale='fr-FR' />
			</Box>
			{recipes.length > 0 ? (
				<Box id='calendar__recipes-container'>
					<Box
						id='calendar__recipes-array-row'
						className='scrollbars'
						onScroll={handleScroll}>
						{recipes.map((recipe, recipeIndex) => {
							return (
								<Box
									className={`calendar__recipes-items${
										savedSelectedRecipe === recipe ? ' active' : ''
									}`}
									key={recipeIndex}
									onClick={() => {
										handleSelectRecipe(recipe);
									}}>
									<RecipeItem recipe={recipe} disabled />
								</Box>
							);
						})}
					</Box>
					<Box id='calendar__recipes__button-container'>
						<Button
							variant='contained'
							color='warning'
							id='calendar__recipes__button-item'
							onClick={handleSendRecipe}
							disabled={!savedSelectedRecipe || mailLoading || emailSent}>
							{(mailLoading && <LoadingBars />) ||
								(emailSent && 'Vous avez déjà reçu la recette') ||
								'Recevoir la recette sélectionnée'}
						</Button>
					</Box>
				</Box>
			) : (
				<Box id='calendar__empty-recipes-message'>
					{(recipesLoading && <LoadingHamster />) ||
						(recipes.length === 0 && (
							<Typography>Pas encore de recettes a choisir !</Typography>
						))}
				</Box>
			)}
		</Container>
	);
};

export default CalendarPage;
