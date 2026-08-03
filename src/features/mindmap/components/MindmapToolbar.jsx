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
import { FULL_PRODUCT_ENABLED, PILOT_START_PATH } from "../../../config/productMode";
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
  showViewSwitcher = true,
}) => {
  const navigate = useNavigate();
  const isPilotMode = !FULL_PRODUCT_ENABLED;

  const handleBack = () => {
    navigate(isPilotMode ? PILOT_START_PATH : getSubjectOverviewUrl(subjectId));
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
          type="button"
          className="mindmap-toolbar__back-btn"
          onClick={handleBack}
          title={isPilotMode ? "返回课程" : "Back"}
        >
          <ArrowLeftOutlined />
          <span>{isPilotMode ? "返回课程" : "Back"}</span>
        </button>
        {subjectName && (
          <div className="mindmap-toolbar__title">
            <h2>{isPilotMode ? `${subjectName} · 知识地图` : `${subjectName} - Knowledge Graph`}</h2>
          </div>
        )}
      </div>

      <div className="mindmap-toolbar__right">
        <div className="mindmap-toolbar__hub-actions">
          {!isPilotMode ? (
            <button type="button" className="mindmap-toolbar__action-btn" onClick={handleBack}>
              Subject overview
            </button>
          ) : null}
          {firstConceptNote?.noteUrl ? (
            <button type="button" className="mindmap-toolbar__action-btn" onClick={onOpenFirstNote}>
              {isPilotMode ? "开始学习" : "Start first note"}
            </button>
          ) : null}
          {selectedConceptNoteUrl ? (
            <button
              type="button"
              className="mindmap-toolbar__action-btn mindmap-toolbar__action-btn--primary"
              onClick={onOpenSelectedConcept}
            >
              {isPilotMode ? "打开对应内容" : "Open selected concept"}
            </button>
          ) : null}
        </div>
        {showViewSwitcher ? <div className="mindmap-toolbar__view-switcher">
          <span className="mindmap-toolbar__view-label">View Type:</span>
          <div className="mindmap-toolbar__view-options">
            {viewOptions.map((option) => (
              <button
                type="button"
                key={option.type}
                className={`mindmap-toolbar__view-btn ${
                  currentType === option.type ? "mindmap-toolbar__view-btn--active" : ""
                } ${option.disabled ? "mindmap-toolbar__view-btn--disabled" : ""}`}
                onClick={() => !option.disabled && onTypeChange(option.type)}
                disabled={option.disabled}
                aria-pressed={currentType === option.type}
                title={option.disabled ? `${option.label} (Coming Soon)` : option.description}
              >
                {option.icon}
                <span>{option.label}</span>
                {option.disabled && <span className="mindmap-toolbar__badge">Coming Soon</span>}
              </button>
            ))}
          </div>
        </div> : null}
      </div>
    </div>
  );
};

export default MindmapToolbar;
