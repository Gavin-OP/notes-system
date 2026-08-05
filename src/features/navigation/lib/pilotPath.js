import {
  FALL_RECRUITING_CERTIFICATES,
  getCertificateById,
} from "../../fallRecruiting/lib/certificates";

const DAY_MS = 24 * 60 * 60 * 1000;
const SUBJECT = "fall-recruiting";

export const PILOT_STAGE_OPTIONS = [
  { value: "getting_started", label: "刚开始准备求职" },
  { value: "materials", label: "正在准备简历与 Profile" },
  { value: "applying", label: "已经开始投递" },
  { value: "interviewing", label: "已经进入测试或面试" },
  { value: "offer", label: "正在比较 Offer" },
];

export const PROFILE_BRANCH_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "cover_letter", label: "Cover Letter" },
  { value: "portfolio", label: "项目集" },
  { value: "personal_site", label: "个人主页" },
];

export const SEARCH_BRANCH_OPTIONS = [
  { value: "networking", label: "Coffee Chat / Networking" },
  { value: "ai_job_search", label: "用 AI 辅助找岗位" },
];

export const SKILL_BRANCH_OPTIONS = [
  { value: "technical", label: "LeetCode" },
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
  const certificateBranches = new Set(profile.certificate_branches || []);
  const nodes = [
    pathNode("getting-started", "刚开始准备求职", "autumn-recruitment-roadmap", 1),
    pathNode("market", "理解岗位与市场", "role-market-research", 3),
    pathNode("profile-preparation", "准备简历与 Profile", "profile-preparation", 4),
    pathNode("resume", "简历", "resume-story", 5, "", { path_relation: "branch" }),
  ];

  if (profileBranches.has("linkedin")) {
    nodes.push(pathNode("linkedin", "LinkedIn", "linkedin-profile", 5, "", { path_relation: "branch" }));
  }
  if (profileBranches.has("cover_letter")) {
    nodes.push(pathNode("cover-letter", "Cover Letter", "cover-letter", 5, "", { path_relation: "branch" }));
  }
  if (profileBranches.has("portfolio")) {
    nodes.push(pathNode("portfolio", "项目集", "portfolio", 5, "", { path_relation: "branch" }));
  }
  if (profileBranches.has("personal_site")) {
    nodes.push(pathNode("personal-site", "个人主页", "personal-site", 5, "", { path_relation: "branch" }));
  }

  nodes.push(pathNode("job-search", "寻找和筛选岗位", "job-search-and-screening", 6));

  if (searchBranches.has("networking")) {
    nodes.push(pathNode("networking", "Coffee Chat / Networking", "coffee-chat", 7, "", { path_relation: "branch" }));
  }
  if (searchBranches.has("ai_job_search")) {
    nodes.push(pathNode("ai-job-search", "用 AI 辅助找岗位", "ai-job-search", 7, "", { path_relation: "branch" }));
  }

  nodes.push(
    pathNode("applications", "投递与流程管理", "application-communication", 8),
    pathNode("assessments", "在线测试", "assessment-preparation", 9),
    pathNode("interviews", "面试准备", "interview-preparation", 10),
    pathNode("interview-review", "面试复盘", "interview-review", 11),
  );

  if (skillBranches.has("technical")) {
    nodes.push(pathNode("technical-skills", "LeetCode", "leetcode-practice", 12, "", { path_relation: "branch" }));
  }

  if (certificateBranches.size > 0) {
    nodes.push(pathNode("finance-skills", "金融证书怎么选", "finance-knowledge-certificates", 12, "", { path_relation: "branch" }));
    FALL_RECRUITING_CERTIFICATES.forEach((certificate) => {
      if (!certificateBranches.has(certificate.id)) return;
      nodes.push(
        pathNode(
          `certificate-${certificate.id}`,
          `${certificate.shortName} 是否适合我`,
          `${certificate.id}-certificate`,
          13,
          "",
          { path_relation: "branch", certificate_id: certificate.id },
        ),
      );
    });
  }

  nodes.push(pathNode("offer", "Offer 判断", "offer-review", 14));
  return nodes;
}

