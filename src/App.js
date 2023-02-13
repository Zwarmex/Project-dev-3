import React, { useEffect, useState } from "react";
import { Navbar } from "./components";
import { Header, AboutUs, CTA, ContactUs, Footer } from "./containers";
import "./App.css";

const App = () => {

  useEffect(() => {
    fetch("http://localhost:8000/marmiton")
      .then((res) => res.json())
      .then((data) => console.log(data.json));
  }, []);
  return (
    <div className="App">
      <div className="gradient__bg">
        <Navbar />
        <Header />
      </div>
      <div>
        <AboutUs />
        <CTA />
        <ContactUs />
        <Footer />
      </div>
    </div>
  );
};

export default App;
