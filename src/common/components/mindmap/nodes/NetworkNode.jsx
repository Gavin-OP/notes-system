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

function normalizeHexColor(color) {
  if (typeof color !== "string") return null;
  const hex = color.trim();
  if (!hex.startsWith("#")) return null;
  const raw = hex.slice(1);
  if (raw.length === 3) {
    return raw
      .split("")
      .map((char) => char + char)
      .join("")
      .toLowerCase();
  }
  if (raw.length === 6) {
    return raw.toLowerCase();
  }
  return null;
}

function adjustHexColor(color, amount) {
  const normalized = normalizeHexColor(color);
  if (!normalized) return color;
  const channels = [0, 2, 4].map((offset) =>
    parseInt(normalized.slice(offset, offset + 2), 16)
  );
  const adjusted = channels.map((channel) => {
    const next = Math.round(channel + (amount >= 0 ? (255 - channel) * amount : channel * amount));
    return Math.max(0, Math.min(255, next));
  });
  return `#${adjusted.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

const NetworkNode = ({ data, selected }) => {
  const {
    label,
    color,
    size = 10,
    isHighlighted = false,
    isDimmed = false,
    conceptLevel = "core",
  } = data;

  // Determine visual state class
  let stateClass = "";
  if (isHighlighted) {
    stateClass = "network-node--highlighted";
  } else if (isDimmed) {
    stateClass = "network-node--dimmed";
  }

  const safeLabel = typeof label === "string" ? label : "";
  const level = typeof conceptLevel === "string" ? conceptLevel.toLowerCase() : "core";
  const levelClass = level === "sub" ? "network-node--level-sub" : "network-node--level-core";
  const displayColor =
    level === "sub" ? adjustHexColor(color, 0.22) : adjustHexColor(color, -0.06);
  const nodeDiameter = Math.max(size * 1.65, 60, safeLabel.length * 2.5);

  return (
    <div
      className={`network-node ${levelClass} ${stateClass} ${selected ? "network-node--selected" : ""}`}
      style={{
        "--node-color": displayColor,
        "--node-size": `${size}px`,
        "--node-diameter": `${nodeDiameter}px`,
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
      <div className="network-node__circle">
        <div className="network-node__label">{label}</div>
      </div>
    </div>
  );
};

export default memo(NetworkNode);

