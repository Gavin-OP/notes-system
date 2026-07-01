import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import useTranslation from "../../i18n/useTranslation";
import AppMetaTopBar from "./AppMetaTopBar";

import "./AppPageShell.css";

const { Paragraph, Title } = Typography;

function SiteFooter({ t, navigate }) {
  return (
    <footer className="app-page-shell__footer">
      <button type="button" onClick={() => navigate("/disclaimer")}>
        {t("home.footer.disclaimer", "Disclaimer")}
      </button>
      <button type="button" onClick={() => navigate("/careers")}>
        {t("home.footer.careers", "Career Database")}
      </button>
      <button type="button" onClick={() => navigate("/subjects")}>
        {t("home.footer.subjects", "Subject Database")}
      </button>
      <a href="mailto:hello@notes-system.local">{t("home.footer.contact", "Contact us")}</a>
    </footer>
  );
}

function AppPageShell({
  children,
  backLabel,
  onBack,
  title,
  subtitle,
  showSiteFooter = false,
  surface = "default",
  contentWidth = "wide",
  mainClassName = "",
  contentClassName = "",
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const theme = useSelector((state) => state.preference.theme);
  const language = useSelector((state) => state.preference.language);

  return (
    <div className={`app-page-shell app-page-shell--${surface}`}>
      <AppMetaTopBar
        t={t}
        theme={theme}
        language={language}
        dispatch={dispatch}
        navigate={navigate}
      />
      <main className={`app-page-shell__main ${mainClassName}`.trim()}>
        <div
          className={[
            "app-page-shell__content",
            contentWidth === "narrow" ? "app-page-shell__content--narrow" : "",
            contentWidth === "full" ? "app-page-shell__content--full" : "",
            contentClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {backLabel && onBack ? (
            <Button
              type="link"
              className="app-page-shell__back"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
            >
              {backLabel}
            </Button>
          ) : null}
          {title ? (
            <header className="app-page-shell__page-header">
              <Title level={2} className="app-page-shell__title">
                {title}
              </Title>
              {subtitle ? (
                <Paragraph type="secondary" className="app-page-shell__subtitle">
                  {subtitle}
                </Paragraph>
              ) : null}
            </header>
          ) : null}
          {children}
        </div>
      </main>
      {showSiteFooter ? <SiteFooter t={t} navigate={navigate} /> : null}
    </div>
  );
}

export default AppPageShell;
