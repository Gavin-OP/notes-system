/**
 * MindmapView - Reusable knowledge graph visualization component
 * Works with any subject by passing subjectId as prop
 * 
 * Node ID conventions (must stay consistent across layout + graphLoader):
 * - center:   center-${subjectId}
 * - category: category-${categoryId}
 * - concept:  concept.id
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { CenterNode, CategoryNode, ConceptNode } from "./nodes";
import {
  loadGraphData,
  loadNetworkGraphData,
  convertToHierarchicalFormat,
} from "./utils/graphLoader";
import { calculateOrthogonalMindmapLayout, DEFAULT_MINDMAP_LAYOUT_CONFIG } from "./utils/layoutUtils";
import MindmapToolbar from "./MindmapToolbar";
import { MINDMAP_TYPES } from "./MindmapTypes";
import RadialMindmapView from "./RadialMindmapView";
import NetworkMindmapView from "./NetworkMindmapView";
import SphereNetworkView from "./SphereNetworkView";
import ConceptReviewModal from "./ConceptReviewModal";
import { normalizeConceptPayload, migrateConceptReviewCaches } from "../lib/conceptReviewUtils";
import useTranslatedContent from "../../../i18n/useTranslatedContent";
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

function findFirstConceptNote(graphData) {
  const node = (graphData?.nodes || []).find((item) => item?.noteUrl || item?.note_url);
  if (!node) return null;
  return {
    title: node.displayTitle || node.title || node.noteTitle || "First concept note",
    noteUrl: node.noteUrl || node.note_url,
  };
}

function buildMindmapLabelBundle(graphData) {
  if (!graphData) return "";
  return JSON.stringify({
    subjectName: graphData.meta?.subjectName || graphData.meta?.name || "",
    categories: (graphData.categories || []).map((category) => ({
      id: category.id,
      name: category.name || "",
      displayName: category.displayName || category.name || "",
    })),
    nodes: (graphData.nodes || []).map((node) => ({
      id: node.id,
      title: node.title || "",
      displayTitle: node.displayTitle || node.displayName || node.title || node.name || "",
      name: node.name || "",
      noteTitle: node.noteTitle || "",
      clusterLabel: node.clusterLabel || "",
      category: node.category || "",
    })),
  });
}

function applyMindmapLabelBundle(graphData, translatedBundleContent) {
  if (!graphData) return graphData;
  try {
    const bundle = JSON.parse(translatedBundleContent || "{}");
    if (!bundle || typeof bundle !== "object") return graphData;
    const categoriesById = new Map(
      (Array.isArray(bundle.categories) ? bundle.categories : [])
        .map((category) => [category?.id, category])
        .filter(([id]) => id),
    );
    const nodesById = new Map(
      (Array.isArray(bundle.nodes) ? bundle.nodes : [])
        .map((node) => [node?.id, node])
        .filter(([id]) => id),
    );
    return {
      ...graphData,
      meta: {
        ...graphData.meta,
        subjectName: bundle.subjectName || graphData.meta?.subjectName,
      },
      categories: (graphData.categories || []).map((category) => {
        const translated = categoriesById.get(category.id);
        return translated
          ? {
              ...category,
              name: translated.name || category.name,
              displayName: translated.displayName || translated.name || category.displayName,
            }
          : category;
      }),
      nodes: (graphData.nodes || []).map((node) => {
        const translated = nodesById.get(node.id);
        return translated
          ? {
              ...node,
              title: translated.title || node.title,
              displayTitle: translated.displayTitle || translated.title || node.displayTitle,
              displayName: translated.displayTitle || translated.title || node.displayName,
              name: translated.name || node.name,
              noteTitle: translated.noteTitle || node.noteTitle,
              clusterLabel: translated.clusterLabel || node.clusterLabel,
              category: translated.category || node.category,
            }
          : node;
      }),
    };
  } catch {
    return graphData;
  }
}

/**
 * MindmapView Component
 * @param {string} subjectId - Subject identifier (e.g., "data-science", "statistics")
 */
