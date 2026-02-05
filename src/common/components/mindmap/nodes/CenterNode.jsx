import { memo } from "react";
import { Handle, Position } from "reactflow";

/**
 * Center Node - The main subject node (e.g., "Data Science")
 * Reusable across all subjects
 */
const CenterNode = memo(({ data }) => {
  const { label } = data;

  return (
    <div className="mindmap-node mindmap-node--center">
      <div className="mindmap-node__label">{label}</div>
      {/* Hidden handles for edge connections */}
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} id="top" />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} id="right" />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} id="bottom" />
      <Handle type="source" position={Position.Left} style={{ opacity: 0 }} id="left" />
    </div>
  );
});

CenterNode.displayName = "CenterNode";

export default CenterNode;

