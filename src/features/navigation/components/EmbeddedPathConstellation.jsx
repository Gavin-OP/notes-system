import { useMemo } from "react";
import { AimOutlined, CompressOutlined, ExpandOutlined, SettingOutlined } from "@ant-design/icons";
import ReactFlow, { Background, BaseEdge, Controls, Handle, Position } from "reactflow";
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
      <span className="path-star-node__orb" aria-hidden="true"><i /></span>
      <span className="path-star-node__copy"><strong>{data.localizedTitle || data.title}</strong>{data.isCurrent ? <small>{data.currentLabel}</small> : data.isComplete ? <small>{data.completedLabel}</small> : !hasContent ? <small>{data.plannedLabel}</small> : null}</span>
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
  const directoryTrunkX = targetX - 28;
  const path = data?.routeStyle === "midpoint-drop"
    ? `M ${routeSourceX} ${routeSourceY} V ${targetY}`
    : data?.routeStyle === "directory"
    ? `M ${routeSourceX} ${routeSourceY} V ${busY} H ${directoryTrunkX} V ${targetY} H ${targetX}`
    : isBranch
      ? `M ${routeSourceX} ${routeSourceY} V ${busY} H ${targetX} V ${targetY}`
      : `M ${routeSourceX} ${routeSourceY} L ${targetX} ${targetY}`;
  return <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />;
}

const edgeTypes = { fixedRoute: FixedRouteEdge };

export default function EmbeddedPathConstellation({ draft, currentNoteUrl, completedNoteUrls, onSelect, onAdjust, isRail = false, isMobile = false, onToggleExpand }) {
  const { t } = useTranslation();
  const elements = useMemo(() => {
    const completed = new Set([...completedNoteUrls].map(normalize));
    const current = normalize(currentNoteUrl);
    const allNodes = Array.isArray(draft?.nodes) ? draft.nodes : [];
    const focusNode = allNodes.find((node) => normalize(node.note_url) === current) || allNodes.find((node) => node.metadata?.recommended_now) || allNodes[0];
    const visibleDraft = isRail
      ? { ...draft, nodes: focusNode ? [focusNode] : [], edges: [] }
      : draft;
    const built = buildConstellationElements(visibleDraft, { compact: true, direction: "horizontal" });
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
    return { nodes, edges, currentNode: nodes.find((node) => node.data.isCurrent) || nodes[0] };
  }, [completedNoteUrls, currentNoteUrl, draft, isRail, onSelect, t]);

  return <section className={`embedded-constellation${isRail ? " is-rail" : " is-expanded"}`} aria-label={t("pilot.path.aria")}>
    <header className="embedded-constellation__header"><div><span>YOUR PATH</span><strong>{isRail ? t("pilot.path.currentRoute") : t("pilot.path.title")}</strong></div><nav>
      {typeof onAdjust === "function" ? <button type="button" className="embedded-constellation__adjust" onClick={onAdjust} aria-label="调整 Path"><SettingOutlined /><span>调整 Path</span></button> : null}
      {!isMobile && typeof onToggleExpand === "function" ? <button type="button" className="embedded-constellation__resize" onClick={onToggleExpand} aria-label={isRail ? t("pilot.path.openSettings") : t("pilot.path.backToReading")}>{isRail ? <ExpandOutlined /> : <CompressOutlined />}</button> : null}
    </nav></header>
    <div className="embedded-constellation__canvas">
      {isRail ? <div className="embedded-constellation__rail-focus"><StarNode data={{ ...elements.currentNode.data, hideHandles: true }} /></div> : <ReactFlow key={`expanded-${isMobile ? "mobile" : "desktop"}-${elements.nodes.length}`} nodes={elements.nodes} edges={elements.edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} panOnDrag zoomOnScroll zoomOnPinch minZoom={.18} maxZoom={1.3} fitView fitViewOptions={{ padding: isMobile ? 0.08 : 0.12, minZoom: 0.18, maxZoom: isMobile ? 0.72 : 1 }} onNodeClick={(_, node) => { if (node.data.note_url) onSelect?.(node.data.note_url); }}>
        <Background variant="dots" gap={24} size={1.1} />
        <Controls showInteractive={false} position="bottom-right" />
        <div className="embedded-constellation__hint"><AimOutlined /> {t("pilot.path.hint")}</div>
      </ReactFlow>}
    </div>
  </section>;
}
