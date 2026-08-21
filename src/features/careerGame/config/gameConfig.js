export const GAME_VERSION = 2;
export const MAX_TURNS = 20;
export const MAX_OVERTIME_TURNS = 22;

export const INITIAL_ATTRIBUTES = Object.freeze({
  time: 70,
  energy: 60,
  confidence: 45,
  profile: 15,
  network: 10,
});

export const RESOURCE_TUNING = Object.freeze({
  timeCostMultiplier: 0.6,
  positiveEnergyMultiplier: 0.7,
  positiveConfidenceMultiplier: 0.6,
  rejectionConfidenceCost: 2,
});

export const STRATEGY_TUNING = Object.freeze({
  interviewPreparationBonusPerChoice: 0.03,
  interviewPreparationBonusCap: 0.09,
});

export const ACHIEVEMENT_THRESHOLDS = Object.freeze({
  developedProfile: 70,
  developedNetwork: 55,
});

export const RARE_EVENT_WEIGHT_MULTIPLIER = 0.42;
export const RARE_ROUTE_CONTINUATION_WEIGHT_MULTIPLIER = 0.72;
export const MAX_RARE_EVENTS_PER_RUN = 4;
export const MIN_ORDINARY_EVENTS_BETWEEN_RARE = 4;
export const MIN_ORDINARY_EVENTS_BETWEEN_RARE_CONTINUATIONS = 1;
export const FIRST_RUN_RARE_EVENT_TURN = 4;

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
  career_creator: { title: "求职博主", description: "工作还没找到，账号先做起来了。现在轮到 HR 刷到你。" },
  content_creator: { title: "内容创作者", description: "求职只是你灵感来源的一部分。通过写作，你与更大的世界连接在一起。" },
  startup_founder: { title: "创业了", description: "你的 idea 和勇气带你走上一条更有挑战的路。给别人打工，终究不如自己做老板。" },
  freelancer: { title: "Freelancer", description: "你成为了自由职业者，开始拥有自己选择客户和项目的可能。" },
  academic: { title: "读研 / PhD", description: "你发现自己更喜欢学术研究。未来的某一天，某个知识领域的边界将被你轻轻推动。" },
  world_travel: { title: "先去看看世界", description: "世界很大，你的心也长出了可以高飞振翅的羽翼。" },
  gap_year: { title: "Gap Year", description: "探索自我、放松休息、及时行乐。不管别人怎么说，这一次你选择听从自己的节奏。" },
  stall_business: { title: "摆摊了", description: "不管是卖煎饼果子还是手工制品，你开始享受小本经营的快乐，或许，这个摊位将是更大成就的起点。" },
  dream_offer: { title: "Dream Offer", description: "你把最想争取的机会一步步推进到了 Offer。为自己骄傲一会儿吧！" },
  graduate_program: { title: "Graduate Programme 新人", description: "你期待着轮岗体验和结构化的培训，这是你成为行业佼佼者的起点。" },
  multiple_offers: { title: "Multiple Offers", description: "居然拿到这么多 Offer？选择权来到了你手里！" },
  referral_success: { title: "Referral Success", description: "一次真诚的交流，为你打开了原本看不见的门。" },
  unexpected_offer: { title: "Unexpected Offer", description: "有时，命运会带给你惊喜。结果不在最初的计划里，你走上一条与自己很合拍的新道路。" },
  startup_employee: { title: "Startup 冒险者", description: "你加入了一支小团队。风险与机遇并存，你们的冒险故事拉开帷幕。" },
  batch_winner: { title: "海投战神", description: "只要投得多，总有属于你的机会。" },
  precision_application: { title: "精准狙击", description: "你把时间和精力集中在少数真正想去的机会，也得到了自己想要的结果。" },
  steady_landing: { title: "稳稳上岸", description: "没有戏剧性的转折，你只是把每一步认真走完，然后找到了一份合适的工作。平稳就是一种幸运。" },
  declined_offer: { title: "拒绝 Offer 的人", description: "拿到 Offer 不代表必须接受。你更看重自己想要的工作与生活方式。" },
  burnout: { title: "Burnout", description: "精力耗尽了。劳逸结合很重要，别在抵达终点之前燃尽自己。" },
  paused_search: { title: "暂时退出求职季", description: "你没有耗尽时间，也还有继续行动的精力，只是在连续反馈之后决定暂时离开求职流程。停下来并不等于失败，恢复信心以后，路仍然可以继续。" },
  still_searching: { title: "Still Searching", description: "求职之路还在继续，虽然没有得到明确的结果，这一路你也有所收获。" },
};

export const STILL_SEARCHING_VARIANTS = Object.freeze({
  active_pipeline: "这一局结束时，还有申请或面试流程正在向前走。结果尚未落地，不等于这些机会已经消失。",
  screening_gap: "你送出了不少申请，面试入口却还没有完全打开。下一步更值得检查岗位匹配、简历证据和材料版本。",
  interview_conversion: "你已经多次走进面试，真正的卡点出现在最后几步。下一轮可以把复盘、表达和专项面试准备做得更具体。",
  prepared_not_exposed: "你的材料已经比开局完整很多，只是送到市场里的机会还不够多。准备成果需要更多真实申请来验证。",
  continuing: "求职之路还在继续。虽然这一局没有得到明确结果，你已经留下了可以带进下一轮的判断和经验。",
});

export function stageForTurn(turn) {
  if (turn < 5) return "preparation";
  if (turn < 11) return "application";
  if (turn < 16) return "interview";
  return "closing";
}
