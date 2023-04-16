import './recipeitem.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';
import defaultRecipeImage from '../../assets/images/defaultRecipeImage.jpg';

const RecipeItem = ({ recipe, disabled }) => {
	const handleImageError = (event) => {
		event.target.src = defaultRecipeImage;
		event.target.alt = 'Default image for recipe';
	};

	const renderCardContent = () => (
		<Container disableGutters>
			<CardMedia
				className='recipe__item-car__action-media'
				component='img'
				width='100'
				height='150'
				image={recipe.imgRec || defaultRecipeImage}
				alt={recipe.labelRec || 'Default image for recipe'}
				onError={handleImageError}
			/>
			<CardContent className='recipe__item-card__action-content'>
				<Typography
					component='p'
					align='justify'
					className='recipe__item-card__action-title'>
					{recipe.labelRec}
				</Typography>
			</CardContent>
		</Container>
	);

	return (
		<Container disableGutters className='recipe__item-container'>
			<Card className='recipe__item-card' key={recipe.idRec}>
				{disabled ? (
					renderCardContent()
				) : (
					<NavLink
						to={{
							pathname: `/recipe/${recipe.idRec}`,
							state: { recipe: recipe },
						}}>
						<CardActionArea className='recipe__item-card__action-area'>
							{renderCardContent()}
						</CardActionArea>
					</NavLink>
				)}
			</Card>
		</Container>
	);
};

export default RecipeItem;
