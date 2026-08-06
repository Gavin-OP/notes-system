import { useMemo } from "react";
import { AimOutlined, CompressOutlined, ExpandOutlined } from "@ant-design/icons";
import ReactFlow, { Background, BaseEdge, Controls, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";

import { buildConstellationElements } from "../lib/constellationPath";
import "./EmbeddedPathConstellation.css";

function normalize(value) {
  return String(value || "").split("#")[0].replace(/\/+$/, "");
}

function StarNode({ data }) {
  return <div className={`path-star-node path-star-node--tone-${data.tone}${data.isCurrent ? " is-current" : ""}${data.isComplete ? " is-complete" : ""}${data.metadata?.path_relation === "branch" ? " is-branch" : ""}`} style={{ "--star-index": data.index || 0 }}>
    {!data.hideHandles ? <Handle type="target" position={Position.Left} isConnectable={false} /> : null}
    <button type="button" className="path-star-node__button" onClick={(event) => { event.stopPropagation(); data.onOpen?.(); }} aria-label={`打开${data.title}`}>
      <span className="path-star-node__orb" aria-hidden="true"><i /></span>
      <span className="path-star-node__copy"><strong>{data.title}</strong>{data.isCurrent ? <small>正在这里</small> : data.isComplete ? <small>已完成</small> : null}</span>
    </button>
    {!data.hideHandles ? <Handle type="source" position={Position.Right} isConnectable={false} /> : null}
  </div>;
}

const nodeTypes = { constellation: StarNode };

function FixedRouteEdge({ id, sourceX, sourceY, targetX, targetY, style, data, markerEnd }) {
  const isBranch = data?.relation === "branches_to";
  const busX = Number.isFinite(data?.busX) ? data.busX : sourceX + Math.max(36, (targetX - sourceX) / 2);
  const path = isBranch
    ? `M ${sourceX} ${sourceY} H ${busX} V ${targetY} H ${targetX}`
    : `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  return <BaseEdge id={id} path={path} style={style} markerEnd={markerEnd} />;
}

const edgeTypes = { fixedRoute: FixedRouteEdge };

function pathTone(nodeId) {
  if (["pilot:profile-preparation", "pilot:resume", "pilot:linkedin", "pilot:cover-letter", "pilot:portfolio", "pilot:personal-site", "pilot:job-search", "pilot:networking", "pilot:ai-job-search"].includes(nodeId)) return 1;
  if (["pilot:applications", "pilot:assessments"].includes(nodeId)) return 2;
  if (["pilot:interviews", "pilot:interview-review", "pilot:technical-skills", "pilot:finance-skills", "pilot:certificate-cfa", "pilot:certificate-frm", "pilot:certificate-hkicpa"].includes(nodeId)) return 3;
  if (nodeId === "pilot:offer") return 4;
  return 0;
}

export default function EmbeddedPathConstellation({ draft, currentNoteUrl, completedNoteUrls, onSelect, isRail = false, onToggleExpand }) {
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
        index,
        tone: pathTone(node.id),
        isCurrent: node.id === currentNode?.id,
        isComplete: completed.has(normalize(node.data.note_url)) || node.data.status === "completed",
        onOpen: () => onSelect?.(node.data.note_url),
      },
    }));
    const edges = built.edges.map((edge) => {
      const source = nodes.find((node) => node.id === edge.source);
      const target = nodes.find((node) => node.id === edge.target);
      const active = currentOrder >= 0 && (target?.data?.metadata?.estimated_order ?? Infinity) <= currentOrder;
      const isBranch = edge.data?.relation === "branches_to" || edge.data?.relation === "converges_to";
      const relationClass = edge.data?.relation === "converges_to" ? "is-converges-route" : edge.data?.relation === "branches_to" ? "is-branches-route" : "";
      return { ...edge, className: `${active ? "is-travelled " : ""}${isBranch ? "is-branch-route" : "is-main-route"} ${relationClass}`.trim(), animated: false, style: { "--edge-index": source?.data?.index || 0, "--route-color": `var(--stage-${target?.data?.tone || 0})` } };
    });
    return { nodes, edges, currentNode: nodes.find((node) => node.data.isCurrent) || nodes[0] };
  }, [completedNoteUrls, currentNoteUrl, draft, isRail, onSelect]);

  return <section className={`embedded-constellation${isRail ? " is-rail" : " is-expanded"}`} aria-label="你的求职星图">
    <header className="embedded-constellation__header"><div><span>YOUR PATH</span><strong>{isRail ? "当前路线" : "求职 Learning Path"}</strong></div><nav><button type="button" className="embedded-constellation__resize" onClick={onToggleExpand} aria-label={isRail ? "打开 Path 设置" : "返回阅读模式"}>{isRail ? <ExpandOutlined /> : <CompressOutlined />}</button></nav></header>
    <div className="embedded-constellation__canvas">
      {isRail ? <div className="embedded-constellation__rail-focus"><StarNode data={{ ...elements.currentNode.data, hideHandles: true }} /></div> : <ReactFlow key="expanded" nodes={elements.nodes} edges={elements.edges} nodeTypes={nodeTypes} edgeTypes={edgeTypes} nodesDraggable={false} nodesConnectable={false} panOnDrag zoomOnScroll zoomOnPinch minZoom={.4} maxZoom={1.3} defaultViewport={{ x: 22, y: 104, zoom: .72 }} onNodeClick={(_, node) => onSelect?.(node.data.note_url)}>
        <Background variant="dots" gap={24} size={1.1} />
        <Controls showInteractive={false} position="bottom-right" />
        <div className="embedded-constellation__hint"><AimOutlined /> 横向探索路线 · 点击节点进入笔记</div>
      </ReactFlow>}
    </div>
  </section>;
}
