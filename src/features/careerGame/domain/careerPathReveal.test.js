import { describe, expect, it } from "vitest";

import { buildCareerPathRevealObservations } from "./careerPathReveal";

const pathDraft = {
  nodes: [
    { node_id: "pilot:profile-preparation", data: { title: "准备简历与 Profile" } },
    { node_id: "pilot:networking", data: { title: "Coffee Chat / Networking" } },
    { node_id: "pilot:referral", data: { title: "Referral" } },
    { node_id: "pilot:application-batch-planning", data: { title: "Application Batch Planning" } },
    { node_id: "pilot:application-tracker", data: { title: "Application Tracker" } },
    { node_id: "pilot:resume-version-management", data: { title: "Resume Version Management" } },
    { node_id: "pilot:interviews", data: { title: "综合面试准备" } },
    { node_id: "pilot:interview-review", data: { title: "面试复盘" } },
  ],
};

const run = {
  attributes: { time: 18, energy: 24, confidence: 28, profile: 31, network: 20 },
  startingAttributes: { time: 70, energy: 60, confidence: 45, profile: 15, network: 10 },
  minimums: { energy: 18, confidence: 25 },
  maximums: { profile: 38, network: 24 },
  counters: { applications: 12, interviews: 1, referrals: 0, offers: 0, acceptedOffers: 0, rejections: 4, waitlists: 1 },
  behavior: { exploration: 2, analysis: 2, action: 9, expression: 2, reflection: 4, resilience: 3, networking: 1, pacing: 1 },
  history: [
    { eventId: "batch-application", category: "application", choiceId: "batch" },
    { eventId: "rejection", category: "offer", choiceId: "review" },
  ],
  failureTags: { profile_screen: 2 },
};

const result = {
  ending: { id: "still_searching" },
  stats: { applications: 12, interviews: 1, referrals: 0, offers: 0 },
  achievements: [{ id: "application-engine" }],
  path: { profile: { application_strategy: "batch" } },
};

describe("Career Path meta reveal observations", () => {
  it("returns two to four observations grounded in run history and actual Path nodes", () => {
    const observations = buildCareerPathRevealObservations({ run, result, pathDraft });
    const nodeIds = new Set(pathDraft.nodes.map((node) => node.node_id));

    expect(observations.length).toBeGreaterThanOrEqual(2);
    expect(observations.length).toBeLessThanOrEqual(4);
    expect(observations.some((item) => item.id === "profile-readiness")).toBe(true);
    expect(observations.some((item) => item.id === "application-conversion")).toBe(true);
    observations.forEach((observation) => {
      expect(observation.nodeIds.length).toBeGreaterThan(0);
      observation.nodeIds.forEach((nodeId) => expect(nodeIds.has(nodeId)).toBe(true));
    });
  });

  it("never promises Networking when the proposed Path does not contain it", () => {
    const withoutNetworking = {
      ...pathDraft,
      nodes: pathDraft.nodes.filter((node) => !["pilot:networking", "pilot:referral"].includes(node.node_id)),
    };

    const observations = buildCareerPathRevealObservations({ run, result, pathDraft: withoutNetworking });

    expect(observations.some((item) => item.id === "network-entry")).toBe(false);
    expect(observations.map((item) => `${item.title} ${item.body}`).join(" ")).not.toContain("Networking");
  });

  it("still returns two grounded observations when an Offer-stage Path has one remaining node", () => {
    const offerOnlyPath = {
      nodes: [{ node_id: "pilot:offer", data: { title: "Offer 判断" } }],
    };
    const offerResult = {
      ...result,
      ending: { id: "steady_landing" },
      stats: { ...result.stats, offers: 1 },
    };
    const offerRun = {
      ...run,
      counters: { ...run.counters, acceptedOffers: 1, offers: 1 },
    };

    const observations = buildCareerPathRevealObservations({ run: offerRun, result: offerResult, pathDraft: offerOnlyPath });

    expect(observations).toHaveLength(2);
    observations.forEach((observation) => expect(observation.nodeIds).toEqual(["pilot:offer"]));
  });
});
