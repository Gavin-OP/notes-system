import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGA from "react-ga4";

import {
  App as AntdApp,
  ConfigProvider as DesktopConfigProvider,
  theme,
} from "antd";
import { ConfigProvider as MobileConfigProvider } from "antd-mobile";

import zhCN from "antd/locale/zh_CN";
import enUS from "antd/locale/en_US";
import zhCNMobile from "antd-mobile/es/locales/zh-CN";
import enUSMobile from "antd-mobile/es/locales/en-US";

import Routes from "./router/Routes";
import { fetchNotesIndex } from "./redux/notesIndexSlice";
import { setIsMobile } from "./redux/preferenceSlice";
import { isLocalhost } from "./utils/analyticsUtils";

import "./App.css";

function App() {
  // redux
  const dispatch = useDispatch();
  const language = useSelector((state) => state.preference.language);
  const themeMode = useSelector((state) => state.preference.theme);
  const status = useSelector((state) => state.notesIndex.status);

  // mobile detection
  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 768));
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // preference tracking
  useEffect(() => {
    if (!isLocalhost()) {
      if (themeMode) {
        ReactGA.set({ theme: themeMode });
      }
      if (language) {
        ReactGA.set({ language });
      }
    }
  }, [themeMode, language]);

  // preference change tracking
  useEffect(() => {
    if (!isLocalhost() && themeMode) {
      ReactGA.event({
        category: "Theme",
        action: "change",
        label: themeMode,
      });
    }
  }, [themeMode]);

  useEffect(() => {
    if (!isLocalhost() && language) {
      ReactGA.event({
        category: "Language",
        action: "change",
        label: language,
      });
    }
  }, [language]);

  // fetch notes index on idle status
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchNotesIndex());
    }
  }, [status, dispatch]);

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
          <Routes />
        </AntdApp>
      </MobileConfigProvider>
    </DesktopConfigProvider>
  );
}

export default App;
