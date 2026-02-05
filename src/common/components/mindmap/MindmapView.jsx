/**
 * MindmapView - Reusable knowledge graph visualization component
 * Works with any subject by passing subjectId as prop
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
import { calculateHierarchicalRadialLayout } from "./utils/layoutUtils";
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

  // Load and process graph data
  useEffect(() => {
    if (!subjectId) {
      setError("No subject specified");
      setLoading(false);
      return;
    }

    async function loadGraph() {
      try {
        setLoading(true);
        const graphData = await loadGraphData(subjectId);

        if (!graphData) {
          setError("Failed to load knowledge graph");
          return;
        }

        // Calculate hierarchical radial layout (图1 style)
        const layoutResult = calculateHierarchicalRadialLayout(
          graphData.categories,
          graphData.nodes,
          {
            centerX: 600,
            centerY: 400,
            categoryRadius: 180,
            conceptStartDistance: 80,
            conceptVerticalGap: 50,
            subjectId: subjectId,
          }
        );

        // Convert to React Flow format
        const { nodes: flowNodes, edges: flowEdges } = convertToHierarchicalFormat(
          graphData,
          layoutResult
        );

        setNodes(flowNodes);
        setEdges(flowEdges);
      } catch (err) {
        console.error("Error loading graph:", err);
        setError("An error occurred while loading the graph");
      } finally {
        setLoading(false);
      }
    }

    loadGraph();
  }, [subjectId, setNodes, setEdges]);

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
          position="bottom-left"
        />
      </ReactFlow>
    </div>
  );
};

export default MindmapView;

