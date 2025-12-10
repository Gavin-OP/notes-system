import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "./redux/navigationSlice";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.navigation.currentPage);

  return (
    <>
      <div className="card">
        <button onClick={() => dispatch(setCurrentPage("test"))}>
          Set current page to "test"
        </button>
        <p>Current Page: {currentPage}</p>
      </div>
    </>
  );
}

export default App;
