import { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import AppPageShell from "../common/layouts/AppPageShell";
import useTranslation from "../i18n/useTranslation";

import "./DisclaimerPage.css";

function DisclaimerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadDisclaimer() {
      setLoading(true);
      const paths = [
        `${import.meta.env.BASE_URL}notes/disclaimer.md`,
        `${import.meta.env.BASE_URL}notes/Disclaimer.md`,
        "/notes-system/notes/disclaimer.md",
        "/notes/disclaimer.md",
      ];
      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (!response.ok) continue;
          const text = await response.text();
          if (!cancelled) setContent(text.replace(/^---[\s\S]*?---\s*/, ""));
          break;
        } catch {
          // Try the next static path.
        }
      }
      if (!cancelled) setLoading(false);
    }
    loadDisclaimer();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppPageShell
      backLabel={t("common.backToHome", "Back to Home")}
      onBack={() => navigate("/")}
      title={t("home.footer.disclaimer", "Disclaimer")}
      contentWidth="narrow"
      showSiteFooter
    >
      <Card className="app-prose-panel">
        {loading ? (
          <div className="app-page-shell__state">
            <Spin tip={t("common.loading", "Loading...")} />
          </div>
        ) : (
          <div className="disclaimer-page__markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content || t("disclaimer.empty", "Disclaimer content is not available yet.")}
            </ReactMarkdown>
          </div>
        )}
      </Card>
    </AppPageShell>
  );
}

export default DisclaimerPage;
