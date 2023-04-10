import React, { useContext, useEffect, useState } from 'react';
import { useSprings, animated } from 'react-spring';
import { RecipeItem, UserContext } from '../../components';
import './wheelpage.css';

const UserRecipesPage = () => {
	const { idUser } = useContext(UserContext);
	const [recipes, setRecipes] = useState([]);

	const fetchRecipes = async () => {
		const data = await fetch(
			`https://recipesappfunctions.azurewebsites.net/api/user/${idUser}/recipes`,
			{
				method: 'get',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const recipes = await data.json();
		setRecipes(recipes);
	};

	useEffect(() => {
		fetchRecipes();
		//eslint-disable-next-line
	}, []);

	const [selectedItem, setSelectedItem] = useState(0);
	const [animating, setAnimating] = useState(false);

	const radius = 10; // Adjust this value to change the size of the wheel

	const springs = useSprings(
		recipes.length,
		recipes.map((_, i) => {
			const angle = (360 / recipes.length) * i;
			const isSelected = i === selectedItem;
			const scale = isSelected ? 1.1 : 1;
			const x = radius * Math.cos(((angle - 90) * Math.PI) / 180) + '%';
			const y = radius * Math.sin(((angle - 90) * Math.PI) / 180) + '%';
			const rotation = angle;

			return {
				transform: `translate(${x}, ${y}) rotate(${rotation}deg) scale(${scale})`,
				// position: 'absolute',
				config: { tension: 200, friction: 20 },
			};
		})
	);

	const handleClick = () => {
		if (!animating) {
			setAnimating(true);
			const steps = 30; // number of steps for the animation
			const duration = 3000; // duration of the animation in milliseconds

			for (let i = 1; i <= steps; i++) {
				setTimeout(() => {
					setSelectedItem(
						(prevSelectedItem) => (prevSelectedItem + 1) % recipes.length
					);
				}, (duration / steps) * i);
			}

			setTimeout(() => {
				setAnimating(false);
			}, duration);
		}
	};

	return (
		<>
			<h1 className='recipes__wheel-title'>
				Faites tourner la roue pour découvrir ce que vous aller manger...
			</h1>

			<button onClick={handleClick}>Start/Stop Carousel</button>

			<div className='recipes__wheel-container'>
				{springs.map((springProps, i) => (
					<animated.div
						key={i}
						style={springProps}
						className='recipes__wheel-item'>
						<RecipeItem recipe={recipes[i]} />
					</animated.div>
				))}
			</div>
		</>
	);
};

export default UserRecipesPage;
