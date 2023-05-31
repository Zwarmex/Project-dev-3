import React from 'react';
import './aboutus.css';
import { Box, Typography } from '@mui/material';

const AboutUs = () => {
	return (
		<Box className='aboutus-container'>
			<Typography variant='h4' component='p'>
				Qui sommes-nous ?
			</Typography>
			<Typography component='p' className='aboutus__content'>
				Nous sommes 4 étudiants de deuxième année en technologie de
				l'informatique à l'Ephec de Louvain-La-Neuve.
				<br />
				Dans le cadre de notre cours de développemennt, nous devions trouver un
				client afin d'apporter une solution au problème posé par celui-ci.
				<br />
				Nous avons donc décidé de choisir Isaline en tant que cliente.
				<br />
				Le problème était qu'elle ne savait souvent pas quoi faire pour manger.
				<br />
				Nous avons donc décidé de créer une application qui lui permettrait de
				mettre des recettes dans ses favoris et de laisser une roue choisir son
				repas du jour.
			</Typography>
		</Box>
	);
};

export default AboutUs;
