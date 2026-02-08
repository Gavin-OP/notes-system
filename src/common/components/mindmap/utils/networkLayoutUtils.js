/**
 * Network Layout Utilities - Force-directed layout for Obsidian-style network graph
 * 
 * This module provides configuration and helpers for the force simulation layout.
 * The actual simulation runs in NetworkMindmapView using D3-force.
 * 
 * Node size is determined by reference count (number of incoming edges).
 * Hover/click highlights directly connected nodes, others become dimmed.
 */

/**
 * Default configuration for network graph layout
 * Single source of truth for all layout parameters
 */
export const DEFAULT_NETWORK_LAYOUT_CONFIG = {
  // Canvas dimensions (will be overridden by actual container size)
  width: 1200,
  height: 800,
  
  // Force simulation parameters
  simulation: {
    // Link force - controls edge length
    linkDistance: 120,
    linkStrength: 0.4,
    
    // Charge force - node repulsion (negative = repel)
    chargeStrength: -400,
    chargeDistanceMax: 500,
    
    // Center force - pulls nodes toward center
    centerStrength: 0.05,
    
    // Collision force - prevents overlap
    collisionRadius: 40,
    collisionStrength: 0.8,
    
    // Simulation parameters
    alphaDecay: 0.02,
    velocityDecay: 0.4,
  },
  
  // Node sizing based on reference count
  nodeSize: {
    min: 6,
    max: 24,
    // Size = min + (referenceCount / maxReferences) * (max - min)
    // Capped at max
  },
  
  // Edge styling
  edge: {
    strokeWidth: 1.5,
    strokeOpacity: 0.3,
    highlightOpacity: 0.8,
    dimmedOpacity: 0.08,
  },
  
  // Node styling
  node: {
    defaultOpacity: 0.85,
    highlightOpacity: 1,
    dimmedOpacity: 0.15,
    connectedOpacity: 0.9,
  },
};

/**
 * Calculate node size based on reference count
 * More referenced nodes appear larger (more important)
 * 
 * @param {number} referenceCount - Number of edges pointing to this node
 * @param {number} maxReferences - Maximum references in the graph
 * @param {Object} config - Node size config
 * @returns {number} Node radius
 */
export function calculateNodeSize(referenceCount, maxReferences, config = DEFAULT_NETWORK_LAYOUT_CONFIG.nodeSize) {
  const { min, max } = config;
  if (maxReferences === 0) return min;
  
  const ratio = Math.min(referenceCount / maxReferences, 1);
  return min + ratio * (max - min);
}

/**
 * Count references (incoming edges) for each node
 * 
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects with source/target
 * @returns {Map<string, number>} Map of nodeId -> reference count
 */
export function countNodeReferences(nodes, edges) {
  const counts = new Map();
  
  // Initialize all nodes with 0
  nodes.forEach(node => {
    counts.set(node.id, 0);
  });
  
  // Count incoming edges for each node
  edges.forEach(edge => {
    const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
    const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
    
    // Count both directions for bidirectional edges
    if (counts.has(targetId)) {
      counts.set(targetId, counts.get(targetId) + 1);
    }
    if (counts.has(sourceId)) {
      counts.set(sourceId, counts.get(sourceId) + 1);
    }
  });
  
  return counts;
}

/**
 * Get connected node IDs for a given node
 * Used for hover/click highlighting
 * 
 * @param {string} nodeId - The node to find connections for
 * @param {Array} edges - Array of edge objects
 * @returns {Set<string>} Set of connected node IDs
 */
export function getConnectedNodeIds(nodeId, edges) {
  const connected = new Set();
  connected.add(nodeId); // Include the node itself
  
  edges.forEach(edge => {
    const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
    const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
    
    if (sourceId === nodeId) {
      connected.add(targetId);
    }
    if (targetId === nodeId) {
      connected.add(sourceId);
    }
  });
  
  return connected;
}

/**
 * Get connected edge IDs for a given node
 * Used for hover/click highlighting
 * 
 * @param {string} nodeId - The node to find edges for
 * @param {Array} edges - Array of edge objects
 * @returns {Set<string>} Set of connected edge IDs
 */
export function getConnectedEdgeIds(nodeId, edges) {
  const connectedEdges = new Set();
  
  edges.forEach(edge => {
    const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source;
    const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target;
    
    if (sourceId === nodeId || targetId === nodeId) {
      connectedEdges.add(edge.id);
    }
  });
  
  return connectedEdges;
}


