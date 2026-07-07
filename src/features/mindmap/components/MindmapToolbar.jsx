/**
 * MindmapToolbar - Header toolbar for mindmap view
 * Provides navigation and view switching controls
 */
import { useNavigate } from "react-router-dom";
import { getSubjectOverviewUrl } from "../../navigation/lib/notesIndexUtils";
import {
  AppstoreOutlined,
  BranchesOutlined,
  ClusterOutlined,
  GlobalOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { MINDMAP_TYPES } from "./MindmapTypes";
import "./MindmapToolbar.css";

/**
 * MindmapToolbar Component
 * @param {string} subjectId - Subject identifier for navigation
 * @param {string} currentType - Current mindmap type
 * @param {Function} onTypeChange - Callback when mindmap type changes
 * @param {string} subjectName - Display name of the subject (optional)
 */
const MindmapToolbar = ({
  subjectId,
  currentType,
  onTypeChange,
  subjectName,
  firstConceptNote,
  selectedConceptNoteUrl,
  onOpenFirstNote,
  onOpenSelectedConcept,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(getSubjectOverviewUrl(subjectId));
  };

  const viewOptions = [
    {
      type: MINDMAP_TYPES.HIERARCHICAL,
      icon: <AppstoreOutlined />,
      label: "Hierarchical",
      description: "Clear category structure, suitable for beginners",
    },
    {
      type: MINDMAP_TYPES.RADIAL,
      icon: <BranchesOutlined />,
      label: "Radial",
      description: "Beautiful grouped layout",
      disabled: false,  // Implemented
    },
    {
      type: MINDMAP_TYPES.NETWORK,
      icon: <ClusterOutlined />,
      label: "Network",
      description: "Concept relationship network, suitable for deep understanding",
      disabled: false,  // Implemented
    },
    {
      type: MINDMAP_TYPES.SPHERE,
      icon: <GlobalOutlined />,
      label: "3D Sphere",
      description: "Rotatable concept sphere for spatial exploration",
      disabled: false,
    },
  ];

  return (
    <div className="mindmap-toolbar">
      <div className="mindmap-toolbar__left">
        <button
          className="mindmap-toolbar__back-btn"
          onClick={handleBack}
          title="Back"
        >
          <ArrowLeftOutlined />
          <span>Back</span>
        </button>
        {subjectName && (
          <div className="mindmap-toolbar__title">
            <h2>{subjectName} - Knowledge Graph</h2>
          </div>
        )}
      </div>

      <div className="mindmap-toolbar__right">
        <div className="mindmap-toolbar__hub-actions">
          <button type="button" className="mindmap-toolbar__action-btn" onClick={handleBack}>
            Subject overview
          </button>
          {firstConceptNote?.noteUrl ? (
            <button type="button" className="mindmap-toolbar__action-btn" onClick={onOpenFirstNote}>
              Start first note
            </button>
          ) : null}
          {selectedConceptNoteUrl ? (
            <button
              type="button"
              className="mindmap-toolbar__action-btn mindmap-toolbar__action-btn--primary"
              onClick={onOpenSelectedConcept}
            >
              Open selected concept
            </button>
          ) : null}
        </div>
        <div className="mindmap-toolbar__view-switcher">
          <span className="mindmap-toolbar__view-label">View Type:</span>
          <div className="mindmap-toolbar__view-options">
            {viewOptions.map((option) => (
              <button
                key={option.type}
                className={`mindmap-toolbar__view-btn ${
                  currentType === option.type ? "mindmap-toolbar__view-btn--active" : ""
                } ${option.disabled ? "mindmap-toolbar__view-btn--disabled" : ""}`}
                onClick={() => !option.disabled && onTypeChange(option.type)}
                disabled={option.disabled}
                title={option.disabled ? `${option.label} (Coming Soon)` : option.description}
              >
                {option.icon}
                <span>{option.label}</span>
                {option.disabled && <span className="mindmap-toolbar__badge">Coming Soon</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindmapToolbar;

