import { memo } from "react";
import { Handle, Position } from "reactflow";
import "./ConceptNode.css";

const ConceptNode = ({ data }) => {
  const { label, color, importance, category } = data;

  // Node size based on importance
  const sizeClass = importance === "high" ? "large" : importance === "low" ? "small" : "medium";

  return (
    <div className={`concept-node concept-node--${sizeClass}`} style={{ borderColor: color }}>
      <Handle type="target" position={Position.Top} className="concept-node__handle" />
      
      <div className="concept-node__content">
        <div className="concept-node__label">{label}</div>
        <div className="concept-node__category" style={{ color }}>
          {category}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="concept-node__handle" />
    </div>
  );
};

export default memo(ConceptNode);

