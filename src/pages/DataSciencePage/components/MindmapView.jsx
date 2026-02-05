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

import ConceptNode from "./ConceptNode";
import { loadGraphData, convertToReactFlowFormat } from "../utils/graphLoader";
import { calculateRadialLayout } from "../utils/layoutUtils";
import "./MindmapView.css";

const nodeTypes = {
  concept: ConceptNode,
};

const MindmapView = ({ subjectId = "data-science" }) => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load and process graph data
  useEffect(() => {
    async function loadGraph() {
      try {
        setLoading(true);
        const graphData = await loadGraphData(subjectId);
        
        if (!graphData) {
          setError("Failed to load knowledge graph");
          return;
        }

        // Calculate layout
        const positionedNodes = calculateRadialLayout(
          graphData.categories,
          graphData.nodes,
          {
            centerX: 600,
            centerY: 400,
            mainRadius: 250,
            subRadius: 120,
          }
        );

        // Convert to React Flow format
        const { nodes: flowNodes, edges: flowEdges } = convertToReactFlowFormat(
          graphData,
          positionedNodes
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

  // Handle node click - navigate to the note
  const onNodeClick = useCallback(
    (event, node) => {
      const noteUrl = node.data.noteUrl;
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
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: false,
          style: { strokeWidth: 2 },
        }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => node.data.color || "#95A5A6"}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
};

export default MindmapView;

