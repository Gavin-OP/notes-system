export const GAME_VERSION = 1;
export const MAX_TURNS = 12;

export const INITIAL_ATTRIBUTES = Object.freeze({
  time: 100,
  energy: 78,
  confidence: 58,
  profile: 32,
  network: 12,
});

export const BEHAVIOR_KEYS = [
  "exploration", "analysis", "action", "expression",
  "reflection", "resilience", "networking", "pacing",
];

export const PROBABILITY_MODELS = {
  profile_screen: { base: 0.38, profile: 0.006, confidence: 0.002 },
  network_outreach: { base: 0.4, network: 0.007, confidence: 0.003 },
  general_interview: { base: 0.38, confidence: 0.006, profile: 0.003 },
  technical_interview: { base: 0.32, profile: 0.006, confidence: 0.003 },
  group_interview: { base: 0.36, confidence: 0.006, network: 0.002 },
  offer_decision: { base: 0.34, confidence: 0.004, profile: 0.004 },
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
  explorer: { name: "林克", description: "你会为意外出现的入口留一点地图空间。" },
  radar: { name: "LinkedIn", description: "你习惯先读懂岗位和公司，再决定怎样出手。" },
  engine: { name: "海王", description: "机会不会自己排队，你更相信行动会创造下一步。" },
  alchemist: { name: "X团神券", description: "你擅长把真实经历翻译成别人能迅速看懂的价值。" },
  researcher: { name: "复仇者", description: "每一次反馈都会进入你的下一版作战记录。" },
  protector: { name: "GPT", description: "你会给努力留出边界，也稳稳接住状态波动。" },
  gardener: { name: "野王", description: "你有自己的节奏，不轻易被别人的进度条带走。" },
  koi: { name: "卡戴珊太后", description: "你用幽默和韧性穿过招聘流程里的随机性。" },
};

export const ENDING_COPY = {
  dream_offer: { title: "Dream Offer", description: "你把最想争取的机会推进到了终点。" },
  multiple_offers: { title: "Multiple Offers", description: "这一次，选择权来到了你手里。" },
  referral_success: { title: "Referral Success", description: "一次真诚连接，为你打开了原本看不见的门。" },
  late_bloomer: { title: "Late Bloomer", description: "前半程并不顺利，但你的调整终于在后半程开花。" },
  unexpected_offer: { title: "Unexpected Offer", description: "终点不在最初的地图上，却可能是一条新路线。" },
  burnout: { title: "Burnout", description: "资源耗尽让这一轮提前暂停。停下来也是重要信息。" },
  still_searching: { title: "Still Searching", description: "流程还在继续，这一轮留下了更清楚的下一步。" },
  no_offer: { title: "No Offer", description: "这轮没有 Offer，但你已经收集了下一轮会用到的线索。" },
};

export function stageForTurn(turn) {
  if (turn <= 3) return "preparation";
  if (turn <= 6) return "application";
  if (turn <= 9) return "interview";
  return "decision";
}
