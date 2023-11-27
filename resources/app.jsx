import './bootstrap.js';

import React from 'react'
import Providers from './js/Providers.jsx';
import {createRoot} from 'react-dom/client'

export default function App() {
  return (
    <Providers />
  );
}

createRoot(document.getElementById('app')).render(<App />);
