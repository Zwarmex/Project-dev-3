import 'react-calendar/dist/Calendar.css';
import './calendarpage.css';
// import './dark-calendar.css';
import { useContext, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import {
	LoadingBars,
	LoadingHamster,
	RecipeItem,
	UserContext,
} from '../../components';
import { Typography, Button, Box, Container } from '@mui/material';

const CalendarPage = () => {
	const { idUser, mailUser } = useContext(UserContext);
	const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
	const [recipes, setRecipes] = useState([]);
	const [savedSelectedRecipe, setSavedSelectedRecipe] = useState(null);
	const [recipesLoading, setRecipesLoading] = useState(false);
	const [mailLoading, setMailLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [errorStatus, setErrorStatus] = useState(false);
	const [infoMessage, setInfoMessage] = useState('');
	const [infoStatus, setInfoStatus] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	const fetchRecipes = async () => {
		try {
			setRecipesLoading(true);
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
			setRecipesLoading(false);
		}
	};
	const sendRecipeEmail = async (recipe) => {
		const mailBody = { recipe: JSON.stringify({ recipe }), date: date };
		setMailLoading(true);
		console.log(JSON.stringify(mailBody));
		try {
			const response = await fetch(
				`https://recipesappfunctions.azurewebsites.net/api/sendRecipeMail/${mailUser}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(mailBody),
				}
			);
			if (response.ok) {
				setInfoMessage('Mail envoyé avec succès');
				setInfoStatus(true);
				setEmailSent(true);
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
		console.log(formattedDate);
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
			<Box className='calendar__title-container'>
				<Typography component='p' variant='h4'>
					Planifier votre prochain repas :
				</Typography>
			</Box>
			<Box className='calendar__error-container'>
				{errorStatus && <Typography color='error'>{errorMessage}</Typography>}
				{infoStatus && <Typography>{infoMessage}</Typography>}
			</Box>
			<Box className='calendar__calendar-container'>
				<Calendar
					className='calendar__calendar-item'
					onChange={handleSetDate}
					value={date}
					locale='fr-FR'
				/>
			</Box>
			{recipes.length > 0 ? (
				<Box className='calendar__recipes-container'>
					<Box className='calendar__recipes-array-row scrollbars'>
						{recipes.map((recipe, recipeIndex) => {
							return (
								<Box
									className={`calendar__recipes-item${
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
					<Box className='calendar__recipes__button-container'>
						<Button
							variant='contained'
							color='warning'
							className='calendar__recipes__button-item'
							onClick={handleSendRecipe}
							disabled={!savedSelectedRecipe || mailLoading || emailSent}>
							{(mailLoading && <LoadingBars />) ||
								(emailSent && 'Vous avez déjà reçu la recette') ||
								'Recevoir la recette sélectionnée'}
						</Button>
					</Box>
				</Box>
			) : (
				<Box className='calendar__empty-recipes-message'>
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
