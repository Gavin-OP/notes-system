/**
 * RadialMindmapView - ECharts-based radial tree visualization
 * Provides a "poster-style" overview of the knowledge graph (Type 2)
 */
import { useMemo, useCallback } from "react";
import ReactECharts from "echarts-for-react";
import { graphToRadialTree, makeRadialTreeOption } from "./utils/radialTreeUtils";
import "./RadialMindmapView.css";

/**
 * RadialMindmapView Component
 * @param {Object} graphData - The graph data from JSON
 * @param {string} subjectId - Subject identifier
 * @param {Function} onConceptClick - Callback when a concept node is clicked
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 */
const RadialMindmapView = ({ 
  graphData, 
  subjectId, 
  onConceptClick,
  isDarkMode = false,
}) => {
  // Convert graph data to ECharts tree format and generate options
  const option = useMemo(() => {
    if (!graphData) return null;
    
    const treeData = graphToRadialTree(graphData, subjectId);
    return makeRadialTreeOption(treeData, {
      isDarkMode,
      symbolSize: 8,
      roam: true,
      initialTreeDepth: 3,
    });
  }, [graphData, subjectId, isDarkMode]);

  // Handle click events on nodes
  const onEvents = useMemo(
    () => ({
      click: (params) => {
        const data = params?.data;
        if (!data?.noteUrl && !data?.name) return;
        onConceptClick?.({
          id: data?.id || data?.conceptId,
          label: data?.name || data?.label,
          noteUrl: data?.noteUrl,
          noteTitle: data?.noteTitle,
          anchorId: data?.anchorId,
        });
      },
    }),
    [onConceptClick]
  );

  // Handle chart ready event
  const onChartReady = useCallback(() => {
    // Optional: Store reference for external control
    console.log("Radial mindmap chart ready");
  }, []);

  if (!graphData) {
    return (
      <div className="radial-mindmap-view radial-mindmap-view--empty">
        <p>No graph data available</p>
      </div>
    );
  }

  return (
    <div className="radial-mindmap-view">
      <ReactECharts
        option={option}
        style={{ width: "100%", height: "100%" }}
        onEvents={onEvents}
        onChartReady={onChartReady}
        opts={{ renderer: "canvas" }}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};

export default RadialMindmapView;
