import './recipeitem.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';
import defaultRecipeImage from '../../assets/images/defaultRecipeImage.jpg';

const RecipeItem = ({ recipe, disableButton }) => {
	const handleImageError = (event) => {
		event.target.src = defaultRecipeImage;
		event.target.alt = 'Default image for recipe';
	};

	const renderCardContent = () => (
		<>
			<CardMedia
				className='recipe__item-car__action-media'
				component='img'
				width='100'
				height='150'
				image={recipe.imgRec || defaultRecipeImage}
				alt={recipe.labelRec || 'Default image for recipe'}
				onError={handleImageError}
			/>
			<CardContent className='recipe__item-car__action-content'>
				<Typography variant='h6' component='div' align='justify'>
					{recipe.labelRec}
				</Typography>
			</CardContent>
		</>
	);

	return (
		<Container
			disableGutters
			className='recipe__item-container'
			sx={{ maxWidth: '20%', width: 'fit-content' }}>
			<Card
				className='recipe__item-card'
				key={recipe.idRec}
				sx={{
					minWidth: '20%',
					boxShadow: '1px 1px 1px 2px lightgrey',
				}}>
				{disableButton ? (
					renderCardContent()
				) : (
					<NavLink
						to={{
							pathname: `/recipe/${recipe.idRec}`,
							state: { recipe: recipe },
						}}>
						<CardActionArea
							sx={{ width: '100%', borderRadius: '5%' }}
							className='recipe__item-card__action-area'>
							{renderCardContent()}
						</CardActionArea>
					</NavLink>
				)}
			</Card>
		</Container>
	);
};

export default RecipeItem;
