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

const UserSettingsPage = () => {
	const maxImageSize = 1024 * 1024; // 1MB
	const { idUser } = useContext(UserContext);
	const [base64Image, setBase64Image] = useState(null);
	const [imageSize, setImageSize] = useState(null);
	const [newPassword1, setNewPassword1] = useState('');
	const [newPassword2, setNewPassword2] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [infoMessage, setInfoMessage] = useState('');
	const [isImgAddButtonDisabled, setIsImgAddButtonDisabled] = useState(false);
	const [newPassword1Error, setNewPassword1Error] = useState(false);
	const [newPassword2Error, setNewPassword2Error] = useState(false);
	const [showNewPassword1, setShowNewPassword1] = useState(false);
	const [showNewPassword2, setShowNewPassword2] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);
	const [imgLoading, setImgLoading] = useState(false);

	const handleClickShowNewPassword1 = () => {
		setShowNewPassword1((show) => !show);
	};
	const handleClickShowNewPassword2 = () => {
		setShowNewPassword2((show) => !show);
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const handleImageUpload = (base64, fileSize) => {
		setBase64Image(base64);
		setImageSize(fileSize);
		setIsImgAddButtonDisabled(fileSize > maxImageSize);
	};
	const handlePasswordChanging = async () => {
		let newPassword1HasError = false;
		let newPassword2HasError = false;
		let errorMessagePasswordChanging = '';
		if (!validatePassword(newPassword1)) {
			newPassword1HasError = true;
			errorMessagePasswordChanging +=
				'- Le nouveau mot de pase doit contenir 8 caractères minimum.\n';
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
			// if (loginPasswordHasError) {
			// 	setLoginPasswordError(true);
			// }
			if (newPassword1HasError) {
				setNewPassword1Error(true);
			}
			if (newPassword2HasError) {
				setNewPassword2Error(true);
			}
			return;
		}
		setPasswordLoading(true);
		const userData = {
			password: newPassword1,
		};
		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userData),
		};
		try {
			const response = await fetch(
				`https://recipesappfunctions.azurewebsites.net/api/user/account/newPassword/${idUser}`,
				requestOptions
			);

			if (!response.ok) {
				setErrorMessage('Connection échouée');
			}
			if (response.ok) {
				setInfoMessage('Changement de mot de passe effectué');
			}
		} catch {
			setErrorMessage('Problèmes dans le changement de mot de passe');
		} finally {
			setPasswordLoading(false);
		}
	};
	const handleImgChanging = async () => {
		setImgLoading(true);
	};
	const validatePassword = (newPassword) => {
		return newPassword.length >= 8;
	};

	return (
		<div className='settings__page-container'>
			<Typography component='h1' color='error'>
				<pre style={{ fontFamily: 'inherit' }}>{errorMessage}</pre>
			</Typography>
			<div className='settings__img-container'>
				<Box component='form' className='settings__box-img'>
					<p className='settings__p-title'>Ajouter un avatar :</p>
					<div className='settings__img-uploader'>
						<ImageUpload onImageUpload={handleImageUpload} />
					</div>
					<Button
						className='settings__button-img'
						type='reset'
						onClick={handleImgChanging}
						color='warning'
						variant='contained'
						disabled={imgLoading || isImgAddButtonDisabled}
						sx={{ margin: '1%' }}>
						{imgLoading ? <LoadingBars /> : 'Ajouter ou modifier son avatar'}
					</Button>
				</Box>
			</div>
			<div className='settings__password-container'>
				<Box component='form' className='settings__box-password'>
					<p className='settings__p-title'>Changez votre mot de passe :</p>
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
						disabled={passwordLoading}
						sx={{ margin: '1%' }}>
						{passwordLoading ? <LoadingBars /> : 'Changer de mot de passe'}
					</Button>
				</Box>
			</div>
		</div>
	);
};

export default UserSettingsPage;
