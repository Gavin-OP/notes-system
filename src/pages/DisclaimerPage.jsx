import { useEffect, useState } from "react";
import { Button, Card, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import useTranslation from "../i18n/useTranslation";

import "./DisclaimerPage.css";

const { Title } = Typography;

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
    <main className="disclaimer-page">
      <div className="disclaimer-page__container">
        <Button onClick={() => navigate(-1)}>{t("common.back", "Back")}</Button>
        <Card className="disclaimer-page__card">
          <Title level={2}>{t("home.footer.disclaimer", "Disclaimer")}</Title>
          {loading ? (
            <div className="disclaimer-page__state">
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
      </div>
    </main>
  );
}

export default DisclaimerPage;
