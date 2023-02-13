import React, { useEffect, useState } from "react";
import { Navbar } from "./components";
import { LoginPage, HomePage, MarketPage, WheelPage } from "./pages";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";

const App = () => {
<<<<<<< HEAD
  let isConnected = true;

=======

  useEffect(() => {
    fetch("http://localhost:8000/marmiton")
      .then((res) => res.json())
      .then((data) => console.log(data.json));
  }, []);
>>>>>>> d5d2d6a (test of server node.js)
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
