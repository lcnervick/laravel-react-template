import React,  { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../contexts/AuthContext';

import '../../css/components/LoginForm.css';

export default function LoginForm() {
	const { user, login, reset, setPassword} = useAuth();

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/members";

	// see if the password reset token has been set and process
	const newPassword = sessionStorage.getItem('passwordResetToken');
	const [passwordResetEmail, passwordResetToken] = newPassword ? newPassword.split('|') : ['',''];
	if(newPassword) console.log('token', passwordResetToken, 'email', passwordResetEmail);
	
	// if the user is resetting their password show only the email address field
	const [passwordReset, setPasswordReset] = useState(false);

	const [formData, setFormData] = useState({ email: passwordResetEmail, password: '', confirm: '', token: passwordResetToken });
	const [errors, setErrors] = useState({ email: '', password: '', confirm: '', server: '' });
	const [showErrors, setShowErrors] = useState(false);


	const validate = (key, test, msg) => {
		setErrors(prev => ({...prev, server: ''}));
		if (!test) {
			setErrors(prev => ({...prev, [key]: msg}));
		} else setErrors(prev => ({...prev, [key]: ''}));
	};

	useEffect(() => {
		const { email, password, confirm } = formData;
		const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
		validate('email', emailRegex.test(email), 'Invalid email address');
		if(!passwordReset) validate('password', password.trim(), 'Password is required');
		if (newPassword) validate('confirm', confirm.trim() && confirm.trim() === password.trim(), 'Passwords Must Match');
	}, [formData]);

	const handleInputChange = (e) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { email, password, confirm, token } = formData;

		setShowErrors(true);
		const noErrors = Object.keys(errors).every(error => error === 'server' || errors[error] === '');
		// PASSWORD RESET
		if (passwordReset && noErrors) {
			try {
				await reset(email);
				setPasswordReset(false);
				setErrors({email: '', password: '', confirm: '', server: 'Please check your email for a link to reset your password. If you do not receive it in the next 5 minutes, check your spam folder and try again.'});
			} catch(error) {
				setErrors(prev => ({...prev, server: error}));
			}
		}
		// CREATE NEW PASSWORD
		else if (newPassword && noErrors) {
			try {
				let response = await setPassword(email, password, confirm, token);
				console.log("Response", response);
				setErrors({email: '', password: '', confirm: '', server: 'Password Reset Successfully. Please log in to continue.'});
			} catch(error) {
				console.log('Error', error ?? '')
				setErrors(prev => ({...prev, server: error}));
			}
			sessionStorage.removeItem('passwordResetToken');
		}
		// NORMAL LOGIN
		else if (noErrors) { // Submit the form or perform other actions
			try {
				await login(email, password);
				navigate(from, {replace: true});
			} catch(error) {
				setErrors(prev => ({...prev, server: error.message}));
			}
		}
		else console.log('Unknown errors', errors);
	};

	const handlePasswordReset = (e) => {
		e.preventDefault();
		setErrors({ email: '', password: '', confirm: '', server: '' });
		setPasswordReset(true);
	}

	return (<section className="login-section">
	<div className='login-container'>
		<h1>{ passwordReset 
				? 'Reset Your Password'
				: ( newPassword 
					? 'Change Password'
					: 'Member Log-In'
				) }</h1>
		<form
			onSubmit={handleSubmit}
			className='login-form'>
			<div>
				<label>Email Address:</label>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleInputChange}
					placeholder="Email Address"
					readOnly={!!newPassword} />
				<div className="error">{showErrors && errors.email}</div>
			</div>
			
			{
				passwordReset ? null : (<>
					<div>
						<label>Password:</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							placeholder="Password" />
						<div className="error">{showErrors && errors.password}</div>
					</div>

					{ 
						newPassword 
							? (	<div>
									<label>Confirm:</label>
									<input
										type="password"
										name="confirm"
										value={formData.confirm}
										onChange={handleInputChange}
										placeholder="Confirm Password" />
									<div className="error">{showErrors && errors.confirm}</div>
								</div>) 
							: null

					}
				</>)
			}

			<div>
				<div className="error">{errors.server}</div>
			</div>

			<button
				className='button light-button inverted'
				type="submit">{passwordReset ? 'Reset Password' : (newPassword ? 'Set Password' : 'Log-In')}</button>

			{ passwordReset
				? (<button className='button light-button' style={{margin:0}} onClick={(e) => {setPasswordReset(false);}}>Cancel</button>) 
				: ( newPassword ? null : <div className='forgot-password'><Link to="/password-reset" onClick={handlePasswordReset}>I forgot my password</Link></div>)
			}

		</form>
	</div>
	</section>);

}
