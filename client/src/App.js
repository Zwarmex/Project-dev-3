import React from 'react';
import { Navbar } from './components';
import {
	LoginPage,
	HomePage,
	MarketPage,
	WheelPage,
	CalendarPage,
	ResetPasswordPage,
	RecipePage,
	AddRecipePage,
} from './pages';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

const App = () => {
	return (
		<div className='App'>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/marketplace' element={<MarketPage />} />
					<Route path='/wheel' element={<WheelPage />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/calendar' element={<CalendarPage />} />
					<Route path='/reset_password' element={<ResetPasswordPage />} />
					<Route path='/recipe/:id' element={<RecipePage />} />
					<Route path='/recipe_add' element={<AddRecipePage />} />
				</Routes>
			</BrowserRouter>
		</div>
	);
};

export default App;
