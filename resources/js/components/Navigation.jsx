import React from 'react';
import { routes } from '../router/router';
import { Link, NavLink } from 'react-router-dom';
import parse from 'html-react-parser';


import '../../css/components/Navigation.css';
import useAuth from '../contexts/AuthContext';


export default function Navigation({ open, setMenuOpen }) {
	const { user, logout } = useAuth();

	const linkFactory = (rts, submenu = false) => {
		return (<ul className={submenu ? 'submenu' : ''}>
			{
				Object.keys(rts).map(r => {
					const route = rts[r];
					return route.menuItem 
						?	(<li key={route.name} className={route.children ? 'has-children' : ''}>
								<NavLink to={route.path}>
									{(route.icon ? parse(route.icon) : '')} {route.icon ? parse(`<span>${route.name}</span>`) : route.name}
								</NavLink>
								{
									route.children && user
									? linkFactory(route.children, true)
									: null
								}
							</li> )
						: null;
				})
			}
			{
				user && submenu 
					? 	(
							<li key="user-actions" className='nav-user-actions'>
								<div><Link to="/logout" onClick={(e) => {  e.preventDefault(); logout(); }}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-16-7v20h14v-2h-12v-16h12v-2h-14z"/></svg>
								</Link></div>
								<div><Link to="/members/settings">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24 13.616v-3.232l-2.869-1.02c-.198-.687-.472-1.342-.811-1.955l1.308-2.751-2.285-2.285-2.751 1.307c-.613-.339-1.269-.613-1.955-.811l-1.021-2.869h-3.232l-1.021 2.869c-.686.198-1.342.471-1.955.811l-2.751-1.308-2.285 2.285 1.308 2.752c-.339.613-.614 1.268-.811 1.955l-2.869 1.02v3.232l2.869 1.02c.197.687.472 1.342.811 1.955l-1.308 2.751 2.285 2.286 2.751-1.308c.613.339 1.269.613 1.955.811l1.021 2.869h3.232l1.021-2.869c.687-.198 1.342-.472 1.955-.811l2.751 1.308 2.285-2.286-1.308-2.751c.339-.613.613-1.268.811-1.955l2.869-1.02zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/></svg>
								</Link></div>
							</li>
						)
					: null
			}
		</ul>);
	}

	return (
		<nav className={'header-navigation' + (open ? ' open' : '')} onClick={(e) => {setMenuOpen(false);}}>
			{ linkFactory(routes) }
		</nav>
	);
}
