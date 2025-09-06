// File: plugin/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const scriptTag = document.getElementById("bughead-plugin-script");
const reporterId = scriptTag ? scriptTag.getAttribute("data-user-id") : null;

// ✅ Create a new DOM element to mount our React app
const root = document.createElement('div');
root.id = 'bughead-plugin-root';
document.body.appendChild(root);

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App reporterId={reporterId} />
  </React.StrictMode>
);