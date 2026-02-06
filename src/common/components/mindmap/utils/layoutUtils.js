/**
 * Layout Utilities for Knowledge Graph Visualization
 * Orthogonal grid-aligned mindmap layout (Feishu/XMind style)
 */

import { normalizeCategoryId } from "./normalize";

/**
 * Default configuration for mindmap layout
 * Centralized to avoid duplication across multiple layout passes
 */
export const DEFAULT_MINDMAP_LAYOUT_CONFIG = {
  centerX: 600,              // X coordinate of center node
  centerY: 450,              // Y coordinate of center node
  categoryRadius: 280,       // Horizontal distance from center to category columns
  conceptOffsetX: 300,       // Horizontal distance from category to concept columns
  conceptVerticalGap: 18,    // Base gap between concept nodes
  categoryVerticalGap: 80,   // Base gap between category nodes
  nodeHeight: 45,            // Estimated concept node height for first pass
  categoryHeight: 50,        // Estimated category node height
  gridSnap: 20,              // Grid alignment in pixels, 0 to disable
  subjectId: "subject",      // Default subject identifier (should be overridden)
  nodeDimensions: null,      // Measured node dimensions from React Flow (for 2nd pass)
};

/**
 * Orthogonal Grid-Aligned Mindmap Layout
 * 
 * Creates a structured, symmetric layout similar to Feishu/XMind:
 * - Center node positioned at (centerX, centerY)
 * - Category nodes aligned in fixed vertical columns (left and right sides)
 * - Concept nodes aligned in outer vertical columns (left and right sides)
 * - All positions are grid-snapped for pixel-perfect alignment
 * - Vertical spacing calculated using measured node heights (2-pass layout)
 * 
 * Layout structure:
 * ```
 *   [Concepts]  [Categories]  [CENTER]  [Categories]  [Concepts]
 *      │            │            │           │            │
 *   leftConceptX  leftCategoryX centerX  rightCategoryX  rightConceptX
 * ```
 * 
 * @param {Array} categories - Category data from graph
 * @param {Array} nodes - Concept node data from graph
 * @param {Object} config - Layout configuration (merged with DEFAULT_MINDMAP_LAYOUT_CONFIG)
 * @returns {Object} Layout result with centerNode, categoryNodes, conceptNodes
 */
export function calculateOrthogonalMindmapLayout(categories, nodes, config = {}) {
  // Merge with defaults to avoid duplication
  const cfg = { ...DEFAULT_MINDMAP_LAYOUT_CONFIG, ...config };
  
  const {
    centerX,
    centerY,
    categoryRadius,
    conceptOffsetX,
    conceptVerticalGap,
    categoryVerticalGap,
    nodeHeight,
    categoryHeight,
    subjectId,
    nodeDimensions,
    gridSnap,
  } = cfg;

  // Helper: Snap to grid for clean alignment
  const snap = (value) => gridSnap > 0 ? Math.round(value / gridSnap) * gridSnap : value;

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

  // STEP 1: Split categories into left and right sides
  const halfCount = Math.ceil(sortedCategories.length / 2);
  const rightCategories = sortedCategories.slice(0, halfCount);
  const leftCategories = sortedCategories.slice(halfCount);

  // STEP 2: Calculate branch info for each category
  const calculateBranchInfo = (category) => {
    const categoryNodesList = nodes.filter((node) => {
      const nodeCategoryId = normalizeCategoryId(node.category);
      return nodeCategoryId === category.id;
    });

    // Calculate total height needed for concept list
    let totalConceptHeight = 0;
    categoryNodesList.forEach((node) => {
      const measuredHeight = nodeDimensions?.get(node.id)?.height || nodeHeight;
      totalConceptHeight += measuredHeight + conceptVerticalGap;
    });
    if (categoryNodesList.length > 0) {
      totalConceptHeight -= conceptVerticalGap; // Remove last gap
    }

    const measuredCategoryHeight = nodeDimensions?.get(`category-${category.id}`)?.height || categoryHeight;

    return {
      category,
      concepts: categoryNodesList,
      totalConceptHeight,
      categoryHeight: measuredCategoryHeight,
      totalHeight: Math.max(totalConceptHeight, measuredCategoryHeight),
    };
  };

  // Process right side (positive x)
  const rightBranches = rightCategories.map(calculateBranchInfo);
  const leftBranches = leftCategories.map(calculateBranchInfo);

  // STEP 3: Layout right side categories and concepts
  const rightCategoryX = snap(centerX + categoryRadius);
  const rightConceptX = snap(rightCategoryX + conceptOffsetX);

  let rightCurrentY = centerY;
  // Calculate total height to center the group
  const rightTotalHeight = rightBranches.reduce((sum, b) => sum + b.totalHeight + categoryVerticalGap, 0) - categoryVerticalGap;
  rightCurrentY = snap(centerY - rightTotalHeight / 2);

  rightBranches.forEach((branch) => {
    const { category, concepts, totalConceptHeight, totalHeight } = branch;

    // Category position - centered in its allocated height
    const categoryY = snap(rightCurrentY + totalHeight / 2);

    result.categoryNodes.push({
      id: `category-${category.id}`,
      categoryId: category.id,
      name: category.name,
      displayName: category.displayName,
      color: category.color,
      position: { x: rightCategoryX, y: categoryY },
    });

    // Concepts - vertically stacked, centered relative to category
    if (concepts.length > 0) {
      let conceptY = snap(categoryY - totalConceptHeight / 2);

      concepts.forEach((node) => {
        const measuredHeight = nodeDimensions?.get(node.id)?.height || nodeHeight;

        result.conceptNodes.push({
          ...node,
          position: { x: rightConceptX, y: snap(conceptY + measuredHeight / 2) },
          categoryColor: category.color,
          categoryId: category.id,
        });

        conceptY += measuredHeight + conceptVerticalGap;
      });
    }

    rightCurrentY += totalHeight + categoryVerticalGap;
  });

  // STEP 4: Layout left side categories and concepts
  const leftCategoryX = snap(centerX - categoryRadius);
  const leftConceptX = snap(leftCategoryX - conceptOffsetX);

  let leftCurrentY = centerY;
  // Calculate total height to center the group
  const leftTotalHeight = leftBranches.reduce((sum, b) => sum + b.totalHeight + categoryVerticalGap, 0) - categoryVerticalGap;
  leftCurrentY = snap(centerY - leftTotalHeight / 2);

  leftBranches.forEach((branch) => {
    const { category, concepts, totalConceptHeight, totalHeight } = branch;

    // Category position - centered in its allocated height
    const categoryY = snap(leftCurrentY + totalHeight / 2);

    result.categoryNodes.push({
      id: `category-${category.id}`,
      categoryId: category.id,
      name: category.name,
      displayName: category.displayName,
      color: category.color,
      position: { x: leftCategoryX, y: categoryY },
    });

    // Concepts - vertically stacked, centered relative to category
    if (concepts.length > 0) {
      let conceptY = snap(categoryY - totalConceptHeight / 2);

      concepts.forEach((node) => {
        const measuredHeight = nodeDimensions?.get(node.id)?.height || nodeHeight;

        result.conceptNodes.push({
          ...node,
          position: { x: leftConceptX, y: snap(conceptY + measuredHeight / 2) },
          categoryColor: category.color,
          categoryId: category.id,
        });

        conceptY += measuredHeight + conceptVerticalGap;
      });
    }

    leftCurrentY += totalHeight + categoryVerticalGap;
  });

  return result;
}
