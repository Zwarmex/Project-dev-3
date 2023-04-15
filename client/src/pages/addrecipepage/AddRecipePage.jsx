import './addrecipepage.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
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
import { AddOutlined } from '@mui/icons-material';
import {
	ImageUpload,
	LoadingBars,
	UserContext,
	IngredientItem,
} from '../../components';

const AddRecipePage = () => {
	const navigate = useNavigate();
	const maxImageSize = 1024 * 1024; // 1MB
	const { idUser } = useContext(UserContext);
	const [numberOfIngredients, setNumberOfIngredients] = useState(0);
	const [difficulty, setDifficulty] = useState(1);
	const [numberOfPersons, setNumberOfPersons] = useState(2);
	const [time, setTime] = useState(15);
	const [title, setTitle] = useState('');
	const [selectedCategoryId, setSelectedCategoryId] = useState('');
	const [loading, setLoading] = useState(false);
	const [ingredients, setIngredients] = useState([]);
	const [categories, setCategories] = useState([]);
	const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
	const [base64Image, setBase64Image] = useState(null);
	const [imageSize, setImageSize] = useState(null);
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);

	const handleAddIngredient = () => {
		setNumberOfIngredients(numberOfIngredients + 1);
		setIngredients([
			...ingredients,
			<IngredientItem
				key={numberOfIngredients}
				ingredient={{ labelIng: 'ingredientName' }}
			/>,
		]);
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
		if (
			!title.trim() ||
			editorState.getCurrentContent().getPlainText().trim() === ''
		) {
			isAddButtonDisabled(true);
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
		};
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(recipeData),
		};
		setLoading(true);
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
			setLoading(false);
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
		const fetchCategories = async () => {
			try {
				const response = await fetch(
					'https://recipesappfunctions.azurewebsites.net/api/categories'
				);
				if (response.ok) {
					const data = await response.json();
					setCategories(data);
					setSelectedCategoryId(data[0].idCat); // Set the first category ID as the default selected value
				} else {
					console.error('Failed to fetch categories');
				}
			} catch (error) {
				console.error('Failed to fetch categories', error);
			}
		};

		fetchCategories();
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
						label='Full Name'
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
						id='recipe__add-category-input'>
						{categories.map((category) => (
							<MenuItem key={category.idCat} value={category.idCat}>
								{category.labelCat}
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<ImageUpload onImageUpload={handleImageUpload} />
				{imageSize > maxImageSize && (
					<Typography color='error'>
						La taille de l'image dépasse la limite de 1MB. Charger une image
						plus petite s'il vous plaît.
					</Typography>
				)}
				<Box id='recipe__add-difficulty-container'>
					<Typography component='legend'>Difficulté :</Typography>
					<Rating
						name='recipe-rating'
						value={difficulty}
						onChange={handleDifficultyChange}
						precision={1}
						size='medium'
					/>
				</Box>
				<Box id='recipe__add-ingredients'>
					<Typography component='p' variant='h5'>
						Ingredients :
					</Typography>
					{ingredients}
					<IconButton
						className='recipe__add-ingredients-buttons'
						onClick={handleAddIngredient}>
						<AddOutlined />
					</IconButton>
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
					{loading ? <LoadingBars /> : 'Ajouter la recette'}
				</Button>
				{isAddButtonDisabled ? (
					<Typography color='error' id='recipe__add-error'>
						Il n'y a pas de titre ou de description. Ajoutez en une s'il vous
						plait.
					</Typography>
				) : null}
			</Box>
		</Container>
	);
};

export default AddRecipePage;
