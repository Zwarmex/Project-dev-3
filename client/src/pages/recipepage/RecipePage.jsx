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
import FavoriteIcon from '@mui/icons-material/Favorite';
import defaultRecipeImage from '../../assets/images/defaultRecipeImage.jpg';
import IconButton from '@mui/material/IconButton';

const RecipePage = () => {
	const navigate = useNavigate();
	const [recipe, setRecipe] = useState([]);
	const [category, setCategory] = useState([]);
	const [editorState, setEditorState] = useState(() =>
		EditorState.createEmpty()
	);
	const { idRec } = useParams();
	const { idUser, abilityUser, tokenJWT, setTokenJWT, logout } =
		useContext(UserContext);

	const [isFav, setIsFav] = useState(false);
	const getFav = async () => {
		const response = await fetch(
			`${process.env.REACT_APP_API_END_POINT}user/${idUser}/isFavoriteRecipe/${idRec}`,
			{
				headers: {
					authorization: tokenJWT,
				},
			}
		);
		if (response.ok) {
			setTokenJWT(response.tokenJWT);
			const fav = await response.result.json();
			setIsFav(fav[0]['']);
		} else if (response.status === 401) {
			logout();
			navigate('/login');
		}
	};

	const fetchRecipe = async () => {
		const response = await fetch(
			`${process.env.REACT_APP_API_END_POINT}recipe/${idRec}`
		);
		if (response.ok) {
			const localRecipe = await response.result.json();

			setRecipe(localRecipe);
			fetchCategory(localRecipe.idCat);
			const contentState = convertFromRaw(JSON.parse(localRecipe.stepsRec));
			setEditorState(EditorState.createWithContent(contentState));
		}
	};
	const fetchCategory = async (id) => {
		const response = await fetch(
			`${process.env.REACT_APP_API_END_POINT}category/${id}`
		);
		await response.result.json().then((categoryArray) => {
			setCategory(categoryArray[0]);
		});
	};
	const handleFavorite = async () => {
		if (isFav) {
			const response = await fetch(
				`${process.env.REACT_APP_API_END_POINT}user/${idUser}/favoritesRecipes`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						authorization: tokenJWT,
					},
					body: JSON.stringify({
						idRec: idRec,
					}),
				}
			);
			if (response.ok) {
				setTokenJWT(response.tokenJWT);
				setIsFav(false);
			}
		} else {
			const response = await fetch(
				`${process.env.REACT_APP_API_END_POINT}user/${idUser}/favoritesRecipes`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						authorization: tokenJWT,
					},
					body: JSON.stringify({
						idRec: idRec,
					}),
				}
			);
			if (response.ok) {
				setTokenJWT(response.tokenJWT);
				setIsFav(true);
			}
		}
	};
	const handleDelete = async () => {
		const confirmDelete = window.confirm(
			'Are you sure you want to delete this recipe?'
		);
		if (confirmDelete) {
			try {
				const response = await fetch(
					`${process.env.REACT_APP_API_END_POINT}recipe/${idRec}/user/${idUser}`,
					{
						method: 'DELETE',
						headers: {
							authorization: tokenJWT,
						},
					}
				);

				if (response.ok) {
					setTokenJWT(response.tokenJWT);
					navigate(-1);
				} else if (response.status === 401) {
					logout();
					navigate('/login');
				}
			} catch (error) {}
		}
	};
	const handleImageError = (event) => {
		event.target.src = defaultRecipeImage;
		event.target.alt = 'Default image for recipe';
	};

	useEffect(() => {
		fetchRecipe();
		getFav();
		// eslint-disable-next-line
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
				loading='lazy'
				src={recipe.imgRec || defaultRecipeImage}
				alt={recipe.labelRec || 'Default image for recipe'}
				className='recipe__img'
				onError={handleImageError}
			/>

			<Box className='recipe__category-container'>
				<Typography component='p' variant='h5'>
					Catégorie : {category.labelCat}
				</Typography>
				<IconButton
					aria-label='add to favorites'
					onClick={handleFavorite}
					color={isFav ? 'error' : ''}>
					<FavoriteIcon />
				</IconButton>
			</Box>
			<Box className='recipe__ingredients-container'>
				<Typography variant='h5' component='p'>
					Ingrédients :
				</Typography>
				{(recipe.ingredients &&
					recipe.ingredients.length > 0 &&
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
			{+abilityUser === 1 || +idUser === recipe.idUser ? (
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
};
export default RecipePage;
