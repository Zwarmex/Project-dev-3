import React, { useState, useEffect } from 'react';
import { UserContext } from '../../components';

const UserProvider = ({ children }) => {
	const [idUser, setIdUser] = useState(localStorage.getItem('idUser') || null);

	useEffect(() => {
		// Retrieve the idUser from local storage or authenticate the user
		// and set the state accordingly.
		// For example:
		const storedIdUser = localStorage.getItem('idUser');
		if (storedIdUser) {
			setIdUser(storedIdUser);
		}
	}, []);

	const logout = () => {
		setIdUser(null);
		localStorage.removeItem('idUser');
	};

	return (
		<UserContext.Provider value={{ idUser, setIdUser, logout }}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
