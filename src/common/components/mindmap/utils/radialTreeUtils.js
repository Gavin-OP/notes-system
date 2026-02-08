/**
 * Radial Tree Utils - Convert graph data to ECharts radial tree format
 * Used for the "poster-style" radial mindmap visualization (Type 2)
 */
import { normalizeCategoryId } from "./normalize";

/**
 * Convert graph data to ECharts tree format
 * @param {Object} graphData - The graph data from JSON
 * @param {string} subjectId - Subject identifier
 * @returns {Object} ECharts tree data structure
 */
export function graphToRadialTree(graphData, subjectId) {
  const categories = graphData?.categories ?? [];
  const concepts = graphData?.nodes ?? [];

  // Build category children, sorted by order
  const categoryChildren = categories
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((cat) => {
      const catId = cat.id;
      
      // Find concepts belonging to this category
      const kids = concepts
        .filter((n) => {
          // Match by category ID or normalized category name
          const conceptCatId = n.categoryId ?? normalizeCategoryId(n.category);
          return conceptCatId === catId;
        })
        .sort((a, b) => (a.learningOrder ?? 0) - (b.learningOrder ?? 0))
        .map((n) => ({
          name: n.displayTitle ?? n.title,
          noteUrl: n.noteUrl,
          importance: n.importance ?? "medium",
          itemStyle: { borderColor: cat.color },
          lineStyle: { color: cat.color },
        }));

      return {
        name: cat.displayName ?? cat.name ?? cat.id,
        categoryId: catId,
        itemStyle: { color: cat.color },
        lineStyle: { color: cat.color },
        children: kids,
      };
    });

  // Root node with subject name
  return {
    name: graphData?.meta?.subjectName ?? graphData?.meta?.name ?? subjectId,
    children: categoryChildren,
  };
}

/**
 * Generate ECharts option for radial tree visualization
 * @param {Object} treeData - Tree data from graphToRadialTree
 * @param {Object} options - Additional options
 * @returns {Object} ECharts option configuration
 */
export function makeRadialTreeOption(treeData, options = {}) {
  const {
    isDarkMode = false,
    symbolSize = 8,
    roam = true,
    initialTreeDepth = 3,
  } = options;

  // Color scheme based on theme
  const textColor = isDarkMode ? "#e0e0e0" : "#333";
  const lineColor = isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";
  const backgroundColor = "transparent";

  return {
    backgroundColor,
    tooltip: {
      trigger: "item",
      triggerOn: "mousemove",
      backgroundColor: isDarkMode ? "#2d2d2d" : "#fff",
      borderColor: isDarkMode ? "#444" : "#ddd",
      textStyle: {
        color: textColor,
      },
      formatter: (params) => {
        const data = params.data;
        if (data.noteUrl) {
          return `<strong>${data.name}</strong><br/><span style="color:#888">点击查看笔记</span>`;
        }
        if (data.children && data.children.length > 0) {
          return `<strong>${data.name}</strong><br/><span style="color:#888">${data.children.length} 个概念</span>`;
        }
        return `<strong>${data.name}</strong>`;
      },
    },
    series: [
      {
        type: "tree",
        data: [treeData],
        layout: "radial",
        top: "8%",
        bottom: "8%",
        left: "8%",
        right: "8%",
        symbol: "emptyCircle",
        symbolSize,
        roam,
        initialTreeDepth,
        // Line styling
        lineStyle: {
          width: 2,
          curveness: 0.35,
          color: lineColor,
        },
        // Label styling
        label: {
          rotate: 0,
          position: "outside",
          align: "center",
          verticalAlign: "middle",
          color: textColor,
          fontSize: 12,
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif",
          formatter: (params) => {
            // Truncate long labels
            const name = params.data.name || "";
            return name.length > 20 ? name.slice(0, 18) + "..." : name;
          },
        },
        // Leaf node styling
        leaves: {
          label: {
            rotate: 0,
            position: "outside",
            align: "center",
            verticalAlign: "middle",
            color: textColor,
            fontSize: 11,
          },
        },
        // Emphasis (hover) effects
        emphasis: {
          focus: "descendant",
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,0.3)",
          },
          lineStyle: {
            width: 3,
          },
        },
        // Animation
        animationDuration: 550,
        animationDurationUpdate: 750,
        animationEasing: "cubicOut",
      },
    ],
  };
}


