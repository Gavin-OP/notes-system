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
import zhTW from "antd/locale/zh_TW";
import enUS from "antd/locale/en_US";
import zhCNMobile from "antd-mobile/es/locales/zh-CN";
import zhTWMobile from "antd-mobile/es/locales/zh-TW";
import enUSMobile from "antd-mobile/es/locales/en-US";

import Routes from "./app/router/Routes";
import { fetchNotesIndex } from "./app/store/notesIndexSlice";
import { setIsMobile } from "./app/store/preferenceSlice";
import { isLocalhost } from "./shared/lib/analyticsUtils";
import { academicAntTokens } from "./styles/academicTheme";

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

  // sync theme to document for custom CSS ([data-theme="dark"] selectors)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode || "light");
  }, [themeMode]);

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
        token: academicAntTokens,
      }}
      locale={language === "cn" ? zhCN : language === "tw" ? zhTW : enUS}
    >
      <MobileConfigProvider
        locale={language === "cn" ? zhCNMobile : language === "tw" ? zhTWMobile : enUSMobile}
      >
        <AntdApp>
          <Routes />
        </AntdApp>
      </MobileConfigProvider>
    </DesktopConfigProvider>
  );
}

export default App;
