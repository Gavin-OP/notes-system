const nodeTitle = (node) => node?.title || node?.data?.title || "这一步";

function createPathIndex(pathDraft) {
  return new Map((pathDraft?.nodes || []).map((node) => [node.node_id, node]));
}

function hasEveryNode(index, nodeIds) {
  return nodeIds.every((nodeId) => index.has(nodeId));
}

export function buildCareerPathRevealObservations({ run, result, pathDraft }) {
  const pathIndex = createPathIndex(pathDraft);
  const candidates = [];
  const add = ({ id, score, nodeIds, title, body }) => {
    if (!hasEveryNode(pathIndex, nodeIds)) return;
    candidates.push({ id, score, nodeIds, title, body });
  };
  const titleOf = (nodeId) => nodeTitle(pathIndex.get(nodeId));
  const counters = run?.counters || {};
  const behavior = run?.behavior || {};
  const attributes = run?.attributes || {};
  const applications = result?.stats?.applications ?? counters.applications ?? 0;
  const interviews = result?.stats?.interviews ?? counters.interviews ?? 0;
  const referrals = result?.stats?.referrals ?? counters.referrals ?? 0;
  const acceptedOffers = counters.acceptedOffers ?? result?.stats?.offers ?? 0;

  if (attributes.profile < 55 || run?.failureTags?.profile_screen) {
    const nodeIds = ["pilot:profile-preparation"];
    add({
      id: "profile-readiness",
      score: 98 + Number(Boolean(run?.failureTags?.profile_screen)) * 4,
      nodeIds,
      title: "你的求职材料还有继续打磨的空间",
      body: `接下来的求职准备路径会从「${titleOf(nodeIds[0])}」开始，帮你重新检查经历表达和材料呈现。`,
    });
  } else {
    const nodeIds = ["pilot:profile-preparation", "pilot:interviews"];
    add({
      id: "profile-momentum",
      score: 52,
      nodeIds,
      title: "你已经准备了较为完整、充实的求职材料",
      body: `「${titleOf(nodeIds[0])}」这一段路可以走得更快，直接进入后续「${titleOf(nodeIds[1])}」相关的节点。`,
    });
  }

  if (referrals === 0 || attributes.network < 35) {
    const nodeIds = ["pilot:networking", "pilot:referral"];
    add({
      id: "network-entry",
      score: referrals === 0 ? 90 : 72,
      nodeIds,
      title: "你可能还需要几个建立人脉连接的入口",
      body: `我们已经为你的求职准备路径加入「${titleOf(nodeIds[0])}」和「${titleOf(nodeIds[1])}」节点，陪你完成交流之前的准备。`,
    });
  }

  const lowApplicationConversion = applications >= 6 && interviews <= Math.max(1, Math.floor(applications * 0.2));
  if (lowApplicationConversion || behavior.action > (behavior.analysis || 0) + 2) {
    const nodeIds = [
      "pilot:application-batch-planning",
      "pilot:application-tracker",
      "pilot:resume-version-management",
    ];
    add({
      id: "application-conversion",
      score: lowApplicationConversion ? 96 : 78,
      nodeIds,
      title: "或许你已经投递了大批申请，下一步是批量管理、跟踪进度、提高申请的转化率",
      body: `求职准备路径会通过「${nodeIds.map(titleOf).join("、")}」，帮你把投递节奏、申请进度和材料版本整理得更清楚。`,
    });
  }

  if ((behavior.analysis || 0) >= (behavior.action || 0)) {
    const nodeIds = ["pilot:company-research", "pilot:jd-deep-dive", "pilot:tailored-materials"];
    add({
      id: "precision-application",
      score: 82,
      nodeIds,
      title: "你习惯先认真调研、分析岗位，看清机会再出手",
      body: `求职准备路径上会出现「${nodeIds.map(titleOf).join("、")}」这条精准投递支线，帮助你把岗位研究转化为更有针对性的申请材料。`,
    });
  }

  if (interviews >= 2 && acceptedOffers === 0) {
    const nodeIds = ["pilot:interviews", "pilot:interview-review"];
    add({
      id: "interview-conversion",
      score: 94,
      nodeIds,
      title: "你已经参加了几场面试，或许你会想知道怎样更好地准备和复盘",
      body: `「${titleOf(nodeIds[0])}」和「${titleOf(nodeIds[1])}」或许会帮你进一步提升自己的表现。`,
    });
  }

  if ((behavior.exploration || 0) > (behavior.analysis || 0) && (behavior.exploration || 0) >= 4) {
    const nodeIds = ["pilot:job-search"];
    add({
      id: "career-exploration",
      score: 76,
      nodeIds,
      title: "你愿意为意料之外的可能留一扇门",
      body: `「${titleOf(nodeIds[0])}」会帮助你继续探索市场与岗位，找到更多适合你的求职机会。`,
    });
  }

  const ranked = candidates
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
    .slice(0, 4)
    .map(({ score: _score, ...observation }) => observation);

  if (ranked.length >= 2) return ranked;

  const fallbackNodes = [...pathIndex.values()];
  const fallbackNode = fallbackNodes.find((node) => !ranked.some((item) => item.nodeIds.includes(node.node_id)))
    || fallbackNodes[0];
  if (ranked.length < 2 && fallbackNode) {
    ranked.push({
      id: "path-next-step",
      nodeIds: [fallbackNode.node_id],
      title: "游戏给了你体验，求职准备路径陪你走完现实求职之路",
      body: `你可以先从「${nodeTitle(fallbackNode)}」开始，大致了解这条路上包含哪些节点。`,
    });
  }

  if (ranked.length < 2 && fallbackNodes[0]) {
    ranked.push({
      id: "path-remains-editable",
      nodeIds: [fallbackNodes[0].node_id],
      title: "这条求职准备路径仍然可以继续调整",
      body: `「${nodeTitle(fallbackNodes[0])}」是我们认为与你现在最相关的一步；进入求职准备路径页面之后，你仍然可以按真实情况调整整条路线。`,
    });
  }

  return ranked.slice(0, 4);
}
