export const GAME_VERSION = 2;
export const MAX_TURNS = 20;
export const MAX_OVERTIME_TURNS = 22;

export const INITIAL_ATTRIBUTES = Object.freeze({
  time: 70,
  energy: 70,
  confidence: 50,
  profile: 15,
  network: 10,
});

export const BEHAVIOR_KEYS = [
  "exploration", "analysis", "action", "expression",
  "reflection", "resilience", "networking", "pacing",
];

export const PROBABILITY_MODELS = {
  profile_screen: { base: 0.18, profile: 0.0025, confidence: 0.0008, cap: 0.65, pity: "application" },
  graduate_screen: { base: 0.15, profile: 0.0025, confidence: 0.0008, cap: 0.65, pity: "application" },
  network_outreach: { base: 0.35, network: 0.003, confidence: 0.0008, cap: 0.8 },
  referral: { base: 0.3, network: 0.0025, profile: 0.0012, cap: 0.8 },
  general_interview: { base: 0.28, profile: 0.0015, confidence: 0.002, cap: 0.78, pity: "interview" },
  technical_interview: { base: 0.25, profile: 0.002, confidence: 0.0018, cap: 0.78, pity: "interview" },
  group_interview: { base: 0.28, confidence: 0.002, network: 0.001, cap: 0.78, pity: "interview" },
  offer_decision: { base: 0.36, profile: 0.001, confidence: 0.0018, cap: 0.82, pity: "final" },
};

export const PITY_BONUSES = {
  application: [[6, 0.18], [4, 0.1]],
  interview: [[3, 0.12]],
  final: [[2, 0.2], [1, 0.1]],
};

export const PERSONA_PROFILES = {
  explorer: { exploration: 1, pacing: 0.15 },
  radar: { analysis: 1, expression: 0.15 },
  engine: { action: 1, resilience: 0.15 },
  alchemist: { expression: 1, analysis: 0.15 },
  researcher: { reflection: 1, analysis: 0.2 },
  protector: { resilience: 0.55, pacing: 0.55 },
  gardener: { pacing: 0.75, reflection: 0.25, exploration: 0.15 },
  koi: { resilience: 0.55, exploration: 0.3, networking: 0.25 },
};

export const PERSONA_COPY = {
  explorer: { name: "林克", description: "你会为意外出现的机会留一点探索空间。" },
  radar: { name: "LinkedIn", description: "你习惯先读懂岗位和公司，再决定怎样出手。" },
  engine: { name: "海王", description: "机会不会自己排队，你更相信行动会创造下一步。" },
  alchemist: { name: "X团神券", description: "你擅长把真实经历翻译成别人能迅速看懂的价值。" },
  researcher: { name: "复仇者", description: "每一次反馈都会进入你的下一版作战记录。" },
  protector: { name: "GPT", description: "你会给努力留出边界，也稳稳接住状态波动。" },
  gardener: { name: "野王", description: "你有自己的节奏，不轻易被别人的进度条带走。" },
  koi: { name: "卡戴珊太后", description: "你用幽默和韧性穿过招聘流程里的随机性。" },
};

export const ENDING_COPY = {
  startup_founder: { title: "创业了", description: "原本只是一起做点东西，最后真的长成了一条你愿意继续负责的路。" },
  freelancer: { title: "Freelancer", description: "一次小交付带来了下一次，你开始拥有自己选择客户和项目的可能。" },
  academic: { title: "读研 / PhD", description: "真实研究经历让你确认，这条路线值得继续认真探索。" },
  world_travel: { title: "先去看看世界", description: "你没有把暂停当作落后，而是为下一阶段留出一段有目标的远行。" },
  gap_year: { title: "Gap Year", description: "这一次，恢复和重新理解自己就是正经计划。" },
  stall_business: { title: "摆摊了", description: "一个周末实验收到了真实订单。职业道路偶尔真的会从摊位开始。" },
  dream_offer: { title: "Dream Offer", description: "你把最想争取的机会一步步推进到了 Offer。" },
  graduate_program: { title: "Graduate Programme 新人", description: "漫长流程走到了入职，你获得了一段有结构的职业起点。" },
  multiple_offers: { title: "Multiple Offers", description: "这一次，选择权来到了你手里。" },
  referral_success: { title: "Referral Success", description: "一次真诚连接，为你打开了原本看不见的门。" },
  unexpected_offer: { title: "Unexpected Offer", description: "结果不在最初的计划里，却可能打开一条适合你的新方向。" },
  startup_employee: { title: "Startup 冒险者", description: "你走进了一支小团队，用更大的不确定性换取更快接触真实问题。" },
  batch_winner: { title: "海投战神", description: "你用持续行动让机会池保持流动，并从大量反馈里找到了入口。" },
  precision_application: { title: "精准狙击", description: "你把研究和表达集中在少数真正想去的机会，最后命中了一个。" },
  steady_landing: { title: "稳稳上岸", description: "没有戏剧性转折，你只是把每一步认真走完，然后接住了一份合适的工作。" },
  declined_offer: { title: "拒绝 Offer 的人", description: "拿到 Offer 不代表必须接受。你为想要的工作与生活保留了判断权。" },
  burnout: { title: "Burnout", description: "资源耗尽让这一轮提前暂停。停下来也是重要信息。" },
  still_searching: { title: "Still Searching", description: "流程还在继续，这一轮留下了更清楚的下一步。" },
};

export function stageForTurn(turn) {
  if (turn < 5) return "preparation";
  if (turn < 11) return "application";
  if (turn < 16) return "interview";
  return "closing";
}
