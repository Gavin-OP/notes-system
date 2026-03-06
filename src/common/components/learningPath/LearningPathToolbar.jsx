import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./LearningPathToolbar.css";

const LearningPathToolbar = ({ subjectId, subjectName }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/note/${subjectId}/index`);
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
