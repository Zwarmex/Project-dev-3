import React, { useContext, useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
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
	const [scrollInterval, setScrollInterval] = useState(null);

	const handleClick = () => {
		if (scrollInterval) {
			clearInterval(scrollInterval);
			setScrollInterval(null);
			const selectedRecipe = recipes[selectedItem];
			console.log('Chosen recipe:', selectedRecipe);
			// Perform any additional actions with the selected recipe
			return;
		}

		const interval = setInterval(() => {
			setSelectedItem(
				(prevSelectedItem) => (prevSelectedItem + 1) % recipes.length
			);
		}, 200); // Adjust the time (in milliseconds) between each scroll step
		setScrollInterval(interval);

		setTimeout(() => {
			clearInterval(interval);
			setScrollInterval(null);
		}, 3000); // 3 seconds
	};

	return (
		<>
			<h1 className='recipes__wheel-title'>
				Faites tourner la roue pour découvrir ce que vous aller manger...
			</h1>

			<button onClick={handleClick}>Start/Stop Carousel</button>

			<div className={`recipes__wheel-container`}>
				<Carousel
					showArrows={false}
					infiniteLoop={true}
					showThumbs={false}
					showStatus={false}
					showIndicators={false}
					emulateTouch={false}
					// verticalSwipe={'natural'}
					selectedItem={selectedItem}
					swipeScrollTolerance={0}
					// centerMode={true}
					// centerSlidePercentage={25}
					// slidesToShow={5}
				>
					{recipes.map((recipe, recipeIndex) => {
						return (
							<div key={recipeIndex} className='recipes__wheel-item'>
								<RecipeItem recipe={recipe} />
							</div>
						);
					})}
				</Carousel>
			</div>
		</>
	);
};
export default UserRecipesPage;
