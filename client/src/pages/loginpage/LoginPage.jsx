import React, { useState } from "react";
import "./loginpage.css";
import login from "../../assets/login.png";
import cadenas from "../../assets/cadenas.png";

const LoginPage = () => {
  const [register, setRegister] = useState(0);
  return (
    <div className="recipe__form-page">
      <div className="recipe__form-container">
        <div className="recipe__form-title">
          <h1>{register ? "Sign up" : "Sign in"}</h1>
          <p>Stay in touch with food</p>
        </div>
        <div className="recipe__form-field__login">
          <img src={login} alt="login-icon" />
          <input
            type="email"
            name=""
            id=""
            placeholder="Email"
            alt="Write you email"
            title="Write your email"
          />
        </div>
        <div className="recipe__form-field__password">
          <img src={cadenas} alt="cadenas-icon" />
          <input
            type="password"
            name=""
            id=""
            placeholder="Password"
            alt="Write you password"
            title="Write your password"
          />
        </div>
        {register ? (
          <div className="recipe__form-field__password">
            <img src={cadenas} alt="cadenas-icon" />
            <input
              type="password"
              name=""
              id=""
              placeholder="Password"
              alt="Write you password"
              title="Write your password"
            />
          </div>
        ) : (
          <div className="recipe__form-forget__password">
            <p>Forget you pwd ? (to be added)</p>
          </div>
        )}
        <div className="recipe__form-submit__btn">
          <button type="submit">
            {register ? "CREATE YOUR ACCOUNT" : "LOG IN"}
          </button>
        </div>
        <div className="recipe__form-option">
          <p>
            {register
              ? "Already have an account ?"
              : "Don't have an account yet ?"}
          </p>
          <button
            onClick={
              register ? () => setRegister(false) : () => setRegister(true)
            }
          >
            {register ? "SIGN IN" : "REGISTER NOW"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
