/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import React from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { AuthProvider } from './contexts/AuthContext';
import { RouterProvider } from 'react-router-dom';
import { PleaseWaitProvider } from './contexts/PleaseWait';
import Layout from './Layout';

import router from './router/router';

import '../css/styles.css';
import '../css/custom-elements.css';
import '../css/animations.css';


export default function Providers() {
	return (
		<React.StrictMode>
			<PleaseWaitProvider>
				{/* <AuthProvider> */}
					<GoogleReCaptchaProvider
						reCaptchaKey='6Lc8s48oAAAAADeNm-TNboQErCyMW0l9jSmmty9U'
						scriptProps={{
							defer: true,
							appendTo: 'head'
						}}
						container={{
							element: 'recaptcha',
							parameters: {
								badge: 'inline'
							}
						}}
					>
						<RouterProvider router={router}>
							<Layout />
						</RouterProvider>
					</GoogleReCaptchaProvider>
				{/* </AuthProvider> */}
			</PleaseWaitProvider>
		</React.StrictMode>
	)
}
