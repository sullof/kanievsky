import React from "react";
import { createRoot } from "react-dom/client";

// import 'bootstrap/dist/css/bootstrap.min.css'
import "./index.css";

import App from "./App.jsx";
import * as serviceWorker from "./serviceWorker";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
serviceWorker.unregister();
