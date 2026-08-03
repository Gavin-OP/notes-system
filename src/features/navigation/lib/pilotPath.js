const DAY_MS = 24 * 60 * 60 * 1000;
const SUBJECT = "fall-recruiting";

export const PILOT_STAGE_OPTIONS = [
  { value: "getting_started", label: "刚开始准备求职" },
  { value: "materials", label: "正在准备简历与 Profile" },
  { value: "applying", label: "已经开始投递" },
  { value: "interviewing", label: "已经进入测试或面试" },
  { value: "offer", label: "正在比较 Offer" },
];

export const PILOT_REGION_OPTIONS = [
  "香港",
  "中国内地",
  "美国",
  "英国",
  "欧洲其他地区",
  "新加坡",
  "其他地区",
];

export const PROFILE_BRANCH_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "portfolio", label: "项目集 / 个人主页" },
];

export const SEARCH_BRANCH_OPTIONS = [
  { value: "networking", label: "Coffee Chat / 校友交流" },
  { value: "ai_job_search", label: "用 AI 辅助找岗位" },
];

export const SKILL_BRANCH_OPTIONS = [
  { value: "technical", label: "SQL / LeetCode" },
  { value: "finance", label: "金融知识 / 证书" },
];

const STAGE_TIMELINES = {
  getting_started: [
    ["方向与材料", 14],
    ["岗位搜索与投递", 28],
    ["测试与面试", 42],
    ["Offer 与复盘", 21],
  ],
  materials: [
    ["完善简历与 Profile", 14],
    ["岗位搜索与投递", 28],
    ["测试与面试", 42],
    ["Offer 与复盘", 21],
  ],
  applying: [
    ["持续投递", 21],
    ["测试与面试准备", 28],
    ["面试与复盘", 42],
    ["Offer 选择", 21],
  ],
  interviewing: [
    ["当前面试准备", 14],
    ["面试复盘与补强", 21],
    ["继续投递与后续面试", 35],
    ["Offer 选择", 21],
  ],
  offer: [
    ["Offer 核实与比较", 14],
    ["沟通与决定", 14],
    ["求职复盘", 14],
    ["下一阶段技能计划", 28],
  ],
};

const STAGE_FOCUS_NODE = {
  getting_started: "pilot:getting-started",
  materials: "pilot:profile-preparation",
  applying: "pilot:applications",
  interviewing: "pilot:interviews",
  offer: "pilot:offer",
};

function normalizeStage(stage) {
  return stage === "targeting" ? "getting_started" : stage || "getting_started";
}

function isoDate(value) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(value, days) {
  return new Date(value.getTime() + days * DAY_MS);
}

function noteUrl(slug, anchor = "") {
  return `/note/${SUBJECT}/${slug}.md${anchor ? `#${anchor}` : ""}`;
}

function pathNode(id, title, slug, order, anchor = "", metadata = {}) {
  return {
    node_id: `pilot:${id}`,
    title,
    subject: SUBJECT,
    note_url: noteUrl(slug, anchor),
    status: "planned",
    metadata: {
      pilot_official_path: true,
      subject_title: "秋招准备",
      estimated_order: order,
      ...metadata,
    },
  };
}

function buildPilotNodes(profile = {}) {
  const profileBranches = new Set(profile.profile_branches || []);
  const searchBranches = new Set(profile.search_branches || []);
  const skillBranches = new Set(profile.skill_branches || []);
  const needsCantonese = profile.region === "香港" && Boolean(profile.learn_cantonese);

  const nodes = [
    pathNode("getting-started", "刚开始准备求职", "autumn-recruitment-roadmap", 1),
    pathNode("direction", "明确方向与现实限制", "autumn-recruitment-roadmap", 2, "concept-target-role"),
    pathNode("market", "理解岗位与市场", "job-search-and-screening", 3, "concept-search-channels"),
    pathNode("profile-preparation", "准备简历与 Profile", "resume-story", 4),
    pathNode("resume", "简历", "resume-story", 5, "concept-job-description-mapping", { path_relation: "branch" }),
  ];

  if (profileBranches.has("linkedin")) {
    nodes.push(pathNode("linkedin", "LinkedIn", "resume-story", 5, "concept-linkedin", { path_relation: "branch" }));
  }
  if (profileBranches.has("portfolio")) {
    nodes.push(pathNode("portfolio", "项目集 / 个人主页", "resume-story", 5, "concept-portfolio", { path_relation: "branch" }));
  }

  nodes.push(pathNode("job-search", "寻找和筛选岗位", "job-search-and-screening", 6));

  if (searchBranches.has("networking")) {
    nodes.push(
      pathNode("coffee-chat", "Coffee Chat", "job-search-and-screening", 7, "concept-coffee-chat", { path_relation: "branch" }),
      pathNode("alumni", "校友 / 往届生交流", "job-search-and-screening", 7, "concept-alumni-networking", { path_relation: "branch" }),
    );
  }
  if (searchBranches.has("ai_job_search")) {
    nodes.push(pathNode("ai-job-search", "用 AI 辅助找岗位", "job-search-and-screening", 7, "concept-ai-job-search", { path_relation: "branch" }));
  }

  nodes.push(
    pathNode("applications", "投递与流程管理", "application-communication", 8),
    pathNode("interviews", "测试与面试", "interview-preparation", 9),
    pathNode("interview-review", "面试复盘", "interview-preparation", 10, "concept-interview-review"),
  );

  if (skillBranches.has("technical")) {
    nodes.push(pathNode("technical-skills", "SQL / LeetCode", "offer-review", 11, "concept-technical-skill-gap", { path_relation: "branch" }));
  }
  if (skillBranches.has("finance")) {
    nodes.push(pathNode("finance-skills", "金融知识 / 证书", "offer-review", 11, "concept-finance-skill-gap", { path_relation: "branch" }));
  }
  if (needsCantonese) {
    nodes.push(pathNode("cantonese", "粤语", "autumn-recruitment-roadmap", 11, "concept-cantonese-learning", { path_relation: "branch" }));
  }

  nodes.push(pathNode("offer", "Offer 判断", "offer-review", 12, "concept-offer-comparison"));
  return nodes;
}

