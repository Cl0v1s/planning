
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@synapse-medicine/boto/platform/index.css';
import './index.css'

import 'react-dates/initialize';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
