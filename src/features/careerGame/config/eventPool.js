const outcome = (id, message, effects = {}, counters = {}, extra = {}) => ({
  id, message, effects, counters, ...extra,
});

const choice = (id, label, behaviorEffects, options = {}) => {
  const { consequence, ...configuration } = options;
  return {
    id,
    label,
    behaviorEffects,
    intensity: "medium",
    ...configuration,
    ...(consequence ? { outcome: outcome("resolved", consequence) } : {}),
  };
};

export const EVENT_POOL = [
  {
    id: "market-crossroads", category: "profile", stages: ["preparation"], baseWeight: 1,
    title: "求职季开始了，你打算先做什么？", description: "你刚开始准备第一份全职工作。岗位、材料和时间都需要梳理，但今天只需要选一件最值得先推进的事。",
    tags: ["direction"], cooldownTags: ["direction"],
    choices: [
      choice("research", "先研究几份 JD，看看市场到底在找谁", { analysis: 2, exploration: 1 }, { effects: { time: -4, confidence: 2 }, consequence: "你对比了几份真实 JD，发现不同职位名称背后有不少共同要求。目标还没有完全确定，但下一步已经具体多了。" }),
      choice("apply", "先投一份感兴趣的岗位，用行动换信息", { exploration: 2, action: 2 }, { effects: { time: -4, confidence: 1 }, consequence: "第一份申请送出去了。它未必立刻有结果，却让求职从脑内计划变成了真实流程。" }),
      choice("profile", "先整理经历，把简历和 Profile 做到能见人", { analysis: 1, expression: 3 }, { effects: { time: -5, profile: 2 }, consequence: "你把课程、项目和实习素材集中到了一处。简历还不是成品，但终于有了可以继续修改的底稿。" }),
      choice("pace", "先排一下节奏，别让求职吞掉全部生活", { exploration: 1, pacing: 3 }, { effects: { time: -3, confidence: 2 }, consequence: "你列出截止日期，也给休息和日常生活留了位置。接下来做选择时，不必每次都靠临时焦虑推动。" }),
    ],
  },
  {
    id: "resume-first-draft", category: "profile", stages: ["preparation"], baseWeight: 6,
    title: "第一版简历从哪里写起？", description: "课程、项目、社团和零散经历都有一些，但还没有被整理成招聘方容易读懂的一页。你准备怎样完成第一版？",
    tags: ["resume", "profile"], cooldownTags: ["profile"], choices: [
      choice("ship", "先写出能投的 V1，再逐步修改", { action: 3, resilience: 1 }, { effects: { time: -7, energy: -5, profile: 9 }, consequence: "你完成了一版不完美但完整的简历。现在终于可以拿着具体内容找人反馈，而不是继续对着空白页想象。" }),
      choice("tailor", "先拆几份 JD，再决定重点写什么", { analysis: 3, expression: 2 }, { effects: { time: -10, energy: -6, profile: 12 }, consequence: "你圈出了 JD 里反复出现的能力，并重新排列了经历。第一版花得久一些，但每一段都更接近目标岗位。" }),
      choice("rest", "今天先整理素材，明天再排版", { pacing: 3, reflection: 1 }, { effects: { time: -4, energy: 3, profile: 5 }, consequence: "你把项目、数据和反馈整理成了素材清单，然后按时收工。明天打开文档时，已经不用再从记忆里打捞经历。" }),
    ],
  },
  {
    id: "linkedin-cleanup", category: "profile", stages: ["preparation", "application"], baseWeight: 4,
    title: "LinkedIn 还停留在大一", description: "头像依然精神，经历却像被按了暂停。招聘方点进来之前，要不要抢救一下？",
    tags: ["linkedin", "profile"], cooldownTags: ["profile"], choices: [
      choice("rewrite", "标题、About、经历，一次更新到现在", { expression: 3, action: 1 }, { effects: { time: -8, energy: -5, profile: 10 }, consequence: "你的 LinkedIn 终于和简历处在同一个时间线。别人点进来时，可以快速看懂你正在找什么、做过什么。" }),
      choice("benchmark", "先看看目标岗位的人如何介绍自己", { analysis: 3, expression: 1 }, { effects: { time: -7, energy: -3, profile: 7 }, consequence: "你参考了几种清楚的写法，也发现不需要把所有关键词都塞进标题。页面开始更像你本人，而不是模板拼贴。" }),
      choice("minimum", "先更新最关键的部分，不做大装修", { pacing: 2, action: 2 }, { effects: { time: -4, profile: 5 }, consequence: "你先修正了求职方向、最近经历和联系方式。页面还不精致，但已经不会向招聘方介绍一个几年前的你。" }),
    ],
  },
  {
    id: "portfolio-weekend", category: "profile", stages: ["preparation", "application"], baseWeight: 3,
    title: "周末限定任务：做不做作品集？", description: "有些项目塞不进一页简历，但作品集也很擅长吞时间。",
    tags: ["portfolio", "profile"], cooldownTags: ["profile"], choices: [
      choice("build", "做个轻量版，先让好项目被看见", { expression: 3, action: 2 }, { effects: { time: -11, energy: -8, profile: 13 }, consequence: "你把项目背景、自己的贡献和结果放进了一个轻量作品集。简历放不下的细节，现在有了合适的去处。" }),
      choice("curate", "只整理最能说明能力的几个案例", { analysis: 2, expression: 2, pacing: 1 }, { effects: { time: -7, energy: -4, profile: 9 }, consequence: "你删掉了重复和解释成本过高的内容，只留下最能说明能力的案例。作品不多，但每一个都有存在的理由。" }),
      choice("skip", "当前路线用不上，先把周末还给自己", { pacing: 2, analysis: 1 }, { effects: { time: -2, energy: 2 }, consequence: "你确认目标岗位并不依赖作品集，于是把时间留给更直接的准备。少做一件不必要的事，也是一种有效规划。" }),
    ],
  },
  {
    id: "mentor-review", category: "profile", stages: ["preparation", "application"], baseWeight: 4,
    title: "你获得了一次真人 Review", description: "对方愿意认真看一遍，但时间有限。怎样把这次反馈用在刀刃上？",
    tags: ["review", "profile"], cooldownTags: ["feedback"], choices: [
      choice("specific", "带上目标 JD 和几个具体问题", { analysis: 2, reflection: 3, networking: 1 }, { effects: { time: -6, energy: -3, profile: 10, network: 4 }, consequence: "对方结合 JD 指出了证据不足的地方，也肯定了几段有效经历。你拿到的是可以直接修改的反馈，不是一句泛泛的“挺好的”。" }),
      choice("open", "请对方指出第一眼最看不懂的地方", { reflection: 3, expression: 1 }, { effects: { time: -5, profile: 8, confidence: 2 }, consequence: "对方很快找到了几处读者需要猜测的表达。你补上背景和结果后，简历更容易被第一次见你的人读懂。" }),
      choice("later", "先自己再改一版，晚点再请对方看", { pacing: 2, expression: 1 }, { effects: { time: -3, profile: 4 }, consequence: "你先处理了自己已经能看见的问题，并约好稍后再发。反馈机会保留下来，也没有浪费在明显的初稿错误上。" }),
    ],
  },
  {
    id: "dream-job-deadline", category: "application", stages: ["application"], baseWeight: 7,
    title: "Dream Job 倒计时：两天", description: "匹配度没有满格，但心动值已经满了。你打算怎样送出这份申请？",
    tags: ["deadline", "application"], cooldownTags: ["deadline"], choices: [
      choice("direct", "先投出去，别让截止日期赢了", { action: 4, resilience: 1 }, { effects: { time: -5, energy: -3 }, counters: { applications: 1 }, successModel: "profile_screen", success: outcome("screen", "速度没有妨碍你被看见，面试邀请来了。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("quiet", "暂时没有回音，但你保住了时间去看更多机会。", { confidence: -2 }, { rejections: 1 }) }),
      choice("tailor", "认真定制 Resume 和 Cover Letter", { analysis: 3, expression: 3 }, { effects: { time: -12, energy: -8, profile: 4 }, counters: { applications: 1 }, probabilityBonus: 0.14, successModel: "profile_screen", success: outcome("screen", "你的材料和 JD 对上了频道。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("quiet", "投入没有立刻换来结果，但这版材料还能复用。", { confidence: -1, profile: 2 }, { rejections: 1 }) }),
      choice("referral", "先问问认识的人，能否帮忙 Referral", { networking: 4, analysis: 1 }, { requirements: { minAttributes: { network: 20 } }, effects: { time: -8, energy: -5 }, successModel: "network_outreach", success: outcome("referred", "对方愿意帮忙，也提醒了你团队真正看重什么。", { confidence: 7, network: 5 }, { applications: 1, referrals: 1, interviewLeads: 1 }, { flags: ["referralPipeline"] }), failure: outcome("no-referral", "这次没有 Referral，但关系没有因此变成一次性工具。", { confidence: -1, network: 1 }) }),
      choice("pass", "这次不追，把资源留给更匹配的机会", { pacing: 3, reflection: 1 }, { effects: { time: -1, energy: 3 }, consequence: "你记下放弃的原因，关掉了申请页面。心动不一定等于合适，你把精力留给了更愿意认真准备的机会。" }),
    ],
  },
  {
    id: "graduate-program-window", category: "application", stages: ["application"], baseWeight: 5,
    title: "Graduate Programme 开放申请", description: "流程很长，轮岗和训练却也很香。先研究，还是先占一个候选席位？",
    tags: ["graduate", "application"], cooldownTags: ["application"], choices: [
      choice("research", "先看清轮岗、培养方式和往届去向", { analysis: 4 }, { effects: { time: -8, energy: -3, profile: 3 }, counters: { applications: 1 }, probabilityBonus: 0.08, successModel: "graduate_screen", success: outcome("oa", "研究帮助你写出了有内容的 Motivation。", { confidence: 4 }, { interviewLeads: 1 }, { flags: ["graduateTrack"] }), failure: outcome("reject", "流程没有继续，但你更清楚自己在找什么。", { confidence: -2 }, { rejections: 1 }) }),
      choice("apply", "先申请，项目细节可以边走边了解", { action: 4, exploration: 1 }, { effects: { time: -5, energy: -4 }, counters: { applications: 1 }, successModel: "graduate_screen", success: outcome("oa", "你拿到了下一轮在线测试。", { confidence: 4 }, { interviewLeads: 1 }, { flags: ["graduateTrack"] }), failure: outcome("reject", "系统发来一封很标准的邮件。", { confidence: -3 }, { rejections: 1 }) }),
      choice("skip", "工作方式不太适合我，先不申请", { pacing: 2, analysis: 2 }, { effects: { time: -2, confidence: 1 }, consequence: "你确认轮岗安排和培养方式并不符合当前计划，于是没有为了热门项目勉强自己进入一条漫长流程。" }),
    ],
  },
  {
    id: "batch-application-night", category: "application", stages: ["application"], baseWeight: 6,
    title: "收藏的岗位越来越多，今晚投哪些？", description: "你已经收藏了一批岗位，其中几份很快截止。精力有限，今晚需要决定怎样安排投递。",
    tags: ["batch", "application"], cooldownTags: ["batch"], choices: [
      choice("batch", "集中投一批，最后统一登记", { action: 5, resilience: 1 }, { effects: { time: -10, energy: -10, confidence: 1 }, counters: { applications: 4, interviewLeads: 1 }, consequence: "你完成了一批申请，也把岗位、版本和截止日期补进 Tracker。今晚很累，但明天不会再猜自己到底投过什么。" }),
      choice("shortlist", "再筛一轮，只投最值得准备的", { analysis: 4, pacing: 1 }, { effects: { time: -9, energy: -6, profile: 2 }, counters: { applications: 2, interviewLeads: 1 }, consequence: "你删掉了几份只是“看起来不错”的岗位，为真正想去的申请多留了一些打磨时间。投递数量少了，理由却更清楚。" }),
      choice("recover", "关掉网页，明天带着清醒的大脑再投", { pacing: 4, resilience: 2 }, { effects: { time: -4, energy: 11, confidence: 2 }, consequence: "你记下最临近的截止日期，然后准时休息。第二天再打开收藏夹时，判断岗位的速度反而更快。" }),
    ],
  },
  {
    id: "crowded-role", category: "application", stages: ["application"], baseWeight: 5,
    title: "这个岗位已经有 1000+ 人申请", description: "数字确实很大，但它没告诉你其中多少人合适，也没说你不能成为其中之一。",
    tags: ["competition", "application"], cooldownTags: ["competition"], choices: [
      choice("apply", "先投。1000+ 里面为什么不能有我", { action: 4, resilience: 2 }, { effects: { time: -5, energy: -3 }, counters: { applications: 1 }, successModel: "profile_screen", success: outcome("screen", "申请人数没有替招聘方做决定。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("reject", "这次没有进入流程，数字也没有定义你。", { confidence: -2 }, { rejections: 1 }) }),
      choice("fit", "先判断匹配度，再决定值不值得投入", { analysis: 4, pacing: 1 }, { effects: { time: -7, energy: -3, profile: 3 }, counters: { applications: 1 }, probabilityBonus: 0.08, successModel: "profile_screen", success: outcome("screen", "你找到了真正匹配的证据。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("pass", "研究之后你决定把精力留给别处。", { confidence: 1 }) }),
      choice("move", "继续看看刚开放、竞争更少的机会", { exploration: 3, pacing: 2 }, { effects: { time: -2, energy: 2 }, consequence: "你没有把全部时间押在一个拥挤岗位上，而是找到几份刚开放的新机会。选择变多后，那个申请数字也没那么吓人了。" }),
    ],
  },
  {
    id: "alumni-reply", category: "networking", stages: ["preparation", "application"], baseWeight: 5,
    title: "叮——校友回复了你的消息", description: "对方愿意聊二十分钟。怎样让这次交流不变成一场突击索取？",
    tags: ["alumni", "networking"], cooldownTags: ["networking"], choices: [
      choice("prepare", "准备具体问题，聊聊岗位的真实日常", { networking: 4, analysis: 2 }, { effects: { time: -6, energy: -3 }, successModel: "network_outreach", success: outcome("insight", "你得到了一些 JD 里没有写的信息。", { network: 10, confidence: 5, profile: 3 }, { referrals: 1 }), failure: outcome("brief", "聊天很短，但你练习了如何自然地开口。", { network: 4, confidence: 1 }) }),
      choice("ask-referral", "开门见山，问问有没有 Referral 机会", { networking: 4, action: 2 }, { effects: { time: -4, energy: -4 }, successModel: "network_outreach", success: outcome("referral", "时机刚好，对方愿意转交材料。", { network: 8, confidence: 6 }, { referrals: 1, interviewLeads: 1 }, { flags: ["referralPipeline"] }), failure: outcome("too-fast", "对方没有答应，但也礼貌说明了原因。", { confidence: -2, network: 1 }) }),
      choice("thank", "先感谢回复，想清楚问题后再约", { pacing: 3, networking: 1 }, { effects: { time: -2, network: 3 }, consequence: "你先确认了对方方便的时间，并花一点时间整理真正想问的问题。这段联系没有被仓促消耗掉。" }),
    ],
  },
  {
    id: "career-fair", category: "networking", stages: ["preparation", "application"], baseWeight: 4,
    title: "Career Fair 已进入人山人海模式", description: "每个摊位都在排队，而你的社交电量并不是无限的。",
    tags: ["career-fair", "networking"], cooldownTags: ["networking"], choices: [
      choice("target", "锁定几家公司，排到了就认真聊", { analysis: 3, networking: 3 }, { effects: { time: -8, energy: -7, network: 9, confidence: 3 }, counters: { interviewLeads: 1 }, consequence: "你和目标公司的招聘人员聊到了岗位细节，也留下了联系方式。回家时社交电量见底，但至少没有抱着一袋传单空手而归。" }),
      choice("explore", "随便走走，也给陌生方向一个机会", { exploration: 4, networking: 2 }, { effects: { time: -9, energy: -8, network: 7, confidence: 4 }, flags: ["unexpectedTrack"], consequence: "你停在一个原本不会搜索的摊位前，意外发现工作内容很合拍。目标清单里多了一条此前没想到的方向。" }),
      choice("online", "不去现场，把公司记下来以后再查", { pacing: 3, analysis: 2 }, { effects: { energy: 3, profile: 2 }, consequence: "你没有勉强自己在嘈杂现场硬聊，而是记下公司名称，之后再查看官网和岗位。今天没有为一场没参加的活动消耗额外时间。" }),
    ],
  },
  {
    id: "coffee-chat-reply", category: "networking", stages: ["application"], baseWeight: 5,
    title: "Coffee Chat 邀请终于被接受", description: "这不是面试，也不是“面经拿来”的限时挑战。你想怎样聊？",
    tags: ["coffee-chat", "networking"], cooldownTags: ["networking"], choices: [
      choice("curious", "聊职业路径、团队挑战和新人日常", { networking: 4, exploration: 2, analysis: 1 }, { effects: { time: -7, energy: -4, network: 10, confidence: 4 }, consequence: "对方讲了几件 JD 里看不到的日常，也解释了新人最容易误解的地方。你没有得到标准答案，却更清楚自己是否喜欢这种工作。" }),
      choice("pitch", "也说说自己为什么对这个方向感兴趣", { expression: 3, networking: 3 }, { effects: { time: -7, energy: -5, network: 8, profile: 3 }, counters: { interviewLeads: 1 }, consequence: "你既认真提问，也自然介绍了自己的相关经历。几天后，对方把一个正在招聘的团队联系人发给了你。" }),
      choice("cancel", "今天状态不好，礼貌申请改约", { pacing: 4, resilience: 1 }, { effects: { time: -3, energy: 7, network: 1 }, consequence: "你提前说明情况并给出新的时间，对方很快确认了改期。一次正常沟通没有毁掉关系，你也不必带着耗尽的状态硬撑。" }),
    ],
  },
  {
    id: "oa-invitation", category: "application", stages: ["application", "interview"], baseWeight: 7,
    requirements: { minCounters: { applications: 1 } }, title: "你收到了一份在线测试邀请", description: "邮件里包含限时能力题和情境判断，完成期限就在几天后。你需要决定是否准备，以及准备到什么程度。",
    tags: ["assessment", "deadline"], cooldownTags: ["assessment"], choices: [
      choice("practice", "先查题型，找几道样题热热手", { analysis: 3, reflection: 2 }, { effects: { time: -8, energy: -5 }, probabilityBonus: 0.12, successModel: "profile_screen", success: outcome("pass", "准备让你更熟悉节奏，下一轮见。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("fail", "题型熟悉了，结果却没有过线。", { confidence: -3 }, { rejections: 1 }, { failureTags: ["online_test"] }) }),
      choice("start", "现在就做，相信第一反应和临场状态", { action: 4, resilience: 1 }, { effects: { time: -5, energy: -6 }, successModel: "profile_screen", success: outcome("pass", "临场判断帮你通过了这一关。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("fail", "这套题没有站在你这边。", { confidence: -4 }, { rejections: 1 }, { failureTags: ["online_test"] }) }),
      choice("withdraw", "投入太高，这条流程就走到这里", { pacing: 4, analysis: 1 }, { effects: { time: -1, energy: 3, confidence: 1 }, consequence: "你确认这份岗位并非优先目标，于是在截止前主动退出。邮箱里少了一条流程，时间则回到了更重要的申请上。" }),
    ],
  },
  {
    id: "hr-screening", category: "interview", stages: ["interview"], baseWeight: 8,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "HR Screening Call 来电", description: "对方想快速了解动机、经历和基本期望。目标是说清楚，不是背完整本自传。",
    tags: ["hr", "interview"], cooldownTags: ["interview"], choices: [
      choice("prepare", "准备短版自我介绍、动机和关键经历", { expression: 4, analysis: 1 }, { effects: { time: -8, energy: -5 }, successModel: "general_interview", success: outcome("pass", "回答清楚，也留下了继续了解的空间。招聘团队邀请你进入下一轮面试。", { confidence: 7 }, { interviews: 1, interviewLeads: 1 }), failure: outcome("fail", "对话没有推进，但暴露了动机表达的卡点。", { confidence: -4 }, { interviews: 1, rejections: 1 }, { failureTags: ["hr_interview"] }) }),
      choice("natural", "放松一点，把它当作双向了解", { exploration: 2, resilience: 2, expression: 1 }, { effects: { time: -5, energy: -4 }, successModel: "general_interview", success: outcome("pass", "交流感让双方都更快判断了匹配度。下一轮面试也随之进入日程。", { confidence: 6 }, { interviews: 1, interviewLeads: 1 }), failure: outcome("fail", "彼此没有对上频道，这也是筛选的一部分。", { confidence: -2 }, { interviews: 1, rejections: 1 }) }),
      choice("reschedule", "今天确实不在状态，礼貌申请改期", { pacing: 4, resilience: 1 }, { effects: { time: -4, energy: 8, confidence: 1 }, consequence: "你及时说明原因，并提供了几个可行时间。HR 接受了改期；清楚而礼貌地沟通，本身也是这通电话的一部分。" }),
    ],
  },
  {
    id: "technical-interview", category: "interview", stages: ["interview"], baseWeight: 7,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "Technical Interview 就在下周", description: "面试可能出现专业知识、案例或现场解题。面试官不只看最终答案，也会观察你怎样拆解陌生问题。",
    tags: ["technical", "interview"], cooldownTags: ["interview"], choices: [
      choice("drill", "刷高频题，也练习把思路说出来", { reflection: 3, action: 2 }, { effects: { time: -10, energy: -8, profile: 4 }, probabilityBonus: 0.12, successModel: "technical_interview", success: outcome("pass", "练习让你把思路说了出来。", { confidence: 8 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "有些知识点没接住，但卡点已经很具体。", { confidence: -5 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
      choice("fundamentals", "回到基础，确保不是只记住答案", { analysis: 2, reflection: 3, pacing: 1 }, { effects: { time: -9, energy: -6, profile: 5 }, successModel: "technical_interview", success: outcome("pass", "基础让你在变形题里没有迷路。", { confidence: 7 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "理解更扎实了，速度仍需要下一轮练习。", { confidence: -3, profile: 2 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
      choice("wing", "先见识真实题目，把这次当实战模考", { exploration: 3, resilience: 2 }, { effects: { time: -5, energy: -7 }, successModel: "technical_interview", success: outcome("pass", "你在陌生题里保持住了思考。", { confidence: 9 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "这次像一场付费为零的真实模考。", { confidence: -5 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
    ],
  },
  {
    id: "behavioral-interview", category: "interview", stages: ["interview"], baseWeight: 7,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "Behavioral Interview 要讲哪段经历？", description: "面试官可能会问“请讲一次失败”。你有几段真实经历可以使用，但需要决定哪一段最能说明自己的行动与成长。",
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
    id: "assessment-centre-group", category: "interview", stages: ["interview"], baseWeight: 4,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "Assessment Centre：小组任务开始", description: "你们需要在有限时间里读材料、形成方案，再一起向评审陈述。被看见很重要，让团队真的完成任务也很重要。",
    tags: ["group", "assessment-centre", "interview"], cooldownTags: ["interview"], choices: [
      choice("coordinate", "先确认目标和分工，再补上讨论缺口", { networking: 3, analysis: 2 }, { effects: { time: -8, energy: -7 }, successModel: "group_interview", success: outcome("pass", "你让信息、分工和时间重新对齐，小组在截止前交出了完整方案。", { confidence: 7, network: 3 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "方案完成了，但你的贡献没有被评审充分看见。", { confidence: -3 }, { interviews: 1, rejections: 1 }, { failureTags: ["group_interview"] }) }),
      choice("present", "主动承担陈述，把大家的观点连成主线", { expression: 3, action: 2 }, { effects: { time: -7, energy: -8 }, successModel: "group_interview", success: outcome("pass", "你的陈述没有抢走团队成果，反而让每个人的贡献更容易被理解。", { confidence: 8 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "表达很有气势，但方案中的几处逻辑没有来得及补齐。", { confidence: -4 }, { interviews: 1, rejections: 1 }, { failureTags: ["group_interview"] }) }),
      choice("support", "观察团队最缺什么，在关键位置补位", { analysis: 3, pacing: 2 }, { effects: { time: -7, energy: -5 }, successModel: "group_interview", success: outcome("pass", "你没有占据最多发言时间，但在几次关键节点让团队继续向前。", { confidence: 6, network: 2 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "补位很有价值，只是评审能观察到的证据还不够清楚。", { confidence: -2 }, { interviews: 1, rejections: 1 }, { failureTags: ["group_interview"] }) }),
    ],
  },
  {
    id: "final-round", category: "interview", stages: ["interview", "decision"], baseWeight: 8,
    requirements: { minCounters: { offerLeads: 1 } }, title: "Final Round：最后一轮面试", description: "能走到这里已经说明了很多。最后一轮仍然是双向判断，你既要回答问题，也要确认团队和岗位是否适合自己。",
    tags: ["final", "interview"], cooldownTags: ["final"], choices: [
      choice("deep", "研究团队的真实挑战，准备深入聊聊", { analysis: 3, expression: 2 }, { effects: { time: -8, energy: -6 }, probabilityBonus: 0.1, successModel: "offer_decision", success: outcome("offer", "公司发来了书面 Offer。条件确认和最终决定，留给下一步。", { confidence: 12 }, { interviews: 1, pendingOffers: 1 }), failure: outcome("wait", "流程进入等待区，结果尚未落地。", { confidence: -2 }, { interviews: 1, waitlists: 1 }) }),
      choice("authentic", "讲清真实动机，也确认彼此是否合适", { exploration: 2, resilience: 2, expression: 1 }, { effects: { time: -6, energy: -5 }, successModel: "offer_decision", success: outcome("dream", "理想团队发来了 Offer；真正接受以前，你仍有一次认真核实的机会。", { confidence: 15 }, { interviews: 1, pendingOffers: 1 }, { flags: ["dreamOffer"] }), failure: outcome("wait", "没有立即结果，但你没有把自己演成另一个人。", { confidence: -1 }, { interviews: 1, waitlists: 1 }) }),
      choice("protect", "准备到够用就停，保留稳定状态", { pacing: 4, resilience: 2 }, { effects: { time: -4, energy: 4 }, successModel: "offer_decision", success: outcome("offer", "稳定发挥换来了一份书面 Offer，接下来需要判断是否接受。", { confidence: 10 }, { interviews: 1, pendingOffers: 1 }), failure: outcome("close", "这次停在终点前，但你保住了继续前进的能量。", { confidence: -2 }, { interviews: 1, rejections: 1 }) }),
    ],
  },
  {
    id: "rejection-wave", category: "offer", stages: ["decision"], baseWeight: 7,
    title: "拒信今天选择组团抵达", description: "邮件像提前开过会一样挤在同一天。但它们来自不同流程，也不共享同一个原因。",
    tags: ["rejection", "decision"], cooldownTags: ["rejection"], choices: [
      choice("review", "只复盘能控制的部分，再调整下一轮", { reflection: 5, resilience: 2 }, { effects: { time: -6, energy: -3, confidence: -2, profile: 3 }, counters: { rejections: 2 }, consequence: "你没有替沉默的招聘方编造原因，只记录材料和回答中能改的部分。下一轮申请因此有了几处具体调整。" }),
      choice("apply", "投几个新机会，让流程继续流动", { action: 5, resilience: 2 }, { effects: { time: -7, energy: -6, confidence: -1 }, counters: { applications: 3, interviewLeads: 1, rejections: 2 }, consequence: "你允许失落存在，同时送出了几份新申请。旧流程结束了，新的面试机会也开始出现。" }),
      choice("pause", "允许自己难过一天，今天不分析人生", { pacing: 5, resilience: 3 }, { effects: { time: -5, energy: 10, confidence: 3 }, counters: { rejections: 2 }, consequence: "你关掉邮箱，找朋友吃了顿饭，也睡了一个完整的晚上。拒信没有消失，但第二天的你重新有力气处理它们。" }),
    ],
  },
  {
    id: "waitlist", category: "offer", stages: ["decision"], baseWeight: 5,
    title: "公司通知你进入 Waitlist", description: "这既不是拒绝，也不是确定结果。对方没有给出明确日期，而你手上还有其他流程要继续。",
    tags: ["waitlist", "decision"], cooldownTags: ["decision"], choices: [
      choice("follow", "礼貌确认时间线，也表达持续兴趣", { expression: 2, pacing: 2, action: 1 }, { effects: { time: -4, energy: -2 }, successModel: "offer_decision", success: outcome("offer", "一个清晰的 follow-up 让流程重新动了起来，公司发来了 Offer。", { confidence: 10 }, { pendingOffers: 1 }), failure: outcome("wait", "对方仍需要时间，你继续保留其他选择。", { confidence: -1 }, { waitlists: 1 }) }),
      choice("continue", "继续申请，不让一个结果暂停全部生活", { action: 3, resilience: 3 }, { effects: { time: -6, energy: -4, confidence: 2 }, counters: { applications: 2, interviewLeads: 1 }, consequence: "你保留 Waitlist 的可能，也继续推进其他岗位。新的面试邀请让等待不再占据全部注意力。" }),
      choice("detach", "先把它放回不确定区，停止反复刷新", { pacing: 4, resilience: 2 }, { effects: { time: -3, energy: 7, confidence: 3 }, consequence: "你设定了下次跟进日期，然后不再每小时刷新邮箱。不确定仍然存在，但它暂时回到了合适的位置。" }),
    ],
  },
  {
    id: "ordinary-offer", category: "offer", stages: ["decision"], baseWeight: 6,
    requirements: { minCounters: { offerLeads: 1 } }, title: "一份不完美、但很真实的 Offer", description: "它解决了一些现实问题，也留下几个需要认真核实的问号。",
    tags: ["offer", "decision"], cooldownTags: ["offer"], choices: [
      choice("accept", "核实条件后接受，把它当作一个入口", { pacing: 2, action: 2 }, { effects: { time: -4, confidence: 12, energy: 4 }, counters: { offers: 1 }, consequence: "你确认了薪酬、岗位、入职时间和书面条款，随后正式接受。它不必是终身答案，但会成为下一段经历的入口。" }),
      choice("compare", "把成长、团队、地点和生活放在一起比", { analysis: 4, pacing: 1 }, { requirements: { flagsAbsent: ["offerCompared"] }, effects: { time: -6, energy: -3, confidence: 5 }, flags: ["offerCompared"], consequence: "你把工作内容、经理、成长空间和生活成本放进同一张表，也向团队补问了几个关键问题。Offer 还在手里，下一次需要作出决定。" }),
      choice("decline", "它离想要的生活太远，继续寻找", { exploration: 3, resilience: 3 }, { effects: { time: -4, confidence: 2 }, flags: ["declinedOffer"], consequence: "你礼貌拒绝了这份 Offer，并保留了对方的联系方式。拒绝一个不合适的入口，也是在为真正想要的生活做选择。" }),
    ],
  },
  {
    id: "referral-conclusion", category: "offer", stages: ["decision"], baseWeight: 7,
    requirements: { flagsAny: ["referralPipeline"] }, title: "Referral 把你送到了最后一程", description: "关系帮你被看见，门后的表现仍然属于你自己。",
    tags: ["referral", "offer"], cooldownTags: ["offer"], choices: [
      choice("finish", "认真完成最后沟通，也感谢帮助过你的人", { networking: 3, expression: 2, resilience: 1 }, { effects: { time: -6, energy: -4 }, probabilityBonus: 0.12, successModel: "offer_decision", success: outcome("offer", "Referral 打开门，你自己走完了后面的路。书面 Offer 已经到手，接下来由你决定。", { confidence: 14, network: 6 }, { pendingOffers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "没有拿到 Offer，但这段关系不必随流程一起结束。", { confidence: -2, network: 3 }, { rejections: 1 }) }),
      choice("pressure", "担心辜负推荐，于是疯狂加码准备", { expression: 2, action: 3 }, { effects: { time: -9, energy: -12 }, probabilityBonus: 0.08, successModel: "offer_decision", success: outcome("offer", "高投入换来一份 Offer，也消耗了不少能量。决定以前，先把条件看完整。", { confidence: 12 }, { pendingOffers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "推荐并不等于承诺，你无需替结果道歉。", { confidence: -5 }, { rejections: 1 }) }),
      choice("steady", "按自己的节奏完成，不把人情变成压力", { pacing: 4, resilience: 2 }, { effects: { time: -5, energy: -3 }, successModel: "offer_decision", success: outcome("offer", "稳定发挥让这次连接结出了果实。Offer 已经发来，选择仍属于你。", { confidence: 13 }, { pendingOffers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "结果没有落地，但你守住了关系和自己。", { confidence: -1, network: 2 }) }),
    ],
  },
  {
    id: "surprise-track", category: "offer", stages: ["decision"], baseWeight: 6,
    requirements: { flagsAny: ["unexpectedTrack"] }, title: "一个没考虑过的方向发来消息", description: "它不在最初的目标清单里，工作内容却和你在意的方式意外合拍。你需要决定是否继续了解。",
    tags: ["unexpected", "offer"], cooldownTags: ["offer"], choices: [
      choice("explore", "认真聊完再判断，不急着替自己拒绝", { exploration: 5, analysis: 1 }, { effects: { time: -6, energy: -4 }, successModel: "offer_decision", success: outcome("offer", "这个意外方向最终给了你一份 Offer。它不是原计划，是否接受仍需要认真判断。", { confidence: 13 }, { pendingOffers: 1 }, { flags: ["unexpectedOffer"] }), failure: outcome("insight", "机会没有变成 Offer，但你对自己愿意尝试的方向有了新的认识。", { confidence: 2 }) }),
      choice("focus", "继续专注原方向，避免同时推进太多流程", { analysis: 2, pacing: 3 }, { effects: { time: -2, energy: 3, confidence: 1 }, consequence: "你感谢对方的联系，并说明这次先不继续。目标方向没有改变，手上的准备也因此保持集中。" }),
    ],
  },
];
