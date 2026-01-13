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

import Routes from "./router/Routes";

import "./App.css";

function App() {
  const dispatch = useDispatch();
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
          <Routes />
        </AntdApp>
      </MobileConfigProvider>
    </DesktopConfigProvider>
  );
}

export default App;
