import React from "react";
import { Header, AboutUs, CTA, ContactUs, Footer } from "../../containers";

import "./homepage.css";

const HomePage = () => {
  return (
    <div>
      <Header />
      <ContactUs />
      <CTA />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default HomePage;
