/**
 * NetworkMindmapView - Obsidian-style force-directed network graph
 * 
 * Features:
 * - Force-directed layout using D3-force simulation
 * - Node size based on reference count (importance)
 * - Hover/click highlights connected nodes, dims others
 * - All concept-to-concept edges visible
 * - Draggable, zoomable, pannable
 */
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import * as d3 from "d3";
import "reactflow/dist/style.css";

import NetworkNode from "./nodes/NetworkNode";
import { convertToNetworkFormat, convertEdgesToReactFlow } from "./utils/networkGraphLoader";
import {
  DEFAULT_NETWORK_LAYOUT_CONFIG,
  getConnectedNodeIds,
  getConnectedEdgeIds,
} from "./utils/networkLayoutUtils";
import "./NetworkMindmapView.css";

// Register custom node type
const nodeTypes = {
  networkNode: NetworkNode,
};

/**
 * NetworkMindmapView Component
 * @param {Object} graphData - The graph data from JSON
 * @param {string} subjectId - Subject identifier
 * @param {Function} onOpenNote - Callback when a concept node is clicked
 */
const NetworkMindmapView = ({ graphData, subjectId, onOpenNote }) => {
  const containerRef = useRef(null);
  const simulationRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const { fitView } = useReactFlow();

  // Convert graph data to network format
  const networkData = useMemo(() => {
    if (!graphData) return null;
    return convertToNetworkFormat(graphData, subjectId);
  }, [graphData, subjectId]);

  // Initialize force simulation
  useEffect(() => {
    if (!networkData || !containerRef.current) return;

    const { nodes: networkNodes, edges: networkEdges } = networkData;
    
    // Get container dimensions
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width || DEFAULT_NETWORK_LAYOUT_CONFIG.width;
    const height = rect.height || DEFAULT_NETWORK_LAYOUT_CONFIG.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Initialize node positions randomly around center
    const simNodes = networkNodes.map((node) => ({
      ...node,
      x: centerX + (Math.random() - 0.5) * width * 0.5,
      y: centerY + (Math.random() - 0.5) * height * 0.5,
    }));

    // Create simulation links
    const simLinks = networkEdges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      strength: edge.strength,
    }));

    const config = DEFAULT_NETWORK_LAYOUT_CONFIG.simulation;

    // Create D3 force simulation
    const simulation = d3
      .forceSimulation(simNodes)
      .force(
        "link",
        d3
          .forceLink(simLinks)
          .id((d) => d.id)
          .distance(config.linkDistance)
          .strength(config.linkStrength)
      )
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(config.chargeStrength)
          .distanceMax(config.chargeDistanceMax)
      )
      .force(
        "center",
        d3.forceCenter(centerX, centerY).strength(config.centerStrength)
      )
      .force(
        "collision",
        d3
          .forceCollide()
          .radius((d) => d.data.size + config.collisionRadius)
          .strength(config.collisionStrength)
      )
      .alphaDecay(config.alphaDecay)
      .velocityDecay(config.velocityDecay);

    simulationRef.current = simulation;

    // Update React Flow nodes on each tick
    simulation.on("tick", () => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          const simNode = simNodes.find((n) => n.id === node.id);
          if (simNode) {
            return {
              ...node,
              position: { x: simNode.x, y: simNode.y },
            };
          }
          return node;
        })
      );
    });

    // When simulation ends
    simulation.on("end", () => {
      setIsSimulationRunning(false);
      // Fit view after simulation stabilizes
      setTimeout(() => fitView({ padding: 0.2 }), 100);
    });

    // Initialize React Flow nodes and edges
    const flowNodes = simNodes.map((node) => ({
      ...node,
      position: { x: node.x, y: node.y },
    }));
    const flowEdges = convertEdgesToReactFlow(networkEdges);

    setNodes(flowNodes);
    setEdges(flowEdges);

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [networkData, setNodes, setEdges, fitView]);

  // Handle node drag - update simulation
  const onNodeDragStart = useCallback((event, node) => {
    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0.3).restart();
    }
  }, []);

  const onNodeDrag = useCallback((event, node) => {
    if (simulationRef.current) {
      const simNode = simulationRef.current.nodes().find((n) => n.id === node.id);
      if (simNode) {
        simNode.fx = node.position.x;
        simNode.fy = node.position.y;
      }
    }
  }, []);

  const onNodeDragStop = useCallback((event, node) => {
    if (simulationRef.current) {
      const simNode = simulationRef.current.nodes().find((n) => n.id === node.id);
      if (simNode) {
        simNode.fx = null;
        simNode.fy = null;
      }
      simulationRef.current.alphaTarget(0);
    }
  }, []);

  // Handle hover - highlight connected nodes
  const onNodeMouseEnter = useCallback(
    (event, node) => {
      setHoveredNodeId(node.id);

      if (!networkData) return;

      const connectedNodes = getConnectedNodeIds(node.id, networkData.edges);
      const connectedEdges = getConnectedEdgeIds(node.id, networkData.edges);

      // Update node visual states
      setNodes((prevNodes) =>
        prevNodes.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isHighlighted: n.id === node.id,
            isDimmed: !connectedNodes.has(n.id),
            showLabel: connectedNodes.has(n.id),
          },
        }))
      );

      // Update edge visual states
      setEdges((prevEdges) =>
        prevEdges.map((e) => ({
          ...e,
          style: {
            ...e.style,
            opacity: connectedEdges.has(e.id)
              ? DEFAULT_NETWORK_LAYOUT_CONFIG.edge.highlightOpacity
              : DEFAULT_NETWORK_LAYOUT_CONFIG.edge.dimmedOpacity,
            strokeWidth: connectedEdges.has(e.id) ? 2 : 1,
          },
        }))
      );
    },
    [networkData, setNodes, setEdges]
  );

  const onNodeMouseLeave = useCallback(() => {
    setHoveredNodeId(null);

    if (!networkData) return;

    // Reset all nodes to default state
    setNodes((prevNodes) =>
      prevNodes.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isHighlighted: false,
          isDimmed: false,
          showLabel: n.data.referenceCount >= networkData.metadata.maxReferences * 0.5,
        },
      }))
    );

    // Reset all edges to default state
    setEdges((prevEdges) =>
      prevEdges.map((e) => ({
        ...e,
        style: {
          ...e.style,
          opacity: DEFAULT_NETWORK_LAYOUT_CONFIG.edge.strokeOpacity,
          strokeWidth: DEFAULT_NETWORK_LAYOUT_CONFIG.edge.strokeWidth,
        },
      }))
    );
  }, [networkData, setNodes, setEdges]);

  // Handle node click - navigate to note
  const onNodeClick = useCallback(
    (event, node) => {
      const noteUrl = node.data?.noteUrl;
      if (noteUrl && onOpenNote) {
        onOpenNote(noteUrl);
      }
    },
    [onOpenNote]
  );

  if (!graphData) {
    return (
      <div className="network-mindmap-view network-mindmap-view--empty">
        <p>No graph data available</p>
      </div>
    );
  }

  return (
    <div className="network-mindmap-view" ref={containerRef}>
      {isSimulationRunning && (
        <div className="network-mindmap-view__loading">
          <span>布局计算中...</span>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          maxZoom: 1.5,
        }}
        minZoom={0.2}
        maxZoom={3}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#333" gap={30} size={1} variant="dots" />
        <Controls showInteractive={false} position="bottom-right" />
      </ReactFlow>
    </div>
  );
};

// Wrapper to provide ReactFlowProvider context
import { ReactFlowProvider } from "reactflow";

const NetworkMindmapViewWrapper = (props) => (
  <ReactFlowProvider>
    <NetworkMindmapView {...props} />
  </ReactFlowProvider>
);

export default NetworkMindmapViewWrapper;

