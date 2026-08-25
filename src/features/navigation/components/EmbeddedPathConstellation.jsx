import { useMemo } from "react";
import { AimOutlined, CompressOutlined } from "@ant-design/icons";
import ReactFlow, { BaseEdge, Controls, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";

import { buildConstellationElements } from "../lib/constellationPath";
import useTranslation from "../../../i18n/useTranslation";
import "./EmbeddedPathConstellation.css";

function normalize(value) {
  return String(value || "").split("#")[0].replace(/\/+$/, "");
}

function StarNode({ data }) {
  const hasContent = Boolean(data.note_url);
  return <div className={`path-star-node path-star-node--tone-${data.tone}${data.isCurrent ? " is-current" : ""}${data.isComplete ? " is-complete" : ""}${data.hasPriorPath ? " has-prior-path" : ""}${data.metadata?.path_relation === "branch" ? " is-branch" : ""}${hasContent ? "" : " is-content-planned"}`} style={{ "--star-index": data.index || 0 }}>
    {!data.hideHandles ? <>
      <Handle id="main-target" type="target" position={Position.Left} isConnectable={false} />
      <Handle id="branch-target" type="target" position={Position.Top} isConnectable={false} />
      <Handle id="tree-target" type="target" position={Position.Left} isConnectable={false} />
    </> : null}
    <button type="button" className="path-star-node__button" disabled={!hasContent} onClick={(event) => { event.stopPropagation(); if (hasContent) data.onOpen?.(); }} aria-label={hasContent ? data.openLabel : `${data.localizedTitle || data.title}，${data.plannedLabel}`}>
      <span className="path-star-node__copy">
        {data.metadata?.path_relation !== "branch" ? <span className="path-star-node__eyebrow">{data.isCurrent ? data.currentLabel : data.isComplete ? data.completedLabel : data.routeLabel}</span> : null}
        <strong>{data.localizedTitle || data.title}</strong>
        {!hasContent ? <small>{data.plannedLabel}</small> : null}
      </span>
    </button>
    {!data.hideHandles ? <>
      <Handle id="main-source" type="source" position={Position.Right} isConnectable={false} />
      <Handle id="branch-source" type="source" position={Position.Bottom} isConnectable={false} />
    </> : null}
  </div>;
}

const nodeTypes = { constellation: StarNode };

function FixedRouteEdge({ id, sourceX, sourceY, targetX, targetY, style, data, markerEnd }) {
  const isBranch = data?.relation === "branches_to";
  const routeSourceX = Number.isFinite(data?.customSourceX) ? data.customSourceX : sourceX;
  const routeSourceY = Number.isFinite(data?.customSourceY) ? data.customSourceY : sourceY;
  const busY = Number.isFinite(data?.busY) ? data.busY : routeSourceY + Math.max(28, (targetY - routeSourceY) / 2);
  const endpointGap = 10;
  const directoryTrunkX = targetX - 20;
  const path = data?.routeStyle === "midpoint-drop"
    ? `M ${routeSourceX} ${routeSourceY + endpointGap} V ${targetY - endpointGap}`
    : data?.routeStyle === "directory"
    ? `M ${directoryTrunkX} ${routeSourceY + endpointGap} V ${targetY} H ${targetX - endpointGap}`
    : isBranch
      ? `M ${routeSourceX} ${routeSourceY + endpointGap} V ${busY} H ${targetX} V ${targetY - endpointGap}`
      : `M ${routeSourceX + endpointGap} ${routeSourceY} L ${targetX - endpointGap} ${targetY}`;
  return <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />;
}

const edgeTypes = { fixedRoute: FixedRouteEdge };

export default function EmbeddedPathConstellation({ draft, currentNoteUrl, completedNoteUrls, onSelect, isRail = false, isMobile = false, onToggleExpand }) {
  const { t } = useTranslation();
  const elements = useMemo(() => {
    const completed = new Set([...completedNoteUrls].map(normalize));
    const current = normalize(currentNoteUrl);
    const allNodes = Array.isArray(draft?.nodes) ? draft.nodes : [];
    const focusNode = allNodes.find((node) => normalize(node.note_url) === current) || allNodes.find((node) => node.metadata?.recommended_now) || allNodes[0];
    const visibleDraft = isRail
      ? { ...draft, nodes: focusNode ? [focusNode] : [], edges: [] }
      : draft;
    const built = buildConstellationElements(visibleDraft, { compact: false, direction: "horizontal" });
    const currentNode = built.nodes.find((node) => normalize(node.data.note_url) === current);
    const currentOrder = currentNode?.data?.metadata?.estimated_order ?? -1;
    const nodes = built.nodes.map((node, index) => ({
      ...node,
      data: {
        ...node.data,
        localizedTitle: t(`pilot.node.${node.id.replace(/^pilot:/, "")}`, node.data.title),
        openLabel: `${t("learningPath.open")} ${t(`pilot.node.${node.id.replace(/^pilot:/, "")}`, node.data.title)}`,
        currentLabel: t("pilot.node.current"),
        completedLabel: t("pilot.node.completed"),
        routeLabel: t("pilot.path.stage", "求职准备"),
        plannedLabel: t("pilot.node.contentPlanned", "内容待补充"),
        index,
        tone: node.data.hierarchyLevel,
        isCurrent: node.id === currentNode?.id,
        isComplete: completed.has(normalize(node.data.note_url)) || node.data.status === "completed",
        onOpen: node.data.note_url ? () => onSelect?.(node.data.note_url) : undefined,
      },
    }));
    const edges = built.edges.map((edge) => {
      const source = nodes.find((node) => node.id === edge.source);
      const target = nodes.find((node) => node.id === edge.target);
      const active = currentOrder >= 0 && (target?.data?.metadata?.estimated_order ?? Infinity) <= currentOrder;
      const isBranch = edge.data?.relation === "branches_to" || edge.data?.relation === "converges_to";
      const relationClass = edge.data?.relation === "converges_to"
        ? "is-converges-route"
        : edge.data?.routeStyle === "midpoint-drop"
          ? "is-midpoint-route"
          : edge.data?.relation === "branches_to" ? "is-branches-route" : "";
      return { ...edge, className: `${active ? "is-travelled " : ""}${isBranch ? "is-branch-route" : "is-main-route"} ${relationClass}`.trim(), animated: false, style: { "--edge-index": source?.data?.index || 0, "--route-color": `var(--stage-${target?.data?.tone || 0})` } };
    });
    const completedCount = nodes.filter((node) => node.data.isComplete).length;
    const progressPercent = nodes.length > 0 ? Math.round((completedCount / nodes.length) * 100) : 0;
    const viewportNode = nodes.find((node) => node.data.isCurrent) || nodes[0];
    return {
      nodes,
      edges,
      currentNode: viewportNode,
      completedCount,
      progressPercent,
      initialViewport: {
        x: viewportNode ? 44 - viewportNode.position.x : 0,
        y: viewportNode ? 48 - viewportNode.position.y : 0,
        zoom: 1,
      },
    };
  }, [completedNoteUrls, currentNoteUrl, draft, isRail, onSelect, t]);

  if (isRail) {
    const currentNode = elements.currentNode?.data;
    return <button
      type="button"
      className="embedded-constellation-rail"
      onClick={onToggleExpand}
      aria-label={t("pilot.path.openSettings")}
      title={t("pilot.path.openSettings")}
    >
      <span>{t("pilot.node.current")}</span>
      <strong>{currentNode?.localizedTitle || currentNode?.title || t("pilot.path.currentRoute")}</strong>
      <small>{t("pilot.path.openSettings")}</small>
    </button>;
  }

  return <section className="embedded-constellation is-expanded" aria-label={t("pilot.path.aria")}>
    <header className="embedded-constellation__header"><div><span>YOUR PATH</span><strong>{t("pilot.path.title")}</strong></div>
      <div className="embedded-constellation__progress">
        <div style={{ "--path-progress": `${elements.progressPercent}%` }}><strong>{elements.progressPercent}%</strong></div>
        <span>{t("learningPath.completed")}<b>{elements.completedCount} / {elements.nodes.length}</b></span>
      </div>
      <nav>
      {!isMobile && typeof onToggleExpand === "function" ? <button type="button" className="embedded-constellation__resize" onClick={onToggleExpand} aria-label={t("pilot.path.backToReading")}><CompressOutlined /></button> : null}
    </nav></header>
    <div className="embedded-constellation__canvas">
      <ReactFlow
        key={`expanded-${isMobile ? "mobile" : "desktop"}-${elements.nodes.length}-${elements.currentNode?.id || "start"}`}
        nodes={elements.nodes}
        edges={elements.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag
        zoomOnScroll
        zoomOnPinch
        minZoom={.18}
        maxZoom={1.3}
        fitView={isMobile}
        defaultViewport={elements.initialViewport}
        fitViewOptions={{
          nodes: elements.currentNode ? [elements.currentNode] : undefined,
          padding: isMobile ? 1.25 : 1,
          minZoom: isMobile ? 0.58 : 0.68,
          maxZoom: isMobile ? 0.76 : 1,
        }}
        onNodeClick={(_, node) => { if (node.data.note_url) onSelect?.(node.data.note_url); }}
      >
        <Controls showInteractive={false} position="bottom-right" />
        <div className="embedded-constellation__hint"><AimOutlined /> {t("pilot.path.hint")}</div>
      </ReactFlow>
    </div>
  </section>;
}
