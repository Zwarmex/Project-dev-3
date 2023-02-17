import React, { useState, useEffect } from 'react';
import './loginpage.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	auth,
	logInWithEmailAndPassword,
	logInWithGoogle,
	registerWithEmailAndPassword,
} from '../../assets/firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
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
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [user, loading, error] = useAuthState(auth);
	const [name, setName] = useState('');

	const navigate = useNavigate();
	useEffect(() => {
		if (loading) {
			// maybe trigger a loading screen
			return;
		}
		if (user) navigate('/');
	}, [user, loading, navigate]);

	const handleClickShowPassword = () => {
		setShowPassword((show) => !show);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const [register, setRegister] = useState(0);

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
						<h1>{register ? 'Sign up' : 'Sign in'}</h1>
						<p>Stay in touch with food</p>
						<p>{error}</p>
					</Container>
					<FormControl id='login__password'>
						<InputLabel htmlFor='input__mail'>Email</InputLabel>
						<OutlinedInput
							onChange={(input) => setEmail(input.target.value)}
							id='input__mail'
							name='input__mail'
							type='email'
							value={email}
							label='Email'
						/>
					</FormControl>
					<FormControl id='login__email'>
						<InputLabel htmlFor='input__password-login'>Password</InputLabel>
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
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
							value={password}
							label='Password'
							required
						/>
					</FormControl>
					{register ? (
						<FormControl id='register__name'>
							<InputLabel htmlFor='input__name-register'>Full Name</InputLabel>
							<OutlinedInput
								id='input__name-register'
								onClick={(input) => setName(input.target.value)}
								value={name}
								name='input__name-register'
								type='text'
								label='Full Name'
								required
							/>
						</FormControl>
					) : (
						<Container className='login__form-password__reset'>
							<NavLink to='/reset_password'>Forget you pwd ?</NavLink>
						</Container>
					)}
					<Button
						className='login__form-buttons'
						type='reset'
						onClick={
							register
								? () => {
										if (registerWithEmailAndPassword(name, email, password)) {
										}
								  }
								: () => logInWithEmailAndPassword(email, password)
						}
						color='warning'
						variant='contained'>
						{register ? 'CREATE YOUR ACCOUNT' : 'LOG IN'}
					</Button>
					<hr />
					<Button
						className='login__form-buttons'
						variant='contained'
						onClick={logInWithGoogle}>
						{register ? 'Register with Google' : 'Login with Google'}
					</Button>
					<hr />
					<Container
						className='login__form-option'
						sx={{ display: 'flex', placeContent: 'center' }}>
						<Typography fontSize='small'>
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
