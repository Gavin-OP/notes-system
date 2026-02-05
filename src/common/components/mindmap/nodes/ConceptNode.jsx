import { memo } from "react";
import { Handle, Position } from "reactflow";

/**
 * Concept Node - Level 2 individual concepts (leaf nodes)
 * Reusable across all subjects
 */
const ConceptNode = memo(({ data }) => {
  const { label, color, importance } = data;

  // Importance affects visual styling
  const importanceClass =
    importance === "high"
      ? "mindmap-node--high"
      : importance === "low"
      ? "mindmap-node--low"
      : "";

  return (
    <div
      className={`mindmap-node mindmap-node--concept ${importanceClass}`}
      style={{ borderColor: color }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} id="left" />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} id="right" />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} id="top" />
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} id="bottom" />
      <div className="mindmap-node__label">{label}</div>
    </div>
  );
});

ConceptNode.displayName = "ConceptNode";

export default ConceptNode;

