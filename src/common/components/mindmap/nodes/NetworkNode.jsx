/**
 * NetworkNode - Obsidian-style circular node for network graph view
 * 
 * Features:
 * - Circular shape with size based on importance/reference count
 * - Color indicates category
 * - Hover shows label, click navigates to note
 * - Supports highlight/dim states for focus interactions
 */
import { memo } from "react";
import { Handle, Position } from "reactflow";

const NetworkNode = ({ data, selected }) => {
  const {
    label,
    color,
    size = 10,
    isHighlighted = false,
    isDimmed = false,
    showLabel = false,
  } = data;

  // Determine visual state class
  let stateClass = "";
  if (isHighlighted) {
    stateClass = "network-node--highlighted";
  } else if (isDimmed) {
    stateClass = "network-node--dimmed";
  }

  return (
    <div
      className={`network-node ${stateClass} ${selected ? "network-node--selected" : ""}`}
      style={{
        "--node-color": color,
        "--node-size": `${size}px`,
      }}
    >
      {/* Handles for edges - all directions for force-directed layout */}
      <Handle type="target" position={Position.Top} id="top" className="network-node__handle" />
      <Handle type="target" position={Position.Bottom} id="bottom" className="network-node__handle" />
      <Handle type="target" position={Position.Left} id="left" className="network-node__handle" />
      <Handle type="target" position={Position.Right} id="right" className="network-node__handle" />
      <Handle type="source" position={Position.Top} id="top" className="network-node__handle" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="network-node__handle" />
      <Handle type="source" position={Position.Left} id="left" className="network-node__handle" />
      <Handle type="source" position={Position.Right} id="right" className="network-node__handle" />
      
      {/* Node circle */}
      <div className="network-node__circle" />
      
      {/* Label - shown on hover or when highlighted */}
      {(showLabel || isHighlighted) && (
        <div className="network-node__label">
          {label}
        </div>
      )}
    </div>
  );
};

export default memo(NetworkNode);


