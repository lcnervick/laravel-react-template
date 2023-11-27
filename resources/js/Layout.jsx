/* This is the layout file for the Router. */

import React from 'react'
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import BackToTop from './components/BackToTop.jsx';

export default function Layout() {
	return (<>
		<Header />

		<main>
			<Outlet />
		</main>

		<Footer />

		<BackToTop />
		<ScrollRestoration />
	</>)
}
