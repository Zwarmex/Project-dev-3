import { Box, Typography } from '@mui/material';
import React from 'react';
import './ingredientitem.css';

const IngredientItem = ({ ingredient }) => {
	return (
		<Box className='ingredient__item-container'>
			<Typography component='p' variant='h4'>
				{ingredient.labelIng}
			</Typography>
		</Box>
	);
};

export default IngredientItem;
