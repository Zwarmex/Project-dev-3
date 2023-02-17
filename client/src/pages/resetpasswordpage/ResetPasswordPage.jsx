import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { auth, sendPasswordReset } from '../../assets/firebase/firebase';
import './resetpasswordpage.css';
function ResetPasswordPage() {
	const [email, setEmail] = useState('');
	const [user, loading] = useAuthState(auth);
	const navigate = useNavigate();
	useEffect(() => {
		if (loading) return;
		if (user) navigate('/dashboard');
	}, [user, loading, navigate]);
	return (
		<div className='reset'>
			<div className='reset__container'>
				<input
					type='text'
					className='reset__textBox'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder='E-mail Address'
				/>
				<button className='reset__btn' onClick={() => sendPasswordReset(email)}>
					Send password reset email
				</button>
				<div>
					Don't have an account? <Link to='/login'>Register</Link> now.
				</div>
			</div>
		</div>
	);
}
export default ResetPasswordPage;
