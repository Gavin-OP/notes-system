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
  { value: "job_board", label: "Job Board" },
  { value: "company_career_page", label: "Company Career Page" },
  { value: "ai_job_search", label: "用 AI 辅助找岗位" },
];

export const EXPERIENCE_BRANCH_OPTIONS = [
  { value: "first_internship", label: "如何开启第一段实习" },
  { value: "transition_first_internship", label: "如何在转专业 / 转行后开启第一段实习" },
];

export const CANDIDATE_BACKGROUND_OPTIONS = [
  { value: "student", label: "仍是在校学生" },
  { value: "other", label: "目前不是在校学生" },
];

export const APPLICATION_STRATEGY_OPTIONS = [
  { value: "auto", label: "跟随 JobTI 的默认建议" },
  { value: "batch", label: "海投 / 批量规划" },
  { value: "precision", label: "精准投递" },
];

export const SKILL_BRANCH_OPTIONS = [
  { value: "technical", label: "LeetCode" },
];

export const INTERVIEW_BRANCH_OPTIONS = [
  { value: "hr", label: "HR 面" },
  { value: "technical", label: "Technical Interview" },
  { value: "group", label: "群面" },
  { value: "panel", label: "Panel Interview" },
  { value: "assessment_centre", label: "Assessment Centre" },
  { value: "stress", label: "压力面" },
  { value: "final", label: "终面" },
  { value: "special_situations", label: "面试特殊情况应对" },
];

const INTERVIEW_BRANCH_CONTENT = {
  hr: ["interview-hr", "HR 面", "interview-hr"],
  technical: ["interview-technical", "Technical Interview", "interview-technical"],
  group: ["interview-group", "群面", "interview-group"],
  panel: ["interview-panel", "Panel Interview", "interview-panel"],
  assessment_centre: ["interview-assessment-centre", "Assessment Centre", "interview-assessment-centre"],
  stress: ["interview-stress", "压力面", "interview-stress"],
  final: ["interview-final", "终面", "interview-final"],
  special_situations: ["interview-special-situations", "面试特殊情况应对", "interview-special-situations"],
};

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

