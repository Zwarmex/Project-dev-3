import React, { useContext } from 'react';
import './cta.css';
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';
import { UserContext } from '../../components';

const CTA = () => {
	const { idUser } = useContext(UserContext);
	return (
		(!idUser && (
			<NavLink to='/login'>
				<Button color='warning' variant='contained'>
					Rejoignez nous !
				</Button>
			</NavLink>
		)) || (
			<Button
				color='warning'
				variant='contained'
				onClick={() => {
					alert('Vous êtes déjà connecté ! Merci');
				}}>
				Rejoignez nous !
			</Button>
		)
	);
};

export default CTA;
