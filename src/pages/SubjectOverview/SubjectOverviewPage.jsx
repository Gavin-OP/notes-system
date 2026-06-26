import { Navigate, useParams } from "react-router-dom";

import { getSubjectOverviewUrl } from "../../utils/notesIndexUtils";

function SubjectOverviewPage() {
  const { subjectId = "" } = useParams();
  return <Navigate to={getSubjectOverviewUrl(subjectId)} replace />;
}

export default SubjectOverviewPage;
