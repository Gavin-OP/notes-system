/**
 * Load and process knowledge graph data
 */

/**
 * Load graph data from JSON file
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
 * Convert graph data to React Flow format
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
      type: "concept", // custom node type
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

