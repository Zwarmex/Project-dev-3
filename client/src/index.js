import React from 'react';
import App from './App';
import './index.css';
import { UserProvider } from './components';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';

const root = createRoot(document.getElementById('root'));
root.render(
	<UserProvider>
		<CssBaseline />
		<App tab='home' />
	</UserProvider>
);
