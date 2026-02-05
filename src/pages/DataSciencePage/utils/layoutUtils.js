/**
 * Layout utilities for knowledge graph visualization
 */

/**
 * Radial layout - arrange nodes in a circle around the center
 * Categories are distributed radially, nodes within each category are arranged in a fan shape
 */
export function calculateRadialLayout(categories, nodes, config = {}) {
  const {
    centerX = 500,
    centerY = 400,
    mainRadius = 300,
    subRadius = 150,
  } = config;

  const categoryPositions = new Map();
  const angleStep = (2 * Math.PI) / categories.length;

  // Calculate position for each category
  categories.forEach((category, idx) => {
    const angle = angleStep * idx;
    const x = centerX + mainRadius * Math.cos(angle);
    const y = centerY + mainRadius * Math.sin(angle);
    categoryPositions.set(category.id, { x, y, angle });
  });

  // Position nodes within each category
  const positionedNodes = nodes.map((node) => {
    const categoryId = node.category.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-");
    const categoryPos = categoryPositions.get(categoryId);

    if (!categoryPos) {
      // Fallback to center if category not found
      return {
        ...node,
        position: { x: centerX, y: centerY },
      };
    }

    // Find all nodes in the same category
    const categoryNodes = nodes.filter((n) => {
      const nCategoryId = n.category.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-");
      return nCategoryId === categoryId;
    });

    const nodeIndex = categoryNodes.findIndex((n) => n.id === node.id);
    const totalNodes = categoryNodes.length;

    // Arrange nodes in a fan shape around the category position
    const fanAngle = Math.PI / 3; // 60 degrees fan
    const startAngle = categoryPos.angle - fanAngle / 2;
    const angleIncrement = totalNodes > 1 ? fanAngle / (totalNodes - 1) : 0;
    const nodeAngle = startAngle + angleIncrement * nodeIndex;

    const x = categoryPos.x + subRadius * Math.cos(nodeAngle);
    const y = categoryPos.y + subRadius * Math.sin(nodeAngle);

    return {
      ...node,
      position: { x, y },
    };
  });

  return positionedNodes;
}

/**
 * Force-directed layout simulation (simplified version)
 * This is a basic implementation - for production, consider using d3-force
 */
export function calculateForceLayout(nodes, edges, config = {}) {
  const {
    width = 1000,
    height = 800,
    iterations = 100,
    repulsion = 1000,
    attraction = 0.01,
  } = config;

  // Initialize random positions
  const positionedNodes = nodes.map((node) => ({
    ...node,
    position: {
      x: Math.random() * width,
      y: Math.random() * height,
    },
    vx: 0,
    vy: 0,
  }));

  // Run simulation
  for (let iteration = 0; iteration < iterations; iteration++) {
    // Reset forces
    positionedNodes.forEach((node) => {
      node.fx = 0;
      node.fy = 0;
    });

    // Repulsion between all nodes
    for (let i = 0; i < positionedNodes.length; i++) {
      for (let j = i + 1; j < positionedNodes.length; j++) {
        const nodeA = positionedNodes[i];
        const nodeB = positionedNodes[j];

        const dx = nodeB.position.x - nodeA.position.x;
        const dy = nodeB.position.y - nodeA.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = repulsion / (distance * distance);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        nodeA.fx -= fx;
        nodeA.fy -= fy;
        nodeB.fx += fx;
        nodeB.fy += fy;
      }
    }

    // Attraction along edges
    edges.forEach((edge) => {
      const source = positionedNodes.find((n) => n.id === edge.source);
      const target = positionedNodes.find((n) => n.id === edge.target);

      if (source && target) {
        const dx = target.position.x - source.position.x;
        const dy = target.position.y - source.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = distance * attraction;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;

        source.fx += fx;
        source.fy += fy;
        target.fx -= fx;
        target.fy -= fy;
      }
    });

    // Update positions
    positionedNodes.forEach((node) => {
      node.vx = (node.vx + node.fx) * 0.8; // damping
      node.vy = (node.vy + node.fy) * 0.8;
      node.position.x += node.vx;
      node.position.y += node.vy;

      // Keep nodes within bounds
      node.position.x = Math.max(50, Math.min(width - 50, node.position.x));
      node.position.y = Math.max(50, Math.min(height - 50, node.position.y));
    });
  }

  return positionedNodes.map((node) => ({
    ...node,
    vx: undefined,
    vy: undefined,
    fx: undefined,
    fy: undefined,
  }));
}

/**
 * Hierarchical layout - arrange nodes by learning phase
 */
export function calculateHierarchicalLayout(nodes, config = {}) {
  const {
    startX = 100,
    startY = 100,
    phaseSpacing = 300,
    nodeSpacing = 120,
  } = config;

  // Group nodes by phase
  const phaseGroups = new Map();
  nodes.forEach((node) => {
    const phase = node.learningPhase;
    if (!phaseGroups.has(phase)) {
      phaseGroups.set(phase, []);
    }
    phaseGroups.get(phase).push(node);
  });

  // Sort phases
  const sortedPhases = Array.from(phaseGroups.keys()).sort((a, b) => a - b);

  const positionedNodes = [];

  sortedPhases.forEach((phase, phaseIndex) => {
    const phaseNodes = phaseGroups.get(phase);
    const x = startX + phaseIndex * phaseSpacing;

    phaseNodes.forEach((node, nodeIndex) => {
      const y = startY + nodeIndex * nodeSpacing;
      positionedNodes.push({
        ...node,
        position: { x, y },
      });
    });
  });

  return positionedNodes;
}

