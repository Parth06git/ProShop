import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css' // For Default bootstrap css
import "./assets/styles/index.css"; // For Custom css
// import "./assets/styles/bootstrap.custom.css"; // For custom bootstrap css
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
