const resolved = (message, effects = {}, extra = {}) => ({ id: "resolved", message, effects, ...extra });
const option = (id, label, behaviorEffects, message, payload = {}) => ({
  id, label, behaviorEffects, intensity: "medium", ...payload,
  outcome: resolved(message, payload.outcomeEffects || {}, {
    counters: payload.outcomeCounters,
    flags: payload.outcomeFlags,
    metrics: payload.outcomeMetrics,
    routes: payload.outcomeRoutes,
    nextTags: payload.nextTags,
  }),
});

export const RARE_EVENT_POOL = [
  {
    id: "late-recruiter-message", category: "application", stages: ["application", "interview"], baseWeight: 1.2,
    title: "晚上十一点，Recruiter 突然发来消息", description: "对方问你明天是否方便快速聊聊。机会来得突然，你也不必把秒回当成职业素养。", tags: ["unexpected", "interview"],
    choices: [
      option("reply", "确认收到，并约一个自己能准备好的时间", { pacing: 2, expression: 2 }, "你礼貌确认了时间。第二天的沟通没有仓促开场。", { effects: { time: -2, confidence: 3 }, counters: { interviewLeads: 1 }, metrics: { careerMomentum: 5 } }),
      option("now", "如果对方方便，现在就简单聊几分钟", { action: 3, exploration: 2 }, "临时交流不算完美，但你接住了这个意外入口。", { effects: { energy: -5, confidence: 2 }, counters: { interviewLeads: 1 }, metrics: { careerMomentum: 4 } }),
    ],
  },
  {
    id: "friend-project", category: "networking", stages: ["preparation", "application"], baseWeight: 1.4,
    title: "朋友问：要不要一起做个东西？", description: "想法还很粗糙，但它可能成为项目、兼职，也可能只是一个周末实验。", tags: ["startup", "alternative"],
    choices: [
      option("prototype", "先做一个很小的版本，看看有没有人需要", { exploration: 3, action: 2 }, "你们把聊天里的想法做成了能给人看的原型。", { effects: { time: -7, energy: -5, profile: 5 }, routes: { startup: 22 }, metrics: { alternativePath: 8, careerMomentum: 3 }, nextTags: ["startup"] }),
      option("advise", "先帮忙研究用户和需求，不急着加入", { analysis: 3, networking: 1 }, "你发现这个问题确实存在，也更清楚自己愿意投入多少。", { effects: { time: -4, network: 3 }, routes: { startup: 10 }, metrics: { alternativePath: 3 } }),
      option("decline", "现在的主线已经够满，先不接新项目", { pacing: 3 }, "你说清楚了自己的精力边界，也保留了以后合作的可能。", { effects: { energy: 4 }, metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "first-user", category: "profile", stages: ["application", "interview"], baseWeight: 1.4,
    requirements: { minRoutes: { startup: 20 } }, title: "陌生人真的用了你们做的东西", description: "第一位用户留下了具体反馈。这个周末项目第一次不只属于你们自己。", tags: ["startup", "alternative"],
    choices: [
      option("iterate", "根据反馈改一版，再找几个人试用", { reflection: 2, action: 2 }, "反馈变成了下一版功能，项目也有了可以写进简历的真实证据。", { effects: { time: -7, energy: -5, profile: 7, confidence: 4 }, routes: { startup: 28 }, metrics: { alternativePath: 8, careerMomentum: 5 } }),
      option("document", "先记录用户、问题和结果，把故事讲清楚", { expression: 3, reflection: 2 }, "你把一次模糊尝试整理成了完整项目故事。", { effects: { time: -5, profile: 8 }, routes: { startup: 16 }, metrics: { careerMomentum: 3 } }),
    ],
  },
  {
    id: "incubator-invite", category: "networking", stages: ["interview", "closing"], baseWeight: 1.5,
    requirements: { minRoutes: { startup: 45 } }, title: "学校孵化器愿意和你们聊聊", description: "这不等于融资，也不保证成功，但项目突然有了一条可以认真走下去的路。", tags: ["startup", "alternative"],
    choices: [
      option("join", "带上数据和问题，申请进入孵化计划", { action: 2, analysis: 2, networking: 2 }, "你们获得了导师和一段验证时间，创业从副本变成了可选主线。", { effects: { time: -8, energy: -6, network: 8, confidence: 6 }, routes: { startup: 38 }, metrics: { alternativePath: 15 }, flags: ["startupReady"] }),
      option("keep-small", "继续小规模验证，不急着把它变成公司", { pacing: 2, reflection: 2 }, "你保留了项目，也保留了生活和求职的空间。", { effects: { profile: 5, confidence: 2 }, routes: { startup: 15 }, metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "partner-disagreement", category: "networking", stages: ["interview", "closing"], baseWeight: 1.2,
    requirements: { minRoutes: { startup: 35 } }, title: "合作伙伴对下一步有了完全不同的想法", description: "一个人想快速上线，另一个人想继续研究。真正的协作问题出现了。", tags: ["startup"],
    choices: [
      option("talk", "把目标、投入和退出条件都摊开谈", { reflection: 3, networking: 2 }, "分歧没有神奇消失，但你们重新定义了怎样继续合作。", { effects: { time: -5, energy: -3, confidence: 3 }, routes: { startup: 12 }, metrics: { lifeSatisfaction: 4 } }),
      option("push", "先按自己的判断推进，用结果再讨论", { action: 3 }, "进度加快了，关系里的摩擦也被暂时留在后面。", { effects: { time: -5, energy: -6, profile: 4 }, routes: { startup: 8 }, metrics: { lifeSatisfaction: -7 } }),
    ],
  },
  {
    id: "paid-freelance", category: "application", stages: ["application", "interview"], baseWeight: 1.3,
    requirements: { minAttributes: { profile: 25 } }, title: "有人愿意为你的技能付第一笔钱", description: "项目不大，却有真实需求、截止日期和客户反馈。", tags: ["freelance", "alternative"],
    choices: [
      option("take", "确认范围和交付，再接下这个项目", { action: 2, expression: 2 }, "你完成了一次有边界的交付，也第一次知道自己的技能可以怎样定价。", { effects: { time: -7, energy: -6, profile: 6, confidence: 5 }, routes: { freelance: 30 }, metrics: { alternativePath: 9, careerMomentum: 4 }, nextTags: ["freelance"] }),
      option("refer", "时间不够，介绍给更合适的人", { networking: 3, pacing: 2 }, "你没有硬接，却因为靠谱的转介建立了新的职业连接。", { effects: { network: 7, energy: 2 }, routes: { freelance: 8 }, metrics: { lifeSatisfaction: 3 } }),
    ],
  },
  {
    id: "freelance-referral", category: "networking", stages: ["interview", "closing"], baseWeight: 1.5,
    requirements: { minRoutes: { freelance: 25 } }, title: "上一位客户把你推荐给了另一位客户", description: "这次项目更完整，意味着更大的自由，也意味着你要自己管理全部承诺。", tags: ["freelance", "alternative"],
    choices: [
      option("accept", "写清范围、价格和修改次数，再开始", { analysis: 2, action: 2, expression: 1 }, "你不再只是在帮忙，而是在经营一段专业合作。", { effects: { time: -8, energy: -6, profile: 7, confidence: 5, network: 4 }, routes: { freelance: 42 }, metrics: { alternativePath: 14 }, flags: ["freelanceReady"] }),
      option("pause", "这段时间先专注求职，不继续扩张", { pacing: 3 }, "你留下了联系方式，也没有让副业挤走当前最重要的事。", { effects: { energy: 4 }, routes: { freelance: 8 }, metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "professor-research", category: "networking", stages: ["preparation", "application"], baseWeight: 1.2,
    title: "教授问你要不要参与一个研究项目", description: "它会占用不少时间，但也可能让你真正体验研究，而不是只想象 PhD 的生活。", tags: ["academic", "alternative"],
    choices: [
      option("join", "先确认工作内容和预期，再参与一段时间", { analysis: 2, exploration: 2 }, "你开始接触真实研究流程，也得到了一种新的职业证据。", { effects: { time: -7, energy: -5, profile: 6, network: 5 }, routes: { academic: 30 }, metrics: { alternativePath: 8 }, nextTags: ["academic"] }),
      option("talk", "先约一次交流，了解研究生活再决定", { analysis: 3, networking: 1 }, "你听到了论文之外的日常，对研究路线有了更具体的判断。", { effects: { time: -3, network: 3, confidence: 2 }, routes: { academic: 10 } }),
    ],
  },
  {
    id: "ra-invite", category: "profile", stages: ["interview", "closing"], baseWeight: 1.5,
    requirements: { minRoutes: { academic: 25 } }, title: "研究团队邀请你继续做 RA", description: "继续留下可以积累研究成果，也会改变接下来几个月的时间安排。", tags: ["academic", "alternative"],
    choices: [
      option("continue", "继续，并认真评估研究生或 PhD 路线", { analysis: 3, reflection: 2 }, "你获得了更完整的研究职责，学术路线从想法变成了真实选项。", { effects: { time: -8, energy: -5, profile: 7, confidence: 5 }, routes: { academic: 50 }, metrics: { alternativePath: 15 }, flags: ["academicReady"] }),
      option("finish", "完成当前项目，把经验带回求职主线", { expression: 2, pacing: 2 }, "你整理好研究成果，也更确定自己暂时想在行业里工作。", { effects: { profile: 7, confidence: 3 }, routes: { academic: 10 } }),
    ],
  },
  {
    id: "gap-year-thought", category: "offer", stages: ["interview", "closing"], baseWeight: 1.2,
    requirements: { maxAttributes: { energy: 45 } }, title: "Gap Year 第一次不再只是随口一说", description: "你开始认真想：如果暂停不是失败，这一年最想用来恢复或探索什么？", tags: ["travel", "alternative"],
    choices: [
      option("plan", "算清预算和目标，看看它能否成为计划", { pacing: 3, exploration: 2 }, "你没有立刻逃走，而是把暂停需要的条件逐项写清楚。", { effects: { time: -3, energy: 7, confidence: 3 }, routes: { travel: 28 }, metrics: { alternativePath: 8, lifeSatisfaction: 8 }, nextTags: ["travel"] }),
      option("rest", "先休息几天，不急着做一年期决定", { resilience: 2, pacing: 3 }, "睡眠和正常生活回来以后，你再看这个问题时不再只有疲惫。", { effects: { energy: 12, confidence: 3 }, routes: { travel: 8 }, metrics: { lifeSatisfaction: 7 } }),
    ],
  },
  {
    id: "cheap-flight", category: "offer", stages: ["closing"], baseWeight: 1.5,
    requirements: { minRoutes: { travel: 22 } }, title: "你刷到一张难以忽略的便宜机票", description: "它不会替你决定人生，却让“出去看看”突然有了具体日期。", tags: ["travel", "alternative"],
    choices: [
      option("book", "确认预算后订票，给自己一段真正的空白", { exploration: 4, pacing: 2 }, "你没有获得传统意义上的上岸结局，却给下一阶段留出了新的视野。", { effects: { energy: 14, confidence: 5 }, routes: { travel: 55 }, metrics: { alternativePath: 18, lifeSatisfaction: 15 }, flags: ["travelReady"] }),
      option("save", "先把路线收藏，等流程结束再决定", { pacing: 2, analysis: 1 }, "你保留了这个念头，也继续处理眼前尚未结束的流程。", { effects: { confidence: 2 }, routes: { travel: 10 } }),
    ],
  },
  {
    id: "startup-friend-opening", category: "networking", stages: ["application", "interview"], baseWeight: 1.3,
    title: "朋友问：要不要来我们的小公司？", description: "团队小、变化快，职位名称不够标准，但你可能会很快接触真实问题。", tags: ["startup-employee", "unexpected"],
    choices: [
      option("meet", "先见团队和老板，问清楚工作与现金流", { analysis: 2, exploration: 2, networking: 1 }, "你看到了一份和大公司完全不同的工作方式，也获得了继续选择的机会。", { effects: { time: -5, network: 6, confidence: 3 }, routes: { startupEmployee: 35 }, metrics: { alternativePath: 7 }, nextTags: ["startup-employee"] }),
      option("join", "如果职责和人靠谱，就愿意承担一点风险", { exploration: 3, action: 2 }, "你决定进入一个成长速度很快、边界也很模糊的团队。", { effects: { time: -6, energy: -5, confidence: 6 }, routes: { startupEmployee: 65 }, metrics: { alternativePath: 14 }, flags: ["startupEmployeeReady"] }),
      option("decline", "风险和当前计划不匹配，感谢后拒绝", { pacing: 2, analysis: 2 }, "你没有因为关系或新鲜感仓促加入，朋友也理解你的决定。", { effects: { confidence: 2, network: 2 } }),
    ],
  },
  {
    id: "stall-idea", category: "offer", stages: ["application", "interview"], baseWeight: 0.8,
    title: "你发现周末市集的一个摊位居然很赚钱", description: "这听起来不像职业规划，但你开始计算：如果自己试一次，会发生什么？", tags: ["stall", "alternative"],
    choices: [
      option("test", "先用一个周末做最低成本测试", { exploration: 4, action: 2 }, "你准备了很少的库存，把好奇心变成了一次真实实验。", { effects: { time: -6, energy: -5, confidence: 3 }, routes: { stall: 30 }, metrics: { alternativePath: 8 }, nextTags: ["stall"] }),
      option("laugh", "把它当成一个有趣念头，继续求职", { resilience: 2, pacing: 1 }, "这个念头至少让你笑了一会儿，求职并不是世界上唯一的生活剧本。", { effects: { energy: 4 }, routes: { stall: 5 }, metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "first-stall-day", category: "offer", stages: ["interview", "closing"], baseWeight: 1.5,
    requirements: { minRoutes: { stall: 25 } }, title: "第一次摆摊，比想象中忙很多", description: "你要定价、招呼客人、补货，也第一次直接看到陌生人为你的东西付钱。", tags: ["stall", "alternative"],
    choices: [
      option("review", "记下销量和顾客问题，下周再优化一次", { reflection: 2, action: 2 }, "第二次准备明显更有章法，这件事开始像一门小生意。", { effects: { time: -6, energy: -5, confidence: 6, network: 3 }, routes: { stall: 38 }, metrics: { alternativePath: 12, careerMomentum: 3 } }),
      option("one-off", "体验已经足够，把它留作一段有趣经历", { pacing: 2, exploration: 1 }, "你收好剩余物料，也带走了真实的销售、运营和用户观察。", { effects: { profile: 5, confidence: 3 }, routes: { stall: 8 } }),
    ],
  },
  {
    id: "social-buyer", category: "offer", stages: ["closing"], baseWeight: 1.5,
    requirements: { minRoutes: { stall: 55 } }, title: "社交平台上有人问：可以邮寄吗？", description: "线下小摊出现了线上订单。它可能只是好运，也可能是一条可继续验证的路。", tags: ["stall", "alternative"],
    choices: [
      option("open", "开放少量预订，先验证履约是否可行", { action: 2, analysis: 2 }, "订单不算多，却足以证明这条小路能够继续生长。", { effects: { time: -5, energy: -4, confidence: 7 }, routes: { stall: 40 }, metrics: { alternativePath: 15 }, flags: ["stallReady"] }),
      option("stop", "这次先不扩张，保留周末的快乐", { pacing: 3 }, "你没有让一次好成绩立刻变成新的 KPI。", { effects: { energy: 5 }, metrics: { lifeSatisfaction: 6 } }),
    ],
  },
  {
    id: "family-question", category: "offer", stages: ["application", "interview", "closing"], baseWeight: 1.4,
    title: "家里人问：所以你找到工作了吗？", description: "他们可能只是关心，但这个问题仍然精准落在你最焦虑的地方。", tags: ["wellbeing"],
    choices: [
      option("explain", "说说流程正在怎样推进，也说明现在需要什么支持", { expression: 2, resilience: 2 }, "家里未必完全理解招聘流程，但对话不再只剩一句追问。", { effects: { confidence: 3, energy: 2 }, metrics: { lifeSatisfaction: 6 } }),
      option("boundary", "告诉他们有结果会主动说，今天先不聊", { pacing: 3, resilience: 1 }, "你结束了这场不合时宜的更新会，也守住了今晚的状态。", { effects: { energy: 5, confidence: 2 }, metrics: { lifeSatisfaction: 5 } }),
      option("spiral", "开始怀疑自己是不是落后了", { reflection: 1 }, "你刷了很久别人的进度，最后只得到一晚更差的睡眠。", { effects: { energy: -7, confidence: -7 }, metrics: { lifeSatisfaction: -9 } }),
    ],
  },
  {
    id: "classmate-offer", category: "offer", stages: ["application", "interview", "closing"], baseWeight: 1.2,
    title: "同学在群里宣布拿到 Offer", description: "你真心替对方高兴，自己的进度条也突然变得格外显眼。", tags: ["wellbeing"],
    choices: [
      option("congratulate", "认真祝贺，然后回到自己的节奏", { resilience: 3, pacing: 2 }, "别人的好消息没有抢走你的机会。你关掉群聊，继续做今天计划里的事。", { effects: { confidence: 3, energy: 2 }, metrics: { lifeSatisfaction: 5 } }),
      option("learn", "祝贺后问问流程里有哪些值得准备的地方", { networking: 2, reflection: 2 }, "同学分享了几条具体经验，你也没有把交流变成比较。", { effects: { network: 4, profile: 2, confidence: 2 }, metrics: { careerMomentum: 3 } }),
      option("compare", "默默打开招聘软件，焦虑地再投一批", { action: 3 }, "申请数增加了，今晚的精力却被比较感提前用完。", { effects: { time: -6, energy: -8, confidence: -4 }, counters: { applications: 3 }, metrics: { lifeSatisfaction: -7 } }),
    ],
  },
  {
    id: "unexpected-interview-question", category: "interview", stages: ["interview"], baseWeight: 1.7,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "面试官问了一个你完全没准备过的问题", description: "大脑短暂空白。你可以诚实思考，也可以急着填满沉默。", tags: ["interview", "unexpected"],
    choices: [
      option("think", "承认需要想一下，再把思路一步步说出来", { resilience: 2, analysis: 2 }, "你没有立刻给出漂亮答案，却让面试官看见了真实的思考过程。", { effects: { confidence: 5 }, counters: { interviews: 1, offerLeads: 1 }, metrics: { careerMomentum: 5 } }),
      option("example", "从一段类似经历出发，边讲边校准", { expression: 2, exploration: 2 }, "你找到一个可以落脚的例子，把陌生问题接回了自己的经验。", { effects: { confidence: 4, profile: 2 }, counters: { interviews: 1, offerLeads: 1 } }),
      option("bluff", "先给一个听起来很完整的答案", { action: 2, expression: 1 }, "答案说得很快，追问却让里面的空白暴露出来。", { effects: { confidence: -5 }, counters: { interviews: 1, rejections: 1 }, failureTags: ["behavioral_interview"] }),
    ],
  },
  {
    id: "process-cancelled", category: "offer", stages: ["interview", "closing"], baseWeight: 1.2,
    requirements: { minCounters: { interviews: 1 } }, title: "公司通知：岗位流程取消", description: "不是你的表现出了问题；HC、预算或团队安排改变了。招聘里的随机性突然有了实体。", tags: ["rejection", "unexpected"],
    choices: [
      option("respond", "感谢通知，询问能否保留未来联系", { resilience: 3, networking: 1 }, "这条流程结束了，关系和你的表现记录没有一起消失。", { effects: { confidence: -1, network: 3 }, counters: { rejections: 1 }, metrics: { lifeSatisfaction: -2 } }),
      option("pause", "今天先消化，明天再继续申请", { pacing: 3, resilience: 2 }, "你允许失望存在，也没有把公司的变化解释成自己的失败。", { effects: { energy: 7, confidence: 2 }, counters: { rejections: 1 }, metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "blank-saturday", category: "profile", stages: ["preparation", "application", "interview"], baseWeight: 1.5,
    title: "周六突然没有任何截止日期", description: "没有测试、没有面试、也没有必须今天投的岗位。这段空白要怎样使用？", tags: ["wellbeing", "reflection"],
    choices: [
      option("rest", "真正休息一天，不把恢复也做成任务", { pacing: 4, resilience: 2 }, "你睡够、吃饭、出门走了走。星期天的求职没有因此崩盘。", { effects: { energy: 15, confidence: 4 }, metrics: { lifeSatisfaction: 12 } }),
      option("review", "轻量复盘最近流程，然后按时收工", { reflection: 4, pacing: 2 }, "你找到两个能改的小问题，也准时关掉了文档。", { effects: { energy: 5, profile: 4, confidence: 3 }, metrics: { careerMomentum: 3, lifeSatisfaction: 5 } }),
      option("grind", "难得有空，把收藏夹里的岗位全投完", { action: 4 }, "申请数明显增加，周末的恢复窗口也就此关闭。", { effects: { time: -8, energy: -12 }, counters: { applications: 4, interviewLeads: 1 }, metrics: { careerMomentum: 4, lifeSatisfaction: -8 } }),
    ],
  },
];
