import { useNavigate, useParams } from "react-router-dom";
import { Button, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import useTranslation from "../../i18n/useTranslation";
import SubjectOverviewContent from "./SubjectOverviewContent";

import "./SubjectOverviewPage.css";

function SubjectOverviewPage() {
  const navigate = useNavigate();
  const { subjectId = "" } = useParams();
  const { t } = useTranslation();

  if (!subjectId) {
    navigate("/subjects", { replace: true });
    return null;
  }

  return (
    <main className="subject-overview-page">
      <div className="subject-overview-page__container">
        <Space direction="vertical" size={16} className="subject-overview-page__header">
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/subjects")}>
            {t("subjectOverview.backToDatabase", "Back to Subject Database")}
          </Button>
        </Space>
        <SubjectOverviewContent subjectId={subjectId} />
      </div>
    </main>
  );
}

export default SubjectOverviewPage;
