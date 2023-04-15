import { Box, Typography } from '@mui/material';
import React from 'react';

const IngredientItem = ({ ingredient }) => {
	return (
		<Box>
			<Typography component='p' variant='h4'>
				{ingredient.labelIng}
			</Typography>
		</Box>
	);
};

export default IngredientItem;
