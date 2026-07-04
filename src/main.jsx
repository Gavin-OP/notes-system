import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import ReactGA from "react-ga4";

import store from "./app/store/store.js";
import App from "./App.jsx";
import { isLocalhost } from "./shared/lib/analyticsUtils.js";

import "./styles/tokens.css";
import "./styles/semanticChips.css";
import "./styles/surface.css";
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
