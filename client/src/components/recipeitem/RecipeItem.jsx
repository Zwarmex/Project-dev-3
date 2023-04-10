import './recipeitem.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

const RecipeItem = ({ recipe }) => {
	return (
		<Container disableGutters>
			<Card
				className='recipe__item-container'
				key={recipe.idRec}
				sx={{
					minWidth: '20%',
					boxShadow: '1px 1px 1px 2px lightgrey',
				}}>
				<NavLink
					to={{
						pathname: `/recipe/${recipe.idRec}`,
						state: { recipe: recipe },
					}}>
					<CardActionArea
						sx={{ width: '100%', borderRadius: '5%' }}
						className='recipe__item-card'>
						<CardMedia
							className='recipe__item-img'
							component='img'
							width='100'
							height='150'
							image={recipe.imgRec}
							alt={recipe.labelRec}
						/>
						<CardContent className='recipe__item-content'>
							<Typography variant='h6' component='div' align='justify'>
								{recipe.labelRec}
							</Typography>
						</CardContent>
					</CardActionArea>
				</NavLink>
			</Card>
		</Container>
	);
};

export default RecipeItem;
