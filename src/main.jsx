import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import ReactGA from "react-ga4";

import store from "./redux/store.js";
import App from "./App.jsx";
import { isLocalhost } from "./utils/analyticsUtils.js";

import "./index.css";

// Only initialize Google Analytics when not running on localhost
if (!isLocalhost()) {
  ReactGA.initialize("G-TVGJDMYL76");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
