import 'react-calendar/dist/Calendar.css';
import './calendarpage.css';
import { useContext, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { LoadingBars, LoadingHamster, RecipeItem, UserContext, } from '../../components';

import { Typography, Button, Box, Container, Tooltip } from '@mui/material';

const CalendarPage = () => {
	const { idUser, mailUser } = useContext(UserContext);
	const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
	const [recipes, setRecipes] = useState([]);
	const [savedSelectedRecipe, setSavedSelectedRecipe] = useState(null);
	const [planning, setPlanning] = useState([]);
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

	const RecipeTooltip = ({ recipe }) => (
		<Box>
			<Typography variant="h6">{recipe.labelRec}</Typography>
			<Typography>{recipe.descRec}</Typography>
			<img src={recipe.imageUrl} alt={recipe.labelRec} width="100" />
		</Box>
	);

	const addToPlanning = () => {
		if (new Date(date) < new Date()) {
			alert("Vous ne pouvez pas ajouter de recettes pour les jours passés.");
			return;
		}

		const existingEntry = planning.find((entry) => entry.date === date);
		if (existingEntry) {
			alert("Ce jour est déjà dans votre planning.");
			return;
		}

		setPlanning([...planning, { date, recipe: savedSelectedRecipe }]);
		localStorage.setItem('planning', JSON.stringify([...planning, { date, recipe: savedSelectedRecipe }]));
	};

	const removeFromPlanning = (index) => {
		const newPlanning = [...planning];
		newPlanning.splice(index, 1);
		setPlanning(newPlanning);
		localStorage.setItem('planning', JSON.stringify(newPlanning));
	};

	const handleSetDate = (selectedDate) => {
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

	useEffect(() => {
		// Get the planning from the localStorage
		const storedPlanning = localStorage.getItem('planning');

		// Update the state if there is a stored planning
		if (storedPlanning) {
			setPlanning(JSON.parse(storedPlanning));
		}

		fetchRecipes();
	}, []);

	const sendPlanningEmail = async () => {
		const mailBody = {
			planning: planning,
			mailUser: mailUser
		};
		setMailLoading(true);
		console.log(JSON.stringify(mailBody));
		try {
			const response = await fetch(
				`https://recipesappfunctions.azurewebsites.net/api/sendPlanningMail`,
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


	return (
		<Container>
			<Box id="calendar__title-container">
				<Typography component="p" variant="h4">
					Planifier votre prochain repas :
				</Typography>
			</Box>
			<Box id="calendar__error-container">
				{errorStatus && (
					<Typography color="error">{errorMessage}</Typography>
				)}
				{infoStatus && <Typography>{infoMessage}</Typography>}
			</Box>
			<Box display="flex">
				<Box>
					<Box id="calendar__calendar-container">
						<Calendar onChange={handleSetDate} value={date} locale="fr-FR" />
					</Box>
					{recipes.length > 0 ? (
						<Box id="calendar__recipes-container">
							<Box id="calendar__recipes-array-row" className="scrollbars">
								{recipes.map((recipe, recipeIndex) => {
									return (
										<Box
											className={`calendar__recipes-items${savedSelectedRecipe === recipe ? " active" : ""
												}`}
											key={recipeIndex}
											onClick={() => {
												handleSelectRecipe(recipe);
											}}
										>
											<RecipeItem recipe={recipe} disabled />
										</Box>
									);
								})}
							</Box>
							<Box id="calendar__recipes__button-container">
								<Button
									variant="contained"
									color="warning"
									id="calendar__recipes__button-item"
									onClick={addToPlanning}
									disabled={!savedSelectedRecipe}
								>
									Ajouter au planning
								</Button>
								<Button
									variant="contained"
									color="primary"
									onClick={sendPlanningEmail}
								>
									Envoyer le planning par e-mail
								</Button>
							</Box>
						</Box>
					) : (
						<Box id='calendar__empty-recipes-message'>
							{(recipesLoading && <LoadingHamster />) ||
								(recipes.length === 0 && (
									<Typography>Pas encore de recettes à choisir !</Typography>
								))}
						</Box>
					)}
				</Box>

				<Box id="calendar__planning-container" sx={{ marginLeft: '20rem' }}>
					<Typography component="p" variant="h6">
						Planning des repas :
					</Typography>
					{planning.map((item, index) => (
						<Box key={index}>
							<Tooltip
								title={<RecipeTooltip recipe={item.recipe} />}
								placement="right"
								arrow
							>
								<Typography>
									{item.date}: {item.recipe.labelRec}
								</Typography>
							</Tooltip>
							<Button
								variant="outlined"
								color="error"
								size="small"
								onClick={() => removeFromPlanning(index)}
							>
								Supprimer
							</Button>
						</Box>
					))}

				</Box>
			</Box>
		</Container>
	);
};

export default CalendarPage;
