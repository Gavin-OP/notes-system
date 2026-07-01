import { useMemo, useState } from "react";
import {
  ApartmentOutlined,
  CompassOutlined,
  DragOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";

import useTranslation from "../../i18n/useTranslation";

import "./LearningNavigationPanel.css";

function normalizeKey(key) {
  return String(key || "").replace(/\/+$/, "");
}

function countLeafSteps(items = []) {
  return items.reduce((count, item) => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      return count + countLeafSteps(item.children);
    }
    return typeof item.key === "string" && item.iconType === "file" ? count + 1 : count;
  }, 0);
}

function collectPathSteps(items = [], trail = [], list = []) {
  items.forEach((item) => {
    const label = typeof item.label === "string" ? item.label : "";
    const nextTrail = label ? [...trail, label] : trail;
    if (Array.isArray(item.children) && item.children.length > 0) {
      collectPathSteps(item.children, nextTrail, list);
      return;
    }
    if (typeof item.key !== "string" || item.iconType !== "file") return;
    list.push({
      key: item.key,
      title: label || item.key.split("/").pop() || item.key,
      module: trail.length > 0 ? trail[trail.length - 1] : "",
      trail,
    });
  });
  return list;
}

function sectionContainsCurrent(section, currentNoteUrl) {
  const steps = collectPathSteps(section.children || []);
  return steps.some((step) => normalizeKey(step.key) === currentNoteUrl);
}

function getFirstStep(section) {
  return collectPathSteps(section.children || [section])[0] || null;
}

function collectLearningPathSteps(learningPathDraft) {
  const nodes = Array.isArray(learningPathDraft?.nodes) ? learningPathDraft.nodes : [];
  return nodes
    .filter((node) => node?.note_url || node?.noteUrl)
    .map((node) => ({
      key: node.note_url || node.noteUrl,
      nodeId: node.node_id || node.nodeId || "",
      title: node.title || node.note_url || node.noteUrl,
      module: node.metadata?.subject_title || node.subject || "",
      pathStatus: node.status || "planned",
      pathRelation: node.metadata?.path_relation || node.metadata?.pathRelation || "linear",
    }));
}

function pathKeyToNodeId(path) {
  const match = normalizeKey(path).match(/^\/note\/([^/]+)\/([^/]+)\.md$/);
  if (!match) return "";
  return `${match[1]}.${match[2]}`;
}

function getStepNodeId(step) {
  return step.nodeId || pathKeyToNodeId(step.key);
}

const GRAPH_NODE_WIDTH = 196;
const GRAPH_NODE_HEIGHT = 76;
const GRAPH_ROW_GAP = 44;
const GRAPH_COLUMN_GAP = 28;
const GRAPH_PADDING_X = 24;
const GRAPH_PADDING_Y = 20;

const ESTIMATED_ORDER_BY_NODE_ID = new Map(
  [
    "statistics.rules-of-thumb",
    "finance.rules-of-thumb",
    "statistics.basic-mathematics-tools",
    "statistics.basic-definition",
    "finance.basic-definition",
    "python.getting-started-with-python",
    "data-science.introduction-to-data-science",
    "statistics.linear-algebra",
    "statistics.basic-statistics",
    "finance.time-value",
    "python.python-data-types-operators",
    "data-science.data-fundamentals-and-types",
    "statistics.probability-theorem",
    "python.control-flow-python",
    "python.python-data-structures",
    "finance.equity-market",
    "statistics.distribution",
    "statistics.sampling-methods",
    "python.functions-in-python",
    "finance.fixed-income",
    "statistics.hypothesis-testing",
    "python.modules-packages",
    "python.file-exception-handling",
    "data-science.programming-for-data-science-python",
    "statistics.linear-regression",
    "python.intro-scientific-computing",
    "data-science.data-acquisition-and-storage",
    "finance.risk-and-insurance",
    "data-science.data-cleaning-preprocessing",
    "data-science.exploratory-data-analysis",
    "finance.behavioral-finance",
    "data-science.statistical-foundations",
    "statistics.time-series",
    "statistics.markov-chain",
    "statistics.simulation",
    "statistics.bayesian-learning",
    "data-science.introduction-to-machine-learning",
    "finance.derivatives",
    "finance.portfolio-management",
    "data-science.supervised-learning-regression",
    "data-science.supervised-learning-classification",
    "data-science.unsupervised-learning-clustering",
    "data-science.advanced-data-visualization",
    "python.object-oriented-programming-python",
    "python.advanced-python-concepts",
    "data-science.model-evaluation-deployment",
  ].map((nodeId, index) => [nodeId, index + 1]),
);

