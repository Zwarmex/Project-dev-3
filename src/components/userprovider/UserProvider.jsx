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
	const [abilityUser, setAbilityUser] = useState(
		localStorage.getItem('abilityUser') || null
	);
	const [tokenJWT, setTokenJWT] = useState(
		localStorage.getItem('tokenJWT') || null
	);

	useEffect(() => {
		const storedIdUser = localStorage.getItem('idUser');
		const storedMailUser = localStorage.getItem('mailUser');
		const storedAvatarUser = localStorage.getItem('avatarUser');
		const storedAbilityUser = localStorage.getItem('abilityUser');
		const storedTokenJWT = localStorage.getItem('tokenJWT');
		//get the id
		if (storedIdUser) {
			setIdUser(storedIdUser);
		}
		//get the mail
		if (storedMailUser) {
			setMailUser(storedMailUser);
		}
		//get the avatar
		if (storedAvatarUser) {
			setAvatarUser(storedAvatarUser);
		}
		//get the ability
		if (storedAbilityUser) {
			setAbilityUser(storedAbilityUser);
		}
		//get the ability
		if (storedTokenJWT) {
			setTokenJWT(storedTokenJWT);
		}
	}, []);

	const logout = () => {
		setIdUser(null);
		setMailUser(null);
		setAvatarUser(null);
		setAbilityUser(null);
		setTokenJWT(null);
		localStorage.removeItem('idUser');
		localStorage.removeItem('mailUser');
		localStorage.removeItem('avatarUser');
		localStorage.removeItem('abilityUser');
		localStorage.removeItem('tokenJWT');
	};

	return (
		<UserContext.Provider
			value={{
				idUser,
				mailUser,
				avatarUser,
				abilityUser,
				tokenJWT,
				setIdUser,
				setMailUser,
				setAvatarUser,
				setAbilityUser,
				setTokenJWT,
				logout,
			}}>
			{children}
		</UserContext.Provider>
	);
};

export default UserProvider;
