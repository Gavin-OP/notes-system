/**
 * SubjectEntry - Generic subject page component
 * Handles routing for subject-specific views (mindmap, learning path)
 * Works with any subject by extracting subjectId from URL params
 */
import { useParams, Outlet } from "react-router-dom";
import "./SubjectEntry.css";

const SubjectEntry = () => {
  const { subjectId } = useParams();

  return (
    <div className="subject-entry">
      {/* Pass subjectId to child routes via Outlet context */}
      <Outlet context={{ subjectId }} />
    </div>
  );
};

export default SubjectEntry;

