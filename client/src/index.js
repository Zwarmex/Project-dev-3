import React from 'react';
import App from './App';
import './index.css';
import { UserProvider } from './components';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
	<UserProvider>
		<App tab='home' />
	</UserProvider>
);
