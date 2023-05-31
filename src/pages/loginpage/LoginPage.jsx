import React, { useState, useContext } from 'react';
import './loginpage.css';
import { UserContext, LoadingBars } from '../../components';
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
  TextField,
} from '@mui/material';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setIdUser, setAvatarUser, setMailUser, setAbilityUser, setTokenJWT } =
    useContext(UserContext);
  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [register, setRegister] = useState(0);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [loginPasswordError, setLoginPasswordError] = useState(false);
  const [registerPasswordError, setRegisterPasswordError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [birthdayError, setBirthdayError] = useState(false);
  const [loading, setLoading] = useState(false);
  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - 3,
    today.getMonth(),
    today.getDate()
  );
  const minDate = new Date(
    today.getFullYear() - 150,
    today.getMonth(),
    today.getDate()
  );

  const handleChangingLoginOrRegister = (isRegister) => {
    setRegister(isRegister);
    setErrorMessage('');
    setEmailError(false);
    setFirstNameError(false);
    setLastNameError(false);
    setLoginPasswordError(false);
    setRegisterPasswordError(false);
  };
  const handleClickShowLoginPassword = () => {
    setShowLoginPassword((show) => !show);
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleClickShowRegisterPassword = () => {
    setShowRegisterPassword((show) => !show);
  };
  const handleLogin = async () => {
    let errors = false;
    let errorMessageLogin = '';
    setErrorMessage(errorMessageLogin);

    if (!validateEmail(email)) {
      errorMessageLogin += '-Email invalide.\n';
      setEmailError(true);
      errors = true;
    } else {
      setEmailError(false);
    }

    if (loginPassword === '') {
      setLoginPasswordError(true);
      errors = true;
      errorMessageLogin += '-Il manque le mot de passe.\n';
    } else {
      setLoginPasswordError(false);
    }

    if (errors) {
      setErrorMessage(errorMessageLogin);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_END_POINT}user/account/${email}/${loginPassword}`
      );

      if (!response.ok) {
        setErrorMessage('Connection échouée');
        return;
      }

      const data = await response.json();
      setIdUser(data.result.idUser);
      setMailUser(data.result.mailUser);
      setAvatarUser(data.result.avatarUser);
      setAbilityUser(data.result.abilityUser);
      setTokenJWT(data.tokenJWT);
      localStorage.setItem('idUser', data.result.idUser);
      localStorage.setItem('mailUser', data.result.mailUser);
      localStorage.setItem('avatarUser', data.result.avatarUser);
      localStorage.setItem('abilityUser', data.result.abilityUser);
      localStorage.setItem('tokenJWT', data.tokenJWT);
      navigate('/');
    } catch (error) {
      setErrorMessage('Connection échouée');
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async () => {
    let errors = false;
    let errorMessageRegister = '';
    setErrorMessage(errorMessageRegister);
    if (!validateEmail(email)) {
      setEmailError(true);
      errors = true;
      errorMessageRegister += '- Email invalide\n';
    } else {
      setEmailError(false);
    }

    if (firstName === '') {
      setFirstNameError(true);
      errors = true;
      errorMessageRegister += '- Prénom invalide.\n';
    } else {
      setFirstNameError(false);
    }

    if (lastName === '') {
      setLastNameError(true);
      errors = true;
      errorMessageRegister += '- Nom de famille invalide.\n';
    } else {
      setLastNameError(false);
    }

    if (!validatePassword(loginPassword)) {
      setRegisterPasswordError(true);
      setLoginPasswordError(true);
      errors = true;
      errorMessageRegister +=
        '- Le mot de passe doit avoir 8 caractère minimum.\n';
    } else {
      setRegisterPasswordError(false);
      setLoginPasswordError(false);
      if (loginPassword !== registerPassword) {
        errors = true;
        errorMessageRegister += '- Les mots de passe ne sont pas identiques.\n';
        setRegisterPasswordError(true);
      }
    }
    if (!validateBirthday(birthday)) {
      setBirthdayError(true);
      errors = true;
      errorMessageRegister += '- Date de naissance invalide.\n';
    } else {
      setBirthdayError(false);
    }

    if (errors) {
      setErrorMessage(errorMessageRegister);
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_END_POINT}user/account`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mail: email,
            firstname: firstName,
            lastname: lastName,
            password: registerPassword,
            birthday: birthday,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          setErrorMessage("L 'utilisateur existe déjà");
        } else {
          // Display a more specific error message if available in the response
          setErrorMessage(errorData.message || 'Inscription échouée');
        }

        return;
      }
      handleLogin();
    } catch (error) {
      setErrorMessage('Inscription échouée');
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      register ? handleRegister() : handleLogin();
    }
  };
  const validateEmail = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  };
  const validatePassword = (password) => {
    return password.length >= 8;
  };
  const validateBirthday = (birthday) => {
    return birthday;
  };

  return (
    <>
      <CssBaseline />
      <Container
        className='login__form-container'
        maxWidth='false'
        sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box
          component='form'
          id='login__form-box'
          noValidate
          autoComplete='on'
          onKeyPress={handleKeyPress}>
          <Container maxWidth='false'>
            <Typography variant='h2'>
              {register ? 'Inscription' : 'Connection'}
            </Typography>
            <Typography variant='subtitle1' fontSize='medium'>
              {register
                ? 'Restez en lien avec la nourriture'
                : 'Connectez vous à votre compte'}
            </Typography>
            <Typography variant='subtitle1' color='error'>
              <pre style={{ fontFamily: 'inherit' }}>{errorMessage}</pre>
            </Typography>
          </Container>
          {register ? (
            <>
              <FormControl id='register__first-name' error={firstNameError}>
                <InputLabel htmlFor='register__first-name'>
                  <Typography>Prénom</Typography>
                </InputLabel>
                <OutlinedInput
                  onChange={(input) => setFirstName(input.target.value)}
                  id='register__first-name'
                  name='register__first-name'
                  type='text'
                  value={firstName}
                  label='Prénom'
                  required
                />
              </FormControl>
              <FormControl id='register__last-name' error={lastNameError}>
                <InputLabel htmlFor='register__last-name'>
                  <Typography>Nom de famille</Typography>
                </InputLabel>
                <OutlinedInput
                  onChange={(input) => setLastName(input.target.value)}
                  id='register__last-name'
                  name='register__last-name'
                  type='text'
                  value={lastName}
                  label='Nom de famille'
                  required
                />
              </FormControl>
              <TextField
                id='register__birthday'
                label='Date de naissance'
                type='date'
                value={birthday}
                onChange={(event) => setBirthday(event.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                error={birthdayError}
                inputProps={{
                  min: minDate.toISOString().split('T')[0], // Convert minDate to 'YYYY-MM-DD' format
                  max: maxDate.toISOString().split('T')[0], // Convert maxDate to 'YYYY-MM-DD' format
                }}
              />
            </>
          ) : null}
          <FormControl id='login__email' error={emailError}>
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
              required
            />
          </FormControl>
          <FormControl id='login__password' error={loginPasswordError}>
            <InputLabel htmlFor='input__password-login'>
              <Typography>Mot de passe</Typography>
            </InputLabel>
            <OutlinedInput
              onChange={(input) => setLoginPassword(input.target.value)}
              id='input__password-login'
              name='input__password-login'
              type={showLoginPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={handleClickShowLoginPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge='end'>
                    {showLoginPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              value={loginPassword}
              label='Mot de passe'
              required
            />
          </FormControl>
          {register ? (
            <FormControl
              id='register__password-copy'
              error={registerPasswordError}>
              <InputLabel htmlFor='input__password-register'>
                <Typography>Mot de passe</Typography>
              </InputLabel>
              <OutlinedInput
                onChange={(input) => setRegisterPassword(input.target.value)}
                id='input__password-register'
                name='input__password-register'
                type={showRegisterPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={handleClickShowRegisterPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge='end'>
                      {showRegisterPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                value={registerPassword}
                label='Mot de passe'
                required
              />
            </FormControl>
          ) : (
            <Container>
              <Typography
                variant='subtitle2'
                align='right'
                className='login__form-reset'>
                <NavLink to='/reset_password'>Mot de passe oublié ?</NavLink>
              </Typography>
            </Container>
          )}
          <Button
            className='login__form-buttons'
            type='reset'
            onClick={register ? handleRegister : handleLogin}
            color='warning'
            variant='contained'
            disabled={loading}>
            {loading ? null : register ? 'INSCRIPTION' : 'CONNECTION'}
            {loading && <LoadingBars />}
          </Button>
          <Box className='login__form-option-container'>
            <Typography variant='subtitle2' align='left'>
              {register ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
            </Typography>
            <Button
              size='small'
              variant='outlined'
              color='warning'
              onClick={
                register
                  ? () => handleChangingLoginOrRegister(false)
                  : () => handleChangingLoginOrRegister(true)
              }
              className='login__form-buttons login__form-option__buttons'>
              {register ? 'CONNECTION' : 'INSCRIPTION'}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
