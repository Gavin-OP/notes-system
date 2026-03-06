import { memo } from "react";
import { Handle, Position } from "reactflow";

/**
 * Center Node - The main subject node (e.g., "Data Science")
 * Reusable across all subjects
 * 
 * Connections: Only LEFT and RIGHT source handles for deterministic
 * horizontal layout. No automatic handle selection.
 */
const CenterNode = memo(({ data }) => {
  const { label } = data;

  return (
    <div className="mindmap-node mindmap-node--center">
      <div className="mindmap-node__label">{label}</div>
      {/* Source handles - only left and right for deterministic horizontal connections */}
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="source" position={Position.Left} id="left" />
    </div>
  );
});

CenterNode.displayName = "CenterNode";

export default CenterNode;
