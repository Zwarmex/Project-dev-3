import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Container,
  InputLabel,
  CssBaseline,
  Button,
  OutlinedInput,
  FormControl,
  Typography,
} from "@mui/material";
import "./resetpasswordpage.css";
import { Box } from "@mui/system";
function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  return (
    <>
      <CssBaseline />
      <Container className="reset__form-page" sx={{ display: "flex" }}>
        <Box
          sx={{
            padding: "5%",
            "& > :not(style)": { margin: 1 },
          }}
          noValidate
          autoComplete="on"
          component="form"
          className="reset__form-container"
        >
          <FormControl id="input_mail" color="warning">
            <InputLabel htmlFor="input__mail">Email</InputLabel>
            <OutlinedInput
              id="input_mail"
              name="input_mail"
              type="email"
              value={email}
              label="Email"
              // color='warning'
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl color="warning">
            <Button color="warning" variant="contained" className="reset__btn">
              {" "}
              Send email
            </Button>
          </FormControl>
          <Container>
            <Typography
              variant="subtitle2"
              align="right"
              className="login__form-reset"
            >
              <NavLink to="/login">Don't have an account ?</NavLink>
            </Typography>
          </Container>
        </Box>
      </Container>
    </>
  );
}
export default ResetPasswordPage;
