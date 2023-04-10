import React from 'react';
import './wheel.css';
import { RecipeItem } from '../../components';

const Wheel = ({ recipes }) => {
	const angle = 360 / recipes.length;

	return (
		<div className='wheel'>
			{recipes.map((recipe, index) => (
				<div
					key={index}
					className='recipe-item'
					style={{
						transform: `rotate(${angle * index}deg) translateY(-50%)`,
					}}>
					<div
						className='rotated-item'
						// style={{
						// 	transform: `rotate(${angle * index}deg)`,
						// }}
					>
						<RecipeItem recipe={recipe} />
					</div>
				</div>
			))}
		</div>
	);
};

export default Wheel;
