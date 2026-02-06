/**
 * Mindmap Components - Main export file
 * Provides reusable mindmap visualization for any subject
 */

// Main view components
export { default as MindmapView } from "./MindmapView";
export { default as RadialMindmapView } from "./RadialMindmapView";
export { default as NetworkMindmapView } from "./NetworkMindmapView";

// Node components (for React Flow)
export { CenterNode, CategoryNode, ConceptNode, NetworkNode } from "./nodes";

// Utilities - Hierarchical view
export {
  loadGraphData,
  convertToHierarchicalFormat,
  calculateOrthogonalMindmapLayout,
  normalizeCategoryId,
} from "./utils";

// Radial tree utilities (for ECharts)
export {
  graphToRadialTree,
  makeRadialTreeOption,
} from "./utils/radialTreeUtils";

// Network graph utilities (for force-directed layout)
export {
  DEFAULT_NETWORK_LAYOUT_CONFIG,
  calculateNodeSize,
  countNodeReferences,
  getConnectedNodeIds,
  getConnectedEdgeIds,
} from "./utils/networkLayoutUtils";

export {
  convertToNetworkFormat,
  convertEdgesToReactFlow,
} from "./utils/networkGraphLoader";
