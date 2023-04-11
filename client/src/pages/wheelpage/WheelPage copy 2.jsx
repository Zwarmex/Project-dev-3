import React, { useContext, useEffect, useState } from 'react';
import { RecipeItem, UserContext, Wheel } from '../../components';
const WheelPage = () => {
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
	return (
		<>
			<div className='wheel-container'>
				<Wheel recipes={recipes} />
			</div>
		</>
	);
};

export default WheelPage;
