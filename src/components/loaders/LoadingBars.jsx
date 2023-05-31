import React from 'react';
import './loadingbars.css';
import { Box } from '@mui/material';

const LoadingBars = () => {
	return (
		<Box id='loader'>
			<span className='bars'></span>
			<span className='bars'></span>
			<span className='bars'></span>
		</Box>
	);
};

export default LoadingBars;
