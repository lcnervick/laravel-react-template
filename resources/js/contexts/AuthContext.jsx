import { useState, useMemo, useContext, createContext } from 'react';
import axios from 'axios';
import usePleaseWait from './PleaseWait';

const AuthContext = createContext({
	user: null,
	verified: null,
	verify: () => {},
	login: () => {},
	logout: () => {},
	reset: () => {},
	setPassword: () => {}
});

export function AuthProvider({children}) {
	const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user') ?? null));
	const [verified, setVerified] = useState(false);
	const { waiting } = usePleaseWait();
	
	const saveUser = userData => {
		if (userData) {
			sessionStorage.setItem('user', JSON.stringify(userData));
		} else {
			sessionStorage.removeItem('user');
		}
		setUser(userData);
	};

	const login = async (email, password) => {
		return new Promise((success, fail) => {
			waiting(true);
			axios.post('/login', { email, password })
				.then(response => {
					if (response.data.success) { 
						saveUser(response.data.user);
						success(response.data);
					} else {
						console.log('Login failed: ', response.data);
						fail(response.data);
					}
				})
				.catch(error => { // Handle network errors (e.g., show a network error message)
					console.log('Login failed: validation error');
					if (error.response?.data?.errors ?? null) {
						fail(error.response.data);
					}
				})
				.finally(() => {
					waiting(false);
				})
			});

	}

	const logout = async () => {
		waiting(true);
		axios.post('/logout')
		.then(response => {
			if (response.data.success) { // Handle successful form submission (e.g., show a success message)
				saveUser(null);
			}
			else { // Handle server-side errors (e.g., display an error message)
				console.log('Logout failed: processing error');
			}
		})
		.catch(error => { // Handle network errors (e.g., show a network error message)
			console.log('Logout failed: ' + error);
		})
		.finally(() => {
			waiting(false);
		})
	}

	const reset = async (email) => {
		return new Promise((success, fail) => {
			waiting(true);
			axios.post('/reset-password', {email})
			.then(response => {
				if (response.data.success) { // Handle successful form submission (e.g., show a success message)
					success(response.data);
				}
				else { // Handle server-side errors (e.g., display an error message)
					console.log('Password Reset Failed: processing error');
					fail(response.data.error);
				}
			})
			.catch(error => { // Handle network errors (e.g., show a network error message)
				console.log('Password Reset Failed: Please check your email address and try again.');
				fail('Password Reset Failed: Please check your email address and try again.');
			})
			.finally(() => {
				waiting(false);
			})
		})
	}

	const setPassword = async (email, password, confirm, token) => {
		return new Promise((success, fail) => {
			waiting(true);
			axios.post('/reset-password', {email, password, confirm, token})
			.then(response => {
				if (response.data.success) { // Handle successful form submission (e.g., show a success message)
					success(response.data);
				}
				else { // Handle server-side errors (e.g., display an error message)
					console.log('Password Reset Failed: processing error');
					fail(response.data.error);
				}
			})
			.catch(error => { // Handle network errors (e.g., show a network error message)
				console.log('Password Reset Failed');
				fail('Password Reset Failed: '+ error);
			})
			.finally(() => {
				waiting(false);
			})

		});
	}

	const verify = (pagePermissions) => {
		user?.roles.forEach(r => {
			setVerified(pagePermissions.includes(r) || r === 'administrator');
		});
	};
	
	const providerValues = useMemo(() => ({
		user,
		verified,
		verify,
		login,
		logout,
		reset,
		setPassword
	}), [user, verified, login, logout, verify, reset, setPassword]);

	return (
		<AuthContext.Provider value={providerValues}>
			{children}
		</AuthContext.Provider>
	);
}

export default function useAuth() {
	return useContext(AuthContext);
}
