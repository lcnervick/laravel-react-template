import React, { useEffect, useState } from 'react';
import '../../css/components/BackToTop.css';

export default function BackToTop() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		window.addEventListener('scroll', (e) => {
			if(window.scrollY > 20 && !visible) {
				setVisible(true);
			} else if(window.scrollY === 0) {
				setVisible(false);
			}
		});
	}, []);


	const handleClick = (e) => {
		e.stopPropagation();
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}

	return (
		<div className={'back-to-top' + (visible ? ' visible' : '')} onClick={handleClick}>
			<div></div>
		</div>
	);
}
