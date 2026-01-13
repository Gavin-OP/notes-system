import { useDispatch, useSelector } from "react-redux";
import { DatePicker } from "antd";

import { setCurrentPage } from "../../redux/navigationSlice";
import { setLanguage, setTheme } from "../../redux/preferenceSlice";

function HomePage() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.navigation.currentPage);
  const language = useSelector((state) => state.preference.language);
  const themeMode = useSelector((state) => state.preference.theme);

  return (
    <div className="card">
      <button onClick={() => dispatch(setCurrentPage("test"))}>
        Set current page to "test"
      </button>
      <p>Current Page: {currentPage}</p>
      <button onClick={() => dispatch(setLanguage("cn"))}>
        Set language to "cn"
      </button>
      <p>Current Language: {language}</p>
      <button onClick={() => dispatch(setTheme("dark"))}>
        Set theme to "dark"
      </button>
      <p>Current Theme: {themeMode}</p>
      <div style={{ margin: "24px 0" }}>
        <DatePicker />
      </div>
    </div>
  );
}
export default HomePage;
