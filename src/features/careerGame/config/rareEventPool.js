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

const RARE_EVENTS = [
  {
    id: "late-recruiter-message", category: "application", stages: ["application", "interview"], baseWeight: 1.2,
    title: "晚上十点，HR 突然发来消息", description: "对方问你明天是否方便快速聊聊。机会来得突然，可是已经很晚了。", tags: ["unexpected", "interview"],
    choices: [
      option("reply", "立刻确认收到，并约一个自己能准备好的时间", { pacing: 2, expression: 2 }, "你礼貌确认了时间。第二天的沟通没有仓促开场。", { effects: { time: -2, confidence: 3 }, counters: { interviewLeads: 1 }, metrics: { careerMomentum: 5 } }),
      option("tomorrow", "时间太晚了，明天再回复吧", { pacing: 3, resilience: 1 }, "第二天醒来以后，你整理好状态回复了对方。机会还在那里，昨晚也没有因此少睡几个小时。", { effects: { energy: 3, confidence: 1 }, counters: { interviewLeads: 1 }, metrics: { careerMomentum: 3 } }),
    ],
  },
  {
    id: "friend-project", category: "networking", stages: ["preparation", "application"], baseWeight: 1.4,
    requirements: { flagsAbsent: ["startupClosed"] },
    title: "朋友问：要不要一起做个有意思的东西？", description: "想法还很粗糙，但它可能成为一个项目、一个产品，也可能只是一个周末实验。", tags: ["startup", "alternative"],
    choices: [
      option("prototype", "先做一个很小的版本，看看效果如何", { exploration: 3, action: 2 }, "你们把聊天里的想法做成了能给人看的原型。", { effects: { time: -7, energy: -5, profile: 5 }, routes: { startup: 22 }, metrics: { alternativePath: 8, careerMomentum: 3 }, nextTags: ["startup"] }),
      option("advise", "先研究用户和需求，看看有没有可能正式落地，再决定是否接受邀请", { analysis: 3, networking: 1 }, "你发现这个问题确实存在，也更清楚自己愿意投入多少。", { effects: { time: -4, network: 3 }, routes: { startup: 10 }, metrics: { alternativePath: 3 } }),
      option("decline", "现在的求职主线已经够满了，婉拒朋友的提议", { pacing: 3 }, "你说清楚了自己的精力边界，也保留了以后合作的可能。", { effects: { energy: 4 }, metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "first-user", category: "profile", stages: ["application", "interview"], baseWeight: 1.4,
    requirements: { minRoutes: { startup: 20 }, flagsAbsent: ["startupClosed"] }, title: "陌生人真的用了你和朋友一起开发的小产品", description: "第一位用户留下了具体反馈。这个周末项目第一次不只属于你们自己。", tags: ["startup", "alternative"],
    choices: [
      option("iterate", "根据反馈进行修改，继续把产品推广给更多人", { reflection: 2, action: 3 }, "反馈变成了下一版功能，你们开始主动寻找更多用户。这个原本只打算做来试试看的产品，逐渐有了真正继续做下去的可能。", { effects: { time: -8, energy: -6, profile: 5, confidence: 5 }, routes: { startup: 35 }, metrics: { alternativePath: 12, careerMomentum: 2 } }),
      option("document", "把用户反馈和修改结果包装成一段完整的故事，放进项目集和 LinkedIn post", { expression: 3, reflection: 2 }, "你把一次模糊尝试整理成了完整项目故事，求职材料更丰富了，还收获了十几个 LinkedIn 粉丝。", { effects: { time: -5, energy: -3, profile: 9, network: 5, confidence: 2 }, routes: { startup: 8 }, metrics: { careerMomentum: 7 } }),
    ],
  },
  {
    id: "incubator-invite", category: "networking", stages: ["interview", "closing"], baseWeight: 1.5,
    requirements: { minRoutes: { startup: 45 }, flagsAbsent: ["startupClosed"] }, title: "学校的创业项目孵化组织愿意和你们聊聊", description: "这不等于融资，也不保证成功，但你们的项目有了一个值得认真考虑的机会。", tags: ["startup", "alternative"],
    choices: [
      option("join", "带上数据和问题，申请进入孵化计划", { action: 2, analysis: 2, networking: 2 }, "你们获得了导师和一段验证时间，创业从副本变成了可选主线。", { effects: { time: -8, energy: -6, network: 8, confidence: 6 }, routes: { startup: 38 }, metrics: { alternativePath: 15 }, flags: ["startupReady"] }),
      option("keep-small", "继续小规模验证，不急着把它变成公司", { pacing: 2, reflection: 2 }, "你保留了项目，也保留了生活和求职的空间。", { effects: { profile: 5, confidence: 2 }, routes: { startup: 15 }, metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "partner-disagreement", category: "networking", stages: ["interview", "closing"], baseWeight: 1.2,
    requirements: { minRoutes: { startup: 35 }, flagsAbsent: ["startupClosed"] }, title: "合作伙伴对下一步有了完全不同的想法", description: "一个人想快速上线，另一个人想继续打磨。真正的协作问题出现了。", tags: ["startup"],
    choices: [
      option("talk", "把长期目标、短期机会、投入和退出条件都摊开谈", { reflection: 3, networking: 2 }, "不同的想法仍然存在，但你们重新定义了怎样继续合作。", { effects: { time: -5, energy: -3, confidence: 3 }, routes: { startup: 12 }, metrics: { lifeSatisfaction: 4 } }),
      option("push", "先按自己的判断推进，拿到结果再讨论", { action: 3 }, null, {
        effects: { time: -5, energy: -6 }, probabilityRule: "startup_push",
        success: resolved("进度加快了，你的方案也确实拿到了结果。虽然关系里的摩擦还没有完全解决，团队暂时找到了继续推进的理由。", { profile: 4 }, { routes: { startup: 8 }, metrics: { lifeSatisfaction: -7 } }),
        failure: resolved("你的方案没有取得预期效果，之前没有解决的分歧也重新浮上水面。团队遗憾解散，但产品、用户反馈和项目经历都留在了作品集和简历里。", { profile: 5, confidence: -7 }, { flags: ["startupClosed"], metrics: { lifeSatisfaction: -8, alternativePath: -5 } }),
      }),
    ],
  },
  {
    id: "paid-freelance", category: "application", stages: ["application", "interview"], baseWeight: 1.3,
    requirements: { minAttributes: { profile: 25 } }, title: "你的专业技能吸引到了来谈合作的人", description: "项目不大，但有真实需求。你的技能专业度得到了认可，看来精心包装的 Profile 有被留意过。", tags: ["freelance", "alternative"],
    choices: [
      option("take", "确认范围和交付，接下这个项目", { action: 2, expression: 2 }, "合作顺利，你也第一次知道了自己的技能在市场上的定价和需求。", { effects: { time: -7, energy: -6, profile: 6, confidence: 5 }, routes: { freelance: 30 }, metrics: { alternativePath: 9, careerMomentum: 4 }, nextTags: ["freelance"] }),
      option("refer", "时间不够，介绍给更合适的人", { networking: 3, pacing: 2 }, "你没有硬接，却因为靠谱的转介建立了新的职业连接。", { effects: { network: 7, energy: 2 }, routes: { freelance: 8 }, metrics: { lifeSatisfaction: 3 } }),
    ],
  },
  {
    id: "freelance-referral", category: "networking", stages: ["interview", "closing"], baseWeight: 1.5,
    requirements: { minRoutes: { freelance: 25 } }, title: "上一位合作客户把你推荐给了另一位客户", description: "这次项目更完整，意味着更大的展示空间，或许你已经开始走上自由职业者的道路。", tags: ["freelance", "alternative"],
    choices: [
      option("accept", "谈好职责范围、价格和修改次数，再开始正式合作", { analysis: 2, action: 2, expression: 1 }, "你不再只是在帮忙，而是在经营一段专业合作。", { effects: { time: -8, energy: -6, profile: 7, confidence: 5, network: 4 }, routes: { freelance: 42 }, metrics: { alternativePath: 14 }, flags: ["freelanceReady"] }),
      option("pause", "这段时间先专注自己的求职，不继续接受委托", { pacing: 3 }, "你留下了联系方式，也没有让副业挤走当前最重要的事。", { effects: { energy: 4 }, routes: { freelance: 8 }, metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "professor-research", category: "networking", stages: ["preparation", "application"], baseWeight: 1.2,
    title: "教授问你要不要参与一个研究项目", description: "它会占用不少时间，但会让你真正接触一次学术研究。至于这段经历最后会走向求职还是学术，要看你准备怎样参与。", tags: ["academic", "alternative"],
    choices: [
      option("join", "参与项目，把它做成一段可以证明研究和分析能力的经历", { analysis: 2, action: 2 }, "你参与了项目，也把自己的工作、方法和成果认真整理下来。这段研究经历逐渐成为简历里一项有分量的证据。", { effects: { time: -6, energy: -4, profile: 8, network: 3, confidence: 2 }, routes: { academic: 8 }, metrics: { careerMomentum: 6 }, nextTags: ["academic"] }),
      option("talk", "先和教授认真聊聊研究生活，再决定是否加入项目", { analysis: 3, exploration: 2 }, "你第一次认真了解论文、研究之外的真实日常，也开始思考自己会不会适合长期走这条路。", { effects: { time: -4, energy: -2, network: 4, confidence: 2 }, routes: { academic: 28 }, metrics: { alternativePath: 8 }, nextTags: ["academic"] }),
      option("decline", "最近的求职和其他事情已经占满时间，婉拒这次邀请", { pacing: 3, resilience: 1 }, "机会确实难得，但你知道自己现在没有足够的时间认真参与。教授理解你的决定，你也把精力留给了当前正在推进的事情。", { effects: { energy: 5, confidence: 1 }, metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "ra-invite", category: "profile", stages: ["interview", "closing"], baseWeight: 1.5,
    requirements: { minRoutes: { academic: 25 } }, title: "教授的研究团队邀请你继续做 RA", description: "继续留下可以积累研究成果，也会改变接下来几个月的时间安排。", tags: ["academic", "alternative"],
    choices: [
      option("continue", "答应，并认真评估研究生或 PhD 路线", { analysis: 3, reflection: 2 }, "你获得了更完整的研究训练，正式开启了学术路线的大门。", { effects: { time: -8, energy: -5, profile: 7, confidence: 5 }, routes: { academic: 50 }, metrics: { alternativePath: 15 }, flags: ["academicReady"] }),
      option("finish", "婉拒，完成手头的项目之后，把成果记在求职简历里", { expression: 2, pacing: 2 }, "你整理好研究成果，也更确定自己暂时想在业界工作。", { effects: { profile: 7, confidence: 3 }, routes: { academic: 10 } }),
    ],
  },
  {
    id: "gap-year-thought", category: "offer", stages: ["interview", "closing"], baseWeight: 1.2,
    requirements: { maxAttributes: { energy: 45 } }, title: "求职让你非常疲惫，Gap Year 的想法出现在脑海当中", description: "你开始认真考虑，是否要休息一年，用来恢复状态或探索新的可能性？", tags: ["travel", "alternative"],
    choices: [
      option("plan", "做好大致规划，认真思考 Gap Year 能为你带来什么", { pacing: 3, exploration: 2 }, "即使是暂停休息，你也想对自己负责。", { effects: { time: -3, energy: 7, confidence: 3 }, routes: { travel: 28 }, metrics: { alternativePath: 8, lifeSatisfaction: 8 }, nextTags: ["travel"] }),
      option("rest", "先休息几天，不急着做一年期的决定", { resilience: 2, pacing: 3 }, "睡眠时长和正常的生活节奏回来以后，你再次提振精神投入到求职当中。", { effects: { energy: 12, confidence: 3 }, routes: { travel: 8 }, metrics: { lifeSatisfaction: 7 } }),
    ],
  },
  {
    id: "cheap-flight", category: "offer", stages: ["closing"], baseWeight: 1.5,
    requirements: { minRoutes: { travel: 22 } }, title: "你刷到一张很难不让人心动的便宜机票", description: "在书桌前和电脑面面相觑太久，是时候出去走一走了。", tags: ["travel", "alternative"],
    choices: [
      option("book", "立刻订票，看看新的风景，呼吸新鲜的空气", { exploration: 4, pacing: 2 }, "虽然求职节奏中断，但你获得了新的视野、好的心情。在远方你看到了自己真正想要的人生。", { effects: { energy: 14, confidence: 5 }, routes: { travel: 55 }, metrics: { alternativePath: 18, lifeSatisfaction: 15 }, flags: ["travelReady"] }),
      option("save", "默默关闭购票页面，等求职流程结束再去旅行", { pacing: 2, analysis: 1 }, "继续处理眼前尚未结束的流程，那个旅行目的地会一直等待你的到来。", { effects: { confidence: 2 }, routes: { travel: 10 } }),
    ],
  },
  {
    id: "startup-friend-opening", category: "networking", stages: ["application", "interview"], baseWeight: 1.3,
    title: "招聘会上认识的人问：要不要加入我们的初创公司？", description: "团队小、变化快，职位名称不够标准，但你有很多机会接触真实问题、承担多种职责。", tags: ["startup-employee", "unexpected"],
    choices: [
      option("meet", "先见团队和老板，问清楚工作内容、公司长期愿景和现金流", { analysis: 2, exploration: 2, networking: 1 }, "你看到了一份和大公司完全不同的工作方式，又多了一条可以选择的路径。", { effects: { time: -5, network: 6, confidence: 3 }, routes: { startupEmployee: 35 }, metrics: { alternativePath: 7 }, nextTags: ["startup-employee"] }),
      option("join", "初创公司在做的事令你兴奋不已，虽然会承担一点风险，但你愿意加入", { exploration: 3, action: 2 }, "你决定进入一个边界虽然模糊、但成长速度很快的团队。", { effects: { time: -6, energy: -5, confidence: 6 }, routes: { startupEmployee: 65 }, metrics: { alternativePath: 14 }, flags: ["startupEmployeeReady"] }),
      option("decline", "风险有点大，也和你当前的求职计划不匹配，感谢后拒绝这个机会", { pacing: 2, analysis: 2 }, "你没有因为新鲜感仓促加入，对方也理解你的决定。", { effects: { confidence: 2, network: 2 } }),
    ],
  },
  {
    id: "stall-idea", category: "offer", stages: ["application", "interview"], baseWeight: 0.8,
    title: "周末没有面试，出去逛逛，你发现市集的一个摊位居然很赚钱", description: "这听起来不像职业规划，但你忍不住去想：如果自己尝试一次，会发生什么？", tags: ["stall", "alternative"],
    choices: [
      option("test", "找一个周末，做最低成本测试", { exploration: 4, action: 2 }, "你准备了很少的库存，把好奇心变成了一次真实实验。", { effects: { time: -6, energy: -5, confidence: 3 }, routes: { stall: 30 }, metrics: { alternativePath: 8 }, nextTags: ["stall"] }),
      option("laugh", "只把它当成一个有趣念头，还是继续求职吧", { resilience: 2, pacing: 1 }, "这个念头至少让你笑了一会儿，求职并不是世界上唯一的生活剧本。", { effects: { energy: 4 }, routes: { stall: 5 }, metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "first-stall-day", category: "offer", stages: ["interview", "closing"], baseWeight: 1.5,
    requirements: { minRoutes: { stall: 25 } }, title: "第一次摆摊，比想象中忙很多", description: "你要定价、招呼客人、补货，也第一次直接看到陌生人为你的东西付钱。", tags: ["stall", "alternative"],
    choices: [
      option("review", "记下销量和顾客问题，为下周的出摊做更好的准备", { reflection: 2, action: 2 }, "第二次出摊明显更有章法，它开始像你的一门小生意了。", { effects: { time: -6, energy: -5, confidence: 6, network: 3 }, routes: { stall: 38 }, metrics: { alternativePath: 12, careerMomentum: 3 } }),
      option("one-off", "体验一下已经足够，把它留作一段有趣经历，用在求职主线上", { pacing: 2, exploration: 1 }, "你收好剩余物料，也带走了真实的销售、运营和用户观察。", { effects: { profile: 5, confidence: 3 }, routes: { stall: 8 } }),
    ],
  },
  {
    id: "social-buyer", category: "offer", stages: ["closing"], baseWeight: 1.5,
    requirements: { minRoutes: { stall: 55 } }, title: "社交平台上有人问：摊位摆出的商品可以邮寄吗？", description: "线下小摊出现了线上订单。它可能只是好运，但你的确发现了新的商机。", tags: ["stall", "alternative"],
    choices: [
      option("open", "开放少量预订，先验证网店出售是否可行", { action: 2, analysis: 2 }, "订单不算多，却足以证明这条小路能够继续生长。", { effects: { time: -5, energy: -4, confidence: 7 }, routes: { stall: 40 }, metrics: { alternativePath: 15 }, flags: ["stallReady"] }),
      option("stop", "先不扩张线上业务，保留周末线下摆摊的快乐", { pacing: 3 }, "你没有让一次好成绩立刻变成新的 KPI。", { effects: { energy: 5 }, metrics: { lifeSatisfaction: 6 } }),
    ],
  },
  {
    id: "creator-essay", category: "profile", stages: ["application", "interview", "closing"], baseWeight: 0.55,
    requirements: { minTurn: 6, minCountersAny: { rejections: 1, interviews: 1, waitlists: 1, declinedOffers: 1 } },
    title: "你在社交平台上发布的一篇求职随笔意外火了", description: "经历几轮投递、等待或拒绝以后，你把这段时间的感受写了下来。原本只是给自己留个记录，发布后却意外被很多人转发和收藏。", tags: ["creator", "alternative"],
    choices: [
      option("read-comments", "看看评论区，发现很多人经历过差不多的事情，你和他们畅聊了一整晚", { expression: 3, networking: 2 }, "有人和你共情、有人和你志同道合。在交流中，你也认识了一些原本完全不会接触到的人，新的职业连接开始出现。", { effects: { time: -4, energy: -3, confidence: 4, network: 7 }, routes: { creator: 1, careerCreator: 1 }, metrics: { alternativePath: 2 }, nextTags: ["creator"] }),
      option("write-again", "趁还有感觉，再写一篇自己真正想说的", { expression: 4, action: 1 }, "你继续写下那些仍在发生的犹豫和选择。你发现内容创作带给了你很多收获与充实的感受。", { effects: { time: -5, energy: -4, confidence: 4 }, routes: { creator: 1, writingCreator: 1 }, metrics: { alternativePath: 7 }, nextTags: ["creator"] }),
      option("return-to-interview", "有人看已经挺意外了，还是继续准备下一轮面试吧", { pacing: 2, action: 2 }, "惊喜感带给你好心情，让你更好地把注意力放回即将到来的面试。", { effects: { time: -2, energy: 2 }, metrics: { careerMomentum: 4 } }),
    ],
  },
  {
    id: "creator-readers", category: "networking", stages: ["application", "interview", "closing"], baseWeight: 1.45,
    requirements: { minRoutes: { creator: 1 } },
    title: "再次打开社交平台，有人在等你这个“求职博主”的更新", description: "几天后，那篇随笔还在被转发。有人留言问“后来怎么样了？”大家感兴趣的不只是技巧，也包括一个普通人在这段过程里经历了什么。", tags: ["creator", "alternative"],
    choices: [
      option("keep-writing", "分享更完整的求职故事，你在“求职博主”的赛道上越走越远", { expression: 3, reflection: 2 }, "你更诚实地整理了自己的经历，也开始有人因为这些求职内容认识你。账号逐渐形成了明确主题和稳定读者。", { effects: { time: -5, energy: -4, confidence: 4, network: 6, profile: 3 }, routes: { creator: 1, careerCreator: 2 }, metrics: { careerMomentum: 3, alternativePath: 3 }, nextTags: ["creator"] }),
      option("broader-stories", "从求职出发，延伸出更多你对生活的感悟和思考，你开始喜欢上写作的感觉", { exploration: 3, expression: 3 }, "写作开始连接求职之外的生活。你第一次意识到，你的文字具有力量。", { effects: { time: -6, energy: -5, confidence: 3 }, routes: { creator: 1, writingCreator: 2 }, metrics: { lifeSatisfaction: 6, alternativePath: 9 }, nextTags: ["creator"] }),
      option("occasional", "偶尔写写就好，你的主要精力仍然留给求职本身", { pacing: 3 }, "你没有把一次意外流量立刻变成新的 KPI，写作和求职暂时维持着舒服的距离。", { effects: { time: -2, energy: 4 }, metrics: { careerMomentum: 3 } }),
    ],
  },
  {
    id: "creator-commission", category: "application", stages: ["interview", "closing"], baseWeight: 1.6,
    requirements: { minRoutes: { creator: 2 } },
    title: "社交平台的私信里，有编辑问你愿不愿意投稿", description: "一家媒体或内容平台看到了之前的文章，邀请你写一篇新稿。这是第一次有人明确愿意为你的文字提供正式发表机会。", tags: ["creator", "alternative"],
    choices: [
      option("accept-commission", "接下邀请，认真写一篇", { expression: 4, action: 2 }, "你完成了第一次正式投稿，收到稿费。自我记录逐渐走向了商业机会。", { effects: { time: -7, energy: -6, profile: 5, confidence: 7, network: 3 }, routes: { creator: 1, careerCreator: 2 }, metrics: { alternativePath: 8 }, flags: ["creatorPublished"], nextTags: ["creator"] }),
      option("keep-voice", "可以写，但我会保留自己的表达方式", { expression: 3, pacing: 2 }, null, {
        effects: { time: -6, energy: -5 }, probabilityRule: "editorial_voice",
        success: resolved("稿件顺利发表。你保留了真正想表达的内容，也第一次发现个人表达和正式发表并不一定冲突。", { confidence: 5 }, { routes: { creator: 1, writingCreator: 2 }, metrics: { lifeSatisfaction: 5, alternativePath: 8 }, flags: ["creatorPublished"] }),
        failure: resolved("你和编辑在内容方向上始终没有达成一致，这篇稿件最终没有发表。你有些失望，但继续经营自己的账号，也越来越清楚自己真正想写什么。", { confidence: -2 }, { routes: { creator: 1, writingCreator: 1 }, metrics: { lifeSatisfaction: 1, alternativePath: 4 } }),
      }),
      option("decline-commission", "最近面试太多，这次先不接下这个机会", { pacing: 3, analysis: 1 }, "你礼貌说明了情况，也保留了未来再合作的可能。当前求职流程没有因此失去节奏。", { effects: { energy: 4 }, metrics: { careerMomentum: 4 } }),
    ],
  },
  {
    id: "creator-crossroads", category: "offer", stages: ["closing"], baseWeight: 1.8,
    requirements: { minRoutes: { creator: 3 } },
    title: "写作开始变成你生活中重要的一部分", description: "后来，又有人向你约稿，你也开始有固定读者。原本只是为了消化求职情绪写下第一篇文章，现在你开始认真考虑：如果继续写下去，会发生什么？", tags: ["creator", "alternative"],
    choices: [
      option("try-creator-path", "给自己一段时间，认真试试内容创作", { exploration: 2, expression: 3, action: 2 }, null, {
        effects: { time: -5, energy: -4, confidence: 7 }, routes: { creator: 1 }, metrics: { alternativePath: 15 },
        conditionalOutcomes: [
          { when: { routeGreaterThan: ["careerCreator", "writingCreator"] }, outcome: resolved("你的账号已经有了稳定的主题和受众。你决定认真经营这份因为求职而意外开始的内容事业。", {}, { flags: ["careerCreatorReady"] }) },
          { outcome: resolved("你的文字早已慢慢走出求职这个主题。你决定给真正的内容创作一次正式尝试。", {}, { flags: ["creatorReady"] }) },
        ],
      }),
      option("keep-personal", "我更喜欢它作为生活的一部分，而不是事业", { pacing: 4, exploration: 1 }, "你保留了写作带来的快乐，没有要求它立刻证明商业价值。", { effects: { energy: 5 }, metrics: { lifeSatisfaction: 8 } }),
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
    title: "同学在朋友圈宣布拿到 Offer", description: "你真心替对方高兴，但焦虑不由得涌上心头。", tags: ["wellbeing"],
    choices: [
      option("congratulate", "认真祝贺，然后回到自己的节奏", { resilience: 3, pacing: 2 }, "别人的好消息没有抢走你的机会。你关掉群聊，继续做今天计划里的事。", { effects: { confidence: 3, energy: 2 }, metrics: { lifeSatisfaction: 5 } }),
      option("learn", "祝贺后问问流程里有哪些值得准备的地方", { networking: 2, reflection: 2 }, "同学分享了几条具体经验，你也没有把交流变成比较。", { effects: { network: 4, profile: 2, confidence: 2 }, metrics: { careerMomentum: 3 } }),
      option("compare", "默默打开招聘软件，焦虑地再投一批", { action: 3 }, "申请数增加了，今晚的精力却被比较感提前用完。", { effects: { time: -6, energy: -8, confidence: -4 }, counters: { applications: 3 }, metrics: { lifeSatisfaction: -7 } }),
    ],
  },
  {
    id: "unexpected-interview-question", category: "interview", stages: ["interview"], baseWeight: 1.7,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "面试官问了一个你完全没准备过的问题", description: "大脑短暂空白。你可以诚实思考，也可以根据即时反应快速作出回答。", tags: ["interview", "unexpected"],
    choices: [
      option("think", "承认需要想一下，再把思路一步步说出来", { resilience: 2, analysis: 2 }, "你没有立刻给出漂亮答案，却让面试官看见了真实的思考过程。", { effects: { confidence: 5 }, counters: { interviews: 1, offerLeads: 1 }, metrics: { careerMomentum: 5 } }),
      option("improvise", "快速开个头，边讲边让大脑飞速运转", { expression: 2, exploration: 2 }, null, {
        probabilityRule: "interview_improv",
        success: resolved("你的快速反应能力让你接住了这个问题。讲到一半时思路逐渐清晰，你顺利把陌生问题接回了自己的经验。", { confidence: 4, profile: 2 }, { counters: { interviews: 1, offerLeads: 1 }, metrics: { careerMomentum: 4 } }),
        failure: resolved("你开头说得很快，后面的思路却没有及时跟上。几次追问以后，答案越来越散，这一轮最终没能继续推进。", { confidence: -4 }, { counters: { interviews: 1, rejections: 1 }, metrics: { lifeSatisfaction: -2 }, failureTags: ["behavioral_interview"] }),
      }),
    ],
  },
  {
    id: "process-cancelled", category: "offer", stages: ["interview", "closing"], baseWeight: 1.2,
    requirements: { minCounters: { interviews: 1 } }, title: "流程走了一半，公司说岗位取消了", description: "不是你的表现出了问题，而是 HC、预算或团队安排改变了。但它就这样降临在你头上。", tags: ["rejection", "unexpected"],
    choices: [
      option("respond", "感谢通知，询问能否保留未来联系", { resilience: 3, networking: 1 }, "抓住每一次可用的机会，万一公司因此记住了你呢？", { effects: { confidence: -1, network: 3 }, counters: { rejections: 1 }, metrics: { lifeSatisfaction: -2 } }),
      option("pause", "默默消化这个结果，明天继续投递新的公司", { pacing: 3, resilience: 2 }, "你允许失望存在，也没有把公司的变化解释成自己的失败。", { effects: { energy: 7, confidence: 2 }, counters: { rejections: 1 }, metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "blank-saturday", category: "profile", stages: ["preparation", "application", "interview"], baseWeight: 1.5,
    title: "因为工作日的高效努力，你提前完成了 to-do list 里的全部事项。这周六你没有任何事情要做", description: "没有测试、没有面试、也没有必须今天投的岗位。这段空白要怎样使用？", tags: ["wellbeing", "reflection"],
    choices: [
      option("rest", "真正放松休息一天", { pacing: 4, resilience: 2 }, "你睡到自然醒、吃了顿美食、出门走了走。你感到自己焕然一新。", { effects: { energy: 15, confidence: 4 }, metrics: { lifeSatisfaction: 12 } }),
      option("review", "轻量复盘最近的流程", { reflection: 4, pacing: 2 }, "你在简历中找到两个能改的小问题，也准时关掉了文档。", { effects: { energy: 5, profile: 4, confidence: 3 }, metrics: { careerMomentum: 3, lifeSatisfaction: 5 } }),
      option("grind", "难得有空，把收藏夹里的岗位全部投完", { action: 4 }, "流程推进了一大截，但下一个休息日何时才会到来？", { effects: { time: -8, energy: -12 }, counters: { applications: 4, interviewLeads: 1 }, metrics: { careerMomentum: 4, lifeSatisfaction: -8 } }),
    ],
  },
];

export const RARE_EVENT_POOL = RARE_EVENTS.map((event) => ({ ...event, rarity: "rare" }));
