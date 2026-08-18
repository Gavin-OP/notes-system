export const LEGACY_POOL = [
  { id: "senior-contact", title: "学长的联系方式", description: "下一局初始 Network +8", initialEffects: { network: 8 } },
  { id: "readable-resume", title: "终于能看的简历", description: "下一局初始 Profile +10", initialEffects: { profile: 10 } },
  { id: "rejection-calm", title: "被拒绝十次以后产生的奇怪平静", description: "下一局初始 Confidence +8", initialEffects: { confidence: 8 } },
  { id: "coffee-chat", title: "Coffee Chat 经验", description: "下一局 Networking 成功率 +4%", modifiers: { networkingProbability: 0.04 } },
  { id: "interview-notes", title: "面经笔记", description: "下一局 Interview 成功率 +4%", modifiers: { interviewProbability: 0.04 } },
  { id: "portfolio-made", title: "做过一次作品集", description: "下一局作品集事件 Time 消耗 -2", modifiers: { portfolioTimeDiscount: 2 } },
  { id: "jd-reader", title: "我知道 JD 在写什么了", description: "下一局研究岗位时额外 Profile +2", modifiers: { researchProfileBonus: 2 } },
  { id: "boundaries", title: "边界感", description: "下一局初始 Energy +5", initialEffects: { energy: 5 } },
  { id: "airport-regular", title: "机场熟客", description: "下一局旅行路线事件更容易出现", modifiers: { travelWeight: 1.3 } },
  { id: "first-client", title: "第一位客户", description: "下一局 Freelance 事件更容易出现", modifiers: { freelanceWeight: 1.3 } },
  { id: "first-user", title: "第一个用户", description: "下一局 Startup 路线事件更容易出现", modifiers: { startupWeight: 1.3 } },
  { id: "stall-pass", title: "摊主体验卡", description: "下一局摆摊路线事件更容易出现", modifiers: { stallWeight: 1.4 } },
];

export const LEGACY_BY_ID = new Map(LEGACY_POOL.map((legacy) => [legacy.id, legacy]));
