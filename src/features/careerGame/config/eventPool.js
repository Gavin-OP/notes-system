const outcome = (id, message, effects = {}, counters = {}, extra = {}) => ({
  id, message, effects, counters, ...extra,
});

const choice = (id, label, behaviorEffects, options = {}) => ({
  id, label, behaviorEffects, intensity: "medium", ...options,
});

export const EVENT_POOL = [
  {
    id: "market-crossroads", category: "profile", stages: ["preparation"], baseWeight: 1,
    title: "地图加载完毕，先从哪里起步？", description: "你以应届生身份进入求职季。还不用决定一辈子，只需要挑一个当下最值得推进的动作。",
    tags: ["direction"], cooldownTags: ["direction"],
    choices: [
      choice("research", "先研究几份 JD，看看市场到底在找谁", { analysis: 2, exploration: 1 }, { effects: { time: -4, confidence: 2 } }),
      choice("apply", "先投一份感兴趣的岗位，用行动换信息", { exploration: 2, action: 2 }, { effects: { time: -4, confidence: 1 } }),
      choice("profile", "先整理经历，把简历和 Profile 做到能见人", { analysis: 1, expression: 3 }, { effects: { time: -5, profile: 2 } }),
      choice("pace", "先排一下节奏，别让求职吞掉全部生活", { exploration: 1, pacing: 3 }, { effects: { time: -3, confidence: 2 } }),
    ],
  },
  {
    id: "resume-first-draft", category: "profile", stages: ["preparation"], baseWeight: 6,
    title: "简历文档已新建，光标正在闪", description: "经历全在脑子里，只是暂时拒绝排队。你准备怎样做出第一版？",
    tags: ["resume", "profile"], cooldownTags: ["profile"], choices: [
      choice("ship", "先写出能投的 V1，告别空白页", { action: 3, resilience: 1 }, { effects: { time: -7, energy: -5, profile: 9 } }),
      choice("tailor", "先拆几份 JD，再决定重点写什么", { analysis: 3, expression: 2 }, { effects: { time: -10, energy: -6, profile: 12 } }),
      choice("rest", "今天只整理素材，排版留给明天的我", { pacing: 3, reflection: 1 }, { effects: { time: -4, energy: 3, profile: 5 } }),
    ],
  },
  {
    id: "linkedin-cleanup", category: "profile", stages: ["preparation", "application"], baseWeight: 4,
    title: "LinkedIn 还停留在大一", description: "头像依然精神，经历却像被按了暂停。招聘方点进来之前，要不要抢救一下？",
    tags: ["linkedin", "profile"], cooldownTags: ["profile"], choices: [
      choice("rewrite", "标题、About、经历，一次更新到现在", { expression: 3, action: 1 }, { effects: { time: -8, energy: -5, profile: 10 } }),
      choice("benchmark", "先看看目标岗位的人如何介绍自己", { analysis: 3, expression: 1 }, { effects: { time: -7, energy: -3, profile: 7 } }),
      choice("minimum", "先更新最关键的部分，谢绝大装修", { pacing: 2, action: 2 }, { effects: { time: -4, profile: 5 } }),
    ],
  },
  {
    id: "portfolio-weekend", category: "profile", stages: ["preparation", "application"], baseWeight: 3,
    title: "周末限定任务：做不做作品集？", description: "有些项目塞不进一页简历，但作品集也很擅长吞时间。",
    tags: ["portfolio", "profile"], cooldownTags: ["profile"], choices: [
      choice("build", "做个轻量版，先让好项目被看见", { expression: 3, action: 2 }, { effects: { time: -11, energy: -8, profile: 13 } }),
      choice("curate", "只整理最能说明能力的几个案例", { analysis: 2, expression: 2, pacing: 1 }, { effects: { time: -7, energy: -4, profile: 9 } }),
      choice("skip", "当前路线用不上，先把周末还给自己", { pacing: 2, analysis: 1 }, { effects: { time: -2, energy: 2 } }),
    ],
  },
  {
    id: "mentor-review", category: "profile", stages: ["preparation", "application"], baseWeight: 4,
    title: "你获得了一次真人 Review", description: "对方愿意认真看一遍，但时间有限。怎样把这次反馈用在刀刃上？",
    tags: ["review", "profile"], cooldownTags: ["feedback"], choices: [
      choice("specific", "带上目标 JD 和几个具体问题", { analysis: 2, reflection: 3, networking: 1 }, { effects: { time: -6, energy: -3, profile: 10, network: 4 } }),
      choice("open", "请对方指出第一眼最看不懂的地方", { reflection: 3, expression: 1 }, { effects: { time: -5, profile: 8, confidence: 2 } }),
      choice("later", "先自己再改一版，晚点使用这张反馈券", { pacing: 2, expression: 1 }, { effects: { time: -3, profile: 4 } }),
    ],
  },
  {
    id: "dream-job-deadline", category: "application", stages: ["application"], baseWeight: 7,
    title: "Dream Job 倒计时：两天", description: "匹配度没有满格，但心动值已经满了。你打算怎样送出这份申请？",
    tags: ["deadline", "application"], cooldownTags: ["deadline"], choices: [
      choice("direct", "先投出去，别让截止日期赢了", { action: 4, resilience: 1 }, { effects: { time: -5, energy: -3 }, counters: { applications: 1 }, successModel: "profile_screen", success: outcome("screen", "速度没有妨碍你被看见，面试邀请来了。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("quiet", "暂时没有回音，但你保住了时间去看更多机会。", { confidence: -2 }, { rejections: 1 }) }),
      choice("tailor", "认真定制 Resume 和 Cover Letter", { analysis: 3, expression: 3 }, { effects: { time: -12, energy: -8, profile: 4 }, counters: { applications: 1 }, probabilityBonus: 0.14, successModel: "profile_screen", success: outcome("screen", "你的材料和 JD 对上了频道。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("quiet", "投入没有立刻换来结果，但这版材料还能复用。", { confidence: -1, profile: 2 }, { rejections: 1 }) }),
      choice("referral", "先问问认识的人，能否帮忙 Referral", { networking: 4, analysis: 1 }, { requirements: { minAttributes: { network: 20 } }, effects: { time: -8, energy: -5 }, successModel: "network_outreach", success: outcome("referred", "对方愿意帮忙，也提醒了你团队真正看重什么。", { confidence: 7, network: 5 }, { applications: 1, referrals: 1, interviewLeads: 1 }, { flags: ["referralPipeline"] }), failure: outcome("no-referral", "这次没有 Referral，但关系没有因此变成一次性工具。", { confidence: -1, network: 1 }) }),
      choice("pass", "这次不追，把资源留给更匹配的机会", { pacing: 3, reflection: 1 }, { effects: { time: -1, energy: 3 } }),
    ],
  },
  {
    id: "graduate-program-window", category: "application", stages: ["application"], baseWeight: 5,
    title: "Graduate Programme 开放申请", description: "流程很长，轮岗和训练却也很香。先研究，还是先占一个候选席位？",
    tags: ["graduate", "application"], cooldownTags: ["application"], choices: [
      choice("research", "先看清轮岗、培养方式和往届去向", { analysis: 4 }, { effects: { time: -8, energy: -3, profile: 3 }, counters: { applications: 1 }, probabilityBonus: 0.08, successModel: "profile_screen", success: outcome("oa", "研究帮助你写出了有内容的 Motivation。", { confidence: 4 }, { interviewLeads: 1 }), failure: outcome("reject", "流程没有继续，但你更清楚自己在找什么。", { confidence: -2 }, { rejections: 1 }) }),
      choice("apply", "先申请，项目细节可以边走边了解", { action: 4, exploration: 1 }, { effects: { time: -5, energy: -4 }, counters: { applications: 1 }, successModel: "profile_screen", success: outcome("oa", "你拿到了下一轮在线测试。", { confidence: 4 }, { interviewLeads: 1 }), failure: outcome("reject", "系统发来一封很标准的邮件。", { confidence: -3 }, { rejections: 1 }) }),
      choice("skip", "工作方式不太适合我，礼貌路过", { pacing: 2, analysis: 2 }, { effects: { time: -2, confidence: 1 } }),
    ],
  },
  {
    id: "batch-application-night", category: "application", stages: ["application"], baseWeight: 6,
    title: "收藏夹满了，今晚清仓吗？", description: "岗位已经攒成一排，截止日期正在悄悄靠近。",
    tags: ["batch", "application"], cooldownTags: ["batch"], choices: [
      choice("batch", "集中投一批，最后统一登记", { action: 5, resilience: 1 }, { effects: { time: -10, energy: -10, confidence: 1 }, counters: { applications: 4, interviewLeads: 1 } }),
      choice("shortlist", "再筛一轮，只投最值得准备的", { analysis: 4, pacing: 1 }, { effects: { time: -9, energy: -6, profile: 2 }, counters: { applications: 2, interviewLeads: 1 } }),
      choice("recover", "关掉网页，明天带着清醒的大脑再投", { pacing: 4, resilience: 2 }, { effects: { time: -4, energy: 11, confidence: 2 } }),
    ],
  },
  {
    id: "crowded-role", category: "application", stages: ["application"], baseWeight: 5,
    title: "这个岗位已经有 1000+ 人申请", description: "数字确实很大，但它没告诉你其中多少人合适，也没说你不能成为其中之一。",
    tags: ["competition", "application"], cooldownTags: ["competition"], choices: [
      choice("apply", "先投。1000+ 里面为什么不能有我", { action: 4, resilience: 2 }, { effects: { time: -5, energy: -3 }, counters: { applications: 1 }, successModel: "profile_screen", success: outcome("screen", "申请人数没有替招聘方做决定。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("reject", "这次没有进入流程，数字也没有定义你。", { confidence: -2 }, { rejections: 1 }) }),
      choice("fit", "先判断匹配度，再决定值不值得投入", { analysis: 4, pacing: 1 }, { effects: { time: -7, energy: -3, profile: 3 }, counters: { applications: 1 }, probabilityBonus: 0.08, successModel: "profile_screen", success: outcome("screen", "你找到了真正匹配的证据。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("pass", "研究之后你决定把精力留给别处。", { confidence: 1 }) }),
      choice("move", "继续刷新刚开放、竞争更少的机会", { exploration: 3, pacing: 2 }, { effects: { time: -2, energy: 2 } }),
    ],
  },
  {
    id: "alumni-reply", category: "networking", stages: ["preparation", "application"], baseWeight: 5,
    title: "叮——校友回复了你的消息", description: "对方愿意聊二十分钟。怎样让这次交流不变成一场突击索取？",
    tags: ["alumni", "networking"], cooldownTags: ["networking"], choices: [
      choice("prepare", "准备具体问题，聊聊岗位的真实日常", { networking: 4, analysis: 2 }, { effects: { time: -6, energy: -3 }, successModel: "network_outreach", success: outcome("insight", "你得到了一些 JD 里没有写的信息。", { network: 10, confidence: 5, profile: 3 }, { referrals: 1 }), failure: outcome("brief", "聊天很短，但你练习了如何自然地开口。", { network: 4, confidence: 1 }) }),
      choice("ask-referral", "开门见山，问问有没有 Referral 机会", { networking: 4, action: 2 }, { effects: { time: -4, energy: -4 }, successModel: "network_outreach", success: outcome("referral", "时机刚好，对方愿意转交材料。", { network: 8, confidence: 6 }, { referrals: 1, interviewLeads: 1 }, { flags: ["referralPipeline"] }), failure: outcome("too-fast", "对方没有答应，但也礼貌说明了原因。", { confidence: -2, network: 1 }) }),
      choice("thank", "先感谢回复，想清楚问题后再约", { pacing: 3, networking: 1 }, { effects: { time: -2, network: 3 } }),
    ],
  },
  {
    id: "career-fair", category: "networking", stages: ["preparation", "application"], baseWeight: 4,
    title: "Career Fair 已进入人山人海模式", description: "每个摊位都在排队，而你的社交电量并不是无限的。",
    tags: ["career-fair", "networking"], cooldownTags: ["networking"], choices: [
      choice("target", "锁定几家公司，排到了就认真聊", { analysis: 3, networking: 3 }, { effects: { time: -8, energy: -7, network: 9, confidence: 3 }, counters: { interviewLeads: 1 } }),
      choice("explore", "随便走走，也给陌生方向一个机会", { exploration: 4, networking: 2 }, { effects: { time: -9, energy: -8, network: 7, confidence: 4 }, flags: ["unexpectedTrack"] }),
      choice("online", "保住社交电量，回去查官网和岗位", { pacing: 3, analysis: 2 }, { effects: { time: -5, energy: 5, profile: 2 } }),
    ],
  },
  {
    id: "coffee-chat-reply", category: "networking", stages: ["application"], baseWeight: 5,
    title: "Coffee Chat 邀请终于被接受", description: "这不是面试，也不是“面经拿来”的限时挑战。你想怎样聊？",
    tags: ["coffee-chat", "networking"], cooldownTags: ["networking"], choices: [
      choice("curious", "聊职业路径、团队挑战和新人日常", { networking: 4, exploration: 2, analysis: 1 }, { effects: { time: -7, energy: -4, network: 10, confidence: 4 } }),
      choice("pitch", "也说说自己为什么对这个方向感兴趣", { expression: 3, networking: 3 }, { effects: { time: -7, energy: -5, network: 8, profile: 3 }, counters: { interviewLeads: 1 } }),
      choice("cancel", "今天状态掉线，礼貌申请改约", { pacing: 4, resilience: 1 }, { effects: { time: -3, energy: 7, network: 1 } }),
    ],
  },
  {
    id: "oa-invitation", category: "application", stages: ["application", "interview"], baseWeight: 7,
    requirements: { minCounters: { applications: 1 } }, title: "在线测试邀请抵达邮箱", description: "限时题、能力测试和情境判断组团出现。距离截止还有一点时间。",
    tags: ["assessment", "deadline"], cooldownTags: ["assessment"], choices: [
      choice("practice", "先查题型，找几道样题热热手", { analysis: 3, reflection: 2 }, { effects: { time: -8, energy: -5 }, probabilityBonus: 0.12, successModel: "profile_screen", success: outcome("pass", "准备让你更熟悉节奏，下一轮见。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("fail", "题型熟悉了，结果却没有过线。", { confidence: -3 }, { rejections: 1 }, { failureTags: ["online_test"] }) }),
      choice("start", "现在就做，相信第一反应和临场状态", { action: 4, resilience: 1 }, { effects: { time: -5, energy: -6 }, successModel: "profile_screen", success: outcome("pass", "临场判断帮你通过了这一关。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("fail", "这套题没有站在你这边。", { confidence: -4 }, { rejections: 1 }, { failureTags: ["online_test"] }) }),
      choice("withdraw", "投入太高，这条流程就走到这里", { pacing: 4, analysis: 1 }, { effects: { time: -1, energy: 3, confidence: 1 } }),
    ],
  },
  {
    id: "hr-screening", category: "interview", stages: ["interview"], baseWeight: 8,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "HR Screening Call 来电", description: "对方想快速了解动机、经历和基本期望。目标是说清楚，不是背完整本自传。",
    tags: ["hr", "interview"], cooldownTags: ["interview"], choices: [
      choice("prepare", "准备短版自我介绍、动机和关键经历", { expression: 4, analysis: 1 }, { effects: { time: -8, energy: -5 }, successModel: "general_interview", success: outcome("pass", "回答清楚，也留下了继续了解的空间。", { confidence: 7 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "对话没有推进，但暴露了动机表达的卡点。", { confidence: -4 }, { interviews: 1, rejections: 1 }, { failureTags: ["hr_interview"] }) }),
      choice("natural", "放松一点，把它当作双向了解", { exploration: 2, resilience: 2, expression: 1 }, { effects: { time: -5, energy: -4 }, successModel: "general_interview", success: outcome("pass", "交流感让双方都更快判断了匹配度。", { confidence: 6 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "彼此没有对上频道，这也是筛选的一部分。", { confidence: -2 }, { interviews: 1, rejections: 1 }) }),
      choice("reschedule", "今天确实不在线，礼貌申请改期", { pacing: 4, resilience: 1 }, { effects: { time: -4, energy: 8, confidence: 1 } }),
    ],
  },
  {
    id: "technical-interview", category: "interview", stages: ["interview"], baseWeight: 7,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "Technical Interview 已刷新", description: "题目不只看最终答案，也会观察你怎样拆解陌生问题。",
    tags: ["technical", "interview"], cooldownTags: ["interview"], choices: [
      choice("drill", "刷高频题，也练习把思路说出来", { reflection: 3, action: 2 }, { effects: { time: -10, energy: -8, profile: 4 }, probabilityBonus: 0.12, successModel: "technical_interview", success: outcome("pass", "练习让你把思路说了出来。", { confidence: 8 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "有些知识点没接住，但卡点已经很具体。", { confidence: -5 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
      choice("fundamentals", "回到基础，确保不是只记住答案", { analysis: 2, reflection: 3, pacing: 1 }, { effects: { time: -9, energy: -6, profile: 5 }, successModel: "technical_interview", success: outcome("pass", "基础让你在变形题里没有迷路。", { confidence: 7 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "理解更扎实了，速度仍需要下一轮练习。", { confidence: -3, profile: 2 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
      choice("wing", "先见识真实题目，把这次当实战模考", { exploration: 3, resilience: 2 }, { effects: { time: -5, energy: -7 }, successModel: "technical_interview", success: outcome("pass", "你在陌生题里保持住了思考。", { confidence: 9 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "这次像一场付费为零的真实模考。", { confidence: -5 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
    ],
  },
  {
    id: "behavioral-interview", category: "interview", stages: ["interview"], baseWeight: 7,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "Behavioral Interview：故事库启动", description: "“请讲一次失败。”脑内文件夹瞬间弹出，但哪一段最值得讲？",
    tags: ["behavioral", "interview"], cooldownTags: ["interview"], choices: [
      choice("stories", "整理几段真实故事，也写清楚学到了什么", { expression: 3, reflection: 3 }, { effects: { time: -8, energy: -5 }, probabilityBonus: 0.1, successModel: "general_interview", success: outcome("pass", "故事有细节，也能看见你怎样成长。", { confidence: 7, profile: 2 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "故事很多，主线却有点散。", { confidence: -3 }, { interviews: 1, rejections: 1 }, { failureTags: ["behavioral_interview"] }) }),
      choice("match", "围绕岗位能力，挑最匹配的故事", { analysis: 3, expression: 3 }, { effects: { time: -9, energy: -6 }, successModel: "general_interview", success: outcome("pass", "你的证据和岗位要求连了起来。", { confidence: 7 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "逻辑很完整，但真实感还可以更多一点。", { confidence: -2 }, { interviews: 1, rejections: 1 }) }),
      choice("honest", "选最真实的一次，保留一点临场感", { resilience: 3, exploration: 1 }, { effects: { time: -5, energy: -5 }, successModel: "general_interview", success: outcome("pass", "真诚和清晰同时出现了。", { confidence: 8 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "真实故事也需要结构，这次留下了练习方向。", { confidence: -3 }, { interviews: 1, rejections: 1 }) }),
    ],
  },
  {
    id: "group-interview", category: "interview", stages: ["interview"], baseWeight: 5,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "Group Interview：全员麦克风已开", description: "同组的人都很会说。真正的任务不是抢到最多台词，而是一起把问题推进。",
    tags: ["group", "interview"], cooldownTags: ["interview"], choices: [
      choice("facilitate", "梳理讨论、邀请他人，也贡献观点", { networking: 3, analysis: 2, expression: 1 }, { effects: { time: -7, energy: -7 }, successModel: "group_interview", success: outcome("pass", "你让团队更像团队，而不只是轮流发言。", { confidence: 8, network: 3 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "节奏很乱，但你看见了群面不是抢麦比赛。", { confidence: -3 }, { interviews: 1, rejections: 1 }, { failureTags: ["group_interview"] }) }),
      choice("lead", "主动给出框架，推动大家做决定", { action: 3, expression: 2 }, { effects: { time: -6, energy: -8 }, successModel: "group_interview", success: outcome("pass", "你的框架帮助讨论落地。", { confidence: 8 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "推进很快，团队共识却没有跟上。", { confidence: -4 }, { interviews: 1, rejections: 1 }) }),
      choice("observe", "先观察缺少什么角色，再找机会补位", { analysis: 3, pacing: 2 }, { effects: { time: -6, energy: -5 }, successModel: "group_interview", success: outcome("pass", "你在关键时刻补上了团队需要的角色。", { confidence: 6 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "观察太久，贡献没有被充分看见。", { confidence: -3 }, { interviews: 1, rejections: 1 }) }),
    ],
  },
  {
    id: "final-round", category: "interview", stages: ["interview", "decision"], baseWeight: 8,
    requirements: { minCounters: { offerLeads: 1 } }, title: "Final Round：终点前的最后一格", description: "走到这里已经说明了很多。最后一轮仍然是双向判断，不是单方面等待打分。",
    tags: ["final", "interview"], cooldownTags: ["final"], choices: [
      choice("deep", "研究团队的真实挑战，准备深入聊聊", { analysis: 3, expression: 2 }, { effects: { time: -8, energy: -6 }, probabilityBonus: 0.1, successModel: "offer_decision", success: outcome("offer", "你拿到了 Offer。", { confidence: 12 }, { interviews: 1, offers: 1 }), failure: outcome("wait", "流程进入等待区，结果尚未落地。", { confidence: -2 }, { interviews: 1 }) }),
      choice("authentic", "讲清真实动机，也确认彼此是否合适", { exploration: 2, resilience: 2, expression: 1 }, { effects: { time: -6, energy: -5 }, successModel: "offer_decision", success: outcome("dream", "这次匹配感是双向的：Dream Offer 到手。", { confidence: 15 }, { interviews: 1, offers: 1 }, { flags: ["dreamOffer"] }), failure: outcome("wait", "没有立即结果，但你没有把自己演成另一个人。", { confidence: -1 }, { interviews: 1 }) }),
      choice("protect", "准备到够用就停，保留稳定状态", { pacing: 4, resilience: 2 }, { effects: { time: -4, energy: 4 }, successModel: "offer_decision", success: outcome("offer", "稳定发挥为你带来一份 Offer。", { confidence: 10 }, { interviews: 1, offers: 1 }), failure: outcome("close", "这次停在终点前，但你保住了继续前进的能量。", { confidence: -2 }, { interviews: 1, rejections: 1 }) }),
    ],
  },
  {
    id: "rejection-wave", category: "offer", stages: ["decision"], baseWeight: 7,
    title: "拒信今天选择组团抵达", description: "邮件像提前开过会一样挤在同一天。但它们来自不同流程，也不共享同一个原因。",
    tags: ["rejection", "decision"], cooldownTags: ["rejection"], choices: [
      choice("review", "只复盘能控制的部分，再调整下一轮", { reflection: 5, resilience: 2 }, { effects: { time: -6, energy: -3, confidence: -2, profile: 3 }, counters: { rejections: 2 } }),
      choice("apply", "投几个新机会，让流程继续流动", { action: 5, resilience: 2 }, { effects: { time: -7, energy: -6, confidence: -1 }, counters: { applications: 3, interviewLeads: 1, rejections: 2 } }),
      choice("pause", "允许自己难过一天，今天不分析人生", { pacing: 5, resilience: 3 }, { effects: { time: -5, energy: 10, confidence: 3 }, counters: { rejections: 2 } }),
    ],
  },
  {
    id: "waitlist", category: "offer", stages: ["decision"], baseWeight: 5,
    title: "你被放进了 Waitlist", description: "不是拒绝，也不是确定。最占用后台内存的，往往正是悬而未决。",
    tags: ["waitlist", "decision"], cooldownTags: ["decision"], choices: [
      choice("follow", "礼貌确认时间线，也表达持续兴趣", { expression: 2, pacing: 2, action: 1 }, { effects: { time: -4, energy: -2 }, successModel: "offer_decision", success: outcome("offer", "一个清晰的 follow-up 让流程重新动了起来。", { confidence: 10 }, { offers: 1 }), failure: outcome("wait", "对方仍需要时间，你继续保留其他选择。", { confidence: -1 }) }),
      choice("continue", "继续申请，不让一个结果暂停全部生活", { action: 3, resilience: 3 }, { effects: { time: -6, energy: -4, confidence: 2 }, counters: { applications: 2, interviewLeads: 1 } }),
      choice("detach", "先把它放回不确定区，关闭后台刷新", { pacing: 4, resilience: 2 }, { effects: { time: -3, energy: 7, confidence: 3 } }),
    ],
  },
  {
    id: "ordinary-offer", category: "offer", stages: ["decision"], baseWeight: 6,
    requirements: { minCounters: { offerLeads: 1 } }, title: "一份不完美、但很真实的 Offer", description: "它解决了一些现实问题，也留下几个需要认真核实的问号。",
    tags: ["offer", "decision"], cooldownTags: ["offer"], choices: [
      choice("accept", "核实条件后接受，把它当作一个入口", { pacing: 2, action: 2 }, { effects: { time: -4, confidence: 12, energy: 4 }, counters: { offers: 1 } }),
      choice("compare", "把成长、团队、地点和生活放在一起比", { analysis: 4, pacing: 1 }, { effects: { time: -6, energy: -3, confidence: 5 }, counters: { offers: 1 } }),
      choice("decline", "它离想要的生活太远，继续寻找", { exploration: 3, resilience: 3 }, { effects: { time: -4, confidence: 2 }, flags: ["declinedOffer"] }),
    ],
  },
  {
    id: "referral-conclusion", category: "offer", stages: ["decision"], baseWeight: 7,
    requirements: { flagsAny: ["referralPipeline"] }, title: "Referral 把你送到了最后一程", description: "关系帮你被看见，门后的表现仍然属于你自己。",
    tags: ["referral", "offer"], cooldownTags: ["offer"], choices: [
      choice("finish", "认真完成最后沟通，也感谢帮助过你的人", { networking: 3, expression: 2, resilience: 1 }, { effects: { time: -6, energy: -4 }, probabilityBonus: 0.12, successModel: "offer_decision", success: outcome("offer", "Referral 打开门，你自己走完了后面的路。", { confidence: 14, network: 6 }, { offers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "没有拿到 Offer，但这段关系不必随流程一起结束。", { confidence: -2, network: 3 }, { rejections: 1 }) }),
      choice("pressure", "担心辜负推荐，于是疯狂加码准备", { expression: 2, action: 3 }, { effects: { time: -9, energy: -12 }, probabilityBonus: 0.08, successModel: "offer_decision", success: outcome("offer", "高投入换来一份 Offer，也消耗了不少能量。", { confidence: 12 }, { offers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "推荐并不等于承诺，你无需替结果道歉。", { confidence: -5 }, { rejections: 1 }) }),
      choice("steady", "按自己的节奏完成，不把人情变成压力", { pacing: 4, resilience: 2 }, { effects: { time: -5, energy: -3 }, successModel: "offer_decision", success: outcome("offer", "稳定发挥让这次连接结出了果实。", { confidence: 13 }, { offers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "结果没有落地，但你守住了关系和自己。", { confidence: -1, network: 2 }) }),
    ],
  },
  {
    id: "surprise-track", category: "offer", stages: ["decision"], baseWeight: 6,
    requirements: { flagsAny: ["unexpectedTrack"] }, title: "支线任务突然发来消息", description: "它不在最初的目标里，却和你在意的工作方式意外合拍。",
    tags: ["unexpected", "offer"], cooldownTags: ["offer"], choices: [
      choice("explore", "认真聊完再判断，先不让旧地图替我拒绝", { exploration: 5, analysis: 1 }, { effects: { time: -6, energy: -4 }, successModel: "offer_decision", success: outcome("offer", "你从支线走到了一个没有预设过的终点。", { confidence: 13 }, { offers: 1 }, { flags: ["unexpectedOffer"] }), failure: outcome("insight", "没有成为 Offer，却扩展了你理解机会的方式。", { confidence: 2 }) }),
      choice("focus", "继续专注原方向，避免同时开太多支线", { analysis: 2, pacing: 3 }, { effects: { time: -2, energy: 3, confidence: 1 } }),
    ],
  },
];
