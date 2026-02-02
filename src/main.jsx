import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import ReactGA from "react-ga4";
import store from "./redux/store.js";
import "./index.css";
import App from "./App.jsx";

ReactGA.initialize("G-TVGJDMYL76");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
