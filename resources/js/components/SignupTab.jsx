import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedElement from './AnimatedElement';

import '../../css/components/SignupTab.css';
import Registration from './Registration';

const rates = [
	{
		id: 118,
		name: 'Monthly',
		desc: 'Monthly Plan',
		rate: 5,
		freq: '/Per Month',
		details: [
			'Enjoy unlimited downloads of all available content',
			'Discover new, stimulating activities released each month',
			'A flexible option perfect for everyone',
			'Easily cancel anytime',
		]
	},
	{
		id: 286,
		name: 'Annual',
		desc: 'Yearly Plan',
		rate: 40,
		freq: '/Per Year',
		details: [
			'Pay once for a full year of unlimited access',
			'Download as much content as you like',
			'Look forward to new quizzes, coloring, sudoku, crosswords and other activities added monthly',
			'An ideal choice for those seeking long-term engagement'
		]
	},
	{
		id: 7213,
		name: 'One-Time',
		desc: 'No Subscription',
		rate: 60,
		freq: '/One Time',
		details: [
			'Receive 150 activities mailed directly to your home',
			'Worldwide Shipping!',
			'Personalized selection process: We\'ll contact you to determine which activities best suit your preferences',
			'Ideal for those who prefer not to handle printing',
			'For extended use, consider photocopying the activities before use'
		]
	}
];

export default function SignupTab() {
	const [rate, setRate] = useState(rates[0]);
	const [showRegistration, setShowRegistration] = useState(false);
	const listRef = useRef(null);

	const changeRate = (r) => {
		const n = rates.findIndex(i => i.name === r);
		// Move the selector to the right spot;
		listRef.current.style.setProperty('--selected-rate-pos', (n * (100 / rates.length)) + '%');
		setTimeout(() => {
			// set the name after it has traveled half-way there
			listRef.current.style.setProperty('--selected-rate-name', `'${r}'`);
			setRate(rates[n]);
		}, 150);
	};

	useEffect(() => {
		changeRate('Monthly');
	}, []);

	const handleSignUpButton = (e) => {
		// e.preventDefault();
		setShowRegistration(!showRegistration);
	}

	return (<>
		<ul className='sign-up-rate-chooser' ref={listRef}>
			{rates.map((r,i) => (
				<li
					key={r.name}
					className={rate === r.name ? 'selected-rate' : ''}
					onClick={(e) => {changeRate(r.name)}}
				>{r.name}
				</li>
			))}
		</ul>
		
		<div className="sign-up-container" key={rate.name}>
			<h3>{rate.desc}</h3>
			<h4><span style={{verticalAlign:'top'}}>$</span><span className='sign-up-container-price'>{rate.rate}</span>{rate.freq}</h4>
			<hr />
			<ul className='sign-up-container-details'>
				{ rate.details.map(r => <li key={r}>{r}</li>) }
			</ul>
			{/* <Link to={"/sign-up/" + rate.name.toLowerCase()}> */}
				<AnimatedElement animate="zoom">
					<button
						className='button dark-button inverted'
						onClick={handleSignUpButton}
					>Sign-Up</button>
				</AnimatedElement>
			{/* </Link> */}
		</div>
		<Registration visible={showRegistration} setVisible={setShowRegistration} registration={rate} />
	</>);
}
