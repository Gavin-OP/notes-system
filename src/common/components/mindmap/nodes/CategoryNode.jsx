import { memo } from "react";
import { Handle, Position } from "reactflow";

/**
 * Category Node - Level 1 categories (e.g., "Foundations", "Machine Learning")
 * Reusable across all subjects
 * 
 * Styling: Uses CSS variable --node-color for background and border colors.
 * No inline styles except for passing the color variable.
 */
const CategoryNode = memo(({ data }) => {
  const { label, color } = data;

  return (
    <div
      className="mindmap-node mindmap-node--category"
      style={{ "--node-color": color }}
    >
      {/* Target handles - only left and right for horizontal flow */}
      <Handle type="target" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
      
      <div className="mindmap-node__label">{label}</div>
      
      {/* Source handles - only left and right for horizontal flow */}
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Left} id="left" />
    </div>
  );
});

CategoryNode.displayName = "CategoryNode";

export default CategoryNode;
