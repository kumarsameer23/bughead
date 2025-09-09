// File: plugin/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const config = window.bugHeadConfig || {};
const { userId, websiteId } = config;

// Create a new DOM element to mount our React app
const root = document.createElement('div');
root.id = 'bughead-plugin-root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App userId={userId} websiteId={websiteId} />
  </React.StrictMode>
);