function buildSubjectLibrary(items = [], personalizedSteps = []) {
  const existing = new Set(personalizedSteps.map((step) => normalizeKey(step.key)));
  return (items || [])
    .filter((item) => Array.isArray(item.children) && item.children.length > 0)
    .map((item) => {
      const steps = collectPathSteps(item.children).filter((step) => !existing.has(normalizeKey(step.key)));
      return {
        key: item.key,
        title: typeof item.label === "string" ? item.label : item.key || "Subject",
        stepCount: steps.length,
        steps,
      };
    })
    .filter((subject) => subject.stepCount > 0);
}

function buildLearningPathGraph(steps = [], canonicalGraph = null) {
  const graphNodes = Array.isArray(canonicalGraph?.nodes) ? canonicalGraph.nodes : [];
  const graphNodeById = new Map(graphNodes.map((node) => [node.node_id || node.nodeId, node]));
  const defaultPathIds = Array.isArray(canonicalGraph?.default_path?.node_ids)
    ? canonicalGraph.default_path.node_ids
    : Array.isArray(canonicalGraph?.defaultPath?.nodeIds)
      ? canonicalGraph.defaultPath.nodeIds
      : [];
  const defaultOrderById = new Map(defaultPathIds.map((nodeId, index) => [nodeId, index + 1]));
  const entries = steps
    .map((step, index) => ({ id: getStepNodeId(step), step, index }))
    .filter((entry) => entry.id);

  const nodes = entries.map((entry) => {
    const graphNode = graphNodeById.get(entry.id) || null;
    const estimatedOrder = Number(
      graphNode?.metadata?.estimated_order ??
        graphNode?.metadata?.estimatedOrder ??
        graphNode?.estimated_order ??
        graphNode?.estimatedOrder ??
        defaultOrderById.get(entry.id) ??
        ESTIMATED_ORDER_BY_NODE_ID.get(entry.id),
    );
    return {
      ...entry,
      graphNode,
      estimatedOrder: Number.isFinite(estimatedOrder) ? estimatedOrder : 10_000 + entry.index,
    };
  });

  if (nodes.length === 0) {
    return { nodes: [], edges: [], width: 0, height: 0 };
  }

  const sortedNodes = [...nodes].sort(
    (a, b) => a.estimatedOrder - b.estimatedOrder || a.index - b.index || a.id.localeCompare(b.id),
  );
  const groups = [];
  sortedNodes.forEach((node) => {
    const previousGroup = groups[groups.length - 1];
    if (previousGroup && previousGroup.estimatedOrder === node.estimatedOrder) {
      previousGroup.nodes.push(node);
    } else {
      groups.push({ estimatedOrder: node.estimatedOrder, nodes: [node] });
    }
  });

  const positioned = [];
  const maxGroupSize = Math.max(...groups.map((group) => group.nodes.length));
  const width = Math.max(
    360,
    GRAPH_PADDING_X * 2 + maxGroupSize * GRAPH_NODE_WIDTH + Math.max(0, maxGroupSize - 1) * GRAPH_COLUMN_GAP,
  );
  groups.forEach((group, groupIndex) => {
    const rowWidth =
      group.nodes.length * GRAPH_NODE_WIDTH + Math.max(0, group.nodes.length - 1) * GRAPH_COLUMN_GAP;
    const startX = (width - rowWidth) / 2;
    group.nodes.forEach((node, nodeIndex) => {
      positioned.push({
        ...node,
        groupIndex,
        incomingCount: groupIndex > 0 ? groups[groupIndex - 1].nodes.length : 0,
        outgoingCount: groupIndex < groups.length - 1 ? groups[groupIndex + 1].nodes.length : 0,
        x: startX + nodeIndex * (GRAPH_NODE_WIDTH + GRAPH_COLUMN_GAP),
        y: GRAPH_PADDING_Y + groupIndex * (GRAPH_NODE_HEIGHT + GRAPH_ROW_GAP),
      });
    });
  });

  const edges = [];
  groups.forEach((group, groupIndex) => {
    const nextGroup = groups[groupIndex + 1];
    if (!nextGroup) return;
    group.nodes.forEach((source) => {
      nextGroup.nodes.forEach((target) => {
        edges.push({
          source: source.id,
          target: target.id,
          strength: group.nodes.length > 1 || nextGroup.nodes.length > 1 ? "parallel" : "main",
          relation: "estimated_order",
        });
      });
    });
  });

  const height =
    GRAPH_PADDING_Y * 2 + groups.length * GRAPH_NODE_HEIGHT + Math.max(0, groups.length - 1) * GRAPH_ROW_GAP;

  return { nodes: positioned, edges, width, height };
}

