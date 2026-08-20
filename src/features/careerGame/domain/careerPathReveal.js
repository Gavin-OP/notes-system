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
  const starting = run?.startingAttributes || {};
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
      title: "你的材料还有继续打磨的空间",
      body: `接下来的 Path 会从「${titleOf(nodeIds[0])}」帮你重新检查经历表达与材料呈现。`,
    });
  } else {
    const nodeIds = ["pilot:profile-preparation"];
    add({
      id: "profile-momentum",
      score: 52,
      nodeIds,
      title: "你的材料已经积累了不错的底气",
      body: `「${titleOf(nodeIds[0])}」这一段可以走得更快，把更多精力留给后面的真实机会。`,
    });
  }

  if (referrals === 0 || attributes.network < 35) {
    const nodeIds = ["pilot:networking", "pilot:referral"];
    add({
      id: "network-entry",
      score: referrals === 0 ? 90 : 72,
      nodeIds,
      title: "你可能还需要几个“认识人”的入口",
      body: `你的 Path 已经加入「${titleOf(nodeIds[0])}」和「${titleOf(nodeIds[1])}」，会从第一次开口和真诚交流讲起。`,
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
      title: "你很会把申请送出去，下一步是让机会更容易回来",
      body: `Path 会用「${nodeIds.map(titleOf).join("、")}」把投递节奏、进度和材料版本整理得更清楚。`,
    });
  }

  if ((behavior.analysis || 0) >= (behavior.action || 0)) {
    const nodeIds = ["pilot:company-research", "pilot:jd-deep-dive", "pilot:tailored-materials"];
    add({
      id: "precision-application",
      score: 82,
      nodeIds,
      title: "你习惯先看清机会，再认真出手",
      body: `Path 会保留「${nodeIds.map(titleOf).join("、")}」这条精准投递支线，让研究真正转化为申请材料。`,
    });
  }

  if (interviews >= 2 && acceptedOffers === 0) {
    const nodeIds = ["pilot:interviews", "pilot:interview-review"];
    add({
      id: "interview-conversion",
      score: 94,
      nodeIds,
      title: "你已经走进过面试房间，接下来要提高转化率",
      body: `「${titleOf(nodeIds[0])}」和「${titleOf(nodeIds[1])}」会帮你把遇到的问题变成下一轮可用的准备。`,
    });
  }

  const confidenceDrop = Number.isFinite(starting.confidence)
    && attributes.confidence <= starting.confidence - 10;
  if (confidenceDrop || run?.minimums?.energy <= 20 || result?.ending?.id === "burnout") {
    const nodeIds = ["pilot:interview-review"];
    add({
      id: "sustainable-rhythm",
      score: result?.ending?.id === "burnout" ? 100 : 86,
      nodeIds,
      title: "这一局不只消耗了时间，也消耗了你",
      body: `Path 会在「${titleOf(nodeIds[0])}」里保留恢复和复盘的位置；可持续地走下去，本身就是策略。`,
    });
  }

  if ((behavior.exploration || 0) > (behavior.analysis || 0) && (behavior.exploration || 0) >= 4) {
    const nodeIds = ["pilot:job-search"];
    add({
      id: "career-exploration",
      score: 76,
      nodeIds,
      title: "你愿意为意料之外的可能留一扇门",
      body: `「${titleOf(nodeIds[0])}」会帮助你继续探索，同时把每次尝试留下的信息慢慢收拢。`,
    });
  }

  if (acceptedOffers > 0) {
    const nodeIds = ["pilot:offer"];
    add({
      id: "offer-decision",
      score: 92,
      nodeIds,
      title: "拿到结果以后，选择仍然属于你",
      body: `Path 最后保留了「${titleOf(nodeIds[0])}」，帮你把岗位内容、条件和想要的生活放在一起看。`,
    });
  }

  const ranked = candidates
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
    .slice(0, 4)
    .map(({ score: _score, ...observation }) => observation);

  if (ranked.length >= 2) return ranked;

  const fallbackNodes = [...pathIndex.values()].slice(0, 2);
  fallbackNodes.forEach((node, index) => {
    if (ranked.length >= 2 || ranked.some((item) => item.nodeIds.includes(node.node_id))) return;
    ranked.push({
      id: `path-next-step-${index}`,
      nodeIds: [node.node_id],
      title: index === 0 ? "游戏给了你结果，Path 给你下一步" : "这条路线不需要一次走完",
      body: index === 0
        ? `你可以先从「${nodeTitle(node)}」开始，把这一局留下的线索变成现实里的行动。`
        : `「${nodeTitle(node)}」已经在路线里等你；需要的时候再打开它，也完全来得及。`,
    });
  });

  if (ranked.length < 2 && fallbackNodes[0]) {
    ranked.push({
      id: "path-remains-editable",
      nodeIds: [fallbackNodes[0].node_id],
      title: "这不是系统替你写好的唯一答案",
      body: `「${nodeTitle(fallbackNodes[0])}」是现在最相关的一步；进入 Workspace 后，你仍然可以按现实情况调整整条路线。`,
    });
  }

  return ranked.slice(0, 4);
}
