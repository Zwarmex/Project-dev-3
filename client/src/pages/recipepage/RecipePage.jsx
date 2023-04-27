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
	const [recipe, setRecipe] = useState([]);
	const [category, setCategory] = useState([]);
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);
	const { idRec } = useParams();
	const { idUser } = useContext(UserContext);

	const fetchRecipe = async () => {
		const resultRecipe = await fetch(
			`https://recipesappfunctions.azurewebsites.net/api/recipe/${idRec}`
		);
		const localRecipe = await resultRecipe.json();

		setRecipe(localRecipe);
		fetchCategory(localRecipe.idCat);
		const contentState = convertFromRaw(JSON.parse(localRecipe.stepsRec));
		setEditorState(EditorState.createWithContent(contentState));
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
	try {
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
				<Box className='recipe__ingredients-container'>
					<Typography variant='h5' component='p'>
						Ingrédients :
					</Typography>
					{(recipe.ingredients.length !== 0 &&
						recipe.ingredients.map((ingredient, ingredientIndex) => {
							return (
								<Typography key={ingredientIndex} variant='h8' component='p'>
									{ingredient.labelIng}
								</Typography>
							);
						})) || (
						<Typography variant='h8' component='p'>
							Il n'y a pas d'ingrédients défini par le créateur de la recette.
						</Typography>
					)}
				</Box>
				<Divider />
				<Box className='recipe__steps-container'>
					<Typography
						component='p'
						variant='h5'
						className='recipe__steps-title'>
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
			</Container>
		);
	} catch (error) {
		console.log(error);
	}
};
export default RecipePage;