function buildPilotEdges(nodes) {
  const nodeIds = new Set(nodes.map((node) => node.node_id));
  const edges = [];
  const connect = (sourceId, targetId, relation = "precedes") => {
    const source = `pilot:${sourceId}`;
    const target = `pilot:${targetId}`;
    if (!nodeIds.has(source) || !nodeIds.has(target)) return;
    edges.push({
      edge_id: `pilot-edge:${sourceId}:${targetId}`,
      source,
      target,
      relation,
      metadata: { pilot_official_path: true },
    });
  };

  connect("getting-started", "market");
  connect("market", "profile-preparation");

  const profileBranchIds = ["resume", "linkedin", "cover-letter", "portfolio", "personal-site"]
    .filter((nodeId) => nodeIds.has(`pilot:${nodeId}`));
  profileBranchIds.forEach((nodeId) => {
    connect("profile-preparation", nodeId, "branches_to");
    connect(nodeId, "job-search", "converges_to");
  });

  const searchBranchIds = ["networking", "ai-job-search"]
    .filter((nodeId) => nodeIds.has(`pilot:${nodeId}`));
  if (searchBranchIds.length > 0) {
    searchBranchIds.forEach((nodeId) => {
      connect("job-search", nodeId, "branches_to");
      connect(nodeId, "applications", "converges_to");
    });
  } else {
    connect("job-search", "applications");
  }

  connect("applications", "assessments");
  connect("assessments", "interviews");
  connect("interviews", "interview-review");

  const supplementIds = ["technical-skills", "finance-skills"]
    .filter((nodeId) => nodeIds.has(`pilot:${nodeId}`));
  if (supplementIds.length === 0) {
    connect("interview-review", "offer");
  } else {
    supplementIds.forEach((nodeId) => connect("interview-review", nodeId, "branches_to"));
    connect("technical-skills", "offer", "converges_to");

    const certificateIds = FALL_RECRUITING_CERTIFICATES
      .map((certificate) => `certificate-${certificate.id}`)
      .filter((nodeId) => nodeIds.has(`pilot:${nodeId}`));
    if (certificateIds.length > 0) {
      certificateIds.forEach((nodeId) => {
        connect("finance-skills", nodeId, "branches_to");
        connect(nodeId, "offer", "converges_to");
      });
    } else {
      connect("finance-skills", "offer", "converges_to");
    }
  }

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
    stage: normalizeStage(rawProfile.stage),
    profile_branches: (rawProfile.profile_branches || []).filter((value) => PROFILE_BRANCH_OPTIONS.some((option) => option.value === value)),
    search_branches: (rawProfile.search_branches || []).filter((value) => SEARCH_BRANCH_OPTIONS.some((option) => option.value === value)),
    skill_branches: (rawProfile.skill_branches || []).filter((value) => SKILL_BRANCH_OPTIONS.some((option) => option.value === value)),
    certificate_branches: (rawProfile.certificate_branches || []).filter((value) =>
      FALL_RECRUITING_CERTIFICATES.some((certificate) => certificate.id === value),
    ),
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
    learning_set_name: "秋招准备 Path",
    learning_set_note: `当前阶段：${PILOT_STAGE_OPTIONS.find((item) => item.value === profile.stage)?.label}`,
    goal_title: "准备下一轮校园招聘",
    metadata: {
      ...(draft?.metadata || {}),
      order_mode: "canonical",
      pilot_official_path: true,
      pilot_path_schema_version: 3,
      graph_layout: draft?.metadata?.graph_layout || {},
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
      stage: "getting_started",
      profile_branches: [],
      search_branches: [],
      skill_branches: [],
      certificate_branches: [],
      setup_complete: false,
    },
    now,
  );
}

export function buildInterviewProfileContext(profile = {}) {
  const branchLabels = [
    ...(profile.skill_branches || []),
    ...(profile.profile_branches || []),
    ...(profile.certificate_branches || []).map(
      (certificateId) => getCertificateById(certificateId)?.shortName || certificateId,
    ),
  ];
  const details = [
    branchLabels.length ? `当前专项准备：${branchLabels.join("、")}` : "",
  ].filter(Boolean);
  return details.length ? `请结合以下求职背景进行模拟面试：${details.join("；")}。` : "";
}
