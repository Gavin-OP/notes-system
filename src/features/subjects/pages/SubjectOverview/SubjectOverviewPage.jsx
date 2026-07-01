import { useNavigate, useParams } from "react-router-dom";

import AppPageShell from "../../../../shared/layouts/AppPageShell";
import useTranslation from "../../../../i18n/useTranslation";
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
    <AppPageShell
      backLabel={t("subjectOverview.backToDatabase", "Back to Subject Database")}
      onBack={() => navigate("/subjects")}
      showSiteFooter
      contentWidth="wide"
    >
      <SubjectOverviewContent subjectId={subjectId} />
    </AppPageShell>
  );
}

export default SubjectOverviewPage;
