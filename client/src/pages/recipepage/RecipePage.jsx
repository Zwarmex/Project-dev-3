import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './recipepage.css';
import {
	Box,
	Button,
	Container,
	Divider,
	Rating,
	Typography,
} from '@mui/material';
import { UserContext } from '../../components';
import { Editor } from 'react-draft-wysiwyg';
import { convertFromRaw, EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import defaultRecipeImage from '../../assets/images/defaultRecipeImage.jpg';

const RecipePage = () => {
	const navigate = useNavigate();
	const [comments, setComments] = useState([]);
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
	const fetchComments = async () => {
		const data = await fetch(`https://recipesappfunctions.azurewebsites.net/api/comments/${idRec}`);
		const commentsArray = await data.json();
		setComments(commentsArray);
	  };
	const handleCommentSubmit = async (event) => {
		event.preventDefault();
	  
		const formData = new FormData(event.target);
		const author = formData.get('author');
		const text = formData.get('text');
	  
		const response = await fetch(`https://recipesappfunctions.azurewebsites.net/api/comments/${idRec}`, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({
			authorCom: author,
			textCom: text,
		  }),
		});
	  
		if (response.ok) {
		  fetchComments();
		} else {
		  // Handle any errors during the comment submission process
		}
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
		fetchComments();
	}, []);
	return (
		<Container>
			<Box className='recipePage__title-container'>
				<Typography component='p' variant='h4' className='recipe__title'>
					{recipe.labelRec} ({recipe.numberOfPersonsRec} pers.)
				</Typography>
			</Box>
			<Box className='recipe__rating-container'>
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
			</Box>
			<img
				src={recipe.imgRec || defaultRecipeImage}
				alt={recipe.labelRec || 'Default image for recipe'}
				className='recipe__img'
				onError={handleImageError}
			/>

			<Box className='recipe__category-container'>
				<Typography component='p' variant='h5'>
					Catégorie : {category.labelCat}
				</Typography>
			</Box>
			<Divider />
			<Box className='recipe__steps-container'>
				<Typography component='p' variant='h5' className='recipe__steps-title'>
					Étapes ({recipe.timeRec} min.):
				</Typography>
				<Editor
					editorClassName='recipe__steps-editor'
					editorState={editorState}
					readOnly
					toolbarHidden
				/>
			</Box>
			{+idUser === recipe.idUser ? (
				<Box className='recipe__delete-button-container'>
					<Button
						onClick={handleDelete}
						color='warning'
						variant='contained'
						className='recipe__delete-button-item'>
						Supprimer la recette
					</Button>
				</Box>
			) : null}
				<Box className='recipe__comment-form-container'>
					<Typography component='p' variant='h5' className='recipe__comment-form-title'>
						Ajouter un commentaire
					</Typography>
					<form onSubmit={handleCommentSubmit} className='recipe__comment-form'>
						<label htmlFor='author' className='recipe__comment-form-label'>
						Nom :
						</label>
						<input type='text' name='author' className='recipe__comment-form-input' required />
						<label htmlFor='text' className='recipe__comment-form-label'>
						Commentaire :
						</label>
						<textarea name='text' className='recipe__comment-form-input' required />
						<Button type='submit' color='primary' variant='contained' className='recipe__delete-button-item'>
						Ajouter
						</Button>
					</form>
				</Box>
		</Container>
	);
};
export default RecipePage;
