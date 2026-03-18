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

  const networkViewConfig = graphData.viewConfigs?.network ?? {};
  const concepts = graphData.nodes ?? [];
  const categories = graphData.categories ?? [];
  const rawEdges =
    (Array.isArray(graphData.networkEdges) && graphData.networkEdges.length > 0
      ? graphData.networkEdges
      : graphData.edges) ?? [];
  const rawHierarchyEdges = graphData.conceptHierarchyEdges ?? [];
  const clusters =
    graphData.networkClusters ??
    networkViewConfig.clusters ??
    [];
  const nodeSizeField = networkViewConfig.nodeSizeField ?? "networkSize";
  const conceptLevelField = networkViewConfig.conceptLevelField ?? "conceptLevel";
  const parentConceptField = networkViewConfig.parentConceptField ?? "parentConceptId";
  const hierarchyEdgeType = networkViewConfig.hierarchyEdgeType ?? "concept_hierarchy";
  const focusNodeIds = networkViewConfig.focusNodeIds ?? [];
  const focusSubject =
    graphData.meta?.focusSubject ?? networkViewConfig.focusSubject ?? null;

  // Build category color map for quick lookup
  const categoryColorMap = new Map();
  categories.forEach((cat) => {
    categoryColorMap.set(cat.id, cat.color);
    // Also map by display name for fallback
    if (cat.name) {
      categoryColorMap.set(normalizeCategoryId(cat.name), cat.color);
    }
  });
  clusters.forEach((cluster) => {
    if (cluster?.id && cluster?.color) {
      categoryColorMap.set(cluster.id, cluster.color);
    }
  });

  const relatedEdges = [];
  const relatedEdgeSet = new Set(); // Prevent duplicates only for reciprocal duplicates
  const nonHierarchyRawEdges = rawEdges.filter(
    (edge) => edge?.source && edge?.target && edge.type !== hierarchyEdgeType
  );
  nonHierarchyRawEdges.forEach((edge) => {
    const sourceId = edge.source;
    const targetId = edge.target;
    const edgeKey = `${sourceId}-${targetId}`;
    const reverseKey = `${targetId}-${sourceId}`;
    const isBidirectional = edge.bidirectional !== false;

    if (relatedEdgeSet.has(edgeKey) || (isBidirectional && relatedEdgeSet.has(reverseKey))) {
      return;
    }

    relatedEdgeSet.add(edgeKey);
    relatedEdges.push({
      id: `e-network-${subjectId}-${sourceId}-${targetId}`,
      source: sourceId,
      target: targetId,
      type: edge.type, // 'prerequisite' or 'related'
      strength: edge.strength ?? 0.5,
      frequency: edge.frequency ?? 1,
      weight: edge.weight ?? edge.strength ?? 0.5,
      edgeKind: "related",
    });
  });

  // Build hierarchy edges (source = parent, target = sub concept)
  const hierarchyEdgeSources =
    Array.isArray(rawHierarchyEdges) && rawHierarchyEdges.length > 0
      ? rawHierarchyEdges
      : rawEdges.filter((edge) => edge?.type === hierarchyEdgeType);
  const hierarchyEdges = [];
  const hierarchyEdgeSet = new Set();
  hierarchyEdgeSources.forEach((edge) => {
    if (!edge?.source || !edge?.target) return;
    const key = `${edge.source}-${edge.target}`;
    if (hierarchyEdgeSet.has(key)) return;
    hierarchyEdgeSet.add(key);
    hierarchyEdges.push({
      id: edge.id ?? `e-hierarchy-${subjectId}-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: hierarchyEdgeType,
      strength: edge.strength ?? 1,
      frequency: edge.frequency ?? 1,
      weight: edge.weight ?? 1,
      edgeKind: "hierarchy",
    });
  });

  const edges = [...relatedEdges, ...hierarchyEdges];

  // Count references for node sizing
  const referenceCounts = countNodeReferences(concepts, relatedEdges);
  const maxReferences = Math.max(...referenceCounts.values(), 1);

  // Build nodes array
  const nodes = concepts.map((concept) => {
    const categoryId =
      concept.clusterId ??
      concept.categoryId ??
      normalizeCategoryId(concept.category);
    const color = categoryColorMap.get(categoryId) ?? "#95A5A6";
    const referenceCount = referenceCounts.get(concept.id) ?? 0;
    const explicitSize =
      typeof concept[nodeSizeField] === "number" && Number.isFinite(concept[nodeSizeField])
        ? concept[nodeSizeField]
        : null;
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
        size: explicitSize ?? size,
        referenceCount,
        importance: concept.importance ?? "medium",
        noteUrl: concept.noteUrl,
        categoryId,
        clusterId: concept.clusterId ?? categoryId,
        clusterLabel: concept.clusterLabel ?? concept.subject ?? concept.category ?? "",
        subject: concept.subject ?? subjectId,
        conceptLevel: concept[conceptLevelField] ?? concept.conceptLevel ?? null,
        parentConceptId: concept[parentConceptField] ?? concept.parentConceptId ?? null,
        // Visual states - will be updated by hover/click
        isHighlighted: false,
        isDimmed: false,
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
      focusSubject,
      focusNodeIds,
      clusters,
      parentSubLayout: networkViewConfig.parentSubLayout ?? null,
      hasHierarchyData:
        hierarchyEdges.length > 0 ||
        concepts.some((concept) => Boolean(concept[parentConceptField] ?? concept.parentConceptId)),
      hierarchyEdgeType,
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
  const relatedEdges = edges.filter((edge) => edge.edgeKind !== "hierarchy");
  const strengths = relatedEdges
    .map((edge) => Number(edge.strength))
    .filter((value) => Number.isFinite(value));
  const minStrength = strengths.length > 0 ? Math.min(...strengths) : 0;
  const maxStrength = strengths.length > 0 ? Math.max(...strengths) : 1;
  const minWidth = config.edge.strokeWidth * 0.7;
  const maxWidth = config.edge.strokeWidth * 2.2;

  const mapStrengthToWidth = (strength) => {
    const numericStrength = Number(strength);
    if (!Number.isFinite(numericStrength) || maxStrength <= minStrength) {
      return config.edge.strokeWidth;
    }
    const ratio = (numericStrength - minStrength) / (maxStrength - minStrength);
    return minWidth + ratio * (maxWidth - minWidth);
  };

  return edges.map((edge) => {
    const isHierarchyEdge = edge.edgeKind === "hierarchy" || edge.type === "concept_hierarchy";
    const baseStrokeWidth = mapStrengthToWidth(edge.strength);
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: "straight", // Straight lines for network view
      animated: false,
      style: {
        stroke: isHierarchyEdge ? "#7A7A8C" : "#9AA4B2",
        strokeWidth: isHierarchyEdge ? Math.max(1.4, config.edge.strokeWidth * 0.75) : baseStrokeWidth,
        opacity: isHierarchyEdge ? Math.min(0.88, config.edge.strokeOpacity + 0.08) : config.edge.strokeOpacity,
        strokeDasharray: isHierarchyEdge ? "6 3" : "none",
      },
      data: {
        type: edge.type,
        edgeKind: edge.edgeKind ?? "related",
        strength: edge.strength,
        baseStrokeWidth: isHierarchyEdge
          ? Math.max(1.4, config.edge.strokeWidth * 0.75)
          : baseStrokeWidth,
      },
    };
  });
}

