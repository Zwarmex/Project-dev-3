import 'react-calendar/dist/Calendar.css';
import './calendarpage.css';
import './dark-calendar.css';
import { useContext, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import {
	LoadingBars,
	LoadingHamster,
	RecipeItem,
	UserContext,
} from '../../components';
import { Typography, Button } from '@mui/material';

const CalendarPage = () => {
	const { idUser, mailUser } = useContext(UserContext);
	const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
	const [recipes, setRecipes] = useState([]);
	const [savedSelectedRecipe, setSavedSelectedRecipe] = useState(null);
	const [recipesLoading, setRecipesLoading] = useState(false);
	const [mailLoading, setMailLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [errorStatus, setErrorStatus] = useState(false);

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
		console.log(JSON.stringify(mailBody));
		return;
		setMailLoading(true);
		try {
			const response = await fetch(
				`https://recipesappfunctions.azurewebsites.net/api/sendRecipeEmail/${mailUser}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: mailBody,
				}
			);
			if (response.ok) {
				alert('Recipe email sent successfully.');
			} else {
				alert('Failed to send recipe email.');
			}
		} catch {
			setErrorMessage('Error sending recipe email:');
			setErrorStatus(true);
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
		const confirmSend = window.confirm(
			`Voulez vous réellement recevoir "${
				savedSelectedRecipe.labelRec
			}" pour le ${new Date(date).toLocaleDateString('fr-FR')} par mail ?`
		);
		if (confirmSend) {
			sendRecipeEmail(savedSelectedRecipe);
		}
	};

	useEffect(() => {
		fetchRecipes();
		//eslint-disable-next-line
	}, []);

	return (
		<div>
			<div className='calendar__title-container'>
				<h1>Planifier votre prochain repas :</h1>
			</div>
			<div className='calendar__error-container'>
				{errorStatus && <Typography>{errorMessage}</Typography>}
			</div>
			<div className='calendar__calendar-container'>
				<Calendar
					className='calendar__calendar-item'
					onChange={handleSetDate}
					value={date}
					locale='fr-FR'
				/>
			</div>
			{recipes.length > 0 ? (
				<div className='calendar__recipes-container'>
					<div className='calendar__recipes-array-container'>
						{recipes.map((recipe, recipeIndex) => {
							return (
								<div
									className={`calendar__recipes-item${
										savedSelectedRecipe === recipe ? ' active' : ''
									}`}
									key={recipeIndex}
									onClick={() => {
										handleSelectRecipe(recipe);
									}}>
									<RecipeItem recipe={recipe} disableButton />
								</div>
							);
						})}
					</div>
					<div className='calendar__recipes__button-container'>
						<Button
							variant='contained'
							color='warning'
							className='calendar__recipes__button-item'
							onClick={handleSendRecipe}
							disabled={!savedSelectedRecipe || mailLoading}>
							{(mailLoading && <LoadingBars />) ||
								'Recevoir la recette sélectionnée'}
						</Button>
					</div>
				</div>
			) : (
				<div className='calendar__empty-recipes-message'>
					{(recipesLoading && <LoadingHamster />) ||
						(recipes.length === 0 && (
							<Typography>Pas encore de recettes a choisir !</Typography>
						))}
				</div>
			)}
		</div>
	);
};

export default CalendarPage;
