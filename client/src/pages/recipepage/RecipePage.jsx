import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './recipepage.css';
import { Rating, Typography } from '@mui/material';
import { UserContext } from '../../components';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import defaultRecipeImage from '../../assets/images/defaultRecipeImage.jpg';

const RecipePage = () => {
	const navigate = useNavigate();

	const [recipe, setRecipe] = useState([]);
	const [category, setCategory] = useState([]);
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);
	const { idRec } = useParams();
	const { idUser } = useContext(UserContext);

	const fetchRecipe = async () => {
		const data = await fetch(
			`https://recipesappfunctions.azurewebsites.net/api/recipe/${idRec}`
		);
		await data.json().then((recipeArray) => {
			setRecipe(recipeArray[0]);
			fetchCategory(recipeArray[0].idCat);
			const contentState = convertFromRaw(JSON.parse(recipeArray[0].stepsRec));
			setEditorState(EditorState.createWithContent(contentState));
		});

		// setRecipe(recipe);
	};
	const fetchCategory = async (id) => {
		const data = await fetch(
			`https://recipesappfunctions.azurewebsites.net/api/category/${id}`
		);
		await data.json().then((categoryArray) => {
			setCategory(categoryArray[0]);
		});
	};
	const handleDelete = async () => {
		const confirmDelete = window.confirm(
			'Are you sure you want to delete this recipe?'
		);
		if (confirmDelete) {
			try {
				const response = await fetch(
					`https://recipesappfunctions.azurewebsites.net/api/recipe/${idRec}/user/${idUser}`,
					{ method: 'DELETE' }
				);

				if (response.ok) {
					navigate(-1);
				} else {
					// Handle any errors during the deletion process
				}
			} catch (error) {
				// Handle any network errors
			}
		}
	};

	const handleImageError = (event) => {
		event.target.src = defaultRecipeImage;
		event.target.alt = 'Default image for recipe';
	};

	useEffect(() => {
		fetchRecipe();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			<h1 className='recipe__title'>
				{recipe.labelRec} ({recipe.numberOfPersonsRec} pers.)
			</h1>
			<div className='recipe__rating-container'>
				<Typography component='legend'>Difficulté :</Typography>
				{recipe.difficultyRec ? (
					<Rating
						className='recipe__rating-stars'
						name='difficulty'
						value={recipe.difficultyRec}
						size='large'
						readOnly
					/>
				) : null}
			</div>
			<img
				src={recipe.imgRec || defaultRecipeImage}
				alt={recipe.labelRec || 'Default image for recipe'}
				className='recipe__img'
				onError={handleImageError}
			/>

			<div className='recipe__category-container'>
				<h2>Catégorie : {category.labelCat}</h2>
			</div>
			<hr />
			<div className='recipe__steps-container'>
				<h2 className='recipe__steps-title'>Étapes ({recipe.timeRec} min.):</h2>
				<Editor
					editorClassName='recipe__steps-editor'
					editorState={editorState}
					readOnly
					toolbarHidden
				/>
			</div>
			{+idUser === recipe.idUser ? (
				<button onClick={handleDelete} className='recipe__delete-button'>
					Supprimer la recette
				</button>
			) : null}
		</>
	);
};
export default RecipePage;
