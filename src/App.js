import React from "react";

import { Navbar } from "./components";
import { Header, AboutUs, CTA, ContactUs, Footer } from "./containers";
import "./App.css";

const App = () => {
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
