import './recipeitem.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Container } from '@mui/material';

const RecipeItem = ({ item }) => {
	return (
		<Container disableGutters className='recipe__item-container'>
			<Card
				className='recipe__item-card'
				key={item.id}
				sx={{ minWidth: '20%' }}>
				<CardActionArea sx={{ width: '100%' }}>
					<CardMedia
						className='recipe__item-img'
						component='img'
						width='100'
						height='150'
						image={item.img}
						alt={item.name}
					/>
					<CardContent className='recipe__item-content'>
						<Typography variant='h6' component='div' align='justify'>
							{item.name}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</Container>
	);
};

export default RecipeItem;
