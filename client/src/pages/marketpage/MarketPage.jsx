import { Container, CssBaseline } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LoadingSpinner, RecipeItem } from '../../components';
import { db } from '../../assets/firebase/firebase';
import { query, collection, where, getDocs } from 'firebase/firestore';
// import storage from '../../assets/firebase/firebase_storage';
import './marketpage.css';
// import { Fetch } from 'fetch-plus';

const MarketPage = () => {
	const [items, setItems] = useState([]);

	const fetchItems = async () => {
		try {
			const recipesRef = collection(db, 'recettes');
			// console.log('ref : ', recipesRef);
			const queryRecipes = query(recipesRef, where('nom', '==', 'Pain perdu'));
			// console.log('query : ', queryRecipes);
			const queryRecipesSnapshot = await getDocs(queryRecipes);
			// console.log(queryRecipesSnapshot);
			queryRecipesSnapshot.forEach((recipe) => {
				console.log(recipe);
			});
			// console.log(q);
		} catch (err) {
			console.log('errors : ', err);
			return 1;
		}
		// const data = await fetch('/marketplace');
		// const items = await data.json();
		// setItems(items);
	};

	useEffect(() => {
		fetchItems();
	}, []);

	return (
		<Container component='div' className='marketplace__container'>
			<CssBaseline />
			{items.length !== 0 ? (
				<Container disableGutters>
					<h1>Category</h1>
					<div className='recipe__marketplace-row'>
						{items.map((item) => (
							<RecipeItem item={item} />
						))}
					</div>
					<h1>Category</h1>
					<div className='recipe__marketplace-row'>
						{items.map((item) => (
							<RecipeItem item={item} />
						))}
					</div>
					<h1>Category</h1>
					<div className='recipe__marketplace-row'>
						{items.map((item) => (
							<RecipeItem item={item} />
						))}
					</div>
					<h1>Category</h1>
					<div className='recipe__marketplace-row'>
						{items.map((item) => (
							<RecipeItem item={item} />
						))}
					</div>
					<h1>Category</h1>
					<div className='recipe__marketplace-row'>
						{items.map((item) => (
							<RecipeItem item={item} />
						))}
					</div>
				</Container>
			) : (
				<div className='marketplace__no-recipe__container'>
					<h1>NO RECIPES...</h1>
					<div className='marketplace__no-recipe__loading-spinner__container'>
						<LoadingSpinner />
					</div>
				</div>
			)}
		</Container>
	);
};

export default MarketPage;
