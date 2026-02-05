/**
 * Graph Data Loader and Converters
 * Reusable utilities for loading and processing knowledge graph data
 * Supports different view modes: hierarchical (图1), sunburst (图2), network (图3)
 */

/**
 * Load graph data from JSON file
 * @param {string} subjectId - The subject identifier (e.g., "data-science", "statistics")
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
 * Convert graph data to React Flow format for hierarchical view (图1 style)
 * Creates: Center Node → Category Nodes → Concept Nodes
 * Only shows edges between these levels (no concept-to-concept edges)
 */
export function convertToHierarchicalFormat(graphData, layoutResult) {
  if (!graphData || !layoutResult) return { nodes: [], edges: [] };

  const { centerNode, categoryNodes, conceptNodes } = layoutResult;
  const nodes = [];
  const edges = [];

  // 1. Center Node
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

  // 2. Category Nodes
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

    // Edge from center to category
    edges.push({
      id: `edge-center-${category.id}`,
      source: centerNode.id,
      target: category.id,
      type: "straight",
      style: {
        stroke: category.color,
        strokeWidth: 2.5,
        opacity: 0.6,
      },
    });
  });

  // 3. Concept Nodes
  conceptNodes.forEach((concept) => {
    const categoryId = concept.category
      .toLowerCase()
      .replace(/\s+&\s+/g, "-")
      .replace(/\s+/g, "-");

    nodes.push({
      id: concept.id,
      type: "conceptNode",
      position: concept.position,
      data: {
        ...concept,
        label: concept.title,
        color: concept.categoryColor,
        noteUrl: concept.noteUrl,
      },
      draggable: false,
    });

    // Edge from category to concept
    edges.push({
      id: `edge-${categoryId}-${concept.id}`,
      source: `category-${categoryId}`,
      target: concept.id,
      type: "straight",
      style: {
        stroke: concept.categoryColor,
        strokeWidth: 1.5,
        opacity: 0.5,
      },
    });
  });

  return { nodes, edges };
}

/**
 * Convert graph data to React Flow format (for network view - 图3)
 */
export function convertToReactFlowFormat(graphData, positionedNodes) {
  if (!graphData) return { nodes: [], edges: [] };

  // Create a map of positioned nodes for quick lookup
  const positionMap = new Map(
    positionedNodes.map((n) => [n.id, n.position])
  );

  // Convert nodes
  const nodes = graphData.nodes.map((node) => {
    const position = positionMap.get(node.id) || { x: 0, y: 0 };
    const categoryData = graphData.categories.find(
      (cat) => cat.name === node.category
    );

    return {
      id: node.id,
      type: "concept",
      position,
      data: {
        ...node,
        color: categoryData?.color || "#95A5A6",
        label: node.title,
      },
    };
  });

  // Convert edges
  const edges = graphData.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.bidirectional ? "default" : "smoothstep",
    animated: edge.type === "prerequisite",
    label: edge.label,
    style: {
      stroke: edge.type === "prerequisite" ? "#FF7675" : "#95A5A6",
      strokeWidth: edge.strength * 2,
    },
    markerEnd: {
      type: "arrowclosed",
      color: edge.type === "prerequisite" ? "#FF7675" : "#95A5A6",
    },
  }));

  return { nodes, edges };
}

/**
 * Get related concepts for a given concept ID
 */
export function getRelatedConcepts(graphData, conceptId) {
  if (!graphData) return [];

  const relatedIds = new Set();

  // Find all edges connected to this concept
  graphData.edges.forEach((edge) => {
    if (edge.source === conceptId) {
      relatedIds.add(edge.target);
    }
    if (edge.target === conceptId) {
      relatedIds.add(edge.source);
    }
  });

  // Get the full node data for related concepts
  return graphData.nodes.filter((node) => relatedIds.has(node.id));
}

