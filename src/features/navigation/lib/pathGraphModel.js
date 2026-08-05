export function validatePathGraph(nodes = [], edges = [], { rootId, terminalId } = {}) {
  const ids = new Set(nodes.map((node) => node.node_id || node.id).filter(Boolean));
  if (!rootId || !terminalId || !ids.has(rootId) || !ids.has(terminalId)) return { valid: false, reason: "missing-endpoint" };
  const seen = new Set();
  const adjacency = new Map([...ids].map((id) => [id, []]));
  const reverse = new Map([...ids].map((id) => [id, []]));
  for (const edge of edges) {
    const source = edge.source;
    const target = edge.target;
    const key = `${source}:${target}`;
    if (!ids.has(source) || !ids.has(target)) return { valid: false, reason: "unknown-node" };
    if (source === target) return { valid: false, reason: "self-link" };
    if (seen.has(key)) return { valid: false, reason: "duplicate-link" };
    seen.add(key); adjacency.get(source).push(target); reverse.get(target).push(source);
  }
  const visit = (start, graph) => {
    const reached = new Set(); const stack = [start];
    while (stack.length) { const id = stack.pop(); if (reached.has(id)) continue; reached.add(id); stack.push(...(graph.get(id) || [])); }
    return reached;
  };
  const visiting = new Set(); const visited = new Set();
  const cyclic = (id) => { if (visiting.has(id)) return true; if (visited.has(id)) return false; visiting.add(id); for (const next of adjacency.get(id) || []) if (cyclic(next)) return true; visiting.delete(id); visited.add(id); return false; };
  if (cyclic(rootId)) return { valid: false, reason: "cycle" };
  const fromRoot = visit(rootId, adjacency); const toTerminal = visit(terminalId, reverse);
  if ([...ids].some((id) => !fromRoot.has(id) || !toTerminal.has(id))) return { valid: false, reason: "disconnected" };
  return { valid: true, reason: "" };
}

export function connectPathNodes(graph, source, target, constraints) {
  const edge = { edge_id: `custom:${source}:${target}`, source, target, relation: "precedes", metadata: { user_created: true } };
  const next = { ...graph, edges: [...(graph.edges || []), edge] };
  const validation = validatePathGraph(next.nodes, next.edges, constraints);
  return validation.valid ? { graph: next, validation } : { graph, validation };
}