const MindmapView = ({ subjectId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);
  
  // Store graph data for 2-pass layout
  const [graphData, setGraphData] = useState(null);
  const [networkGraphData, setNetworkGraphData] = useState(null);
  const [needsRelayout, setNeedsRelayout] = useState(false);
  
  // Mindmap view type state
  const [viewType, setViewType] = useState(
    location.state?.mindmapViewType || MINDMAP_TYPES.HIERARCHICAL,
  );
  const [selectedConcept, setSelectedConcept] = useState(null);
  const [conceptModalOpen, setConceptModalOpen] = useState(false);
  const graphLabelBundle = useMemo(() => buildMindmapLabelBundle(graphData), [graphData]);
  const translatedGraphLabelBundle = useTranslatedContent(graphLabelBundle, {
    sourceType: "mindmap_label_bundle",
    sourceId: `mindmap:${subjectId}:hierarchical`,
    disabled: !graphData,
  });
  const localizedGraphData = useMemo(
    () => applyMindmapLabelBundle(graphData, translatedGraphLabelBundle.content),
    [graphData, translatedGraphLabelBundle.content],
  );
  const networkGraphLabelBundle = useMemo(() => buildMindmapLabelBundle(networkGraphData), [networkGraphData]);
  const translatedNetworkGraphLabelBundle = useTranslatedContent(networkGraphLabelBundle, {
    sourceType: "mindmap_label_bundle",
    sourceId: `mindmap:${subjectId}:network`,
    disabled: !networkGraphData,
  });
  const localizedNetworkGraphData = useMemo(
    () => applyMindmapLabelBundle(networkGraphData, translatedNetworkGraphLabelBundle.content),
    [networkGraphData, translatedNetworkGraphLabelBundle.content],
  );
  const firstConceptNote = useMemo(() => findFirstConceptNote(localizedGraphData), [localizedGraphData]);
  const selectedConceptNoteUrl = selectedConcept?.noteUrl || "";

  useEffect(() => {
    migrateConceptReviewCaches();
  }, []);

  useEffect(() => {
    if (!location.state?.mindmapConcept) return;
    setSelectedConcept(normalizeConceptPayload(location.state.mindmapConcept));
    setConceptModalOpen(true);
  }, [location.state]);

  // Load graph data
  useEffect(() => {
    if (!subjectId) {
      setError("No knowledge domain specified");
      setLoading(false);
      return;
    }

    async function loadGraph() {
      try {
        setLoading(true);
        setError(null);
        const [data, networkData] = await Promise.all([
          loadGraphData(subjectId),
          loadNetworkGraphData(subjectId),
        ]);

        if (!data) {
          setError("Failed to load knowledge graph");
          return;
        }

        setGraphData(data);
        // Fallback to subject graph if dedicated network graph is unavailable.
        setNetworkGraphData(networkData ?? data);
      } catch (err) {
        console.error("Error loading graph:", err);
        setError("An error occurred while loading the graph");
      } finally {
        setLoading(false);
      }
    }

    loadGraph();
  }, [subjectId, reloadToken]);

  // PASS 1: Initial layout with estimated dimensions
  useEffect(() => {
    if (!localizedGraphData) return;

    // Create base config with subject-specific overrides
    const baseConfig = {
      ...DEFAULT_MINDMAP_LAYOUT_CONFIG,
      subjectId,
      nodeDimensions: null,  // First pass - no measurements yet
    };

    const layoutResult = calculateOrthogonalMindmapLayout(
      localizedGraphData.categories,
      localizedGraphData.nodes,
      baseConfig
    );

    const { nodes: flowNodes, edges: flowEdges } = convertToHierarchicalFormat(
      localizedGraphData,
      layoutResult
    );

    setNodes(flowNodes);
    setEdges(flowEdges);
    setNeedsRelayout(true);  // Trigger second pass after render
  }, [localizedGraphData, subjectId, setNodes, setEdges]);

  // PASS 2: Re-layout with measured dimensions after nodes are rendered
  useEffect(() => {
    if (!needsRelayout || !localizedGraphData || nodes.length === 0) return;

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
          localizedGraphData.categories,
          localizedGraphData.nodes,
          baseConfig
        );

        const { nodes: flowNodes, edges: flowEdges } = convertToHierarchicalFormat(
          localizedGraphData,
          layoutResult
        );

        setNodes(flowNodes);
        setEdges(flowEdges);
      }

      setNeedsRelayout(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [needsRelayout, localizedGraphData, nodes, subjectId, setNodes, setEdges]);

  // Handle mindmap view type change
  const handleViewTypeChange = useCallback((newType) => {
    setViewType(newType);
  }, []);
  
  const handleConceptClick = useCallback((rawConcept = {}) => {
    const concept = normalizeConceptPayload(rawConcept);
    if (!concept.label && !concept.id) return;
    setSelectedConcept(concept);
    setConceptModalOpen(true);
  }, []);

  const handleGoToNotes = useCallback(
    (concept) => {
      if (concept?.noteUrl) {
        navigate(concept.noteUrl, {
          state: {
            fromMindmap: true,
            mindmapReturnTo: `/subject/${subjectId}/mindmap`,
            mindmapViewType: viewType,
            mindmapConcept: concept,
          },
        });
      }
      setConceptModalOpen(false);
    },
    [navigate, subjectId, viewType],
  );

  const handleCloseConceptModal = useCallback(() => {
    setConceptModalOpen(false);
  }, []);

  const handleOpenFirstNote = useCallback(() => {
    if (firstConceptNote?.noteUrl) navigate(firstConceptNote.noteUrl, { state: { fromMindmap: true, mindmapReturnTo: `/subject/${subjectId}/mindmap`, mindmapViewType: viewType } });
  }, [firstConceptNote?.noteUrl, navigate, subjectId, viewType]);

  const handleOpenSelectedConcept = useCallback(() => {
    if (selectedConceptNoteUrl) navigate(selectedConceptNoteUrl, { state: { fromMindmap: true, mindmapReturnTo: `/subject/${subjectId}/mindmap`, mindmapViewType: viewType, mindmapConcept: selectedConcept } });
  }, [navigate, selectedConcept, selectedConceptNoteUrl, subjectId, viewType]);

  // Handle node click - open concept action modal (only for concept nodes)
  const onNodeClick = useCallback(
    (event, node) => {
      if (node.type !== "conceptNode") return;
      handleConceptClick({
        id: node.id,
        label: node.data?.label,
        noteUrl: node.data?.noteUrl,
        noteTitle: node.data?.noteTitle,
        anchorId: node.data?.anchorId,
        categoryId: node.data?.categoryId,
        conceptType: node.data?.conceptType,
      });
    },
    [handleConceptClick],
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
        <div className="mindmap-view__error-actions">
          <button type="button" onClick={() => setReloadToken((value) => value + 1)}>
            Retry
          </button>
          <button type="button" onClick={() => navigate(`/subject/${subjectId}`)}>
            Back to domain overview
          </button>
        </div>
      </div>
    );
  }

  // Render the appropriate view based on viewType
  const renderMindmapContent = () => {
    if (viewType === MINDMAP_TYPES.RADIAL) {
      // Radial Tree View (ECharts)
      return (
        <div className="mindmap-view__canvas">
          <RadialMindmapView
            graphData={localizedGraphData}
            subjectId={subjectId}
            onConceptClick={handleConceptClick}
            isDarkMode={false} // TODO: Get from theme context
          />
        </div>
      );
    }
    
    if (viewType === MINDMAP_TYPES.NETWORK) {
      // Network View (Force-directed, Obsidian-style)
      return (
        <div className="mindmap-view__canvas">
          <NetworkMindmapView
            graphData={localizedNetworkGraphData}
            subjectId={subjectId}
            onConceptClick={handleConceptClick}
          />
        </div>
      );
    }

    if (viewType === MINDMAP_TYPES.SPHERE) {
      // 3D Sphere View (WebGL, rotatable concept globe)
      return (
        <div className="mindmap-view__canvas">
          <SphereNetworkView
            graphData={localizedNetworkGraphData}
            subjectId={subjectId}
            onConceptClick={handleConceptClick}
          />
        </div>
      );
    }
    
    // Default: Hierarchical/Orthogonal View (React Flow)
    return (
      <div className="mindmap-view__canvas">
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

  return (
    <div className="mindmap-view">
      {/* Toolbar with back button and view switcher */}
      <MindmapToolbar
        subjectId={subjectId}
        currentType={viewType}
        onTypeChange={handleViewTypeChange}
        subjectName={localizedGraphData?.meta?.subjectName}
        firstConceptNote={firstConceptNote}
        selectedConceptNoteUrl={selectedConceptNoteUrl}
        onOpenFirstNote={handleOpenFirstNote}
        onOpenSelectedConcept={handleOpenSelectedConcept}
      />
      
      {/* Render the selected mindmap view */}
      {renderMindmapContent()}

      <ConceptReviewModal
        open={conceptModalOpen}
        concept={selectedConcept}
        onClose={handleCloseConceptModal}
        onGoToNotes={handleGoToNotes}
      />
    </div>
  );
};

export default MindmapView;
