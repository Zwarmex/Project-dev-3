import React, { useContext, useState } from 'react';
import './usersettingspage.css';
import { ImageUpload, LoadingBars, UserContext } from '../../components';
import {
	Box,
	FormControl,
	InputLabel,
	OutlinedInput,
	Typography,
	InputAdornment,
	IconButton,
	Button,
	Container,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const UserSettingsPage = () => {
	const maxImageSize = 1024 * 1024; // 1MB
	const { idUser, setAvatarUser, tokenJWT, setTokenJWT, logout } =
		useContext(UserContext);
	const navigate = useNavigate();
	const [base64Avatar, setBase64Avatar] = useState(null);

	const [newPassword1, setNewPassword1] = useState('');
	const [newPassword2, setNewPassword2] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [errorStatus, setErrorStatus] = useState(false);
	const [infoMessage, setInfoMessage] = useState('');
	const [infoStatus, setInfoStatus] = useState(false);
	const [isAvatarAddButtonDisabled, setIsAvatarAddButtonDisabled] =
		useState(false);
	const [newPassword1Error, setNewPassword1Error] = useState(false);
	const [newPassword2Error, setNewPassword2Error] = useState(false);
	const [showNewPassword1, setShowNewPassword1] = useState(false);
	const [showNewPassword2, setShowNewPassword2] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);
	const [avatarLoading, setAvatarLoading] = useState(false);

	const handleClickShowNewPassword1 = () => {
		setShowNewPassword1((show) => !show);
	};
	const handleClickShowNewPassword2 = () => {
		setShowNewPassword2((show) => !show);
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const handleAvatarUpload = (base64, fileSize) => {
		setBase64Avatar(base64);
		// setAvatarSize(fileSize);
		if (fileSize > maxImageSize) {
			setIsAvatarAddButtonDisabled(true);
			setErrorStatus(true);
			setErrorMessage(
				"La taille de l'image dépasse la limite de 1MB. Charger une image plus petite s'il vous plaît."
			);
		} else {
			setIsAvatarAddButtonDisabled(false);
			setErrorMessage('');
			setErrorStatus(false);
		}
	};
	const handlePasswordChanging = async () => {
		let newPassword1HasError = false;
		let newPassword2HasError = false;
		let errorMessagePasswordChanging = '';
		if (!validatePassword(newPassword1)) {
			newPassword2HasError = true;
			newPassword1HasError = true;
			errorMessagePasswordChanging +=
				'- Le nouveau mot de passe doit contenir 8 caractères minimum.\n';
		}
		if (newPassword2 !== newPassword1) {
			newPassword1HasError = true;
			newPassword2HasError = true;
			errorMessagePasswordChanging +=
				'- Les deux nouveaux mots de passe doivent être identiques.\n';
		}
		setErrorMessage(errorMessagePasswordChanging);
		setNewPassword1Error(false);
		setNewPassword2Error(false);
		if (errorMessagePasswordChanging !== '') {
			setErrorStatus(true);
			if (newPassword1HasError) {
				setNewPassword1Error(true);
			}
			if (newPassword2HasError) {
				setNewPassword2Error(true);
			}
			return;
		}
		setErrorStatus(false);
		setPasswordLoading(true);

		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_END_POINT}user/account/newPassword/${idUser}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						authorization: tokenJWT,
					},
					body: JSON.stringify({
						password: newPassword1,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				setTokenJWT(data.tokenJWT);
				localStorage.setItem('tokenJWT', data.tokenJWT);

				setInfoStatus(true);
				setInfoMessage('Changement de mot de passe effectué');
			} else if (response.status === 401) {
				logout();
				navigate('/login');
			} else {
				setErrorMessage('Connection échouée');
				setErrorStatus(true);
			}
		} catch {
			setErrorStatus(true);
			setErrorMessage('Problèmes dans le changement de mot de passe');
		} finally {
			setPasswordLoading(false);
		}
	};
	const handleAvatarChanging = async () => {
		setAvatarLoading(true);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_END_POINT}user/${idUser}/updateAvatar`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						authorization: tokenJWT,
					},
					body: JSON.stringify({
						avatar: base64Avatar,
					}),
				}
			);

			if (response.ok) {
				const data = await response.json();
				setTokenJWT(data.tokenJWT);
				localStorage.setItem('tokenJWT', data.tokenJWT);
				setInfoStatus(true);
				setInfoMessage('Votre avatar a été mis a jour.');
				setAvatarUser(base64Avatar);
			} else if (response.status === 401) {
				logout();
				navigate('/login');
			} else {
				setErrorMessage('Erreur dans la modification de votre avatar.');
				setErrorStatus(true);
			}
		} catch {
			setErrorMessage('Erreur dans la modification de votre avatar.');
			setErrorStatus(true);
		} finally {
			setAvatarLoading(false);
		}
	};
	const validatePassword = (newPassword) => {
		return newPassword.length >= 8;
	};

	return (
		<Container className='settings__page-container'>
			{errorStatus && (
				<Typography component='h1' color='error'>
					<pre style={{ fontFamily: 'inherit' }}>{errorMessage}</pre>
				</Typography>
			)}
			{infoStatus && (
				<Typography component='h1' color='warning'>
					<pre style={{ fontFamily: 'inherit' }}>{infoMessage}</pre>
				</Typography>
			)}
			<Box className='settings__avatar-container'>
				<Box component='form' className='settings__box-avatar'>
					<Typography component='p' variant='h5' className='settings__p-title'>
						Ajouter un avatar :
					</Typography>
					<Box className='settings__avatar-uploader'>
						<ImageUpload onImageUpload={handleAvatarUpload} />
					</Box>
					<Button
						className='settings__button-avatar'
						type='reset'
						onClick={handleAvatarChanging}
						color='warning'
						variant='contained'
						disabled={avatarLoading || isAvatarAddButtonDisabled}>
						{avatarLoading ? <LoadingBars /> : 'Ajouter ou modifier son avatar'}
					</Button>
				</Box>
			</Box>
			<Box className='settings__password-container'>
				<Box component='form' className='settings__box-password'>
					<Typography component='p' variant='h5' className='settings__p-title'>
						Changez votre mot de passe :
					</Typography>
					<FormControl
						disabled={passwordLoading}
						id='settings__password-new1-form'
						error={newPassword1Error}>
						<InputLabel htmlFor='seetings__password-new'>
							<Typography>Nouveau mot de passe</Typography>
						</InputLabel>
						<OutlinedInput
							onChange={(input) => setNewPassword1(input.target.value)}
							id='settings__password-new'
							name='settings__password-new'
							type={showNewPassword1 ? 'text' : 'password'}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleClickShowNewPassword1}
										onMouseDown={handleMouseDownPassword}
										edge='end'>
										{showNewPassword1 ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
							value={newPassword1}
							label='Nouveau mot de passe'
							required
						/>
					</FormControl>
					<FormControl
						disabled={passwordLoading}
						id='settings__password-new2-form'
						error={newPassword2Error}>
						<InputLabel htmlFor='seetings__password-new2'>
							<Typography>Répéter le nouveau mot de passe</Typography>
						</InputLabel>
						<OutlinedInput
							onChange={(input) => setNewPassword2(input.target.value)}
							id='settings__password-new2'
							name='settings__password-new2'
							type={showNewPassword2 ? 'text' : 'password'}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={handleClickShowNewPassword2}
										onMouseDown={handleMouseDownPassword}
										edge='end'>
										{showNewPassword2 ? <Visibility /> : <VisibilityOff />}
									</IconButton>
								</InputAdornment>
							}
							value={newPassword2}
							label='Répéter le nouveau mot de passe'
							required
						/>
					</FormControl>
					<Button
						className='settings__form-button'
						type='reset'
						onClick={handlePasswordChanging}
						variant='contained'
						color='warning'
						disabled={passwordLoading}>
						{passwordLoading ? <LoadingBars /> : 'Changer de mot de passe'}
					</Button>
				</Box>
			</Box>
		</Container>
	);
};

export default UserSettingsPage;
