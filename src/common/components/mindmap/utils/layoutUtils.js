/**
 * Layout Utilities for Knowledge Graph Visualization
 * Supports multiple layout styles for different mindmap views
 */

/**
 * Hierarchical Radial Layout (图1 style)
 * Creates a clean tree-like structure similar to XMind:
 * - Center node (subject name) in the middle
 * - Category nodes arranged radially around center
 * - Concept nodes listed, extending outward from each category
 * 
 * @param {Array} categories - Category data from graph
 * @param {Array} nodes - Node data from graph
 * @param {Object} config - Layout configuration
 */
export function calculateHierarchicalRadialLayout(categories, nodes, config = {}) {
  const {
    centerX = 600,
    centerY = 450,
    categoryRadius = 220,
    conceptStartDistance = 100,
    conceptVerticalGap = 45,
    subjectId = "subject",
  } = config;

  const result = {
    centerNode: {
      id: `center-${subjectId}`,
      position: { x: centerX, y: centerY },
    },
    categoryNodes: [],
    conceptNodes: [],
  };

  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);
  const categoryCount = sortedCategories.length;

  sortedCategories.forEach((category, idx) => {
    // Calculate angle - distribute categories evenly around the circle
    // Start from top (-90 degrees) and go clockwise
    const angle = (-Math.PI / 2) + (idx * (2 * Math.PI) / categoryCount);
    
    const categoryX = centerX + categoryRadius * Math.cos(angle);
    const categoryY = centerY + categoryRadius * Math.sin(angle);

    result.categoryNodes.push({
      id: `category-${category.id}`,
      categoryId: category.id,
      name: category.name,
      displayName: category.displayName,
      color: category.color,
      position: { x: categoryX, y: categoryY },
      angle: angle,
    });

    // Get concepts for this category
    const categoryNodesList = nodes.filter((node) => {
      const nodeCategoryId = node.category
        .toLowerCase()
        .replace(/\s+&\s+/g, "-")
        .replace(/\s+/g, "-");
      return nodeCategoryId === category.id;
    });

    // Position concepts in a list extending outward from the category
    categoryNodesList.forEach((node, nodeIdx) => {
      // Calculate total height of concept list
      const totalHeight = (categoryNodesList.length - 1) * conceptVerticalGap;
      const startYOffset = -totalHeight / 2;
      const verticalPosition = startYOffset + nodeIdx * conceptVerticalGap;

      // Extend concepts in the same direction as the category from center
      const outwardDistance = conceptStartDistance + 70;
      
      // Move outward from category in the radial direction
      let conceptX = categoryX + outwardDistance * Math.cos(angle);
      let conceptY = categoryY + outwardDistance * Math.sin(angle);
      
      // Add perpendicular offset for list stacking
      const perpAngle = angle + Math.PI / 2;
      conceptX += verticalPosition * Math.cos(perpAngle);
      conceptY += verticalPosition * Math.sin(perpAngle);

      result.conceptNodes.push({
        ...node,
        position: { x: conceptX, y: conceptY },
        categoryColor: category.color,
      });
    });
  });

  return result;
}

/**
 * Simple Radial Layout - for network view (图3)
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

  categories.forEach((category, idx) => {
    const angle = angleStep * idx;
    const x = centerX + mainRadius * Math.cos(angle);
    const y = centerY + mainRadius * Math.sin(angle);
    categoryPositions.set(category.id, { x, y, angle });
  });

  const positionedNodes = nodes.map((node) => {
    const categoryId = node.category.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-");
    const categoryPos = categoryPositions.get(categoryId);

    if (!categoryPos) {
      return { ...node, position: { x: centerX, y: centerY } };
    }

    const categoryNodes = nodes.filter((n) => {
      const nCategoryId = n.category.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-");
      return nCategoryId === categoryId;
    });

    const nodeIndex = categoryNodes.findIndex((n) => n.id === node.id);
    const totalNodes = categoryNodes.length;
    const fanAngle = Math.PI / 3;
    const startAngle = categoryPos.angle - fanAngle / 2;
    const angleIncrement = totalNodes > 1 ? fanAngle / (totalNodes - 1) : 0;
    const nodeAngle = startAngle + angleIncrement * nodeIndex;

    const x = categoryPos.x + subRadius * Math.cos(nodeAngle);
    const y = categoryPos.y + subRadius * Math.sin(nodeAngle);

    return { ...node, position: { x, y } };
  });

  return positionedNodes;
}

/**
 * Hierarchical layout - arrange nodes by learning phase (for learning path)
 */
export function calculateHierarchicalLayout(nodes, config = {}) {
  const {
    startX = 100,
    startY = 100,
    phaseSpacing = 300,
    nodeSpacing = 120,
  } = config;

  const phaseGroups = new Map();
  nodes.forEach((node) => {
    const phase = node.learningPhase;
    if (!phaseGroups.has(phase)) {
      phaseGroups.set(phase, []);
    }
    phaseGroups.get(phase).push(node);
  });

  const sortedPhases = Array.from(phaseGroups.keys()).sort((a, b) => a - b);
  const positionedNodes = [];

  sortedPhases.forEach((phase, phaseIndex) => {
    const phaseNodes = phaseGroups.get(phase);
    const x = startX + phaseIndex * phaseSpacing;
    phaseNodes.forEach((node, nodeIndex) => {
      const y = startY + nodeIndex * nodeSpacing;
      positionedNodes.push({ ...node, position: { x, y } });
    });
  });

  return positionedNodes;
}

