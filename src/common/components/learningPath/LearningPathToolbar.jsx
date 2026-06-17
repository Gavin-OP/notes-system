import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getFirstSubjectTopicUrl } from "../../../utils/notesIndexUtils";
import "./LearningPathToolbar.css";

const LearningPathToolbar = ({ subjectId, subjectName }) => {
  const navigate = useNavigate();
  const notesIndex = useSelector((state) => state.notesIndex.data);

  const handleBack = () => {
    const firstTopicUrl = getFirstSubjectTopicUrl(notesIndex, subjectId);
    navigate(firstTopicUrl || `/note/${subjectId}`);
  };

  return (
    <div className="learning-path-toolbar">
      <button
        className="learning-path-toolbar__back-btn"
        onClick={handleBack}
        title="Back"
      >
        <ArrowLeftOutlined />
        <span>Back</span>
      </button>
      {subjectName && (
        <div className="learning-path-toolbar__title">
          <h2>{subjectName} - Learning Path</h2>
        </div>
      )}
    </div>
  );
};

export default LearningPathToolbar;
