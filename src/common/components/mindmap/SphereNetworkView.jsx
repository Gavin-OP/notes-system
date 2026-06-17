/**
 * SphereNetworkView - WebGL concept graph laid out on a rotatable sphere.
 *
 * The layout is intentionally deterministic and mostly static: nodes are
 * pinned to a Fibonacci sphere so opening the view is fast and the user can
 * inspect different sides by rotating the camera.
 */
import { useCallback, useMemo, useRef, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";
import SpriteText from "three-spritetext";

import { convertToNetworkFormat } from "./utils/networkGraphLoader";
import "./SphereNetworkView.css";

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const MIN_SPHERE_RADIUS = 280;
const MAX_SPHERE_RADIUS = 620;
const MAX_LABEL_LINES = 2;
const MAX_LABEL_LINE_LENGTH = 12;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getNodeLabel(node) {
  return node?.name ?? node?.label ?? node?.id ?? "";
}

function formatNodeText(label) {
  const normalizedLabel = String(label).replace(/\s+/g, " ").trim();
  if (normalizedLabel.length <= MAX_LABEL_LINE_LENGTH) {
    return normalizedLabel;
  }

  const words = normalizedLabel.split(" ");
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= MAX_LABEL_LINE_LENGTH) {
      currentLine = candidate;
      return;
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  const visibleLines = lines.slice(0, MAX_LABEL_LINES);
  const hasHiddenText = lines.length > MAX_LABEL_LINES;
  const lastLine = visibleLines[visibleLines.length - 1] ?? normalizedLabel;

  if (hasHiddenText || lastLine.length > MAX_LABEL_LINE_LENGTH) {
    visibleLines[visibleLines.length - 1] = `${lastLine.slice(0, MAX_LABEL_LINE_LENGTH - 3)}...`;
  }

  return visibleLines.join("\n");
}

function getNodeColor(node, focusSubject) {
  if (node.subject && node.subject !== focusSubject) {
    return node.color ?? "#8fb8ff";
  }
  return node.color ?? "#7CFF9E";
}

function buildSphereGraph(graphData, subjectId) {
  const networkData = convertToNetworkFormat(graphData, subjectId);
  const networkNodes = networkData.nodes ?? [];
  const networkEdges = networkData.edges ?? [];
  const focusSubject = networkData.metadata?.focusSubject ?? subjectId;
  const nodeCount = Math.max(networkNodes.length, 1);
  const radius = clamp(180 + Math.sqrt(nodeCount) * 34, MIN_SPHERE_RADIUS, MAX_SPHERE_RADIUS);

  const nodes = networkNodes.map((node, index) => {
    const y = 1 - (index / Math.max(nodeCount - 1, 1)) * 2;
    const radial = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = index * GOLDEN_ANGLE;
    const x = Math.cos(theta) * radial;
    const z = Math.sin(theta) * radial;
    const size = clamp(Number(node.data?.size) || 42, 24, 96);
    const subject = node.data?.subject ?? subjectId;
    const sphereNode = {
      id: node.id,
      name: node.data?.label ?? node.id,
      subject,
      color: getNodeColor({ color: node.data?.color, subject }, focusSubject),
      noteUrl: node.data?.noteUrl,
      val: size,
      categoryId: node.data?.categoryId,
      clusterLabel: node.data?.clusterLabel,
      fx: x * radius,
      fy: y * radius,
      fz: z * radius,
      x: x * radius,
      y: y * radius,
      z: z * radius,
    };
    return sphereNode;
  });

  const nodeIds = new Set(nodes.map((node) => node.id));
  const links = networkEdges
    .filter((edge) => nodeIds.has(edge.source) && nodeIds.has(edge.target))
    .map((edge) => ({
      source: edge.source,
      target: edge.target,
      type: edge.type,
      edgeKind: edge.edgeKind,
      value: Number(edge.weight ?? edge.strength ?? 1) || 1,
    }));

  return {
    nodes,
    links,
    radius,
    metadata: networkData.metadata ?? {},
  };
}

const SphereNetworkView = ({ graphData, subjectId, onOpenNote }) => {
  const graphRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const sphereGraph = useMemo(() => {
    if (!graphData) {
      return { nodes: [], links: [], radius: MIN_SPHERE_RADIUS, metadata: {} };
    }
    return buildSphereGraph(graphData, subjectId);
  }, [graphData, subjectId]);

  const connectedNodeIds = useMemo(() => {
    if (!hoveredNode) return null;
    const ids = new Set([hoveredNode.id]);
    sphereGraph.links.forEach((link) => {
      const sourceId = typeof link.source === "object" ? link.source.id : link.source;
      const targetId = typeof link.target === "object" ? link.target.id : link.target;
      if (sourceId === hoveredNode.id) ids.add(targetId);
      if (targetId === hoveredNode.id) ids.add(sourceId);
    });
    return ids;
  }, [hoveredNode, sphereGraph.links]);

  const createNodeObject = useCallback(
    (node) => {
      const isConnected = !connectedNodeIds || connectedNodeIds.has(node.id);
      const color = new THREE.Color(node.color);
      const radius = clamp(Math.sqrt(node.val) * 2.35, 13, 25);
      const geometry = new THREE.SphereGeometry(radius, 18, 18);
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: hoveredNode?.id === node.id ? 0.72 : 0.36,
        transparent: true,
        opacity: isConnected ? 0.96 : 0.18,
        shininess: 80,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const group = new THREE.Group();
      const label = new SpriteText(formatNodeText(getNodeLabel(node)));
      label.textHeight = clamp(radius * 0.28, 4.2, 6.4);
      label.color = "#111111";
      label.fontWeight = 600;
      label.material.transparent = true;
      label.material.opacity = isConnected ? 0.94 : 0.18;
      label.material.depthWrite = false;
      label.material.depthTest = false;
      label.position.set(0, 0, 0);

      group.add(mesh);
      group.add(label);

      if (hoveredNode?.id === node.id) {
        const haloGeometry = new THREE.SphereGeometry(radius * 1.9, 24, 24);
        const haloMaterial = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.16,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        group.add(new THREE.Mesh(haloGeometry, haloMaterial));
      }

      return group;
    },
    [connectedNodeIds, hoveredNode]
  );

  const handleNodeClick = useCallback(
    (node) => {
      if (node?.noteUrl) {
        onOpenNote(node.noteUrl);
      }
    },
    [onOpenNote]
  );

  if (!sphereGraph.nodes.length) {
    return (
      <div className="sphere-network-view sphere-network-view--empty">
        No graph data available.
      </div>
    );
  }

  return (
    <div className="sphere-network-view">
      <div className="sphere-network-view__hud">
        <div className="sphere-network-view__title">3D Sphere</div>
        <div className="sphere-network-view__meta">
          {sphereGraph.nodes.length} concepts · {sphereGraph.links.length} links
        </div>
        <div className="sphere-network-view__hint">
          Drag to rotate · Scroll to zoom · Click a node to open its note
        </div>
      </div>

      {hoveredNode && (
        <div className="sphere-network-view__tooltip">
          <strong>{getNodeLabel(hoveredNode)}</strong>
          <span>{hoveredNode.clusterLabel || hoveredNode.subject}</span>
        </div>
      )}

      <ForceGraph3D
        ref={graphRef}
        graphData={sphereGraph}
        width={undefined}
        height={undefined}
        backgroundColor="#070910"
        showNavInfo={false}
        warmupTicks={0}
        cooldownTicks={0}
        enableNodeDrag={false}
        nodeThreeObject={createNodeObject}
        nodeLabel={(node) => getNodeLabel(node)}
        onNodeHover={setHoveredNode}
        onNodeClick={handleNodeClick}
        linkColor={(link) => {
          if (!hoveredNode) return "rgba(135, 195, 255, 0.36)";
          const sourceId = typeof link.source === "object" ? link.source.id : link.source;
          const targetId = typeof link.target === "object" ? link.target.id : link.target;
          return sourceId === hoveredNode.id || targetId === hoveredNode.id
            ? "rgba(170, 255, 180, 0.78)"
            : "rgba(120, 180, 255, 0.06)";
        }}
        linkWidth={(link) => {
          const baseWidth = clamp(Math.sqrt(Number(link.value) || 1) * 0.56, 0.5, 2.6);
          if (!hoveredNode) return baseWidth;
          const sourceId = typeof link.source === "object" ? link.source.id : link.source;
          const targetId = typeof link.target === "object" ? link.target.id : link.target;
          return sourceId === hoveredNode.id || targetId === hoveredNode.id
            ? baseWidth * 2.6
            : baseWidth * 0.5;
        }}
        linkOpacity={0.62}
        linkDirectionalParticles={(link) => {
          if (!hoveredNode) return 0;
          const sourceId = typeof link.source === "object" ? link.source.id : link.source;
          const targetId = typeof link.target === "object" ? link.target.id : link.target;
          return sourceId === hoveredNode.id || targetId === hoveredNode.id ? 2 : 0;
        }}
        linkDirectionalParticleWidth={1.8}
        linkDirectionalParticleSpeed={0.004}
        cameraPosition={{ z: sphereGraph.radius * 2.7 }}
      />
    </div>
  );
};

export default SphereNetworkView;
