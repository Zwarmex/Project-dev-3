import React, { useState, useEffect } from 'react';
import { UserContext } from '../../components';

const UserProvider = ({ children }) => {
	const [idUser, setIdUser] = useState(localStorage.getItem('idUser') || null);
	const [mailUser, setMailUser] = useState(
		localStorage.getItem('mailUser') || null
	);
	const [avatarUser, setAvatarUser] = useState(
		localStorage.getItem('avatarUser') || null
	);

	useEffect(() => {
		const storedIdUser = localStorage.getItem('idUser');
		const storedMailUser = localStorage.getItem('mailUser');
		const storedAvatarUser = localStorage.getItem('avatarUser');
		//get the id
		if (storedIdUser) {
			setIdUser(storedIdUser);
		}
		//get the mail
		if (storedMailUser) {
			setIdUser(storedMailUser);
		}
		//get the avatar
		if (storedAvatarUser) {
			setAvatarUser(storedAvatarUser);
		}
	}, []);

	const logout = () => {
		setIdUser(null);
		setMailUser(null);
		setAvatarUser(null);
		localStorage.removeItem('idUser');
		localStorage.removeItem('mailUser');
		localStorage.removeItem('avatarUser');
	};

	return (
		<UserContext.Provider
			value={{
				idUser,
				mailUser,
				avatarUser,
				setIdUser,
				setMailUser,
				setAvatarUser,
				logout,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
