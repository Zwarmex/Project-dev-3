import React from "react";
import "./loginpage.css";
import login from "../../assets/login.png";
import cadenas from "../../assets/cadenas.png";

const LoginPage = () => {
  const handleClickRegisterPage = () => {
    alert("register button clicked");
  };
  const handleClickLoginButton = () => {
    alert("Login button clicked");
  };
  return (
    <div className="recipe__form-page">
      <div className="recipe__form-container">
        <div className="recipe__form-login">
          <img src={login} alt="login-icon" />
          <input type="email" name="" id="" />
        </div>
        <div className="recipe__form-password">
          <img src={cadenas} alt="cadenas-icon" />
          <input type="password" name="" id="" />
        </div>
        <div className="recipe__form-login__btn">
          <button type="submit" onClick={() => handleClickLoginButton()}>
            LOGIN
          </button>
        </div>
        <div className="recipe__form-register">
          <p>Don't have an account yet ?</p>
          <button type="submit" onClick={() => handleClickRegisterPage()}>
            REGISTER NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
