import React from "react";
import { Navbar } from "./components";
import {
  LoginPage,
  HomePage,
  MarketPage,
  WheelPage,
  CalendarPage,
  ResetPasswordPage,
  RecipePage,
  AddRecipePage,
  UserRecipesPage,
  UserSettingsPage,
  FavoritePage,
} from "./pages";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Box } from "@mui/material";

const App = () => {
  return (
    <Box id="App" className="scrollbars">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketPage />} />
          <Route path="/wheel" element={<WheelPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/reset_password" element={<ResetPasswordPage />} />
          <Route path="/recipe/:idRec" element={<RecipePage />} />
          <Route path="/recipe_add" element={<AddRecipePage />} />
          <Route path="/user_recipes" element={<UserRecipesPage />} />
          <Route path="/settings" element={<UserSettingsPage />} />
          <Route path="/favoritepage" element={<FavoritePage />} />
        </Routes>
      </BrowserRouter>
    </Box>
  );
};

export default App;
