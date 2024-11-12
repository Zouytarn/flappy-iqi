import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import App from './App';

// This line finds the 'root' div in index.html and injects your React app into it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 