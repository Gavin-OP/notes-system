import { describe, expect, it } from "vitest";
import { connectPathNodes, validatePathGraph } from "./pathGraphModel";

const nodes = ["start", "middle", "offer"].map((node_id) => ({ node_id }));
const constraints = { rootId: "start", terminalId: "offer" };

describe("Path graph public model", () => {
  it("accepts a connected directed path", () => expect(validatePathGraph(nodes, [{ source: "start", target: "middle" }, { source: "middle", target: "offer" }], constraints).valid).toBe(true));
  it("rejects a cycle", () => expect(validatePathGraph(nodes, [{ source: "start", target: "middle" }, { source: "middle", target: "start" }, { source: "middle", target: "offer" }], constraints).reason).toBe("cycle"));
  it("rejects self and duplicate links", () => {
    expect(validatePathGraph(nodes, [{ source: "start", target: "start" }], constraints).reason).toBe("self-link");
    expect(validatePathGraph(nodes, [{ source: "start", target: "middle" }, { source: "start", target: "middle" }], constraints).reason).toBe("duplicate-link");
  });
  it("does not mutate a valid graph when a proposed link is invalid", () => {
    const graph = { nodes, edges: [{ source: "start", target: "middle" }, { source: "middle", target: "offer" }] };
    expect(connectPathNodes(graph, "offer", "start", constraints).graph).toBe(graph);
  });
});
