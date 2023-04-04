import React from "react";
import { Navbar } from "./components";
import {
  LoginPage,
  HomePage,
  MarketPage,
  WheelPage,
  CalendarPage,
  ResetPasswordPage,
  ContactUsPage,
  AboutUsPage,
} from "./pages";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";

const App = () => {
  const isConnected = false;
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isConnected={isConnected} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/contact-us" element={<ContactUsPage />} />
          <Route path="/wheel" element={<WheelPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/reset_password" element={<ResetPasswordPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
