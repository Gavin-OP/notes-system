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
  ReactFlowProvider,
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

function buildInitialPositions(networkNodes, clusters, width, height, focusSubject) {
  const centerX = width / 2;
  const centerY = height / 2;
  const safeClusters = Array.isArray(clusters) ? clusters : [];
  const fallbackRadius = Math.max(180, Math.min(width, height) * 0.24);

  const nonFocusClusters = safeClusters.filter(
    (cluster) => cluster?.subject !== focusSubject
  );

  const clusterCenters = new Map();
  safeClusters.forEach((cluster, index) => {
    if (!cluster?.id) return;
    if (cluster.subject === focusSubject) {
      clusterCenters.set(cluster.id, { x: centerX, y: centerY });
      return;
    }
    const idx = nonFocusClusters.findIndex((item) => item?.id === cluster.id);
    const angle = (Math.PI * 2 * Math.max(idx, 0)) / Math.max(nonFocusClusters.length, 1);
    clusterCenters.set(cluster.id, {
      x: centerX + Math.cos(angle) * fallbackRadius * 1.6,
      y: centerY + Math.sin(angle) * fallbackRadius * 1.2,
    });
  });

  return networkNodes.map((node, index) => {
    const clusterId = node.data?.clusterId ?? node.data?.categoryId;
    const clusterCenter = clusterCenters.get(clusterId) ?? {
      x: centerX + Math.cos(index) * 40,
      y: centerY + Math.sin(index) * 40,
    };
    const spread = clusterId && clusterCenters.has(clusterId) ? fallbackRadius * 0.35 : 140;
    return {
      ...node,
      x: clusterCenter.x + (Math.random() - 0.5) * spread,
      y: clusterCenter.y + (Math.random() - 0.5) * spread,
    };
  });
}

function extractFocusNodeIds(networkData) {
  const focusNodeIds = networkData?.metadata?.focusNodeIds ?? [];
  if (Array.isArray(focusNodeIds) && focusNodeIds.length > 0) {
    return focusNodeIds;
  }
  const focusSubject = networkData?.metadata?.focusSubject;
  const focusCluster = (networkData?.metadata?.clusters ?? []).find(
    (cluster) => cluster?.subject === focusSubject
  );
  return focusCluster?.nodeIds ?? [];
}

/**
 * NetworkMindmapView Component
 * @param {Object} graphData - The graph data from JSON
 * @param {string} subjectId - Subject identifier
 * @param {Function} onOpenNote - Callback when a concept node is clicked
 */
