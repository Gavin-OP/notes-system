import { memo } from "react";

const ClusterBackgroundNode = ({ data }) => {
  const {
    label,
    color = "#4A90E2",
    width = 300,
    height = 200,
    isFocus = false,
  } = data ?? {};

  return (
    <div
      className={`network-cluster-node ${isFocus ? "network-cluster-node--focus" : ""}`}
      style={{
        "--cluster-color": color,
        width: `${Math.max(width, 120)}px`,
        height: `${Math.max(height, 80)}px`,
      }}
    >
      <div className="network-cluster-node__label">{label}</div>
    </div>
  );
};

export default memo(ClusterBackgroundNode);
