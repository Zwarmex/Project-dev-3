import { Container, CssBaseline } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LoadingSpinner, RecipeItem } from '../../components';
import './marketpage.css';

const MarketPage = () => {
	const [items, setItems] = useState([]);

	const fetchItems = async () => {
		const headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('Access-Control-Allow-Origin', '*');

		const requestOptions = {
			method: 'GET',
			headers: headers,
			cache: 'default',
		};
		const data = await fetch(
			'http://localhost:7071/api/getRecipes',
			requestOptions
		);

		const items = await data.json();
		console.log(items);
		setItems(items);
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
						{items.map((item, index) => (
							<RecipeItem key={index} item={item} />
						))}
					</div>
					<h1>Category</h1>
					<div className='recipe__marketplace-row'>
						{items.map((item, index) => (
							<RecipeItem key={index} item={item} />
						))}
					</div>
					<h1>Category</h1>
					<div className='recipe__marketplace-row'>
						{items.map((item, index) => (
							<RecipeItem key={index} item={item} />
						))}
					</div>
					<h1>Category</h1>
					<div className='recipe__marketplace-row'>
						{items.map((item, index) => (
							<RecipeItem key={index} item={item} />
						))}
					</div>
					<h1>Category</h1>
					<div className='recipe__marketplace-row'>
						{items.map((item, index) => (
							<RecipeItem key={index} item={item} />
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
