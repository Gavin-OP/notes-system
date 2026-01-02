import { useDispatch, useSelector } from "react-redux";
import {
  App as AntdApp,
  ConfigProvider as DesktopConfigProvider,
  theme,
  DatePicker,
} from "antd";
import { ConfigProvider as MobileConfigProvider } from "antd-mobile";

import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import zhCNMobile from "antd-mobile/es/locales/zh-CN";
import enUSMobile from "antd-mobile/es/locales/en-US";

import { setCurrentPage } from "./redux/navigationSlice";
import { setLanguage, setTheme } from "./redux/preferenceSlice";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.navigation.currentPage);
  const language = useSelector((state) => state.preference.language);
  const themeMode = useSelector((state) => state.preference.theme);

  return (
    <DesktopConfigProvider
      theme={{
        algorithm:
          themeMode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
      locale={language === "cn" ? zhCN : enUS}
    >
      <MobileConfigProvider
        locale={language === "cn" ? zhCNMobile : enUSMobile}
      >
        <AntdApp>
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
        </AntdApp>
      </MobileConfigProvider>
    </DesktopConfigProvider>
  );
}

export default App;
