import './recipeitem.css';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

const RecipeItem = ({item}) => {
    return (
    <Card 
    className='recipe__item-card'
    sx={{minWidth:'20%',}}>
        <CardActionArea
        sx={{width:'100%',}}>
            <CardMedia
            className='recipe__item-img'
            component="img"
            height="140"
            maxWidth="100%"
            image={item.img}
            alt={item.name}
            />
            <CardContent>
                <Typography 
                variant="h6" 
                component="div" 
                align='justify'>
                    {item.name}
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
        // <div className="recipe__item-container">
        //     <div className="recipe__item-img">
        //         <img src={item.img} alt={item.name}/>
        //     </div>
        //     <div className="recipe__item-name">
        //         <p>Name : {item.name}</p>
        //     </div>
        //     <div className="recipe__item-duration">
        //         <p>Duration : {item.duration} minutes</p>
        //     </div>
        // </div>
    );
};

export default RecipeItem;