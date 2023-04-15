import React from 'react';
import './wheel.css';
import { RecipeItem } from '../../components';
import { Box } from '@mui/material';

const Wheel = ({ recipes }) => {
	const angle = 360 / recipes.length;

	return (
		<Box className='wheel-container'>
			{recipes.map((recipe, index) => (
				<Box
					key={index}
					className='recipe-item'
					style={{
						transform: `rotate(${angle * index}deg) translateY(-50%)`,
					}}>
					<Box
						className='rotated-item'
						// style={{
						// 	transform: `rotate(${angle * index}deg)`,
						// }}
					>
						<RecipeItem recipe={recipe} disabled={true} />
					</Box>
				</Box>
			))}
		</Box>
	);
};

export default Wheel;
