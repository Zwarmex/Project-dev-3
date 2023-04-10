import './addrecipepage.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {
	CssBaseline,
	Box,
	FormControl,
	InputLabel,
	Typography,
	OutlinedInput,
	Button,
	MenuItem,
	Select,
	Rating,
} from '@mui/material';
import { ImageUpload, UserContext } from '../../components';

const AddRecipePage = () => {
	const navigate = useNavigate();
	const [imageSize, setImageSize] = useState(null);
	const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
	const maxImageSize = 1024 * 1024; // 1MB
	const { idUser } = useContext(UserContext);
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);
	const [title, setTitle] = useState('');
	const [numberOfPersons, setNumberOfPersons] = useState(2);
	const [time, setTime] = useState(15);
	const [difficulty, setDifficulty] = useState(1);
	const [categories, setCategories] = useState([]);
	const [selectedCategoryId, setSelectedCategoryId] = useState('');
	const [base64Image, setBase64Image] = useState(null);

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

		try {
			const response = await fetch(
				'https://recipesappfunctions.azurewebsites.net/api/recipe',
				requestOptions
			);

			if (response.ok) {
				navigate('/');
				// TODO: handle success feedback or redirect to recipe page
			} else {
				console.error('Failed to add recipe');
				// TODO: handle error feedback
			}
		} catch (error) {
			console.error('Failed to add recipe', error);
			// TODO: handle error feedback
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
		<>
			<CssBaseline />
			<div className='recipe__add-top-title'>
				<h1>Ajoute une recette : </h1>
			</div>
			<Box
				component='form'
				className='recipe__add-form'
				sx={{
					'& > :not(style)': { margin: 1 },
				}}
				noValidate
				autoComplete='off'>
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
						The image size exceeds the 1MB limit. Please upload a smaller image.
					</Typography>
				)}
				<div className='recipe__add-difficulty-container'>
					<Typography component='legend'>Difficulté :</Typography>
					<Rating
						name='recipe-rating'
						value={difficulty}
						onChange={handleDifficultyChange}
						precision={1}
						size='medium'
					/>
				</div>
			</Box>
			<hr />
			<div className='recipe__add-rich__editor-container'>
				<h2>Ajoutez les étapes : </h2>
				<Editor
					editorState={editorState}
					onEditorStateChange={handleEditorChange}
					placeholder='Écrivez ici'
				/>
			</div>

			<Button
				variant='contained'
				onClick={handleAddRecipe}
				className='recipe__add-button'
				sx={{ margin: '0 auto' }}
				disabled={isAddButtonDisabled}>
				Ajouter la recette
			</Button>
			{isAddButtonDisabled ? (
				<Typography color='error' className='recipe__add-error'>
					Il n'y a pas de titre ou de description. Ajoutez en une s'il vous
					plait.
				</Typography>
			) : null}
		</>
	);
};

export default AddRecipePage;