function buildPilotEdges(nodes) {
  const groups = new Map();
  nodes.forEach((node) => {
    const order = Number(node.metadata?.estimated_order || 0);
    const group = groups.get(order) || [];
    group.push(node);
    groups.set(order, group);
  });
  const orderedGroups = [...groups.entries()].sort(([a], [b]) => a - b).map(([, group]) => group);
  const edges = [];
  orderedGroups.slice(0, -1).forEach((group, index) => {
    const nextGroup = orderedGroups[index + 1];
    group.forEach((source) => {
      nextGroup.forEach((target) => {
        const branching = group.length > 1 || nextGroup.length > 1;
        edges.push({
          edge_id: `pilot:${source.node_id}:${target.node_id}`,
          source: source.node_id,
          target: target.node_id,
          relation: branching ? "branches_to" : "precedes",
          metadata: { pilot_official_path: true },
        });
      });
    });
  });
  return edges;
}

export function buildPilotTimeline(stage, now = new Date()) {
  const normalizedStage = normalizeStage(stage);
  const phases = STAGE_TIMELINES[normalizedStage] || STAGE_TIMELINES.getting_started;
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return phases.map(([label, durationDays], index) => {
    const start = cursor;
    const end = addDays(start, durationDays - 1);
    cursor = addDays(end, 1);
    return {
      id: `phase-${index + 1}`,
      label,
      start_date: isoDate(start),
      end_date: isoDate(end),
      status: index === 0 ? "current" : "upcoming",
    };
  });
}

export function buildPersonalizedPilotDraft(draft = {}, rawProfile = {}, now = new Date()) {
  const profile = {
    region: rawProfile.region || "",
    stage: normalizeStage(rawProfile.stage),
    work_authorization: rawProfile.work_authorization || "",
    profile_branches: (rawProfile.profile_branches || []).filter((value) => PROFILE_BRANCH_OPTIONS.some((option) => option.value === value)),
    search_branches: (rawProfile.search_branches || []).filter((value) => SEARCH_BRANCH_OPTIONS.some((option) => option.value === value)),
    skill_branches: (rawProfile.skill_branches || []).filter((value) => SKILL_BRANCH_OPTIONS.some((option) => option.value === value)),
    learn_cantonese: rawProfile.region === "香港" && Boolean(rawProfile.learn_cantonese),
    setup_complete: Boolean(rawProfile.setup_complete),
  };
  const focusNodeId = STAGE_FOCUS_NODE[profile.stage];
  const nodes = buildPilotNodes(profile).map((node) => ({
    ...node,
    metadata: {
      ...node.metadata,
      recommended_now: node.node_id === focusNodeId,
    },
  }));
  return {
    ...draft,
    path_id: draft?.path_id || "primary",
    learning_set_name: profile.region ? `${profile.region}秋招 Path` : "秋招准备 Path",
    learning_set_note: `当前阶段：${PILOT_STAGE_OPTIONS.find((item) => item.value === profile.stage)?.label}`,
    goal_title: profile.region ? `${profile.region}秋招准备` : "准备下一轮校园招聘",
    metadata: {
      ...(draft?.metadata || {}),
      order_mode: "canonical",
      pilot_official_path: true,
      pilot_path_schema_version: 2,
      personalization: {
        ...profile,
        setup_complete: Boolean(profile.setup_complete),
        updated_at: now.toISOString(),
      },
      timeline: profile.setup_complete ? buildPilotTimeline(profile.stage, now) : [],
    },
    nodes,
    edges: buildPilotEdges(nodes),
  };
}

export function buildDefaultPilotDraft(draft = {}, now = new Date()) {
  return buildPersonalizedPilotDraft(
    draft,
    {
      region: "",
      stage: "getting_started",
      work_authorization: "",
      profile_branches: [],
      search_branches: [],
      skill_branches: [],
      learn_cantonese: false,
      setup_complete: false,
    },
    now,
  );
}

export function buildInterviewProfileContext(profile = {}) {
  const branchLabels = [
    ...(profile.skill_branches || []),
    ...(profile.profile_branches || []),
  ];
  const details = [
    profile.region ? `目标地区：${profile.region}` : "",
    profile.work_authorization ? `工作资格：${profile.work_authorization}` : "",
    profile.learn_cantonese ? "需要准备粤语求职沟通" : "",
    branchLabels.length ? `当前专项准备：${branchLabels.join("、")}` : "",
  ].filter(Boolean);
  return details.length ? `请结合以下求职背景进行模拟面试：${details.join("；")}。` : "";
}
