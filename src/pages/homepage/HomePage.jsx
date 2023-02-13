import React from "react";
import { Header, AboutUs, CTA, ContactUs, Footer } from "../../containers";

import "./homepage.css";

const HomePage = () => {
  return (
    <div>
      <Header />
      <AboutUs />
      <CTA />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default HomePage;
