import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "./redux/navigationSlice";
import { setLanguage, setTheme } from "./redux/preferenceSlice";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.navigation.currentPage);
  const currentLanguage = useSelector((state) => state.preference.language);
  const currentTheme = useSelector((state) => state.preference.theme);

  return (
    <>
      <div className="card">
        <button onClick={() => dispatch(setCurrentPage("test"))}>
          Set current page to "test"
        </button>
        <p>Current Page: {currentPage}</p>
        <button onClick={() => dispatch(setLanguage("cn"))}>
          Set language to "cn"
        </button>
        <p>Current Language: {currentLanguage}</p>
        <button onClick={() => dispatch(setTheme("dark"))}>
          Set theme to "dark"
        </button>
        <p>Current Theme: {currentTheme}</p>
      </div>
    </>
  );
}

export default App;