const LearningNavigationPanel = ({
  items,
  currentNoteUrl,
  completedNoteUrls,
  learningPathDraft,
  learningPathPending = false,
  onGeneratePath,
  onAddPathNode,
  onReorderPathNodes,
  onRemovePathNode,
  onEditModeChange,
  canonicalGraph,
  onSelect,
  isMobile = false,
}) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [draggedKey, setDraggedKey] = useState("");
  const [dragPayload, setDragPayload] = useState(null);
  const [isPathDropActive, setIsPathDropActive] = useState(false);
  const normalizedCurrent = normalizeKey(currentNoteUrl);
  const personalizedSteps = useMemo(
    () => collectLearningPathSteps(learningPathDraft),
    [learningPathDraft],
  );
  const hasPersonalizedPath = personalizedSteps.length > 0;
  const subjectSections = useMemo(
    () =>
      (items || [])
        .filter((item) => Array.isArray(item.children) && item.children.length > 0)
        .map((item) => ({
          ...item,
          stepCount: countLeafSteps(item.children),
          steps: collectPathSteps(item.children),
        }))
        .filter((item) => item.stepCount > 0),
    [items],
  );
  const standaloneSteps = useMemo(
    () =>
      collectPathSteps((items || []).filter((item) => !Array.isArray(item.children) || item.children.length === 0)),
    [items],
  );
  const addCandidateSteps = useMemo(() => {
    const existing = new Set(personalizedSteps.map((step) => normalizeKey(step.key)));
    return collectPathSteps(items || []).filter((step) => !existing.has(normalizeKey(step.key)));
  }, [items, personalizedSteps]);
  const subjectLibrary = useMemo(
    () => buildSubjectLibrary(items, personalizedSteps),
    [items, personalizedSteps],
  );
  const personalizedGraph = useMemo(
    () => buildLearningPathGraph(personalizedSteps, canonicalGraph),
    [personalizedSteps, canonicalGraph],
  );
  const initialExpandedKey = useMemo(() => {
    const currentSection = subjectSections.find((section) =>
      section.steps.some((step) => normalizeKey(step.key) === normalizedCurrent),
    );
    return currentSection?.key || subjectSections[0]?.key || "standalone";
  }, [normalizedCurrent, subjectSections]);
  const [expandedKeys, setExpandedKeys] = useState(() => new Set([initialExpandedKey]));
  const effectiveExpandedKeys = useMemo(() => {
    const next = new Set(expandedKeys);
    if (hasPersonalizedPath) next.add("personalized");
    if (initialExpandedKey) next.add(initialExpandedKey);
    return next;
  }, [expandedKeys, hasPersonalizedPath, initialExpandedKey]);

  const toggleSection = (sectionKey) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  };

  const toggleEditMode = () => {
    setEditMode((value) => {
      const nextValue = !value;
      onEditModeChange?.(nextValue);
      return nextValue;
    });
  };

  const addCandidateToPath = (candidate) => {
    if (!candidate || typeof onAddPathNode !== "function") return;
    onAddPathNode(candidate);
  };

  const addSubjectToPath = (subject) => {
    if (!subject?.steps?.length || typeof onAddPathNode !== "function") return;
    onAddPathNode({
      type: "subject",
      title: subject.title,
      module: subject.title,
      steps: subject.steps,
    });
  };

  const handleLibraryDragStart = (event, payload) => {
    setDragPayload(payload);
    setDraggedKey(payload?.type === "course" ? payload.step?.key : "");
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("application/x-learning-path-item", JSON.stringify(payload));
    event.dataTransfer.setData("text/plain", payload?.step?.key || payload?.subject?.key || "");
  };

  const handlePathDrop = (event) => {
    if (!editMode) return;
    event.preventDefault();
    setIsPathDropActive(false);
    let payload = dragPayload;
    const rawPayload = event.dataTransfer.getData("application/x-learning-path-item");
    if (rawPayload) {
      try {
        payload = JSON.parse(rawPayload);
      } catch {
        payload = dragPayload;
      }
    }
    if (payload?.type === "subject") addSubjectToPath(payload.subject);
    if (payload?.type === "course") addCandidateToPath(payload.step);
    setDragPayload(null);
    setDraggedKey("");
  };

  const renderSteps = (steps, subjectLabel, options = {}) => {
    const allowRemove = Boolean(options.allowRemove && typeof onRemovePathNode === "function");
    const allowEdit = Boolean(options.allowEdit);
    const firstIncompleteIndex = steps.findIndex(
      (step) => !completedNoteUrls.has(normalizeKey(step.key)) && step.pathStatus !== "completed",
    );
    const handleDropOnStep = (targetKey) => {
      if (!draggedKey || draggedKey === targetKey || typeof onReorderPathNodes !== "function") return;
      const sourceIndex = steps.findIndex((step) => normalizeKey(step.key) === normalizeKey(draggedKey));
      const targetIndex = steps.findIndex((step) => normalizeKey(step.key) === normalizeKey(targetKey));
      if (sourceIndex < 0 || targetIndex < 0) return;
      const nextSteps = [...steps];
      const [moved] = nextSteps.splice(sourceIndex, 1);
      nextSteps.splice(targetIndex, 0, moved);
      onReorderPathNodes(nextSteps.map((step) => step.key));
      setDraggedKey("");
    };
    return (
      <ol className="learning-nav__path" aria-label={`${subjectLabel} path`}>
        {steps.map((step, index) => {
          const stepKey = normalizeKey(step.key);
          const isCurrent = stepKey === normalizedCurrent;
          const isDone = completedNoteUrls.has(stepKey) || step.pathStatus === "completed";
          const isNext = !isCurrent && !isDone && index === firstIncompleteIndex;
          const status = isCurrent ? "current" : isDone ? "done" : isNext ? "next" : "todo";
          return (
            <li
              key={step.key}
              className={`learning-nav__step learning-nav__step--${status} learning-nav__step--${step.pathRelation || "linear"} ${
                draggedKey && normalizeKey(draggedKey) === stepKey ? "learning-nav__step--dragging" : ""
              }`}
              draggable={allowEdit}
              onDragStart={(event) => {
                if (!allowEdit) return;
                setDraggedKey(step.key);
                setDragPayload({ type: "path-node", step });
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", step.key);
              }}
              onDragOver={(event) => {
                if (!allowEdit || !draggedKey || dragPayload?.type === "course") return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }}
              onDrop={(event) => {
                if (!allowEdit) return;
                event.preventDefault();
                handleDropOnStep(step.key);
              }}
              onDragEnd={() => {
                setDraggedKey("");
                setDragPayload(null);
              }}
            >
              <button
                type="button"
                className="learning-nav__node"
                onClick={() => onSelect(step.key)}
                aria-current={isCurrent ? "page" : undefined}
              >
                <span className="learning-nav__connector learning-nav__connector--left" aria-hidden="true" />
                <span className="learning-nav__node-body">
                  {step.module ? (
                    <span className="learning-nav__module">{step.module}</span>
                  ) : null}
                  <span className="learning-nav__node-title">{step.title}</span>
                  {step.pathRelation && step.pathRelation !== "linear" ? (
                    <span className={`learning-nav__relation learning-nav__relation--${step.pathRelation}`}>
                      {step.pathRelation}
                    </span>
                  ) : null}
                </span>
                <span className="learning-nav__connector learning-nav__connector--right" aria-hidden="true" />
              </button>
              {allowRemove ? (
                <button
                  type="button"
                  className="learning-nav__remove-node"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemovePathNode(step.key);
                  }}
                  aria-label={`Remove ${step.title} from path`}
                  title="Remove from path"
                >
                  ×
                </button>
              ) : null}
            </li>
          );
        })}
      </ol>
    );
  };

  const renderDecisionGraph = (graph, options = {}) => {
    const allowRemove = Boolean(options.allowRemove && typeof onRemovePathNode === "function");
    const firstIncompleteIndex = personalizedSteps.findIndex(
      (step) => !completedNoteUrls.has(normalizeKey(step.key)) && step.pathStatus !== "completed",
    );
    const firstIncompleteKey = firstIncompleteIndex >= 0 ? normalizeKey(personalizedSteps[firstIncompleteIndex].key) : "";
    const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
    const edgePath = (edge) => {
      const source = nodeById.get(edge.source);
      const target = nodeById.get(edge.target);
      if (!source || !target) return "";
      const sx = source.x + GRAPH_NODE_WIDTH / 2;
      const sy = source.y + GRAPH_NODE_HEIGHT;
      const tx = target.x + GRAPH_NODE_WIDTH / 2;
      const ty = target.y;
      const middleY = sy + Math.max(34, (ty - sy) / 2);
      return `M ${sx} ${sy} C ${sx} ${middleY}, ${tx} ${middleY}, ${tx} ${ty}`;
    };

    return (
      <div className="learning-nav__graph-scroll">
        <div
          className="learning-nav__graph-canvas"
          style={{ width: graph.width, height: graph.height }}
        >
          <svg
            className="learning-nav__graph-lines"
            viewBox={`0 0 ${graph.width} ${graph.height}`}
            aria-hidden="true"
          >
            <defs>
              <marker
                id="learning-nav-arrow"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path d="M 0 0 L 8 4 L 0 8 z" />
              </marker>
            </defs>
            {graph.edges.map((edge) => {
              const path = edgePath(edge);
              if (!path) return null;
              return (
                <path
                  key={`${edge.source}:${edge.target}`}
                  className={`learning-nav__graph-edge learning-nav__graph-edge--${edge.strength}`}
                  d={path}
                  markerEnd="url(#learning-nav-arrow)"
                />
              );
            })}
          </svg>
          {graph.nodes.map((node) => {
          const step = node.step;
          const stepKey = normalizeKey(step.key);
          const isCurrent = stepKey === normalizedCurrent;
          const isDone = completedNoteUrls.has(stepKey) || step.pathStatus === "completed";
          const isNext = !isCurrent && !isDone && stepKey === firstIncompleteKey;
          const status = isCurrent ? "current" : isDone ? "done" : isNext ? "next" : "todo";
          return (
            <div
              key={`${node.id}:${step.key}`}
              className={`learning-nav__graph-node-wrap learning-nav__graph-node-wrap--${status} ${
                node.incomingCount > 1 ? "learning-nav__graph-node-wrap--join" : ""
              } ${node.outgoingCount > 1 ? "learning-nav__graph-node-wrap--split" : ""}`}
              style={{ left: node.x, top: node.y }}
            >
                <button
                  type="button"
                  className="learning-nav__node learning-nav__graph-node"
                  onClick={() => onSelect(step.key)}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <span className="learning-nav__node-body">
                    {step.module ? <span className="learning-nav__module">{step.module}</span> : null}
                    <span className="learning-nav__node-title">{step.title}</span>
                  </span>
                </button>
                {allowRemove ? (
                  <button
                    type="button"
                    className="learning-nav__remove-node learning-nav__remove-node--graph"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRemovePathNode(step.key);
                    }}
                    aria-label={`Remove ${step.title} from path`}
                    title="Remove from path"
                  >
                    ×
                  </button>
                ) : null}
              </div>
          );
        })}
        </div>
      </div>
    );
  };

  const renderSubjectSection = (section) => {
    const isExpanded = effectiveExpandedKeys.has(section.key);
    const completedCount = section.steps.filter((step) =>
      completedNoteUrls.has(normalizeKey(step.key)),
    ).length;
    const containsCurrent = sectionContainsCurrent(section, normalizedCurrent);
    const firstStep = getFirstStep(section);
    return (
      <section
        key={section.key}
        className={`learning-nav__section ${containsCurrent ? "learning-nav__section--active" : ""}`}
      >
        <div className="learning-nav__section-header">
          <button
            type="button"
            className="learning-nav__section-toggle"
            onClick={() => toggleSection(section.key)}
            aria-expanded={isExpanded}
          >
            <span className="learning-nav__section-icon" aria-hidden="true">
              <ApartmentOutlined />
            </span>
            <span className="learning-nav__section-copy">
              <span className="learning-nav__section-title">{section.label}</span>
              <span className="learning-nav__section-meta">
                {completedCount}/{section.stepCount} {t("learningPath.steps")}
              </span>
            </span>
          </button>
          {firstStep ? (
            <button
              type="button"
              className="learning-nav__section-start"
              onClick={() => onSelect(firstStep.key)}
            >
              {containsCurrent ? t("learningPath.resume") : t("learningPath.open")}
            </button>
          ) : null}
        </div>
        {isExpanded ? renderSteps(section.steps, section.label) : null}
      </section>
    );
  };

  const renderPersonalizedSection = () => {
    if (!hasPersonalizedPath) return null;
    const containsCurrent = personalizedSteps.some((step) => normalizeKey(step.key) === normalizedCurrent);
    return (
      <section
        className={`learning-nav__section learning-nav__section--personalized ${
          containsCurrent ? "learning-nav__section--active" : ""
        }`}
      >
        <div className="learning-nav__section-header">
          <button
            type="button"
            className={`learning-nav__section-start ${editMode ? "learning-nav__section-start--active" : ""}`}
            onClick={toggleEditMode}
          >
            {editMode ? "Done" : "Edit"}
          </button>
        </div>
        {editMode ? (
          <div className="learning-nav__editor">
            <div className="learning-nav__library" aria-label="Course library">
              {subjectLibrary.map((subject) => (
                <button
                  key={subject.key}
                  type="button"
                  className="learning-nav__library-card learning-nav__library-card--subject"
                  draggable
                  onDragStart={(event) => handleLibraryDragStart(event, { type: "subject", subject })}
                  onClick={() => addSubjectToPath(subject)}
                  title={`Add ${subject.title}`}
                >
                  <span className="learning-nav__library-card-icon" aria-hidden="true">
                    <ApartmentOutlined />
                  </span>
                  <span className="learning-nav__library-card-copy">
                    <span className="learning-nav__library-card-title">{subject.title}</span>
                    <span className="learning-nav__library-card-meta">{subject.stepCount} courses</span>
                  </span>
                  <DragOutlined />
                </button>
              ))}
              {addCandidateSteps.map((step) => (
                <button
                  key={step.key}
                  type="button"
                  className="learning-nav__library-card"
                  draggable
                  onDragStart={(event) => handleLibraryDragStart(event, { type: "course", step })}
                  onClick={() => addCandidateToPath(step)}
                  title={`Add ${step.title}`}
                >
                  <span className="learning-nav__library-card-copy">
                    {step.module ? <span className="learning-nav__library-card-meta">{step.module}</span> : null}
                    <span className="learning-nav__library-card-title">{step.title}</span>
                  </span>
                  <DragOutlined />
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div
          className={`learning-nav__drop-zone ${isPathDropActive ? "learning-nav__drop-zone--active" : ""}`}
          onDragOver={(event) => {
            if (!editMode) return;
            event.preventDefault();
            event.dataTransfer.dropEffect =
              dragPayload?.type === "path-node" ? "move" : "copy";
            setIsPathDropActive(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPathDropActive(false);
          }}
          onDrop={handlePathDrop}
        >
          {renderDecisionGraph(personalizedGraph, { allowRemove: true })}
        </div>
      </section>
    );
  };

  return (
    <nav
      className={`learning-nav ${isMobile ? "learning-nav--mobile" : ""}`}
      aria-label={t("learningPath.title")}
    >
      <div className="learning-nav__intro">
        <span className="learning-nav__intro-icon" aria-hidden="true">
          <NodeIndexOutlined />
        </span>
        <div>
          <p className="learning-nav__eyebrow">{t("learningPath.eyebrow")}</p>
          <p className="learning-nav__description">{t("learningPath.description")}</p>
          {!hasPersonalizedPath && typeof onGeneratePath === "function" ? (
            <button
              type="button"
              className="learning-nav__create-path"
              onClick={onGeneratePath}
              disabled={learningPathPending}
            >
              {learningPathPending ? "Creating..." : "Create path"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="learning-nav__legend" aria-label={t("learningPath.legend")}>
        <span className="learning-nav__legend-item learning-nav__legend-item--done">
          {t("learningPath.completed")}
        </span>
        <span className="learning-nav__legend-item learning-nav__legend-item--current">
          {t("learningPath.current")}
        </span>
        <span className="learning-nav__legend-item learning-nav__legend-item--next">
          {t("learningPath.next")}
        </span>
      </div>

      <div className="learning-nav__sections">
        {renderPersonalizedSection()}
        {!hasPersonalizedPath ? subjectSections.map(renderSubjectSection) : null}
        {!hasPersonalizedPath && standaloneSteps.length > 0 ? (
          <section className="learning-nav__section learning-nav__section--active">
            <div className="learning-nav__section-header">
              <div className="learning-nav__section-toggle learning-nav__section-toggle--static">
                <span className="learning-nav__section-icon" aria-hidden="true">
                  <CompassOutlined />
                </span>
                <span className="learning-nav__section-copy">
                  <span className="learning-nav__section-title">{t("learningPath.general")}</span>
                  <span className="learning-nav__section-meta">
                    {standaloneSteps.length} {t("learningPath.steps")}
                  </span>
                </span>
              </div>
            </div>
            {renderSteps(standaloneSteps, t("learningPath.general"))}
          </section>
        ) : null}
      </div>
    </nav>
  );
};

export default LearningNavigationPanel;
