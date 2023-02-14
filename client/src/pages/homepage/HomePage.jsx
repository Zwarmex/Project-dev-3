import React from "react";
import { Header, CTA, Footer } from "../../containers";

import "./homepage.css";

const HomePage = () => {
  return (
    <div>
      <Header />
      <CTA />
      <div className="homepage__footer-container">
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