const STAGE_START_ORDER = {
  getting_started: 1,
  materials: 4,
  applying: 8,
  interviewing: 9,
  offer: 14,
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

function plannedNode(id, title, order, metadata = {}) {
  return {
    node_id: `pilot:${id}`,
    title,
    subject: SUBJECT,
    status: "planned",
    metadata: {
      pilot_official_path: true,
      subject_title: "秋招准备",
      estimated_order: order,
      content_status: "planned",
      ...metadata,
    },
  };
}

function resolveApplicationStrategy(profile = {}) {
  if (["batch", "precision"].includes(profile.application_strategy)) {
    return profile.application_strategy;
  }
  if (profile.jobti_type === "engine") return "batch";
  if (["radar", "alchemist"].includes(profile.jobti_type)) return "precision";
  return "core";
}

function buildPilotNodes(profile = {}) {
  const stage = normalizeStage(profile.stage);
  const profileBranches = new Set(profile.profile_branches || []);
  const searchBranches = new Set(profile.search_branches || []);
  const skillBranches = new Set(profile.skill_branches || []);
  const certificateBranches = new Set(profile.certificate_branches || []);
  const interviewBranches = new Set(profile.interview_branches || []);
  const experienceBranches = new Set(profile.experience_branches || []);
  const analyticalSearch = profile.jobti_type === "radar";
  const studentSearch = profile.candidate_background === "student";
  const applicationStrategy = profile.resolved_application_strategy || resolveApplicationStrategy(profile);
  const hasSkillSupplement = skillBranches.has("technical")
    || profile.certificate_interest
    || certificateBranches.size > 0;
  const nodes = [
    pathNode("getting-started", "刚开始准备求职", "autumn-recruitment-roadmap", 1),
    pathNode("market", "理解岗位与市场", "role-market-research", 3),
    pathNode("profile-preparation", "准备简历与 Profile", "profile-preparation", 4),
    pathNode("resume", "简历", "resume-story", 5, "", { path_relation: "branch" }),
  ];

  if (experienceBranches.has("first_internship")) {
    nodes.push(plannedNode("first-internship", "如何开启第一段实习", 2, { path_relation: "branch", directory_order: 0 }));
  }
  if (experienceBranches.has("transition_first_internship")) {
    nodes.push(plannedNode("transition-first-internship", "如何在转专业 / 转行后开启第一段实习", 2, { path_relation: "branch", directory_order: 1 }));
  }

  if (hasSkillSupplement) {
    nodes.push(pathNode("skill-supplement", "技能补充", "skill-supplement", 4, "", { path_relation: "branch" }));
  }

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
    nodes.push(plannedNode("referral", "Referral", 7, { path_relation: "branch" }));
  }
  if (analyticalSearch || searchBranches.has("job_board")) {
    nodes.push(plannedNode("job-board", "Job Board", 7, { path_relation: "branch" }));
  }
  if (analyticalSearch || searchBranches.has("company_career_page")) {
    nodes.push(plannedNode("company-career-page", "Company Career Page", 7, { path_relation: "branch" }));
  }
  if (analyticalSearch || searchBranches.has("ai_job_search")) {
    nodes.push(pathNode("ai-job-search", "用 AI 辅助找岗位", "ai-job-search", 7, "", { path_relation: "branch" }));
  }
  if (studentSearch) {
    nodes.push(plannedNode("campus-recruiting", "Campus Recruiting", 7, { path_relation: "branch" }));
    nodes.push(plannedNode("career-fair", "Career Fair", 7, { path_relation: "branch" }));
    nodes.push(plannedNode("alumni-networking", "Alumni Networking", 7, { path_relation: "branch" }));
  }

  nodes.push(
    pathNode("applications", "投递与流程管理", "application-communication", 8),
    pathNode("assessments", "在线测试", "assessment-preparation", 9),
    pathNode("interviews", "综合面试准备", "interview-preparation", 10),
  );

  if (applicationStrategy === "batch") {
    nodes.push(
      plannedNode("application-batch-planning", "Application Batch Planning", 8.5, { path_relation: "branch" }),
      plannedNode("application-tracker", "Application Tracker", 8.5, { path_relation: "branch" }),
      plannedNode("resume-version-management", "Resume Version Management", 8.5, { path_relation: "branch" }),
    );
  }
  if (applicationStrategy === "precision") {
    nodes.push(
      plannedNode("company-research", "Company Research", 8.5, { path_relation: "branch" }),
      plannedNode("jd-deep-dive", "JD Deep Dive", 8.5, { path_relation: "branch" }),
      plannedNode("tailored-materials", "Tailored Resume / Cover Letter", 8.5, { path_relation: "branch" }),
    );
  }

  nodes.push(plannedNode("hr-screening-call", "HR Screening Call", 10.5, {
    path_relation: "branch",
    interview_type: "screening",
    directory_order: 0,
  }));

  INTERVIEW_BRANCH_OPTIONS.forEach(({ value }, index) => {
    if (!interviewBranches.has(value)) return;
    const [id, title, slug] = INTERVIEW_BRANCH_CONTENT[value];
    nodes.push(pathNode(id, title, slug, 10.5, "", { path_relation: "branch", interview_type: value, directory_order: index + 1 }));
  });
  nodes.push(pathNode("interview-review", "面试复盘", "interview-review", 11));

  if (skillBranches.has("technical")) {
    nodes.push(pathNode("technical-skills", "LeetCode", "leetcode-practice", 4, "", { path_relation: "branch" }));
  }

  if (profile.certificate_interest || certificateBranches.size > 0) {
    nodes.push(pathNode("finance-skills", "金融证书怎么选", "finance-knowledge-certificates", 4, "", { path_relation: "branch" }));
    FALL_RECRUITING_CERTIFICATES.forEach((certificate) => {
      if (!certificateBranches.has(certificate.id)) return;
      nodes.push(
        pathNode(
          `certificate-${certificate.id}`,
          `${certificate.shortName} 是否适合我`,
          `${certificate.id}-certificate`,
          4,
          "",
          { path_relation: "branch", certificate_id: certificate.id },
        ),
      );
    });
  }

  nodes.push(pathNode("offer", "Offer 判断", "offer-review", 14));

  const startOrder = STAGE_START_ORDER[stage] || STAGE_START_ORDER.getting_started;
  return nodes.filter((node) => (node.metadata?.estimated_order || 0) >= startOrder);
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

  const experienceIds = ["first-internship", "transition-first-internship"]
    .filter((nodeId) => nodeIds.has(`pilot:${nodeId}`));
  if (experienceIds.length > 0) {
    experienceIds.forEach((nodeId) => {
      connect("getting-started", nodeId, "branches_to");
      connect(nodeId, "market", "converges_to");
    });
  } else {
    connect("getting-started", "market");
  }

  connect("market", "profile-preparation");

  const profileBranchIds = ["resume", "linkedin", "cover-letter", "portfolio", "personal-site"]
    .filter((nodeId) => nodeIds.has(`pilot:${nodeId}`));
  profileBranchIds.forEach((nodeId) => {
    connect("profile-preparation", nodeId, "branches_to");
    connect(nodeId, "job-search", "converges_to");
  });

  const searchTerminals = [];
  if (nodeIds.has("pilot:networking")) {
    connect("job-search", "networking", "branches_to");
    connect("networking", "referral");
    searchTerminals.push("referral");
  }
  ["job-board", "company-career-page", "ai-job-search"].forEach((nodeId) => {
    if (!nodeIds.has(`pilot:${nodeId}`)) return;
    connect("job-search", nodeId, "branches_to");
    searchTerminals.push(nodeId);
  });
  if (nodeIds.has("pilot:campus-recruiting")) {
    connect("job-search", "campus-recruiting", "branches_to");
    connect("campus-recruiting", "career-fair");
    connect("career-fair", "alumni-networking");
    searchTerminals.push("alumni-networking");
  }
  if (searchTerminals.length > 0) {
    searchTerminals.forEach((nodeId) => connect(nodeId, "applications", "converges_to"));
  } else {
    connect("job-search", "applications");
  }

  if (nodeIds.has("pilot:application-batch-planning")) {
    connect("applications", "application-batch-planning", "branches_to");
    connect("application-batch-planning", "application-tracker");
    connect("application-tracker", "resume-version-management");
    connect("resume-version-management", "assessments", "converges_to");
  } else if (nodeIds.has("pilot:company-research")) {
    connect("applications", "company-research", "branches_to");
    connect("company-research", "jd-deep-dive");
    connect("jd-deep-dive", "tailored-materials");
    connect("tailored-materials", "assessments", "converges_to");
  } else {
    connect("applications", "assessments");
  }
  connect("assessments", "interviews");
  const interviewBranchIds = ["hr-screening-call", ...Object.values(INTERVIEW_BRANCH_CONTENT)
    .map(([nodeId]) => nodeId)
  ].filter((nodeId) => nodeIds.has(`pilot:${nodeId}`));
  if (interviewBranchIds.length > 0) {
    interviewBranchIds.forEach((nodeId) => {
      connect("interviews", nodeId, "branches_to");
      connect(nodeId, "interview-review", "converges_to");
    });
  } else {
    connect("interviews", "interview-review");
  }

  connect("interview-review", "offer");

  if (nodeIds.has("pilot:skill-supplement")) {
    const branchAnchor = nodeIds.has("pilot:market") ? "market" : "profile-preparation";
    const branchReturn = branchAnchor === "market" ? "profile-preparation" : "job-search";
    connect(branchAnchor, "skill-supplement", "branches_to");

    const supplementIds = ["technical-skills", "finance-skills"]
      .filter((nodeId) => nodeIds.has(`pilot:${nodeId}`));
    supplementIds.forEach((nodeId) => connect("skill-supplement", nodeId, "branches_to"));

    const certificateIds = FALL_RECRUITING_CERTIFICATES
      .map((certificate) => `certificate-${certificate.id}`)
      .filter((nodeId) => nodeIds.has(`pilot:${nodeId}`));
    certificateIds.forEach((nodeId) => connect("finance-skills", nodeId, "branches_to"));

    const terminalIds = [
      ...(nodeIds.has("pilot:technical-skills") ? ["technical-skills"] : []),
      ...(certificateIds.length > 0
        ? certificateIds
        : nodeIds.has("pilot:finance-skills") ? ["finance-skills"] : []),
    ];
    terminalIds.forEach((nodeId) => connect(nodeId, branchReturn, "converges_to"));
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
  const previousStatusById = new Map((draft?.nodes || []).map((node) => [node.node_id, node.status]));
  const profile = {
    stage: normalizeStage(rawProfile.stage),
    jobti_type: typeof rawProfile.jobti_type === "string" ? rawProfile.jobti_type : "",
    candidate_background: CANDIDATE_BACKGROUND_OPTIONS.some((option) => option.value === rawProfile.candidate_background)
      ? rawProfile.candidate_background
      : "other",
    experience_branches: (rawProfile.experience_branches ?? ["first_internship", "transition_first_internship"]).filter((value) =>
      EXPERIENCE_BRANCH_OPTIONS.some((option) => option.value === value),
    ),
    application_strategy: APPLICATION_STRATEGY_OPTIONS.some((option) => option.value === rawProfile.application_strategy)
      ? rawProfile.application_strategy
      : "auto",
    profile_branches: (rawProfile.profile_branches || []).filter((value) => PROFILE_BRANCH_OPTIONS.some((option) => option.value === value)),
    search_branches: (rawProfile.search_branches || []).filter((value) => SEARCH_BRANCH_OPTIONS.some((option) => option.value === value)),
    skill_branches: (rawProfile.skill_branches || []).filter((value) => SKILL_BRANCH_OPTIONS.some((option) => option.value === value)),
    certificate_branches: (rawProfile.certificate_branches || []).filter((value) =>
      FALL_RECRUITING_CERTIFICATES.some((certificate) => certificate.id === value),
    ),
    certificate_interest: Boolean(rawProfile.certificate_interest || rawProfile.certificate_branches?.length),
    interview_branches: (rawProfile.interview_branches || []).filter((value) =>
      INTERVIEW_BRANCH_OPTIONS.some((option) => option.value === value),
    ),
    setup_complete: Boolean(rawProfile.setup_complete),
  };
  profile.resolved_application_strategy = resolveApplicationStrategy(profile);
  const focusNodeId = STAGE_FOCUS_NODE[profile.stage];
  const nodes = buildPilotNodes(profile).map((node) => ({
    ...node,
    status: previousStatusById.get(node.node_id) || node.status,
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
      pilot_path_schema_version: 5,
      graph_layout: undefined,
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
      certificate_interest: false,
      interview_branches: [],
      jobti_type: "",
      candidate_background: "other",
      experience_branches: ["first_internship", "transition_first_internship"],
      application_strategy: "auto",
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
    ...(profile.interview_branches || []).map(
      (interviewId) => INTERVIEW_BRANCH_OPTIONS.find((option) => option.value === interviewId)?.label || interviewId,
    ),
  ];
  const details = [
    branchLabels.length ? `当前专项准备：${branchLabels.join("、")}` : "",
  ].filter(Boolean);
  return details.length ? `请结合以下求职背景进行模拟面试：${details.join("；")}。` : "";
}
