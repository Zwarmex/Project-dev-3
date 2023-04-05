import React, { useState } from 'react';
import './loginpage.css';
import { NavLink } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import GoogleIcon from '@mui/icons-material/Google';
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
	const [errorLogin] = useState('');
	const [name, setName] = useState('');
	const [register, setRegister] = useState(0);

	const handleClickShowPassword = () => {
		setShowPassword((show) => !show);
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
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
							{errorLogin ? 'There was an error.' : null}
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
						onClick={() => {
							'';
						}}
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
