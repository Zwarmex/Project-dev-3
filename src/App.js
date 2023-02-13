import React from "react";
import { Navbar } from "./components";
import { LoginPage, HomePage, MarketPage, WheelPage } from "./pages";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";

const App = () => {
  let isConnected = true;

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isConnected={isConnected} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketPage />} />
          <Route path="/wheel" element={<WheelPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
