import React from "react";
import "./loginpage.css";
import login from "../../assets/login.png";
import cadenas from "../../assets/cadenas.png";

const LoginPage = () => {
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
          <button type="submit">LOGIN</button>
        </div>
        <div className="recipe__form-register">
          <p>Don't have an account yet ?</p>
          <button type="submit">REGISTER NOW</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
