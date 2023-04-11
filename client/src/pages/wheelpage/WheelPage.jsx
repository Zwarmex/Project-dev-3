import React, { useState, useContext, useEffect } from 'react';
import './wheelpage.css';
import { RecipeItem, UserContext, LoadingHamster } from '../../components';

const WheelPage = () => {
	const { idUser } = useContext(UserContext);
	const [recipes, setRecipes] = useState([]);
	const wheelRadius = 200;
	const itemRadius = 50;
	const [rotation, setRotation] = useState(0);
	const [loading, setLoading] = useState(false);

	const fetchRecipes = async () => {
		setLoading(true);
		try {
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
		} catch {
		} finally {
			setLoading(false);
		}
	};
	const startAnimation = () => {
		const animationDuration = 3000;
		const endRotation = Math.random() * 360 + 720;

		setRotation(endRotation);

		setTimeout(() => {
			const selected =
				Math.floor(((endRotation % 360) * recipes.length) / 360) + 1;
			console.log(`Selected: ${recipes[selected].labelRec}`);
		}, animationDuration);
	};

	useEffect(() => {
		fetchRecipes();
		//eslint-disable-next-line
	}, []);
	return (
		<>
			{recipes.length > 0 ? (
				<>
					<div
						className='wheel-container'
						style={{
							transform: `rotate(${rotation}deg)`,
							transition: 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)',
						}}>
						{recipes.map((recipe, index) => {
							const angle = (360 / recipes.length) * index;
							const x =
								wheelRadius -
								itemRadius +
								(wheelRadius - itemRadius) * Math.cos((angle * Math.PI) / 180);
							const y =
								wheelRadius -
								itemRadius +
								(wheelRadius - itemRadius) * Math.sin((angle * Math.PI) / 180);
							return (
								<div
									key={index}
									className='wheel-items'
									style={{
										transform: `translate(${x}px, ${y}px)`,
									}}>
									<RecipeItem recipe={recipe} />
								</div>
							);
						})}
					</div>
					<div className='wheel__button-container'>
						<button className='wheel__button-start' onClick={startAnimation}>
							Start Animation {'>>>>'}
						</button>
					</div>
				</>
			) : (
				<div className='wheel__recipes-empty-message'>
					{loading && <LoadingHamster />}
					<p>Il n'y a pas de recettes pour le moment.</p>
				</div>
			)}
		</>
	);
};

export default WheelPage;
