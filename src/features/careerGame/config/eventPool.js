const outcome = (id, message, effects = {}, counters = {}, extra = {}) => ({
  id, message, effects, counters, ...extra,
});

const choice = (id, label, behaviorEffects, options = {}) => ({
  id, label, behaviorEffects, intensity: "medium", ...options,
});

export const EVENT_POOL = [
  {
    id: "market-crossroads", category: "profile", stages: ["preparation"], baseWeight: 1,
    title: "地图刚刚展开", description: "你以应届生身份站在求职季的入口。第一站，你想先看哪种世界？",
    tags: ["direction"], cooldownTags: ["direction"],
    choices: [
      choice("tech", "看看大型科技公司和成熟团队", { analysis: 2, exploration: 1 }, { effects: { time: -4, confidence: 2 }, companyTypes: ["big_tech"] }),
      choice("startup", "去创业公司看看，工作边界也许更宽", { exploration: 3, action: 1 }, { effects: { time: -4, confidence: 1 }, companyTypes: ["startup"] }),
      choice("professional", "研究咨询、投行等专业服务路线", { analysis: 3, expression: 1 }, { effects: { time: -5, profile: 2 }, companyTypes: ["consulting", "investment_banking"] }),
      choice("graduate", "先从 Graduate Programme 的轮岗地图开始", { exploration: 1, pacing: 2 }, { effects: { time: -3, confidence: 2 }, companyTypes: ["graduate_program"] }),
    ],
  },
  {
    id: "resume-first-draft", category: "profile", stages: ["preparation"], baseWeight: 6,
    title: "简历还是一页空白", description: "截止日期还没追上来，但经历已经在脑子里挤成一团。",
    tags: ["resume", "profile"], cooldownTags: ["profile"], choices: [
      choice("ship", "先做出能投的第一版", { action: 3, resilience: 1 }, { effects: { time: -7, energy: -5, profile: 9 } }),
      choice("tailor", "先拆几份 JD，再决定怎样写", { analysis: 3, expression: 2 }, { effects: { time: -10, energy: -6, profile: 12 } }),
      choice("rest", "今天先整理素材，明天再排版", { pacing: 3, reflection: 1 }, { effects: { time: -4, energy: 3, profile: 5 } }),
    ],
  },
  {
    id: "linkedin-cleanup", category: "profile", stages: ["preparation", "application"], baseWeight: 4,
    title: "LinkedIn 还停在大一", description: "头像很精神，经历却像被时间按了暂停。",
    tags: ["linkedin", "profile"], cooldownTags: ["profile"], choices: [
      choice("rewrite", "把标题、About 和经历一次补齐", { expression: 3, action: 1 }, { effects: { time: -8, energy: -5, profile: 10 } }),
      choice("benchmark", "先看看目标岗位的人都怎么呈现", { analysis: 3, expression: 1 }, { effects: { time: -7, energy: -3, profile: 7 } }),
      choice("minimum", "只更新最关键的经历", { pacing: 2, action: 2 }, { effects: { time: -4, profile: 5 } }),
    ],
  },
  {
    id: "portfolio-weekend", category: "profile", stages: ["preparation", "application"], baseWeight: 3,
    title: "一个周末，做不做作品集？", description: "有些项目放不进一页简历，但作品集也会吞掉不少时间。",
    tags: ["portfolio", "profile"], cooldownTags: ["profile"], choices: [
      choice("build", "做一个轻量版本，先让项目能被看见", { expression: 3, action: 2 }, { effects: { time: -11, energy: -8, profile: 13 } }),
      choice("curate", "只整理最能说明能力的案例", { analysis: 2, expression: 2, pacing: 1 }, { effects: { time: -7, energy: -4, profile: 9 } }),
      choice("skip", "这条路线暂时不需要作品集", { pacing: 2, analysis: 1 }, { effects: { time: -2, energy: 2 } }),
    ],
  },
  {
    id: "mentor-review", category: "profile", stages: ["preparation", "application"], baseWeight: 4,
    title: "有人愿意帮你 Review", description: "对方很忙，只能给你一次认真反馈的机会。",
    tags: ["review", "profile"], cooldownTags: ["feedback"], choices: [
      choice("specific", "带着目标 JD 和具体问题去请教", { analysis: 2, reflection: 3, networking: 1 }, { effects: { time: -6, energy: -3, profile: 10, network: 4 } }),
      choice("open", "请对方说说第一眼最困惑的地方", { reflection: 3, expression: 1 }, { effects: { time: -5, profile: 8, confidence: 2 } }),
      choice("later", "先自己再改一版，不急着用掉机会", { pacing: 2, expression: 1 }, { effects: { time: -3, profile: 4 } }),
    ],
  },
  {
    id: "dream-job-deadline", category: "application", stages: ["application"], baseWeight: 7,
    title: "Dream Job 两天后截止", description: "匹配度不算完美，但你确实很想试试。",
    tags: ["deadline", "application"], cooldownTags: ["deadline"], choices: [
      choice("direct", "直接投，让机会先进入系统", { action: 4, resilience: 1 }, { effects: { time: -5, energy: -3 }, counters: { applications: 1 }, successModel: "profile_screen", success: outcome("screen", "速度没有妨碍你被看见，面试邀请来了。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("quiet", "暂时没有回音，但你保住了时间去看更多机会。", { confidence: -2 }, { rejections: 1 }) }),
      choice("tailor", "花时间定制 Resume 和 Cover Letter", { analysis: 3, expression: 3 }, { effects: { time: -12, energy: -8, profile: 4 }, counters: { applications: 1 }, probabilityBonus: 0.14, successModel: "profile_screen", success: outcome("screen", "你的材料和 JD 对上了频道。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("quiet", "投入没有立刻换来结果，但这版材料还能复用。", { confidence: -1, profile: 2 }, { rejections: 1 }) }),
      choice("referral", "先问问认识的人能否提供 Referral", { networking: 4, analysis: 1 }, { requirements: { minAttributes: { network: 20 } }, effects: { time: -8, energy: -5 }, successModel: "network_outreach", success: outcome("referred", "对方愿意帮忙，也提醒了你团队真正看重什么。", { confidence: 7, network: 5 }, { applications: 1, referrals: 1, interviewLeads: 1 }, { flags: ["referralPipeline"] }), failure: outcome("no-referral", "这次没有 Referral，但关系没有因此变成一次性工具。", { confidence: -1, network: 1 }) }),
      choice("pass", "先放过它，把资源留给更匹配的机会", { pacing: 3, reflection: 1 }, { effects: { time: -1, energy: 3 } }),
    ],
  },
  {
    id: "graduate-program-window", category: "application", stages: ["application"], baseWeight: 5,
    title: "Graduate Programme 窗口打开", description: "流程很长，但轮岗和训练听起来也有吸引力。",
    tags: ["graduate", "application"], cooldownTags: ["application"], choices: [
      choice("research", "先研究项目、轮岗和往届去向", { analysis: 4 }, { effects: { time: -8, energy: -3, profile: 3 }, counters: { applications: 1 }, probabilityBonus: 0.08, successModel: "profile_screen", success: outcome("oa", "研究帮助你写出了有内容的 Motivation。", { confidence: 4 }, { interviewLeads: 1 }), failure: outcome("reject", "流程没有继续，但你更清楚自己在找什么。", { confidence: -2 }, { rejections: 1 }) }),
      choice("apply", "先申请，再边走边了解", { action: 4, exploration: 1 }, { effects: { time: -5, energy: -4 }, counters: { applications: 1 }, successModel: "profile_screen", success: outcome("oa", "你拿到了下一轮在线测试。", { confidence: 4 }, { interviewLeads: 1 }), failure: outcome("reject", "系统发来一封很标准的邮件。", { confidence: -3 }, { rejections: 1 }) }),
      choice("skip", "它不符合我想要的工作方式", { pacing: 2, analysis: 2 }, { effects: { time: -2, confidence: 1 } }),
    ],
  },
  {
    id: "batch-application-night", category: "application", stages: ["application"], baseWeight: 6,
    title: "今晚适合批量投递吗？", description: "收藏夹里攒了一排岗位，截止日期正在安静靠近。",
    tags: ["batch", "application"], cooldownTags: ["batch"], choices: [
      choice("batch", "集中投一批，再统一记录", { action: 5, resilience: 1 }, { effects: { time: -10, energy: -10, confidence: 1 }, counters: { applications: 4, interviewLeads: 1 } }),
      choice("shortlist", "先筛选，再投最值得准备的几份", { analysis: 4, pacing: 1 }, { effects: { time: -9, energy: -6, profile: 2 }, counters: { applications: 2, interviewLeads: 1 } }),
      choice("recover", "今晚休息，明天带着脑子投", { pacing: 4, resilience: 2 }, { effects: { time: -4, energy: 11, confidence: 2 } }),
    ],
  },
  {
    id: "crowded-role", category: "application", stages: ["application"], baseWeight: 5,
    title: "岗位显示 1000+ 人申请", description: "数字很大，但它并没有告诉你其中有多少人真正匹配。",
    tags: ["competition", "application"], cooldownTags: ["competition"], choices: [
      choice("apply", "先投，1000+ 里面为什么不能有我", { action: 4, resilience: 2 }, { effects: { time: -5, energy: -3 }, counters: { applications: 1 }, successModel: "profile_screen", success: outcome("screen", "申请人数没有替招聘方做决定。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("reject", "这次没有进入流程，数字也没有定义你。", { confidence: -2 }, { rejections: 1 }) }),
      choice("fit", "研究一下岗位，我和它是否合适更重要", { analysis: 4, pacing: 1 }, { effects: { time: -7, energy: -3, profile: 3 }, counters: { applications: 1 }, probabilityBonus: 0.08, successModel: "profile_screen", success: outcome("screen", "你找到了真正匹配的证据。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("pass", "研究之后你决定把精力留给别处。", { confidence: 1 }) }),
      choice("move", "继续看刚开放的新机会", { exploration: 3, pacing: 2 }, { effects: { time: -2, energy: 2 } }),
    ],
  },
  {
    id: "alumni-reply", category: "networking", stages: ["preparation", "application"], baseWeight: 5,
    title: "校友回复了你的消息", description: "对方愿意聊二十分钟，但希望你先说清楚想了解什么。",
    tags: ["alumni", "networking"], cooldownTags: ["networking"], choices: [
      choice("prepare", "准备具体问题，聊岗位真实工作", { networking: 4, analysis: 2 }, { effects: { time: -6, energy: -3 }, successModel: "network_outreach", success: outcome("insight", "你得到了一些 JD 里没有写的信息。", { network: 10, confidence: 5, profile: 3 }, { referrals: 1 }), failure: outcome("brief", "聊天很短，但你练习了如何自然地开口。", { network: 4, confidence: 1 }) }),
      choice("ask-referral", "直接问有没有 Referral 机会", { networking: 4, action: 2 }, { effects: { time: -4, energy: -4 }, successModel: "network_outreach", success: outcome("referral", "时机刚好，对方愿意转交材料。", { network: 8, confidence: 6 }, { referrals: 1, interviewLeads: 1 }, { flags: ["referralPipeline"] }), failure: outcome("too-fast", "对方没有答应，但也礼貌说明了原因。", { confidence: -2, network: 1 }) }),
      choice("thank", "先感谢回复，等问题更明确再约", { pacing: 3, networking: 1 }, { effects: { time: -2, network: 3 } }),
    ],
  },
  {
    id: "career-fair", category: "networking", stages: ["preparation", "application"], baseWeight: 4,
    title: "Career Fair 人山人海", description: "每个摊位前都排着队，你只有有限的精力。",
    tags: ["career-fair", "networking"], cooldownTags: ["networking"], choices: [
      choice("target", "只去最相关的几家公司，认真聊", { analysis: 3, networking: 3 }, { effects: { time: -8, energy: -7, network: 9, confidence: 3 }, counters: { interviewLeads: 1 } }),
      choice("explore", "四处看看，也给陌生方向一个机会", { exploration: 4, networking: 2 }, { effects: { time: -9, energy: -8, network: 7, confidence: 4 }, flags: ["unexpectedTrack"] }),
      choice("online", "保存体力，回去查官网和岗位", { pacing: 3, analysis: 2 }, { effects: { time: -5, energy: 5, profile: 2 } }),
    ],
  },
  {
    id: "coffee-chat-reply", category: "networking", stages: ["application"], baseWeight: 5,
    title: "Coffee Chat 邀请终于被接受", description: "这不是面试，也不是索取面经的快问快答。",
    tags: ["coffee-chat", "networking"], cooldownTags: ["networking"], choices: [
      choice("curious", "聊职业路径、团队挑战和新人表现", { networking: 4, exploration: 2, analysis: 1 }, { effects: { time: -7, energy: -4, network: 10, confidence: 4 } }),
      choice("pitch", "也简洁介绍自己为什么关注这个方向", { expression: 3, networking: 3 }, { effects: { time: -7, energy: -5, network: 8, profile: 3 }, counters: { interviewLeads: 1 } }),
      choice("cancel", "状态不好，礼貌改约", { pacing: 4, resilience: 1 }, { effects: { time: -3, energy: 7, network: 1 } }),
    ],
  },
  {
    id: "oa-invitation", category: "application", stages: ["application", "interview"], baseWeight: 7,
    requirements: { minCounters: { applications: 1 } }, title: "在线测试邀请抵达", description: "限时题、能力测试和情境判断一起出现在邮件里。",
    tags: ["assessment", "deadline"], cooldownTags: ["assessment"], choices: [
      choice("practice", "先确认题型，做几道样题热身", { analysis: 3, reflection: 2 }, { effects: { time: -8, energy: -5 }, probabilityBonus: 0.12, successModel: "profile_screen", success: outcome("pass", "准备让你更熟悉节奏，下一轮见。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("fail", "题型熟悉了，结果却没有过线。", { confidence: -3 }, { rejections: 1 }, { failureTags: ["online_test"] }) }),
      choice("start", "直接开始，相信临场状态", { action: 4, resilience: 1 }, { effects: { time: -5, energy: -6 }, successModel: "profile_screen", success: outcome("pass", "临场判断帮你通过了这一关。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("fail", "这套题没有站在你这边。", { confidence: -4 }, { rejections: 1 }, { failureTags: ["online_test"] }) }),
      choice("withdraw", "这条流程投入过高，主动退出", { pacing: 4, analysis: 1 }, { effects: { time: -1, energy: 3, confidence: 1 } }),
    ],
  },
  {
    id: "hr-screening", category: "interview", stages: ["interview"], baseWeight: 8,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "HR Screening Call", description: "对方想快速了解动机、经历和基本期望。",
    tags: ["hr", "interview"], cooldownTags: ["interview"], choices: [
      choice("prepare", "准备自我介绍、Motivation 和关键经历", { expression: 4, analysis: 1 }, { effects: { time: -8, energy: -5 }, successModel: "general_interview", success: outcome("pass", "回答清楚，也留下了继续了解的空间。", { confidence: 7 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "对话没有推进，但暴露了动机表达的卡点。", { confidence: -4 }, { interviews: 1, rejections: 1 }, { failureTags: ["hr_interview"] }) }),
      choice("natural", "保持自然，把它当作双向了解", { exploration: 2, resilience: 2, expression: 1 }, { effects: { time: -5, energy: -4 }, successModel: "general_interview", success: outcome("pass", "交流感让双方都更快判断了匹配度。", { confidence: 6 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "彼此没有对上频道，这也是筛选的一部分。", { confidence: -2 }, { interviews: 1, rejections: 1 }) }),
      choice("reschedule", "今天状态太差，礼貌申请改期", { pacing: 4, resilience: 1 }, { effects: { time: -4, energy: 8, confidence: 1 } }),
    ],
  },
  {
    id: "technical-interview", category: "interview", stages: ["interview"], baseWeight: 7,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "Technical Interview", description: "题目不只考答案，也在看你如何拆解未知问题。",
    tags: ["technical", "interview"], cooldownTags: ["interview"], choices: [
      choice("drill", "集中练高频题，并复述思路", { reflection: 3, action: 2 }, { effects: { time: -10, energy: -8, profile: 4 }, probabilityBonus: 0.12, successModel: "technical_interview", success: outcome("pass", "练习让你把思路说了出来。", { confidence: 8 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "有些知识点没接住，但卡点已经很具体。", { confidence: -5 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
      choice("fundamentals", "回到基础概念，确保自己真的理解", { analysis: 2, reflection: 3, pacing: 1 }, { effects: { time: -9, energy: -6, profile: 5 }, successModel: "technical_interview", success: outcome("pass", "基础让你在变形题里没有迷路。", { confidence: 7 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "理解更扎实了，速度仍需要下一轮练习。", { confidence: -3, profile: 2 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
      choice("wing", "先去见识一下真实题目", { exploration: 3, resilience: 2 }, { effects: { time: -5, energy: -7 }, successModel: "technical_interview", success: outcome("pass", "你在陌生题里保持住了思考。", { confidence: 9 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "这次像一场付费为零的真实模考。", { confidence: -5 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
    ],
  },
  {
    id: "behavioral-interview", category: "interview", stages: ["interview"], baseWeight: 7,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "Behavioral Interview", description: "“请讲一次失败。”你的脑内故事库开始翻页。",
    tags: ["behavioral", "interview"], cooldownTags: ["interview"], choices: [
      choice("stories", "整理几段真实故事和反思", { expression: 3, reflection: 3 }, { effects: { time: -8, energy: -5 }, probabilityBonus: 0.1, successModel: "general_interview", success: outcome("pass", "故事有细节，也能看见你怎样成长。", { confidence: 7, profile: 2 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "故事很多，主线却有点散。", { confidence: -3 }, { interviews: 1, rejections: 1 }, { failureTags: ["behavioral_interview"] }) }),
      choice("match", "围绕岗位能力挑最匹配的故事", { analysis: 3, expression: 3 }, { effects: { time: -9, energy: -6 }, successModel: "general_interview", success: outcome("pass", "你的证据和岗位要求连了起来。", { confidence: 7 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "逻辑很完整，但真实感还可以更多一点。", { confidence: -2 }, { interviews: 1, rejections: 1 }) }),
      choice("honest", "选择最真实的一次，现场组织", { resilience: 3, exploration: 1 }, { effects: { time: -5, energy: -5 }, successModel: "general_interview", success: outcome("pass", "真诚和清晰同时出现了。", { confidence: 8 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "真实故事也需要结构，这次留下了练习方向。", { confidence: -3 }, { interviews: 1, rejections: 1 }) }),
    ],
  },
  {
    id: "group-interview", category: "interview", stages: ["interview"], baseWeight: 5,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "Group Interview", description: "同组的人都很会说，真正的任务是一起把问题推进。",
    tags: ["group", "interview"], cooldownTags: ["interview"], choices: [
      choice("facilitate", "梳理讨论、邀请他人，也贡献观点", { networking: 3, analysis: 2, expression: 1 }, { effects: { time: -7, energy: -7 }, successModel: "group_interview", success: outcome("pass", "你让团队更像团队，而不只是轮流发言。", { confidence: 8, network: 3 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "节奏很乱，但你看见了群面不是抢麦比赛。", { confidence: -3 }, { interviews: 1, rejections: 1 }, { failureTags: ["group_interview"] }) }),
      choice("lead", "主动提出框架，推动大家做决定", { action: 3, expression: 2 }, { effects: { time: -6, energy: -8 }, successModel: "group_interview", success: outcome("pass", "你的框架帮助讨论落地。", { confidence: 8 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "推进很快，团队共识却没有跟上。", { confidence: -4 }, { interviews: 1, rejections: 1 }) }),
      choice("observe", "先观察角色缺口，再补位", { analysis: 3, pacing: 2 }, { effects: { time: -6, energy: -5 }, successModel: "group_interview", success: outcome("pass", "你在关键时刻补上了团队需要的角色。", { confidence: 6 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "观察太久，贡献没有被充分看见。", { confidence: -3 }, { interviews: 1, rejections: 1 }) }),
    ],
  },
  {
    id: "final-round", category: "interview", stages: ["interview", "decision"], baseWeight: 8,
    requirements: { minCounters: { offerLeads: 1 } }, title: "Final Round", description: "走到这里已经说明了很多。最后一轮仍然是双向判断。",
    tags: ["final", "interview"], cooldownTags: ["final"], choices: [
      choice("deep", "研究团队挑战，准备更深入的对话", { analysis: 3, expression: 2 }, { effects: { time: -8, energy: -6 }, probabilityBonus: 0.1, successModel: "offer_decision", success: outcome("offer", "你拿到了 Offer。", { confidence: 12 }, { interviews: 1, offers: 1 }), failure: outcome("wait", "流程进入等待区，结果尚未落地。", { confidence: -2 }, { interviews: 1 }) }),
      choice("authentic", "把重点放在真实动机和相互匹配", { exploration: 2, resilience: 2, expression: 1 }, { effects: { time: -6, energy: -5 }, successModel: "offer_decision", success: outcome("dream", "这次匹配感是双向的：Dream Offer 到手。", { confidence: 15 }, { interviews: 1, offers: 1 }, { flags: ["dreamOffer"] }), failure: outcome("wait", "没有立即结果，但你没有把自己演成另一个人。", { confidence: -1 }, { interviews: 1 }) }),
      choice("protect", "状态优先，准备到够用就停下", { pacing: 4, resilience: 2 }, { effects: { time: -4, energy: 4 }, successModel: "offer_decision", success: outcome("offer", "稳定发挥为你带来一份 Offer。", { confidence: 10 }, { interviews: 1, offers: 1 }), failure: outcome("close", "这次停在终点前，但你保住了继续前进的能量。", { confidence: -2 }, { interviews: 1, rejections: 1 }) }),
    ],
  },
  {
    id: "rejection-wave", category: "offer", stages: ["decision"], baseWeight: 7,
    title: "拒信突然组团抵达", description: "邮件像商量好了一样挤在同一天，但它们来自不同流程和不同原因。",
    tags: ["rejection", "decision"], cooldownTags: ["rejection"], choices: [
      choice("review", "复盘能控制的部分，再调整下一轮", { reflection: 5, resilience: 2 }, { effects: { time: -6, energy: -3, confidence: -2, profile: 3 }, counters: { rejections: 2 } }),
      choice("apply", "先投几个新机会，让流程继续流动", { action: 5, resilience: 2 }, { effects: { time: -7, energy: -6, confidence: -1 }, counters: { applications: 3, interviewLeads: 1, rejections: 2 } }),
      choice("pause", "允许自己难过一下，今天不做决定", { pacing: 5, resilience: 3 }, { effects: { time: -5, energy: 10, confidence: 3 }, counters: { rejections: 2 } }),
    ],
  },
  {
    id: "waitlist", category: "offer", stages: ["decision"], baseWeight: 5,
    title: "你进入了 Waitlist", description: "不是拒绝，也不是确定，最消耗人的往往是悬而未决。",
    tags: ["waitlist", "decision"], cooldownTags: ["decision"], choices: [
      choice("follow", "礼貌确认时间线，同时表达持续兴趣", { expression: 2, pacing: 2, action: 1 }, { effects: { time: -4, energy: -2 }, successModel: "offer_decision", success: outcome("offer", "一个清晰的 follow-up 让流程重新动了起来。", { confidence: 10 }, { offers: 1 }), failure: outcome("wait", "对方仍需要时间，你继续保留其他选择。", { confidence: -1 }) }),
      choice("continue", "继续申请，不让一个结果暂停全部生活", { action: 3, resilience: 3 }, { effects: { time: -6, energy: -4, confidence: 2 }, counters: { applications: 2, interviewLeads: 1 } }),
      choice("detach", "把它放回不确定区，先照顾状态", { pacing: 4, resilience: 2 }, { effects: { time: -3, energy: 7, confidence: 3 } }),
    ],
  },
  {
    id: "ordinary-offer", category: "offer", stages: ["decision"], baseWeight: 6,
    requirements: { minCounters: { offerLeads: 1 } }, title: "一份并不完美的 Offer", description: "它解决了部分现实问题，也留下了一些你需要认真核实的问号。",
    tags: ["offer", "decision"], cooldownTags: ["offer"], choices: [
      choice("accept", "核实条件后接受，把它当作一个入口", { pacing: 2, action: 2 }, { effects: { time: -4, confidence: 12, energy: 4 }, counters: { offers: 1 } }),
      choice("compare", "继续比较成长、团队、地点和生活方式", { analysis: 4, pacing: 1 }, { effects: { time: -6, energy: -3, confidence: 5 }, counters: { offers: 1 } }),
      choice("decline", "它与想要的生活差距太大，继续寻找", { exploration: 3, resilience: 3 }, { effects: { time: -4, confidence: 2 }, flags: ["declinedOffer"] }),
    ],
  },
  {
    id: "referral-conclusion", category: "offer", stages: ["decision"], baseWeight: 7,
    requirements: { flagsAny: ["referralPipeline"] }, title: "Referral 推进到了最后", description: "关系帮你被看见，后面的表现仍然属于你自己。",
    tags: ["referral", "offer"], cooldownTags: ["offer"], choices: [
      choice("finish", "认真完成最后沟通，也感谢帮助过你的人", { networking: 3, expression: 2, resilience: 1 }, { effects: { time: -6, energy: -4 }, probabilityBonus: 0.12, successModel: "offer_decision", success: outcome("offer", "Referral 打开门，你自己走完了后面的路。", { confidence: 14, network: 6 }, { offers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "没有拿到 Offer，但这段关系不必随流程一起结束。", { confidence: -2, network: 3 }, { rejections: 1 }) }),
      choice("pressure", "担心辜负推荐，拼命加码准备", { expression: 2, action: 3 }, { effects: { time: -9, energy: -12 }, probabilityBonus: 0.08, successModel: "offer_decision", success: outcome("offer", "高投入换来一份 Offer，也消耗了不少能量。", { confidence: 12 }, { offers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "推荐并不等于承诺，你无需替结果道歉。", { confidence: -5 }, { rejections: 1 }) }),
      choice("steady", "按自己的节奏完成，不把人情变成压力", { pacing: 4, resilience: 2 }, { effects: { time: -5, energy: -3 }, successModel: "offer_decision", success: outcome("offer", "稳定发挥让这次连接结出了果实。", { confidence: 13 }, { offers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "结果没有落地，但你守住了关系和自己。", { confidence: -1, network: 2 }) }),
    ],
  },
  {
    id: "surprise-track", category: "offer", stages: ["decision"], baseWeight: 6,
    requirements: { flagsAny: ["unexpectedTrack"] }, title: "意外方向发来消息", description: "它不是起初的目标，却和你在意的工作方式意外合拍。",
    tags: ["unexpected", "offer"], cooldownTags: ["offer"], choices: [
      choice("explore", "认真聊完再判断，不急着用旧地图否定它", { exploration: 5, analysis: 1 }, { effects: { time: -6, energy: -4 }, successModel: "offer_decision", success: outcome("offer", "你从支线走到了一个没有预设过的终点。", { confidence: 13 }, { offers: 1 }, { flags: ["unexpectedOffer"] }), failure: outcome("insight", "没有成为 Offer，却扩展了你理解机会的方式。", { confidence: 2 }) }),
      choice("focus", "仍然专注原方向，减少分散", { analysis: 2, pacing: 3 }, { effects: { time: -2, energy: 3, confidence: 1 } }),
    ],
  },
];
