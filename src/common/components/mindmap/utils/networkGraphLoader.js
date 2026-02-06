/**
 * Network Graph Loader - Converts graph data to force-directed network format
 * 
 * Unlike the hierarchical view, this includes ALL edges from the graph data:
 * - Concept-to-concept edges (prerequisites, related concepts)
 * - No center node or category nodes - just concepts
 * 
 * Node ID convention: concept.id (same as in graph JSON)
 * Edge ID convention: e-network-${source}-${target}
 */

import { normalizeCategoryId } from "./normalize";
import { 
  countNodeReferences, 
  calculateNodeSize,
  DEFAULT_NETWORK_LAYOUT_CONFIG,
} from "./networkLayoutUtils";

/**
 * Convert graph data to network format for force-directed layout
 * 
 * @param {Object} graphData - Raw graph data from JSON
 * @param {string} subjectId - Subject identifier for edge IDs
 * @returns {Object} { nodes, edges, metadata } for network view
 */
export function convertToNetworkFormat(graphData, subjectId) {
  if (!graphData) return { nodes: [], edges: [], metadata: {} };

  const concepts = graphData.nodes ?? [];
  const categories = graphData.categories ?? [];
  const rawEdges = graphData.edges ?? [];

  // Build category color map for quick lookup
  const categoryColorMap = new Map();
  categories.forEach((cat) => {
    categoryColorMap.set(cat.id, cat.color);
    // Also map by display name for fallback
    if (cat.name) {
      categoryColorMap.set(normalizeCategoryId(cat.name), cat.color);
    }
  });

  // Build edges array - all concept-to-concept edges
  const edges = [];
  const edgeSet = new Set(); // Prevent duplicates
  
  rawEdges.forEach((edge) => {
    const sourceId = edge.source;
    const targetId = edge.target;
    const edgeKey = `${sourceId}-${targetId}`;
    const reverseKey = `${targetId}-${sourceId}`;
    
    // Skip if already added (handle bidirectional edges)
    if (edgeSet.has(edgeKey) || edgeSet.has(reverseKey)) {
      return;
    }
    
    edgeSet.add(edgeKey);
    
    edges.push({
      id: `e-network-${subjectId}-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: edge.type, // 'prerequisite' or 'related'
      strength: edge.strength ?? 0.5,
    });
  });

  // Count references for node sizing
  const referenceCounts = countNodeReferences(concepts, edges);
  const maxReferences = Math.max(...referenceCounts.values(), 1);

  // Build nodes array
  const nodes = concepts.map((concept) => {
    const categoryId = concept.categoryId ?? normalizeCategoryId(concept.category);
    const color = categoryColorMap.get(categoryId) ?? "#95A5A6";
    const referenceCount = referenceCounts.get(concept.id) ?? 0;
    const size = calculateNodeSize(
      referenceCount,
      maxReferences,
      DEFAULT_NETWORK_LAYOUT_CONFIG.nodeSize
    );

    return {
      id: concept.id,
      // Position will be set by force simulation
      position: { x: 0, y: 0 },
      type: "networkNode",
      data: {
        label: concept.displayTitle ?? concept.title,
        color,
        size,
        referenceCount,
        importance: concept.importance ?? "medium",
        noteUrl: concept.noteUrl,
        categoryId,
        // Visual states - will be updated by hover/click
        isHighlighted: false,
        isDimmed: false,
        showLabel: referenceCount >= maxReferences * 0.5, // Show label for important nodes
      },
      draggable: true, // Network nodes are draggable
    };
  });

  return {
    nodes,
    edges,
    metadata: {
      subjectId,
      subjectName: graphData.meta?.subjectName ?? subjectId,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      maxReferences,
    },
  };
}

/**
 * Convert network edges to React Flow edge format
 * 
 * @param {Array} edges - Network edges
 * @param {Object} config - Layout config for styling
 * @returns {Array} React Flow formatted edges
 */
export function convertEdgesToReactFlow(edges, config = DEFAULT_NETWORK_LAYOUT_CONFIG) {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: "straight", // Straight lines for network view
    animated: false,
    style: {
      stroke: "#666",
      strokeWidth: config.edge.strokeWidth,
      opacity: config.edge.strokeOpacity,
    },
    data: {
      type: edge.type,
      strength: edge.strength,
    },
  }));
}

