/**
 * MindmapView - Reusable knowledge graph visualization component
 * Works with any subject by passing subjectId as prop
 * 
 * Node ID conventions (must stay consistent across layout + graphLoader):
 * - center:   center-${subjectId}
 * - category: category-${categoryId}
 * - concept:  concept.id
 */
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { CenterNode, CategoryNode, ConceptNode } from "./nodes";
import { loadGraphData, convertToHierarchicalFormat } from "./utils/graphLoader";
import { calculateOrthogonalMindmapLayout, DEFAULT_MINDMAP_LAYOUT_CONFIG } from "./utils/layoutUtils";
import "./nodes/nodes.css";
import "./MindmapView.css";

// Register custom node types
const nodeTypes = {
  centerNode: CenterNode,
  categoryNode: CategoryNode,
  conceptNode: ConceptNode,
};

// Default edge options for clean straight lines
const defaultEdgeOptions = {
  type: "straight",
  style: {
    strokeWidth: 2,
  },
};

/**
 * MindmapView Component
 * @param {string} subjectId - Subject identifier (e.g., "data-science", "statistics")
 */
const MindmapView = ({ subjectId }) => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Store measured node dimensions and graph data for 2-pass layout
  const [nodeDimensions, setNodeDimensions] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [needsRelayout, setNeedsRelayout] = useState(false);

  // Load graph data
  useEffect(() => {
    if (!subjectId) {
      setError("No subject specified");
      setLoading(false);
      return;
    }

    async function loadGraph() {
      try {
        setLoading(true);
        const data = await loadGraphData(subjectId);

        if (!data) {
          setError("Failed to load knowledge graph");
          return;
        }

        setGraphData(data);
      } catch (err) {
        console.error("Error loading graph:", err);
        setError("An error occurred while loading the graph");
      } finally {
        setLoading(false);
      }
    }

    loadGraph();
  }, [subjectId]);

  // PASS 1: Initial layout with estimated dimensions
  useEffect(() => {
    if (!graphData) return;

    // Create base config with subject-specific overrides
    const baseConfig = {
      ...DEFAULT_MINDMAP_LAYOUT_CONFIG,
      subjectId,
      nodeDimensions: null,  // First pass - no measurements yet
    };

    const layoutResult = calculateOrthogonalMindmapLayout(
      graphData.categories,
      graphData.nodes,
      baseConfig
    );

    const { nodes: flowNodes, edges: flowEdges } = convertToHierarchicalFormat(
      graphData,
      layoutResult
    );

    setNodes(flowNodes);
    setEdges(flowEdges);
    setNeedsRelayout(true);  // Trigger second pass after render
  }, [graphData, subjectId, setNodes, setEdges]);

  // PASS 2: Re-layout with measured dimensions after nodes are rendered
  useEffect(() => {
    if (!needsRelayout || !graphData || nodes.length === 0) return;

    // Small delay to ensure nodes are rendered and measured
    const timer = setTimeout(() => {
      // Collect measured dimensions from rendered nodes
      const dimensions = new Map();
      nodes.forEach((node) => {
        if (node.measured) {
          dimensions.set(node.id, {
            width: node.measured.width || node.width || 150,
            height: node.measured.height || node.height || 45,
          });
        }
      });

      // Only re-layout if we have measurements
      if (dimensions.size > 0) {
        // Reuse base config, only updating measured dimensions
        const baseConfig = {
          ...DEFAULT_MINDMAP_LAYOUT_CONFIG,
          subjectId,
          nodeDimensions: dimensions,  // Second pass - with measured dimensions
        };

        const layoutResult = calculateOrthogonalMindmapLayout(
          graphData.categories,
          graphData.nodes,
          baseConfig
        );

        const { nodes: flowNodes, edges: flowEdges } = convertToHierarchicalFormat(
          graphData,
          layoutResult
        );

        setNodes(flowNodes);
        setEdges(flowEdges);
        setNodeDimensions(dimensions);
      }

      setNeedsRelayout(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [needsRelayout, graphData, nodes, subjectId, setNodes, setEdges]);

  // Handle node click - navigate to the note (only for concept nodes)
  const onNodeClick = useCallback(
    (event, node) => {
      const noteUrl = node.data?.noteUrl;
      if (noteUrl) {
        navigate(noteUrl);
      }
    },
    [navigate]
  );

  if (loading) {
    return (
      <div className="mindmap-view mindmap-view--loading">
        <div className="mindmap-view__spinner" />
        <p>Loading knowledge graph...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mindmap-view mindmap-view--error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mindmap-view">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1.2,
        }}
        minZoom={0.3}
        maxZoom={2}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e0e0e0" gap={20} size={1} />
        <Controls 
          showInteractive={false}
          position="bottom-right"
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.type === "centerNode") return "#2C3E50";
            if (node.type === "categoryNode") return node.data?.color || "#95A5A6";
            return node.data?.color || "#95A5A6";
          }}
          maskColor="rgba(0, 0, 0, 0.08)"
          pannable
          zoomable
          position="top-left"
          style={{ width: 150, height: 100 }}
        />
      </ReactFlow>
    </div>
  );
};

export default MindmapView;

