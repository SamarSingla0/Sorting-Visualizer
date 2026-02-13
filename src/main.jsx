import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Entry point that mounts the React application into the #root element in index.html
ReactDOM.createRoot(document.getElementById("root")).render(
    // App contains all providers, layout and the visualizer itself
    <App />
);
