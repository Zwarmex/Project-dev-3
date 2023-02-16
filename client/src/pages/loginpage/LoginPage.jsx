import React, { useState } from "react";
import "./loginpage.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { AccountCircleOutlined, LockOutlined} from '@mui/icons-material';
import {
  IconButton,
  InputLabel,
  OutlinedInput,
  Alert,
  CssBaseline,
  Container,
  FormControl,
  InputAdornment,
  FormHelperText,
  Box,
  Button,
} from "@mui/material";

const LoginPage = () => {
  const [showPassword_login, setShowPassword_login] = React.useState(false);
  const [showPassword_register, setShowPassword_register] =
    React.useState(false);

  const handleClickShowPassword_login = () => {
    setShowPassword_login((show) => !show);
  };

  const handleClickShowPassword_register = () => {
    setShowPassword_register((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const HandleSubmitForm = () => {
    console.log("clicked");
    <Alert severity="success">
      This is a success alert — <strong>check it out!</strong>
    </Alert>;
  };
  const [register, setRegister] = useState(0);
  return (
    <>
      <CssBaseline />
      <Container className="login__form-container" maxWidth="false">
        <Box
          component="form"
          className="login__form-boxes"
          sx={{
            "& > :not(style)": { margin: 1 },
          }}
          noValidate
          autoComplete="on"
        >
          <Container maxWidth="false">
            <h1>{register ? "Sign up" : "Sign in"}</h1>
            <p>Stay in touch with food</p>
          </Container>
          <FormControl>
            <InputLabel htmlFor="input__mail">Email</InputLabel>
            <OutlinedInput
              id="input__mail"
              name="input__mail"
              type="email"
              label="Email"
            />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="input__password-login">Password</InputLabel>
            <OutlinedInput
              id="input__password-login"
              name="input__password-login"
              type={showPassword_login ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword_login}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword_login ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              required
            />
          </FormControl>
          {register ? (
            <FormControl>
              <InputLabel htmlFor="input__password-register">
                Password
              </InputLabel>
              <OutlinedInput
                id="input__password-register"
                name="input__password-register"
                type={showPassword_register ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword_register}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword_register ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
                required
              />
              <FormHelperText id="helper__password-register">
                Write your password
              </FormHelperText>
            </FormControl>
          ) : (
            <Container className="login__form-p">
              <p>Forget you pwd ?</p>
            </Container>
          )}
          <Button
            className="login__form-buttons"
            type="reset"
            onClick={HandleSubmitForm}
            color="warning"
            variant="contained"
          >
            {register ? "CREATE YOUR ACCOUNT" : "LOG IN"}
          </Button>
          <Container>
            <p>
              {register
                ? "Already have an account ?"
                : "Don't have an account yet ?"}
            </p>
          </Container>
          <Button
            variant="outlined"
            color="warning"
            onClick={
              register ? () => setRegister(false) : () => setRegister(true)
            }
            className="login__form-buttons"
          >
            {register ? "SIGN IN" : "REGISTER NOW"}
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default LoginPage;
