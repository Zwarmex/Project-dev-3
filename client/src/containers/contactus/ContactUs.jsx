import React, { useState } from 'react';
import './contactus.css';
import {
	Box,
	Typography,
	FormControl,
	OutlinedInput,
	InputLabel,
	TextField,
	Button,
	Container,
} from '@mui/material';

const ContactUs = () => {
	const [emailError, setEmailError] = useState(false);
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');
	const [message, setMessage] = useState('');

	const handleMailInput = (newMail) => {
		setEmailError(!validateEmail(newMail));
		setEmail(newMail);
	};
	const handleSendMessage = () => {
		alert('Ca ne marche pas encore');
	};
	const validateEmail = (email) => {
		const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
		return emailRegex.test(email);
	};
	return (
		<Box component='form' className='contact-form'>
			<Typography component='p' variant='h4'>
				Formulaire de contact
			</Typography>
			<FormControl id='contactus__name' className='contactus__form-control'>
				<InputLabel htmlFor='contactus__name'>
					<Typography>Votre nom</Typography>
				</InputLabel>
				<OutlinedInput
					onChange={(input) => setName(input.target.value)}
					id='contactus__nom'
					name='contactus__nom'
					type='text'
					value={name}
					label='Votre nom'
					required
				/>
			</FormControl>
			<FormControl
				id='contactus__email'
				error={emailError}
				className='contactus__form-control'>
				<InputLabel htmlFor='contactus__email'>
					<Typography>Votre adresse mail</Typography>
				</InputLabel>
				<OutlinedInput
					onChange={(input) => handleMailInput(input.target.value)}
					id='contactus__email'
					name='contactus__email'
					type='email'
					value={email}
					label='Votre adresse mail'
					required
				/>
			</FormControl>
			<FormControl id='contactus__message' className='contactus__form-control'>
				<TextField
					id='contactus__message'
					label='Votre message'
					multiline
					maxRows={4}
					value={message}
					onChange={(input) => {
						setMessage(input.target.value);
					}}
				/>
			</FormControl>
			<Container className='contactus__button-container'>
				<Button color='warning' variant='contained' onClick={handleSendMessage}>
					Envoyer votre message
				</Button>
			</Container>
		</Box>
	);
};

export default ContactUs;
