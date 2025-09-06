// File: plugin/src/main.jsx
import React from "react"; // ✅ Import React
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Create a new DOM element to mount our React app
// const root = document.createElement('div');
// root.id = 'bughead-plugin-root';
// document.body.appendChild(root);

const root = document.getElementById("bughead-plugin-root");
if (!root) {
  throw new Error("Root element not found");
} else {
  console.log("Root element found:", root);
}
ownerId = root.getAttribute("owner-id");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App ownerId={ownerId} />
  </React.StrictMode>
);
