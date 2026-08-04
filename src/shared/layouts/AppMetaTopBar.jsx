import { Button, Dropdown, Space } from "antd";
import { GlobalOutlined, MoonOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";

import { setLanguage, setTheme } from "../../app/store/preferenceSlice";
import useCurrentUserSummary from "../../features/profile/hooks/useCurrentUserSummary";
import { FULL_PRODUCT_ENABLED, PILOT_BACKEND_ENABLED } from "../../config/productMode";

import "./AppPageShell.css";

function AppMetaTopBar({
  t,
  theme,
  language,
  dispatch,
  navigate,
  startSlot = null,
  toolSlot = null,
  topBarRef = null,
}) {
  const { displayName, isAuthenticated } = useCurrentUserSummary({ disabled: !PILOT_BACKEND_ENABLED });
  const languageItems = [
    {
      key: "cn",
      label: t("language.chinese"),
      onClick: () => dispatch(setLanguage("cn")),
    },
    {
      key: "en",
      label: t("language.english"),
      onClick: () => dispatch(setLanguage("en")),
    },
    {
      key: "tw",
      label: t("language.traditional", "繁體中文"),
      onClick: () => dispatch(setLanguage("tw")),
    },
  ];
  const languageLabel = language === "cn"
    ? t("language.chinese")
    : language === "tw"
      ? t("language.traditional", "繁體中文")
      : t("language.english");

  return (
    <header
      className={`app-page-shell__topbar ${FULL_PRODUCT_ENABLED ? "" : "app-page-shell__topbar--compact"}`.trim()}
      ref={topBarRef}
    >
      <div className="app-meta-topbar__start">
        {startSlot}
        {FULL_PRODUCT_ENABLED ? (
          <button type="button" className="app-page-shell__brand" onClick={() => navigate("/")}>
            <span className="app-page-shell__logo">NS</span>
            <span className="app-page-shell__brand-name">{t("home.brand", "Notes System")}</span>
          </button>
        ) : null}
      </div>
      <Space size={8} className="app-page-shell__tools">
        {toolSlot}
        <Button
          shape="circle"
          className="app-page-shell__tool-btn"
          icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
          onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
          aria-label={t("note.toolbar.darkMode", "Dark mode")}
        />
        <Dropdown
          menu={{ items: languageItems, selectable: true, selectedKeys: [language] }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            shape={FULL_PRODUCT_ENABLED ? "default" : "circle"}
            className="app-page-shell__language-btn"
            icon={<GlobalOutlined />}
            aria-label={t("home.languageSelector", "Choose language")}
          >
            {FULL_PRODUCT_ENABLED ? (
              <span className="app-page-shell__language-label">{languageLabel}</span>
            ) : null}
          </Button>
        </Dropdown>
        {FULL_PRODUCT_ENABLED ? (
          <Button
            className={`app-page-shell__auth-btn ${isAuthenticated ? "app-page-shell__auth-btn--user" : ""}`}
            icon={<UserOutlined />}
            onClick={() => navigate(isAuthenticated ? "/user/profile" : "/user/login")}
            aria-label={isAuthenticated ? displayName || t("profile.title", "Profile") : t("auth.signIn", "Sign in")}
          >
            <span className="app-page-shell__auth-label">
              {isAuthenticated ? displayName || t("profile.title", "Profile") : t("auth.signIn", "Sign in")}
            </span>
          </Button>
        ) : null}
      </Space>
    </header>
  );
}

export default AppMetaTopBar;
