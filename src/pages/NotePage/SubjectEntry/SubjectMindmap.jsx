/**
 * SubjectMindmap - Wrapper component for MindmapView
 * Gets subjectId from route context and passes to MindmapView
 */
import { useOutletContext } from "react-router-dom";
import { MindmapView } from "../../../common/components/mindmap";

const SubjectMindmap = () => {
  const { subjectId } = useOutletContext();

  return <MindmapView subjectId={subjectId} />;
};

export default SubjectMindmap;

