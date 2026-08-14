import { useNavigate, useParams } from "react-router-dom";

import AppPageShell from "../../../../shared/layouts/AppPageShell";
import useTranslation from "../../../../i18n/useTranslation";
import SubjectOverviewContent from "./SubjectOverviewContent";
import { FULL_PRODUCT_ENABLED } from "../../../../config/productMode";

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
      backLabel={FULL_PRODUCT_ENABLED ? t("subjectOverview.backToDatabase", "Back to Knowledge Database") : "返回求职学习"}
      onBack={() => navigate(FULL_PRODUCT_ENABLED ? "/subjects" : "/")}
      showSiteFooter={FULL_PRODUCT_ENABLED}
      contentWidth="wide"
    >
      <SubjectOverviewContent subjectId={subjectId} />
    </AppPageShell>
  );
}

export default SubjectOverviewPage;
