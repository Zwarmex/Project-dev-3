import './addrecipepage.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { DropdownList } from 'react-widgets';
import 'react-widgets/styles.css';
import {
	Box,
	FormControl,
	InputLabel,
	Typography,
	OutlinedInput,
	Button,
	MenuItem,
	Select,
	Rating,
	Container,
	Divider,
	IconButton,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import {
	ImageUpload,
	LoadingBars,
	LoadingHamster,
	UserContext,
} from '../../components';

const AddRecipePage = () => {
	const [units, setUnits] = useState([
		'cm³',
		'g',
		'mg',
		'kg',
		'l',
		'ml',
		'cl',
		'pouce',
		'tasse',
		'cuillère à café',
		'cuillère à soupe',
		'pièce',
	]);
	const navigate = useNavigate();
	const maxImageSize = 1024 * 1024; // 1MB
	const { idUser } = useContext(UserContext);
	const [numberOfIngredients, setNumberOfIngredients] = useState(0);
	const [difficulty, setDifficulty] = useState(1);
	const [numberOfPersons, setNumberOfPersons] = useState(2);
	const [time, setTime] = useState(15);
	const [title, setTitle] = useState('');
	const [selectedCategoryId, setSelectedCategoryId] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [errorStatus, setErrorStatus] = useState(false);
	const [loadingCategories, setLoadingCategories] = useState(false);
	const [loadingIngredients, setLoadingIngredients] = useState(false);
	const [loadingAddRecipe, setLoadingAddRecipe] = useState(false);
	const [ingredients, setIngredients] = useState([]);
	const [ingredientsSelected, setIngredientsSelected] = useState([]);
	const [categories, setCategories] = useState([]);
	const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
	const [base64Image, setBase64Image] = useState(null);
	const [imageSize, setImageSize] = useState(null);
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);

	const resetError = () => {
		setErrorStatus(false);
	};
	const handleEditorChange = (state) => {
		setEditorState(state);
	};
	const handleImageUpload = (base64, fileSize) => {
		setBase64Image(base64);
		setImageSize(fileSize);
		setIsAddButtonDisabled(fileSize > maxImageSize);
	};
	const handleNumberOfPersonsChange = (event) => {
		setNumberOfPersons(event.target.value);
	};
	const handleTimeChange = (event) => {
		setTime(event.target.value);
	};
	const handleDifficultyChange = (event, newValue) => {
		setDifficulty(newValue);
	};
	const handleCategoryChange = (event) => {
		setSelectedCategoryId(event.target.value);
	};
	const handleAddRecipe = async () => {
		resetError();
		let labelError = false;
		let quantityError = false;
		let unitError = false;
		let errorMessageRecipe = '';
		for (let index = 0; index < ingredientsSelected.length; index++) {
			const ingredient = ingredientsSelected[index];
			if (!labelError && ingredient.labelIng === '') {
				labelError = true;
				errorMessageRecipe += "- Il manque au moins un nom d'ingrédient\n";
			}
			if (!quantityError && !ingredient.quantityRecIng) {
				quantityError = true;
				errorMessageRecipe += '- Il manque au moins une quantité\n';
			}
			if (!unitError && !ingredient.unitRecIng) {
				unitError = true;
				errorMessageRecipe += '- Il manque au moins une unité\n';
			}
			if (labelError && quantityError && unitError) {
				break;
			}
		}
		if (labelError || quantityError || unitError) {
			setErrorStatus(true);
			setErrorMessage(errorMessageRecipe);
			return;
		}
		if (
			!title.trim() ||
			editorState.getCurrentContent().getPlainText().trim() === ''
		) {
			setIsAddButtonDisabled(true);
			return;
		}
		const rawContentState = convertToRaw(editorState.getCurrentContent());
		const stepsJsonString = JSON.stringify(rawContentState);
		const recipeData = {
			label: title,
			steps: stepsJsonString,
			numberOfPersons: numberOfPersons,
			time: time,
			difficulty: difficulty,
			idCat: selectedCategoryId,
			idUser: idUser,
			img: base64Image,
			ingredients: ingredientsSelected,
		};
		console.log(JSON.stringify(recipeData));
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(recipeData),
		};
		setLoadingAddRecipe(true);
		try {
			const response = await fetch(
				'https://recipesappfunctions.azurewebsites.net/api/recipe',
				requestOptions
			);

			if (response.ok) {
				navigate('/');
			} else {
				console.error("L'ajout de recette a échoué");
			}
		} catch {
			console.error("L'ajout de recette a échoué");
		} finally {
			setLoadingAddRecipe(false);
		}
	};
	const handleAddIngredient = () => {
		setNumberOfIngredients(
			(prevNumberOfIngredients) => prevNumberOfIngredients + 1
		);
		setIngredientsSelected((prevSelectedIngredients) => [
			...prevSelectedIngredients,
			{ quantityRecIng: 0 },
		]);
	};
	const handleRemoveIngredient = () => {
		if (numberOfIngredients > 0) {
			const newLength = numberOfIngredients - 1;
			setNumberOfIngredients(newLength);
			setIngredientsSelected((prevSelectedIngredients) =>
				prevSelectedIngredients.slice(0, newLength)
			);
		}
	};
	const handleNewIngredient = (newLabel) => {
		setIngredients([...ingredients, { labelIng: newLabel }]);
	};
	const handleNewUnit = (newUnit) => {
		setUnits([...units, newUnit]);
	};
	const handleIngredientQuantityChange = (index, newValue) => {
		const updatedIngredientsSelected = [...ingredientsSelected];
		updatedIngredientsSelected[index].quantityRecIng = newValue;
		setIngredientsSelected(updatedIngredientsSelected);
	};
	const handleIngredientSelectedChange = (index, newIngredient) => {
		const updatedIngredientsSelected = [...ingredientsSelected];
		updatedIngredientsSelected[index].labelIng = newIngredient.labelIng;
		updatedIngredientsSelected[index].idIng = newIngredient.hasOwnProperty(
			'idIng'
		)
			? newIngredient.idIng
			: null;
		console.log(updatedIngredientsSelected);
		setIngredientsSelected(updatedIngredientsSelected);
	};
	const handleIngredientUnitChange = (index, newUnit) => {
		const updatedIngredientsSelected = [...ingredientsSelected];
		updatedIngredientsSelected[index].unitRecIng = newUnit;
		setIngredientsSelected(updatedIngredientsSelected);
	};
	const preventNegativeInput = (event) => {
		// Check if the pressed key is a minus sign
		if (event.key === '-') {
			// Prevent the minus sign from being entered
			event.preventDefault();
		}
	};
	const fetchIngredients = async () => {
		resetError();
		setLoadingIngredients(true);
		try {
			const response = await fetch(
				'https://recipesappfunctions.azurewebsites.net/api/ingredients'
			);
			if (response.ok) {
				const data = await response.json();
				setIngredients(data);
			} else {
				setErrorStatus(true);
				setErrorMessage('Erreur de connection.');
			}
		} catch {
			setErrorStatus(true);
			setErrorMessage('Erreur de connection.');
		} finally {
			setLoadingIngredients(false);
		}
	};
	const fetchCategories = async () => {
		resetError();
		setLoadingCategories(true);
		try {
			const response = await fetch(
				'https://recipesappfunctions.azurewebsites.net/api/categories'
			);
			if (response.ok) {
				const data = await response.json();
				setCategories(data);
				setSelectedCategoryId(data[0].idCat);
			} else {
				setErrorStatus(true);
				setErrorMessage('Erreur de connection.');
			}
		} catch {
			setErrorStatus(true);
			setErrorMessage('Erreur de connection.');
		} finally {
			setLoadingCategories(false);
		}
	};
	useEffect(() => {
		setIsAddButtonDisabled(
			!title.trim() ||
				editorState.getCurrentContent().getPlainText().trim() === '' ||
				imageSize > maxImageSize
		);
	}, [title, editorState, imageSize, maxImageSize]);
	useEffect(() => {
		fetchCategories();
		fetchIngredients();
		//eslint-disable-next-line
	}, []);
	return (
		<Container>
			{/* Title */}
			<Box id='recipe__add-top-title'>
				<Typography component='p' variant='h4'>
					Ajoute une recette :{' '}
				</Typography>
			</Box>
			<Box component='form' id='recipe__add-form' noValidate autoComplete='off'>
				<FormControl id='recipe__add-title'>
					<InputLabel htmlFor='recipe__add-title-input'>
						<Typography>Titre</Typography>
					</InputLabel>
					<OutlinedInput
						onChange={(input) => setTitle(input.target.value)}
						id='recipe__add-title-input'
						name='recipe__add-title-input'
						type='text'
						value={title}
						label='Titre'
					/>
				</FormControl>
				<FormControl id='recipe__add-number-of-persons'>
					<InputLabel htmlFor='recipe__add-number-of-persons-input'>
						<Typography>Nombre de personnes</Typography>
					</InputLabel>
					<Select
						value={numberOfPersons}
						onChange={handleNumberOfPersonsChange}
						label='Nombre de personnes'
						id='recipe__add-number-of-persons-input'>
						{Array.from({ length: 15 }, (_, index) => index + 1).map(
							(value) => (
								<MenuItem key={value} value={value}>
									{value}
								</MenuItem>
							)
						)}
					</Select>
				</FormControl>
				<FormControl id='recipe__add-time'>
					<InputLabel htmlFor='recipe__add-time-input'>
						<Typography>Temps</Typography>
					</InputLabel>
					<Select
						value={time}
						onChange={handleTimeChange}
						label='Temps'
						id='recipe__add-time-input'>
						{Array.from({ length: 10 }, (_, index) => (index + 1) * 15).map(
							(value) => (
								<MenuItem key={value} value={value}>
									{value}
								</MenuItem>
							)
						)}
					</Select>
				</FormControl>
				<FormControl id='recipe__add-category'>
					<InputLabel htmlFor='recipe__add-category-input'>
						<Typography>Catégorie</Typography>
					</InputLabel>
					<Select
						value={selectedCategoryId}
						onChange={handleCategoryChange}
						label='Catégorie'
						id='recipe__add-category-input'
						renderValue={
							loadingCategories
								? () => <LoadingBars />
								: (selectedValue) =>
										categories.find(
											(category) => category.idCat === selectedValue
										)?.labelCat
						}>
						{categories.map((category) => (
							<MenuItem key={category.idCat} value={category.idCat}>
								{category.labelCat}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Box id='recipe__add-image-container'>
					<Typography component='p' variant='h6'>
						Photo :
					</Typography>
					<ImageUpload onImageUpload={handleImageUpload} />
					{imageSize > maxImageSize && (
						<Typography color='error'>
							La taille de l'image dépasse la limite de 1MB. Charger une image
							plus petite s'il vous plaît.
						</Typography>
					)}
				</Box>
				<Box id='recipe__add-difficulty-container'>
					<Typography component='p' variant='h6'>
						Difficulté :
					</Typography>
					<Rating
						name='recipe-rating'
						value={difficulty}
						onChange={handleDifficultyChange}
						precision={1}
						size='medium'
					/>
				</Box>
				<Box id='recipe__add-ingredients-container'>
					<Typography component='p' variant='h5'>
						Ingredients (optionel) :
					</Typography>
					{(loadingIngredients && <LoadingHamster />) ||
						Array.from(
							{ length: numberOfIngredients },
							(_, index) => index
						).map((index) => {
							return (
								<Box
									key={index}
									className='recipe__add-ingredients-choice-containers'>
									<Typography
										component='p'
										className='recipe__add-ingredients-choice-numbers'>
										{index + 1}.
									</Typography>
									<Box className='recipe__add-ingredients-dropdown-containers'>
										<DropdownList
											data={ingredients}
											dataKey='idIng'
											textField='labelIng'
											placeholder='Ingrédient'
											onCreate={handleNewIngredient}
											allowCreate='onFilter'
											onChange={(ingredient) => {
												handleIngredientSelectedChange(index, ingredient);
											}}
										/>
									</Box>
									<Box className='recipe__add-ingredients-dropdown-containers'>
										<FormControl id='recipe__add-ingredients-quantity'>
											<InputLabel htmlFor='input__recipe__add-ingredients-quantity'>
												<Typography>Quantité</Typography>
											</InputLabel>
											<OutlinedInput
												id='input__recipe__add-ingredients-quantity'
												name='input__recipe__add-ingredients-quantity'
												type='number'
												inputProps={{ min: 0 }}
												value={ingredientsSelected[index].quantityRecIng}
												onChange={(input) => {
													handleIngredientQuantityChange(
														index,
														input.target.value
													);
												}}
												onKeyDown={preventNegativeInput}
												label='Quantité'
												fullWidth
												required
											/>
										</FormControl>
									</Box>
									<Box className='recipe__add-ingredients-dropdown-containers'>
										<DropdownList
											placeholder='Unité'
											data={units}
											allowCreate='onFilter'
											onCreate={handleNewUnit}
											onChange={(unit) => {
												handleIngredientUnitChange(index, unit);
											}}></DropdownList>
									</Box>
								</Box>
							);
						})}
					{!loadingIngredients && (
						<>
							<IconButton
								className='recipe__add-ingredients-buttons'
								onClick={handleAddIngredient}>
								<Add />
							</IconButton>
							{numberOfIngredients > 0 && (
								<IconButton
									className='recipe__add-ingredients-buttons'
									onClick={handleRemoveIngredient}>
									<Remove />
								</IconButton>
							)}
						</>
					)}
				</Box>
			</Box>
			<Divider />
			<Box id='recipe__add-rich__editor-container'>
				<Typography component='p' variant='h5'>
					Ajoutez les étapes :{' '}
				</Typography>
				<Editor
					editorState={editorState}
					onEditorStateChange={handleEditorChange}
					placeholder='Écrivez ici'
				/>
			</Box>
			<Box id='recipe__add-button__warning-container'>
				<Button
					variant='contained'
					onClick={handleAddRecipe}
					id='recipe__add-button'
					disabled={isAddButtonDisabled}>
					{(loadingAddRecipe && <LoadingBars />) || 'Ajouter la recette'}
				</Button>
				{isAddButtonDisabled && (
					<Typography color='error' component='p' id='recipe__add-error'>
						Il n'y a pas de titre ou de description. Ajoutez en une s'il vous
						plait.
					</Typography>
				)}
				{errorStatus && (
					<Typography color='error' component='h1'>
						<pre style={{ fontFamily: 'inherit' }}>{errorMessage}</pre>
					</Typography>
				)}
			</Box>
		</Container>
	);
};

export default AddRecipePage;
