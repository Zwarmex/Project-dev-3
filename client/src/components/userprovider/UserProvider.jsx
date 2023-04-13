import React, { useState, useEffect } from 'react';
import { UserContext } from '../../components';

const UserProvider = ({ children }) => {
	const [idUser, setIdUser] = useState(localStorage.getItem('idUser') || null);
	const [avatarUser, setAvatarUser] = useState(
		localStorage.getItem('avatarUser') || null
	);

	useEffect(() => {
		// Retrieve the idUser from local storage or authenticate the user
		// and set the state accordingly.
		// For example:
		const storedIdUser = localStorage.getItem('idUser');
		const storedAvatarUser = localStorage.getItem('avatarUser');
		if (storedIdUser) {
			setIdUser(storedIdUser);
		}
		if (storedAvatarUser) {
			setAvatarUser(storedAvatarUser);
		}
	}, []);

	const logout = () => {
		setIdUser(null);
		setAvatarUser(null);
		localStorage.removeItem('idUser');
		localStorage.removeItem('avatarUser');
	};

	return (
		<UserContext.Provider
			value={{ idUser, setIdUser, logout, avatarUser, setAvatarUser }}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
