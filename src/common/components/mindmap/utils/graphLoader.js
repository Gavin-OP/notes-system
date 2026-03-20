/**
 * Graph Data Loader and Converters
 * Utilities for loading and processing knowledge graph data for mindmap visualization
 */

import { normalizeCategoryId } from "./normalize";

async function tryFetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function fetchSubjectGraphFromApi(subjectId) {
  const configuredApiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const candidatePaths = [
    configuredApiBase ? `${configuredApiBase}/api/subjects/${subjectId}/graph` : null,
    `${import.meta.env.BASE_URL}api/subjects/${subjectId}/graph`,
    `/api/subjects/${subjectId}/graph`,
  ].filter(Boolean);

  for (const path of candidatePaths) {
    const data = await tryFetchJson(path);
    if (data) return data;
  }
  return null;
}

/**
 * Load graph data from JSON file
 * @param {string} subjectId - The subject identifier (e.g., "data-science", "statistics")
 * @returns {Promise<Object|null>} Graph data or null on error
 */
export async function loadGraphData(subjectId) {
  try {
    const staticData = await tryFetchJson(
      `${import.meta.env.BASE_URL}graphs/${subjectId}-graph.json`
    );
    if (staticData) return staticData;

    const apiData = await fetchSubjectGraphFromApi(subjectId);
    if (apiData) return apiData;

    throw new Error("Failed to load graph data from API and static fallback");
  } catch (error) {
    console.error("Error loading graph data:", error);
    return null;
  }
}

/**
 * Load network graph data from subject-specific network JSON file.
 * Network view now reads a dedicated file because it may contain
 * cross-subject nodes and cluster metadata.
 *
 * @param {string} subjectId - The subject identifier (e.g., "data-science")
 * @returns {Promise<Object|null>} Network graph data or null on error
 */
export async function loadNetworkGraphData(subjectId) {
  try {
    const dedicatedNetworkData = await tryFetchJson(
      `${import.meta.env.BASE_URL}graphs/${subjectId}-network-graph.json`
    );
    if (dedicatedNetworkData) return dedicatedNetworkData;

    const apiData = await fetchSubjectGraphFromApi(subjectId);
    if (apiData) return apiData;

    const staticData = await tryFetchJson(
      `${import.meta.env.BASE_URL}graphs/${subjectId}-graph.json`
    );
    if (staticData) return staticData;

    throw new Error("Failed to load network graph data from API and static fallback");
  } catch (error) {
    console.error("Error loading network graph data:", error);
    return null;
  }
}

/**
 * Convert graph data to React Flow format for orthogonal mindmap view
 * 
 * Creates a three-level hierarchy:
 * - Center Node (subject)
 * - Category Nodes (main topics)
 * - Concept Nodes (individual concepts)
 * 
 * Uses deterministic handle selection (left/right) based on relative positions
 * for clean, consistent bezier curve edges.
 * 
 * @param {Object} graphData - Raw graph data from JSON
 * @param {Object} layoutResult - Positioned nodes from layout algorithm
 * @returns {Object} { nodes, edges } in React Flow format
 */
export function convertToHierarchicalFormat(graphData, layoutResult) {
  if (!graphData || !layoutResult) return { nodes: [], edges: [] };

  const { centerNode, categoryNodes, conceptNodes } = layoutResult;
  const nodes = [];
  const edges = [];

  // Helper: Determine which handles to use based on relative position
  const getHandles = (sourcePos, targetPos) => {
    const isTargetRight = targetPos.x > sourcePos.x;
    return {
      sourceHandle: isTargetRight ? "right" : "left",
      targetHandle: isTargetRight ? "left" : "right",
    };
  };

  // Extract subject ID from center node for unique edge IDs
  const subjectId = centerNode.id.replace(/^center-/, "");

  // 1. Center Node (subject)
  nodes.push({
    id: centerNode.id,
    type: "centerNode",
    position: centerNode.position,
    data: {
      label: graphData.meta.subjectName,
      title: graphData.meta.subjectName,
      isCenter: true,
    },
    draggable: false,
  });

  // 2. Category Nodes (main topics)
  categoryNodes.forEach((category) => {
    nodes.push({
      id: category.id,
      type: "categoryNode",
      position: category.position,
      data: {
        label: category.displayName,
        title: category.displayName,
        color: category.color,
        isCategory: true,
      },
      draggable: false,
    });

    // Edge from center to category - deterministic handles
    const handles = getHandles(centerNode.position, category.position);
    edges.push({
      id: `e-${subjectId}-${centerNode.id}-${category.id}`,
      source: centerNode.id,
      target: category.id,
      sourceHandle: handles.sourceHandle,
      targetHandle: handles.targetHandle,
      type: "bezier",
      style: {
        stroke: category.color,
        strokeWidth: 2.5,
        opacity: 0.7,
      },
    });
  });

  // 3. Concept Nodes (individual concepts)
  conceptNodes.forEach((concept) => {
    // Use categoryId if already normalized, otherwise normalize from category name
    const categoryId = concept.categoryId ?? normalizeCategoryId(concept.category);
    const categoryNode = categoryNodes.find(c => c.categoryId === categoryId);

    // Only keep fields actually used by ConceptNode component and MindmapView
    nodes.push({
      id: concept.id,
      type: "conceptNode",
      position: concept.position,
      data: {
        label: concept.displayName ?? concept.displayTitle ?? concept.title ?? concept.name,
        color: concept.categoryColor,
        importance: concept.importance,
        noteUrl: concept.noteUrl,
      },
      draggable: false,
    });

    // Edge from category to concept - deterministic handles
    if (categoryNode) {
      const handles = getHandles(categoryNode.position, concept.position);
      edges.push({
        id: `e-${subjectId}-${categoryNode.id}-${concept.id}`,
        source: categoryNode.id,  // Use categoryNode.id directly (safer)
        target: concept.id,
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
        type: "bezier",
        style: {
          stroke: concept.categoryColor,
          strokeWidth: 1.5,
          opacity: 0.6,
        },
      });
    }
  });

  return { nodes, edges };
}
