import React from 'react';
import './loadinghamster.css';
import { Box } from '@mui/material';

const LoadingHamster = () => {
	return (
		<Box
			aria-label='Orange and tan hamster running in a metal wheel'
			role='img'
			className='wheel-and-hamster'>
			<Box className='wheel'></Box>
			<Box className='hamster'>
				<Box className='hamster__body'>
					<Box className='hamster__head'>
						<Box className='hamster__ear'></Box>
						<Box className='hamster__eye'></Box>
						<Box className='hamster__nose'></Box>
					</Box>
					<Box className='hamster__limb hamster__limb--fr'></Box>
					<Box className='hamster__limb hamster__limb--fl'></Box>
					<Box className='hamster__limb hamster__limb--br'></Box>
					<Box className='hamster__limb hamster__limb--bl'></Box>
					<Box className='hamster__tail'></Box>
				</Box>
			</Box>
			<Box className='spoke'></Box>
		</Box>
	);
};

export default LoadingHamster;
