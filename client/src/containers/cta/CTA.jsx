import React from 'react';
import './cta.css';
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';

const CTA = () => {
	return (
		<NavLink to='/login'>
			<Button color='warning' variant='contained'>
				Rejoignez nous !
			</Button>
		</NavLink>
	);
};

export default CTA;
