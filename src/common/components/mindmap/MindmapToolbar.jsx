/**
 * MindmapToolbar - Header toolbar for mindmap view
 * Provides navigation and view switching controls
 */
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, AppstoreOutlined, BranchesOutlined, ClusterOutlined } from "@ant-design/icons";
import "./MindmapToolbar.css";

/**
 * Mindmap view types
 */
export const MINDMAP_TYPES = {
  HIERARCHICAL: "hierarchical",  // Type 1: 清晰的层级结构
  RADIAL: "radial",              // Type 2: 径向分组布局 (待实现)
  NETWORK: "network",            // Type 3: 网状关系图 (待实现)
};

/**
 * MindmapToolbar Component
 * @param {string} subjectId - Subject identifier for navigation
 * @param {string} currentType - Current mindmap type
 * @param {Function} onTypeChange - Callback when mindmap type changes
 * @param {string} subjectName - Display name of the subject (optional)
 */
const MindmapToolbar = ({ subjectId, currentType, onTypeChange, subjectName }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Navigate back to subject index page (shows _index.md)
    navigate(`/note/${subjectId}/index`);
  };

  const viewOptions = [
    {
      type: MINDMAP_TYPES.HIERARCHICAL,
      icon: <AppstoreOutlined />,
      label: "层级视图",
      description: "清晰的分类结构，适合入门",
    },
    {
      type: MINDMAP_TYPES.RADIAL,
      icon: <BranchesOutlined />,
      label: "径向视图",
      description: "美观的分组布局",
      disabled: false,  // 已实现
    },
    {
      type: MINDMAP_TYPES.NETWORK,
      icon: <ClusterOutlined />,
      label: "网络视图",
      description: "概念关系网络，适合深入理解",
      disabled: false,  // 已实现
    },
  ];

  return (
    <div className="mindmap-toolbar">
      <div className="mindmap-toolbar__left">
        <button
          className="mindmap-toolbar__back-btn"
          onClick={handleBack}
          title="返回"
        >
          <ArrowLeftOutlined />
          <span>返回</span>
        </button>
        {subjectName && (
          <div className="mindmap-toolbar__title">
            <h2>{subjectName} - 知识图谱</h2>
          </div>
        )}
      </div>

      <div className="mindmap-toolbar__right">
        <div className="mindmap-toolbar__view-switcher">
          <span className="mindmap-toolbar__view-label">视图类型：</span>
          <div className="mindmap-toolbar__view-options">
            {viewOptions.map((option) => (
              <button
                key={option.type}
                className={`mindmap-toolbar__view-btn ${
                  currentType === option.type ? "mindmap-toolbar__view-btn--active" : ""
                } ${option.disabled ? "mindmap-toolbar__view-btn--disabled" : ""}`}
                onClick={() => !option.disabled && onTypeChange(option.type)}
                disabled={option.disabled}
                title={option.disabled ? `${option.label}（即将推出）` : option.description}
              >
                {option.icon}
                <span>{option.label}</span>
                {option.disabled && <span className="mindmap-toolbar__badge">敬请期待</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindmapToolbar;