const NetworkMindmapView = ({ graphData, subjectId, onOpenNote }) => {
  const containerRef = useRef(null);
  const simulationRef = useRef(null);
  const activeClusterSubjectRef = useRef(null);
  const releaseFixRef = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(true);
  const [activeClusterSubject, setActiveClusterSubject] = useState(null);
  const { fitView } = useReactFlow();

  // Convert graph data to network format
  const networkData = useMemo(() => {
    if (!graphData) return null;
    return convertToNetworkFormat(graphData, subjectId);
  }, [graphData, subjectId]);

  const clusterButtons = useMemo(
    () => networkData?.metadata?.clusters ?? [],
    [networkData]
  );

  const clearReleaseTimer = useCallback(() => {
    if (releaseFixRef.current) {
      clearTimeout(releaseFixRef.current);
      releaseFixRef.current = null;
    }
  }, []);

  // Initialize force simulation
  useEffect(() => {
    if (!networkData || !containerRef.current) return;

    const { nodes: networkNodes, edges: networkEdges, metadata } = networkData;
    const initialFocusSubject = metadata?.focusSubject ?? null;
    setActiveClusterSubject(initialFocusSubject);
    activeClusterSubjectRef.current = initialFocusSubject;
    
    // Get container dimensions
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width || DEFAULT_NETWORK_LAYOUT_CONFIG.width;
    const height = rect.height || DEFAULT_NETWORK_LAYOUT_CONFIG.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const simNodes = buildInitialPositions(
      networkNodes,
      metadata?.clusters,
      width,
      height,
      metadata?.focusSubject
    );

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
        {
          const prevById = new Map(prevNodes.map((node) => [node.id, node]));
          const conceptNodes = simNodes.map((simNode) => {
            const prevNode = prevById.get(simNode.id);
            const isActiveClusterNode =
              activeClusterSubjectRef.current &&
              simNode.data?.subject === activeClusterSubjectRef.current;
            return {
              ...(prevNode ?? simNode),
              position: { x: simNode.x, y: simNode.y },
              zIndex: isActiveClusterNode ? 20 : 6,
            };
          });
          return conceptNodes;
        }
      );
    });

    // When simulation ends
    simulation.on("end", () => {
      setIsSimulationRunning(false);
      const focusIds = extractFocusNodeIds(networkData);
      setTimeout(() => {
        if (focusIds.length > 0) {
          fitView({
            nodes: focusIds.map((id) => ({ id })),
            padding: 0.35,
            maxZoom: 1.3,
            duration: 500,
          });
        } else {
          fitView({ padding: 0.2 });
        }
      }, 100);
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
      clearReleaseTimer();
      simulation.stop();
    };
  }, [networkData, setNodes, setEdges, fitView, clearReleaseTimer]);

  const focusCluster = useCallback(
    (cluster) => {
      if (!cluster || !simulationRef.current || !containerRef.current || !networkData) {
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = (rect.width || DEFAULT_NETWORK_LAYOUT_CONFIG.width) / 2;
      const centerY = (rect.height || DEFAULT_NETWORK_LAYOUT_CONFIG.height) / 2;
      const simNodes = simulationRef.current.nodes();
      const nodeIdSet = new Set(cluster.nodeIds ?? []);
      const clusterNodes = simNodes.filter((node) => nodeIdSet.has(node.id));
      if (clusterNodes.length === 0) return;

      const clusterRadius = Math.max(130, Math.min(rect.width, rect.height) * 0.18);
      const outerRadius = Math.max(clusterRadius * 2.1, Math.min(rect.width, rect.height) * 0.4);

      const selected = simNodes.filter((node) => nodeIdSet.has(node.id));
      const others = simNodes.filter((node) => !nodeIdSet.has(node.id));

      selected.forEach((node, idx) => {
        const angle = (Math.PI * 2 * idx) / Math.max(selected.length, 1);
        const ring = 0.45 + Math.floor(idx / 10) * 0.22;
        const jitter = (Math.random() - 0.5) * 14;
        const targetX = centerX + Math.cos(angle) * clusterRadius * ring + jitter;
        const targetY = centerY + Math.sin(angle) * clusterRadius * ring + jitter;
        node.x = targetX;
        node.y = targetY;
        node.fx = targetX;
        node.fy = targetY;
      });

      const clusters = networkData.metadata?.clusters ?? [];
      const otherCenters = new Map();
      const nonSelectedClusters = clusters.filter((item) => item?.id !== cluster.id);
      nonSelectedClusters.forEach((item, idx) => {
        const angle = (Math.PI * 2 * idx) / Math.max(nonSelectedClusters.length, 1);
        otherCenters.set(item.id, {
          x: centerX + Math.cos(angle) * outerRadius,
          y: centerY + Math.sin(angle) * outerRadius * 0.9,
        });
      });

      others.forEach((node, idx) => {
        const clusterId = node.data?.clusterId;
        const groupCenter = otherCenters.get(clusterId) ?? {
          x: centerX + Math.cos(idx) * outerRadius,
          y: centerY + Math.sin(idx) * outerRadius * 0.85,
        };
        const jitterX = (Math.random() - 0.5) * 80;
        const jitterY = (Math.random() - 0.5) * 80;
        const targetX = groupCenter.x + jitterX;
        const targetY = groupCenter.y + jitterY;
        node.x = targetX;
        node.y = targetY;
        node.fx = targetX;
        node.fy = targetY;
      });

      setActiveClusterSubject(cluster.subject ?? null);
      activeClusterSubjectRef.current = cluster.subject ?? null;

      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          if (node.type !== "networkNode") return node;
          const inCluster = nodeIdSet.has(node.id);
          return {
            ...node,
            zIndex: inCluster ? 22 : 6,
            data: {
              ...node.data,
              isDimmed: !inCluster,
              showLabel: inCluster || node.data.showLabel,
            },
          };
        })
      );

      setEdges((prevEdges) =>
        prevEdges.map((edge) => {
          const inCluster =
            nodeIdSet.has(edge.source) && nodeIdSet.has(edge.target);
          return {
            ...edge,
            style: {
              ...edge.style,
              opacity: inCluster
                ? DEFAULT_NETWORK_LAYOUT_CONFIG.edge.highlightOpacity
                : DEFAULT_NETWORK_LAYOUT_CONFIG.edge.dimmedOpacity,
              strokeWidth: inCluster
                ? DEFAULT_NETWORK_LAYOUT_CONFIG.edge.strokeWidth + 0.8
                : DEFAULT_NETWORK_LAYOUT_CONFIG.edge.strokeWidth,
            },
          };
        })
      );

      simulationRef.current.alpha(0.22).restart();
      clearReleaseTimer();
      releaseFixRef.current = setTimeout(() => {
        simNodes.forEach((node) => {
          node.fx = null;
          node.fy = null;
        });
        simulationRef.current?.alpha(0.06).restart();
      }, 900);
      fitView({
        nodes: (cluster.nodeIds ?? []).map((id) => ({ id })),
        padding: 0.35,
        maxZoom: 1.45,
        duration: 450,
      });
    },
    [fitView, networkData, setEdges, setNodes, clearReleaseTimer]
  );

  // Handle node drag - update simulation
  const onNodeDragStart = useCallback((event, node) => {
    if (node.type !== "networkNode") return;
    if (simulationRef.current) {
      simulationRef.current.alphaTarget(0.3).restart();
    }
  }, []);

  const onNodeDrag = useCallback((event, node) => {
    if (node.type !== "networkNode") return;
    if (simulationRef.current) {
      const simNode = simulationRef.current.nodes().find((n) => n.id === node.id);
      if (simNode) {
        simNode.fx = node.position.x;
        simNode.fy = node.position.y;
      }
    }
  }, []);

  const onNodeDragStop = useCallback((event, node) => {
    if (node.type !== "networkNode") return;
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
      if (node.type !== "networkNode") return;

      if (!networkData) return;

      const connectedNodes = getConnectedNodeIds(node.id, networkData.edges);
      const connectedEdges = getConnectedEdgeIds(node.id, networkData.edges);

      // Update node visual states
      setNodes((prevNodes) =>
        prevNodes.map((n) => ({
          ...(n.type !== "networkNode"
            ? n
            : {
                ...n,
                data: {
                  ...n.data,
                  isHighlighted: n.id === node.id,
                  isDimmed: !connectedNodes.has(n.id),
                  showLabel: connectedNodes.has(n.id),
                },
              }),
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
    if (!networkData) return;

    // Reset all nodes to default state
    setNodes((prevNodes) =>
      prevNodes.map((n) => ({
          ...(n.type !== "networkNode"
            ? n
            : {
                ...n,
                data: {
                  ...n.data,
                  isHighlighted: false,
                  isDimmed: false,
                  showLabel:
                    n.data.referenceCount >= networkData.metadata.maxReferences * 0.5,
                },
              }),
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
      if (node.type !== "networkNode") return;
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
      {clusterButtons.length > 0 && (
        <div className="network-mindmap-view__cluster-legend">
          {clusterButtons.map((cluster) => {
            const isActive = cluster.subject === activeClusterSubject;
            return (
              <button
                key={cluster.id}
                type="button"
                className={`network-mindmap-view__cluster-btn ${isActive ? "network-mindmap-view__cluster-btn--active" : ""}`}
                style={{ "--cluster-color": cluster.color }}
                onClick={() => focusCluster(cluster)}
              >
                {cluster.label ?? cluster.subject ?? cluster.id}
              </button>
            );
          })}
        </div>
      )}
      {isSimulationRunning && (
        <div className="network-mindmap-view__loading">
          <span>Calculating layout...</span>
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
const NetworkMindmapViewWrapper = (props) => (
  <ReactFlowProvider>
    <NetworkMindmapView {...props} />
  </ReactFlowProvider>
);

export default NetworkMindmapViewWrapper;

