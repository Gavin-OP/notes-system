/**
 * SubjectLearningPath - Wrapper component for LearningPathView
 * Gets subjectId from route context and passes to LearningPathView
 */
import { useOutletContext } from "react-router-dom";
import { LearningPathView } from "../../../common/components/learningPath";

const SubjectLearningPath = () => {
  const { subjectId } = useOutletContext();
  return <LearningPathView subjectId={subjectId} />;
};

export default SubjectLearningPath;
