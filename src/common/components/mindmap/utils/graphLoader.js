/**
 * Graph Data Loader and Converters
 * Utilities for loading and processing knowledge graph data for mindmap visualization
 */

import { normalizeCategoryId } from "./normalize";

/**
 * Load graph data from JSON file
 * @param {string} subjectId - The subject identifier (e.g., "data-science", "statistics")
 * @returns {Promise<Object|null>} Graph data or null on error
 */
export async function loadGraphData(subjectId) {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}graphs/${subjectId}-graph.json`
    );
    if (!response.ok) {
      throw new Error(`Failed to load graph: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error loading graph data:", error);
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
        label: concept.title,
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
