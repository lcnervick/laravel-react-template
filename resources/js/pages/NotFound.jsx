import React from 'react';
import image404 from '../../images/404.png';
import '../../css/pages/NotFound.css';

export default function NotFound() {
	document.title = 'Not Found | ActivityUplift';
	return (
		<div className="not-found">
			<img src={image404} alt="404 Page Not Found" />
			<button
				className='button dark-button inverted'
				onClick={() => window.history.back()}
				style={{display: 'block', margin: '0 auto'}}
			>Go Back</button>
		</div>
	)
}
