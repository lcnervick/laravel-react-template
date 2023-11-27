import React, { useCallback,useEffect, useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import usePleaseWait from '../contexts/PleaseWait';
import AnimatedElement from './AnimatedElement';
import axios from 'axios';
import '../../css/components/ContactForm.css';

export default function ContactForm() {
	const [formData, setFormData] = useState({ name: '', email: '', message: '', captchaValue: null });
	const [errors, setErrors] = useState({ name: '', email: '', message: '', captcha: '', server: '' });
	const [showErrors, setShowErrors] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const { executeRecaptcha } = useGoogleReCaptcha();
	const { waiting } = usePleaseWait();

	// console.log("Form Data", formData);

	const validate = (key, test, msg) => {
		if (!test) {
			setErrors(prev => ({...prev, [key]: msg}));
		} else setErrors(prev => ({...prev, [key]: ''}));
	};

	useEffect(() => {
		const { name, email, message, captchaValue } = formData;
		const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

		validate('name', name.trim(), 'Name is required');
		validate('email', emailRegex.test(email), 'Invalid email address');
		validate('message', message.trim(), 'Message is required');
		validate('captcha', captchaValue, 'Please complete the ReCaptcha');
	}, [formData]);

	const handleInputChange = (e) => {
		setFormData(prev => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};

	const handleReCaptchaVerify = useCallback(async () => {
		if (!executeRecaptcha) return;
		const token = await executeRecaptcha('activityupliftcontactform');
		setFormData({
			...formData,
			captchaValue: token
		});
	  }, [executeRecaptcha]);

	useEffect(() => {
		handleReCaptchaVerify();
	}, [handleReCaptchaVerify]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		const { name, email, message, captchaValue } = formData;

		setShowErrors(true);
		setSuccessMessage('');

		if (!captchaValue) {
			await handleReCaptchaVerify();
		}

		if (Object.values(errors).every((error) => error === '')) { // Submit the form or perform other actions
			try {
				waiting(true);
				const response = await axios.post('/contact-us', { name, email, message, captchaValue });
				waiting(false);
				console.log("Form Response", response.data);
				if (response.data.success) { // Handle successful form submission (e.g., show a success message)
					// Reset form fields
					setShowErrors(false);
					setFormData({ name: '', email: '', message: '', captchaValue: null });
					setSuccessMessage(<AnimatedElement animate="zoom"><div>{response.data.message}</div></AnimatedElement>);
					setTimeout(() => {
						setSuccessMessage('');
					}, 7000);
				}
				else { // Handle server-side errors (e.g., display an error message)
					console.log('Form submission failed: processing error');
					setErrors(prev => ({...prev, server: response.data.message}));
				}
				handleReCaptchaVerify();


			} catch (error) { // Handle network errors (e.g., show a network error message)
				console.log('Form submission failed: server error');
				if (error.response?.data?.errors ?? null) {
					for (let m in error.response.data.errors) {
						console.log("Form Error:", m, error.response.data.errors[m][0]);
						setErrors(prev => ({...prev, [m]: error.response.data.errors[m][0]}));
					}
				}
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='contact-form'>
			<div>
				<label>Name:</label>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleInputChange}
					placeholder="Name" />
				<div className="error">{showErrors && errors.name}</div>
			</div>

			<div>
				<label>Email Address:</label>
				<input
					type="email"
					name="email"
					value={formData.email}
					onChange={handleInputChange}
					placeholder="Email Address" />
				<div className="error">{showErrors && errors.email}</div>
			</div>

			<div>
				<label>Message:</label>
				<textarea
					name="message"
					value={formData.message}
					onChange={handleInputChange}
					placeholder="Message" />
				<div className="error">{showErrors && errors.message}</div>
			</div>

			<button
				className='button light-button inverted'
				type="submit">Submit</button>

			<div>
				<div id="recaptcha"></div>
				<div className="error">{showErrors && errors.captcha}</div>
				<div className="error">{errors.server}</div>
				<div className="success">{successMessage}</div>
			</div>

		</form>
	);

}
