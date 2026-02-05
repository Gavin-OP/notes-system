import { memo } from "react";
import { Handle, Position } from "reactflow";

/**
 * Category Node - Level 1 categories (e.g., "Foundations", "Machine Learning")
 * Reusable across all subjects
 */
const CategoryNode = memo(({ data }) => {
  const { label, color } = data;

  return (
    <div
      className="mindmap-node mindmap-node--category"
      style={{
        backgroundColor: color,
        borderColor: color,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} id="left" />
      <Handle type="target" position={Position.Right} style={{ opacity: 0 }} id="right" />
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} id="top" />
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} id="bottom" />
      <div className="mindmap-node__label">{label}</div>
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} id="source-left" />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} id="source-right" />
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} id="source-top" />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} id="source-bottom" />
    </div>
  );
});

CategoryNode.displayName = "CategoryNode";

export default CategoryNode;

