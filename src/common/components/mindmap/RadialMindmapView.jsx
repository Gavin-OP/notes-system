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
 * @param {Function} onOpenNote - Callback when a concept node is clicked
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 */
const RadialMindmapView = ({ 
  graphData, 
  subjectId, 
  onOpenNote,
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
        const noteUrl = params?.data?.noteUrl;
        if (noteUrl && onOpenNote) {
          onOpenNote(noteUrl);
        }
      },
    }),
    [onOpenNote]
  );

  // Handle chart ready event
  const onChartReady = useCallback((echartInstance) => {
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

