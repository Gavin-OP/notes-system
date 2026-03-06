import { memo } from "react";
import { Handle, Position } from "reactflow";

/**
 * Concept Node - Level 2 individual concepts (leaf nodes)
 * Reusable across all subjects
 * 
 * Styling: Uses CSS variable --node-color for border color.
 * No inline styles except for passing the color variable.
 * Leaf node: Only has target handles, no source handles.
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
      style={{ "--node-color": color }}
    >
      {/* Target handles - only left and right for horizontal flow */}
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
      
      <div className="mindmap-node__label">{label}</div>
    </div>
  );
});

ConceptNode.displayName = "ConceptNode";

export default ConceptNode;
