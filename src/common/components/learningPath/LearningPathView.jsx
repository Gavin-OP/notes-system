import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Tag } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

import LearningPathToolbar from "./LearningPathToolbar";
import { extractLearningPathData, loadSubjectGraph } from "./utils";
import "./LearningPathView.css";

const LearningPathView = ({ subjectId }) => {
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subjectId) {
      setError("No subject specified");
      setLoading(false);
      return;
    }

    let active = true;
    async function fetchGraph() {
      try {
        setLoading(true);
        const data = await loadSubjectGraph(subjectId);
        if (!active) return;
        if (!data) {
          setError("Failed to load subject graph");
          return;
        }
        setGraphData(data);
      } catch {
        if (!active) return;
        setError("An error occurred while loading learning path");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchGraph();

    return () => {
      active = false;
    };
  }, [subjectId]);

  const learningPathData = useMemo(
    () => extractLearningPathData(graphData),
    [graphData],
  );

  const openNote = (noteUrl) => {
    if (noteUrl) navigate(noteUrl);
  };

  const subjectName = learningPathData?.subjectName;
  const orderedNodes = useMemo(
    () => learningPathData?.orderedNodes ?? [],
    [learningPathData],
  );
  const layeredNodes = useMemo(
    () => learningPathData?.layeredNodes ?? [],
    [learningPathData],
  );
  const hasCycle = learningPathData?.hasCycle ?? false;
  const cycleNodes = learningPathData?.cycleNodes ?? [];
  const warnings = learningPathData?.warnings ?? [];

  const flowGraphData = useMemo(() => {
    const byId = new Map(orderedNodes.map((node) => [node.id, node]));
    const flowNodes = [];
    const flowEdges = [];
    const xGap = 260;
    const yGap = 100;
    const startX = 40;
    const baseCenterY = 120;
    const totalLayers = layeredNodes.length;
    const yAssignments = new Map();
    let nextCenterY = baseCenterY;

    layeredNodes.forEach((layer) => {
      layer.forEach((node) => {
        const prereqs = (node.prerequisites || []).filter((id) => byId.has(id));
        const centerY =
          prereqs.length === 0
            ? nextCenterY
            : (yAssignments.get(prereqs[0]) ?? baseCenterY);
        if (prereqs.length === 0) nextCenterY += yGap;
        yAssignments.set(node.id, centerY);
      });
    });

    layeredNodes.forEach((layer, layerIdx) => {
      layer.forEach((node) => {
        const t = totalLayers <= 1 ? 0 : layerIdx / (totalLayers - 1);
        const centerY = yAssignments.get(node.id) ?? baseCenterY;
        flowNodes.push({
          id: node.id,
          type: "default",
          position: {
            x: startX + layerIdx * xGap,
            y: centerY,
          },
          data: { label: node.title || node.id, noteUrl: node.noteUrl },
          className: `learning-path-graph__node learning-path-graph__node--depth-${Math.min(Math.floor(t * 10), 9)}`,
          sourcePosition: "right",
          targetPosition: "left",
        });
      });
    });

    orderedNodes.forEach((node) => {
      (node.prerequisites || []).forEach((prereqId) => {
        if (!byId.has(prereqId)) return;
        flowEdges.push({
          id: `lp-${prereqId}-${node.id}`,
          source: prereqId,
          target: node.id,
          type: "straight",
          animated: false,
          className: "learning-path-graph__edge",
        });
      });
    });

    return { flowNodes, flowEdges };
  }, [orderedNodes, layeredNodes]);

  if (loading) {
    return (
      <div className="learning-path-view learning-path-view--loading">
        <div className="learning-path-view__spinner" />
        <p>Loading learning path...</p>
      </div>
    );
  }

  if (error || !learningPathData) {
    return (
      <div className="learning-path-view learning-path-view--error">
        <p>{error || "No learning path data available."}</p>
      </div>
    );
  }

  return (
    <div className="learning-path-view">
      <LearningPathToolbar subjectId={subjectId} subjectName={subjectName} />
      <div className="learning-path-view__content">
        {hasCycle && (
          <Alert
            type="warning"
            showIcon
            message="Cycle detected in prerequisites"
            description={`The graph contains cycles: ${cycleNodes.join(", ")}. Showing available partial order.`}
          />
        )}

        {warnings.length > 0 && (
          <Alert
            type="info"
            showIcon
            message="Data warnings"
            description={warnings.join(" | ")}
          />
        )}

        <Card
          title="Learning Path Graph"
          className="learning-path-view__card learning-path-view__graph-card"
        >
          <div className="learning-path-view__graph">
            <ReactFlow
              nodes={flowGraphData.flowNodes}
              edges={flowGraphData.flowEdges}
              nodeOrigin={[0, 0.5]}
              fitView
              fitViewOptions={{ padding: 0.25, maxZoom: 1.2 }}
              minZoom={0.3}
              maxZoom={1.8}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable
              onNodeClick={(_, node) => openNote(node.data?.noteUrl)}
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={18} size={1} />
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
        </Card>

        <Card title="Step-by-step Order" className="learning-path-view__card">
          {orderedNodes.length === 0 ? (
            <p className="learning-path-view__empty">No topics available.</p>
          ) : (
            <ol className="learning-path-view__ordered-list">
              {orderedNodes.map((node) => (
                <li key={node.id} className="learning-path-view__ordered-item">
                  <button
                    type="button"
                    className="learning-path-view__topic-btn"
                    onClick={() => openNote(node.noteUrl)}
                  >
                    {node.title || node.id}
                  </button>
                  <span className="learning-path-view__meta">
                    {node.estimatedMinutes ? (
                      <span>
                        <ClockCircleOutlined /> {node.estimatedMinutes} min
                      </span>
                    ) : null}
                    {node.difficulty && (
                      <Tag
                        color={
                          String(node.difficulty).toLowerCase() === "easy"
                            ? "green"
                            : String(node.difficulty).toLowerCase() === "hard"
                              ? "#f87171"
                              : "blue"
                        }
                      >
                        {String(node.difficulty)}
                      </Tag>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Card>

        <Card title="Branching Layers" className="learning-path-view__card">
          {layeredNodes.length === 0 ? (
            <p className="learning-path-view__empty">No layers available.</p>
          ) : (
            <div className="learning-path-view__layers">
              {layeredNodes.map((layer, index) => (
                <div key={`layer-${index}`} className="learning-path-view__layer">
                  <div className="learning-path-view__layer-title">
                    Layer {index + 1}
                  </div>
                  <div className="learning-path-view__layer-items">
                    {layer.map((node) => (
                      <button
                        key={node.id}
                        type="button"
                        className="learning-path-view__chip"
                        onClick={() => openNote(node.noteUrl)}
                      >
                        {node.title || node.id}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LearningPathView;
