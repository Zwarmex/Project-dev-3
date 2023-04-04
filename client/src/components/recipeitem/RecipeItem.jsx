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
				key={item.idRec}
				className='recipe__item-card'
				sx={{ minWidth: '20%', boxShadow: '1px 1px 1px 2px lightgrey' }}>
				<CardActionArea sx={{ width: '100%' }}>
					<CardMedia
						className='recipe__item-img'
						component='img'
						width='100'
						height='150'
						image={'data:image/jpeg;base64,' + item.imgRec}
						alt={item.nameRec}
					/>
					<CardContent className='recipe__item-content'>
						<Typography variant='h6' component='div' align='justify'>
							{item.nameRec}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</Container>
	);
};

export default RecipeItem;
