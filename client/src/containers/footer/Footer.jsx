import React from 'react';
import './footer.css';
import { Box, Link, Typography } from '@mui/material';

const Footer = () => {
	return (
		<Box className='footer'>
			<Box className='banner'>
				<Typography component='p'>
					Mail :{' '}
					<Link href='mailto:recipesapp-admin@gmail.com'>
						recipesapp-admin@gmail.com
					</Link>
				</Typography>
				<Typography component='p'>
					Github :{' '}
					<Link href='https://github.com/Zwarmex/Project-dev-3'>
						Projet-dev-3
					</Link>
				</Typography>
			</Box>
		</Box>
	);
};

export default Footer;
