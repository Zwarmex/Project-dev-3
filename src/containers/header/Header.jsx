import React from 'react';
import './header.css';
import { CTA } from '..';
import { Box, Typography } from '@mui/material';

const Header = () => {
	return (
		<Box className='header-container'>
			<Typography component='h1' variant='p'>
				Bienvenue sur Recipe's App
			</Typography>
			<Typography component='p'>
				Pas le temps de réfléchir à quoi acheter, ou à quoi manger ? <br />
				Envie découvrir de bonnes recettes de manière simple ?
			</Typography>
			<CTA />
		</Box>
	);
};

export default Header;
