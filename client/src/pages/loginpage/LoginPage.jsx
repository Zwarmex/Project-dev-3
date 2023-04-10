import React, { useState, useContext } from 'react';
import './loginpage.css';
import { UserContext } from '../../components';
import { NavLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	IconButton,
	InputLabel,
	OutlinedInput,
	CssBaseline,
	Container,
	FormControl,
	InputAdornment,
	Box,
	Button,
	Typography,
} from '@mui/material';

const LoginPage = () => {
	const navigate = useNavigate();
	const { setIdUser } = useContext(UserContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [name, setName] = useState('');
	const [register, setRegister] = useState(0);

	const handleClickShowPassword = () => {
		setShowPassword((show) => !show);
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const handleLogin = async () => {
		// Validate the email before proceeding
		if (!validateEmail(email)) {
			setError('Invalid email');
			console.log('error');
			return;
		}

		// Perform the login process, for example, by making an API call
		try {
			const response = await fetch(
				`https://recipesappfunctions.azurewebsites.net/api/user/${email}/${password}`,
				{
					method: 'get',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (!response.ok) {
				setError('Login failed');
			}

			const data = await response.json();

			// Set the idUser in the context and store it in localStorage
			setIdUser(data.idUser);
			localStorage.setItem('idUser', data.idUser);
			navigate('/');
		} catch (error) {
			console.error('Login error:', error.message);
		}
	};

	const handleRegister = async () => {};
	const validateEmail = (email) => {
		const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
		return emailRegex.test(email);
	};

	return (
		<>
			<CssBaseline />
			<Container className='login__form-container' maxWidth='false'>
				<Box
					component='form'
					className='login__form-boxes'
					sx={{
						'& > :not(style)': { margin: 1 },
					}}
					noValidate
					autoComplete='on'>
					<Container maxWidth='false'>
						<Typography variant='h2'>
							{register ? 'Sign up' : 'Sign in'}
						</Typography>
						<Typography variant='subtitle1' fontSize='medium'>
							Stay in touch with food
						</Typography>
						<Typography variant='subtitle1' color='error'>
							{error ? error : null}
						</Typography>
					</Container>
					{register ? (
						<FormControl id='register__name'>
							<InputLabel htmlFor='register__name'>
								<Typography>Full Name</Typography>
							</InputLabel>
							<OutlinedInput
								onChange={(input) => setName(input.target.value)}
								id='register__name'
								name='register__name'
								type='text'
								value={name}
								label='Full Name'
							/>
						</FormControl>
					) : null}
					<FormControl id='login__email'>
						<InputLabel htmlFor='input__mail'>
							<Typography>Email</Typography>
						</InputLabel>
						<OutlinedInput
							onChange={(input) => setEmail(input.target.value)}
							id='input__mail'
							name='input__mail'
							type='email'
							value={email}
							label='Email'
						/>
					</FormControl>
					<FormControl id='login__password'>
						<InputLabel htmlFor='input__password-login'>
							<Typography>Password</Typography>
						</InputLabel>
						<OutlinedInput
							onChange={(input) => setPassword(input.target.value)}
							id='input__password-login'
							name='input__password-login'
							type={showPassword ? 'text' : 'password'}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge='end'>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
							value={password}
							label='Password'
							required
						/>
					</FormControl>
					{!register ? (
						<Container>
							<Typography
								variant='subtitle2'
								align='right'
								className='login__form-reset'>
								<NavLink to='/reset_password'>Forgot your password ?</NavLink>
							</Typography>
						</Container>
					) : null}
					<Button
						className='login__form-buttons'
						type='reset'
						onClick={register ? handleRegister : handleLogin} // Replace the empty function with handleLogin
						color='warning'
						variant='contained'>
						{register ? 'CREATE YOUR ACCOUNT' : 'LOG IN'}
					</Button>

					<Container
						className='login__form-option'
						sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Typography variant='subtitle2' align='left'>
							{register
								? 'Already have an account ?'
								: "Don't have an account yet ?"}
						</Typography>
						<Button
							size='small'
							variant='outlined'
							color='warning'
							onClick={
								register ? () => setRegister(false) : () => setRegister(true)
							}
							className='login__form-buttons login__form-option__buttons'>
							{register ? 'SIGN IN' : 'REGISTER NOW'}
						</Button>
					</Container>
				</Box>
			</Container>
		</>
	);
};

export default LoginPage;
