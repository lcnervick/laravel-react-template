import React from 'react';
import '../../css/components/Navigation.css';

export default function MenuButton({ open, setMenuOpen }) {
	return (
		<div id="menu-button" className={'mobile-menu-button' + (open ? ' open' : '')} onClick={(e) => { setMenuOpen(!open); }}>
			<span></span>
			<span></span>
			<span></span>
		</div>
	);
}
