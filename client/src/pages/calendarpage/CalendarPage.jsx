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

const CalendarPage = () => {
	const { idUser, mailUser, tokenJWT, setTokenJWT, logout } =
		useContext(UserContext);
	const navigate = useNavigate();
	const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
	const [errorMessage, setErrorMessage] = useState('');
	const [infoMessage, setInfoMessage] = useState('');
	const [lastId, setLastId] = useState(0);
	const [recipes, setRecipes] = useState([]);
	const [planning, setPlanning] = useState({});
	const [selectedDay, setSelectedDay] = useState(null);
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
				const response = await fetch(
					`${process.env.REACT_APP_API_END_POINT}user/${idUser}/recipes?${lastIdString}&${topString}`,
					{
						headers: {
							authorization: tokenJWT,
						},
					}
				);

				if (response.ok) {
					const data = await response.json();
					setTokenJWT(data.tokenJWT);
					localStorage.setItem('tokenJWT', data.tokenJWT);
					const newRecipes = await data.result;
					const recipesUpdated = [...recipes, ...newRecipes];
					const lastIdUpdated = recipesUpdated[recipesUpdated.length - 1].idRec;
					if (lastId === lastIdUpdated) {
						setDisableMore(true);
					}
					setRecipes(recipesUpdated);
					setLastId(lastIdUpdated);
				} else if (response.status === 401) {
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
				const data = await response.json();
				setTokenJWT(data.tokenJWT);
				localStorage.setItem('tokenJWT', data.tokenJWT);

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

		// Update the selected date
		setDate(formattedDate);

		// If the selected date is in the planning, select it and its associated recipe
		if (planning[formattedDate]) {
			setSelectedDay(formattedDate);
			setSavedSelectedRecipe(planning[formattedDate]);
		} else {
			// If the selected date is not in the planning, deselect the current day and recipe
			setSelectedDay(null);
			setSavedSelectedRecipe(null);
		}
	};

	const handleSelectRecipe = (selectedRecipe) => {
		if (selectedRecipe === savedSelectedRecipe) {
			setSavedSelectedRecipe(null);
		} else {
			setSavedSelectedRecipe(selectedRecipe);
		}
	};
	const handleSendRecipe = () => {
		console.log('handleSendRecipe is called');
		resetInfosAndErrors();
		const confirmSend = window.confirm(
			`Voulez vous réellemendt recevoir "${
				savedSelectedRecipe.labelRec
			}" pour le ${new Date(date).toLocaleDateString('fr-FR')} par mail ?`
		);
		console.log('confirmSend', confirmSend);
		if (confirmSend) {
			console.log('sending recipe');
			sendRecipeEmail(savedSelectedRecipe);
		}
	};
	const handleScroll = (e) => {
		const { scrollLeft, clientWidth, scrollWidth } = e.currentTarget;

		if (scrollWidth - scrollLeft === clientWidth) {
			fetchRecipes(lastId);
		}
	};

	const addRecipeToPlanning = (day, recipe) => {
		setPlanning(prevPlanning => {
			// Créez une copie du planning actuel
			const newPlanning = { ...prevPlanning };
	
			// Limitez à 7 jours max
			const planningDays = Object.keys(newPlanning);
			if (planningDays.length >= 7) {
				const oldestDay = planningDays[0];
				delete newPlanning[oldestDay];
			}
	
			// Ajoutez la recette au jour sélectionné
			newPlanning[day] = recipe;
	
			// Sauvegardez le planning dans le localStorage
			localStorage.setItem('planning', JSON.stringify(newPlanning));
			if (day === selectedDay) setSelectedDay(null);
			return newPlanning;
		});
	};

	const resetInfosAndErrors = () => {
		setErrorStatus(false);
		setInfoStatus(false);
	};

	const removeDayFromPlanning = (dayToRemove) => {
		setPlanning(prevPlanning => {
			const newPlanning = { ...prevPlanning };
			delete newPlanning[dayToRemove];
			if (dayToRemove === selectedDay) setSelectedDay(null);
			localStorage.setItem('planning', JSON.stringify(newPlanning));
			return newPlanning;
		});
	};

	useEffect(() => {
		fetchRecipes();
		
		// Récupérez le planning du localStorage
		const storedPlanning = localStorage.getItem('planning');
		if (storedPlanning) {
			setPlanning(JSON.parse(storedPlanning));
		}
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
			<Box id='calendar__main-container' style={{ display: 'flex', justifyContent: 'space-around' }}>
				<Box id='calendar__planning-container' style={{ marginRight: '5px', border: '2px solid #000', borderRadius: '5px', padding: '10px', backgroundColor: 'white' }}>
					<h2>Planning de la semaine</h2>
					{Object.entries(planning)
						.sort((a, b) => new Date(a[0]) - new Date(b[0]))
						.map(([day, recipe], index) => (
						<div 
							key={index} 
							style={day === selectedDay ? {backgroundColor: 'darkgray'} : {}}
							onClick={() => {
								setSelectedDay(day);
								setDate(day);
								setSavedSelectedRecipe(recipe);
							}}
						>
							<h3>{new Date(day).toLocaleDateString('fr-FR')}</h3>
							<p>{recipe.labelRec}</p>
							<button onClick={(event) => {
								event.stopPropagation(); // prevent the onClick event of the parent div from being triggered
								removeDayFromPlanning(day);
							}}>Supprimer</button>
						</div>
					))}
				</Box>
				<Box id='calendar__calendar-container' style={{ marginLeft: '5px' }}>
					<Calendar onChange={handleSetDate} value={date} locale='fr-FR' />
				</Box>
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
						<Button
							variant='contained'
							color='primary'
							onClick={() => addRecipeToPlanning(date, savedSelectedRecipe)}
							disabled={!savedSelectedRecipe}>
							Ajouter au planning
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
