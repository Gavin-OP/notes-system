import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setLanguage, setTheme } from "../../redux/preferenceSlice";

function HomePage() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.preference.language);
  const themeMode = useSelector((state) => state.preference.theme);
  const navigate = useNavigate();

  return (
    <div className="home-page__card">
      <button onClick={() => navigate("/note")}>go to note system</button>
    </div>
  );
}
export default HomePage;
