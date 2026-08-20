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
    title: "求职季开始了。打开电脑，第一件事你打算做什么？", description: "岗位、材料和时间线都需要梳理，但今天只需要选一件最值得推进的事。",
    tags: ["direction"], cooldownTags: ["direction"],
    choices: [
      choice("research", "打开招聘软件，研究几份 JD，确认自己的定位", { analysis: 2, exploration: 1 }, { effects: { time: -4, confidence: 2 }, consequence: "你对比了几份真实 JD，发现不同职位名称背后有不少共同要求，有些你已经符合，有些还有待补充。总之，你对自己的定位有了认知，也建立了信心。" }),
      choice("apply", "行动起来！直接投递几个最感兴趣的岗位", { exploration: 2, action: 2 }, { effects: { time: -4, confidence: 1 }, consequence: "投递是一切后续流程的开始，你知道自己已经走在路上。" }),
      choice("profile", "先整理经历，把简历和 Profile 补充完整", { analysis: 1, expression: 3 }, { effects: { time: -5, profile: 2 }, consequence: "你把课程、项目和实习素材集中到了一处。简历还不是成品，但终于有了可以继续修改的底稿。" }),
      choice("pace", "先排一下这几个月时间线，大致掌握住求职的节奏", { exploration: 1, pacing: 3 }, { effects: { time: -3, confidence: 2 }, consequence: "你列出截止日期，也给休息和日常生活留了位置。接下来做选择时，不必每次都靠临时焦虑推动。" }),
    ],
  },
  {
    id: "resume-first-draft", category: "profile", stages: ["preparation"], baseWeight: 6,
    title: "第一版简历从哪里写起？", description: "课程、项目、社团和实习经历都有一些，但还没有被整理成最精华的一页。你准备怎样完成第一版？",
    tags: ["resume", "profile"], cooldownTags: ["profile"], choices: [
      choice("ship", "快速写好达到投递标准的 V1，再逐步修改", { action: 3, resilience: 1 }, { effects: { time: -7, energy: -5, profile: 9 }, consequence: "你完成了一版不完美但完整的简历。现在终于可以拿着具体内容找人反馈，而不是继续对着空白页想象。" }),
      choice("tailor", "先研读几份目标岗位的 JD，再决定重点写什么", { analysis: 3, expression: 2 }, { effects: { time: -10, energy: -6, profile: 12 }, consequence: "你圈出了 JD 里反复出现的能力，并重新排列了经历。第一版花得久一些，但每一段都更接近目标岗位。" }),
      choice("rest", "慢慢来，今天只整理素材，明天再排版", { pacing: 3, reflection: 1 }, { effects: { time: -4, energy: 3, profile: 5 }, consequence: "你把项目、数据和反馈整理成了素材清单，然后按时收工。明天打开文档时，已经不用再从记忆里打捞经历。" }),
    ],
  },
  {
    id: "linkedin-cleanup", category: "profile", stages: ["preparation", "application"], baseWeight: 4,
    title: "你打开 LinkedIn，发现除了头像全是空白", description: "头像依然精神，经历却很神秘。在招聘方点进来之前，要不要抢救一下？",
    tags: ["linkedin", "profile"], cooldownTags: ["profile"], choices: [
      choice("rewrite", "About me、教育经历、实习经验，一鼓作气更新完毕", { expression: 3, action: 1 }, { effects: { time: -8, energy: -5, profile: 10 }, consequence: "你的 LinkedIn 终于和简历处在同一个时间线。别人点进来时，可以快速看懂你正在找什么、做过什么。" }),
      choice("benchmark", "快速补充一些经历，然后就去发展 connections", { networking: 3, action: 2 }, { effects: { time: -6, energy: -4, profile: 4, network: 8 }, consequence: "你写上了自己的学校和实习背景，接着向几十位校友发出了 connect 邀请。" }),
      choice("minimum", "先更新最关键的部分，不做大装修", { pacing: 2, action: 2 }, { effects: { time: -4, profile: 5 }, consequence: "你先补充了求职方向、最近经历和联系方式。页面还不精致，但已足够完整，也没有花费你太多精力。" }),
    ],
  },
  {
    id: "portfolio-weekend", category: "profile", stages: ["preparation", "application"], baseWeight: 3,
    title: "周末限定任务：要不要做一个作品集？", description: "你做过的项目塞不进一页简历，但作品集会吞掉很多时间和精力。",
    tags: ["portfolio", "profile"], cooldownTags: ["profile"], choices: [
      choice("build", "必须要做，我要充分展现自己的实力和成果", { expression: 3, action: 2 }, { effects: { time: -11, energy: -8, profile: 13 }, consequence: "你燃尽了，但你的作品集完整而精美，想必会给招聘方留下不错的印象。" }),
      choice("curate", "做个轻量版，先让好项目被看见", { analysis: 2, expression: 2, pacing: 1 }, { effects: { time: -7, energy: -4, profile: 9 }, consequence: "你把项目背景、自己的贡献和结果放进了一个轻量作品集。简历放不下的细节，现在有了合适的去处。" }),
      choice("skip", "我的专业和求职方向用不上，周末还是留着做些别的事情吧", { pacing: 2, analysis: 1 }, { effects: { time: -2, energy: 2 }, consequence: "你确认目标岗位并不依赖作品集，于是把时间留给更直接的准备。少做一件不必要的事，也是一种有效规划。" }),
    ],
  },
  {
    id: "mentor-review", category: "profile", stages: ["preparation", "application"], baseWeight: 4,
    title: "你询问了前辈，获得了一次真人 Review 简历的机会", description: "对方愿意认真看一遍，但时间有限。怎样把这次得到反馈的机会用在刀刃上？",
    tags: ["review", "profile"], cooldownTags: ["feedback"], choices: [
      choice("specific", "带上目标岗位的 JD 和几个具体问题", { analysis: 2, reflection: 3, networking: 1 }, { effects: { time: -6, energy: -3, profile: 10, network: 4 }, consequence: "对方结合 JD 指出了证据不足的地方，也肯定了几段有效经历。你拿到的是可以直接修改的反馈，不是一句泛泛的“挺好的”。" }),
      choice("open", "请对方直接指出简历本身存在的问题", { reflection: 3, expression: 1 }, { effects: { time: -5, profile: 8, confidence: 2 }, consequence: "对方很快找到了几处可以优化的表达。你补上背景和结果后，简历更容易给招聘方留下深刻的印象。" }),
    ],
  },
  {
    id: "dream-job-deadline", category: "application", stages: ["application"], baseWeight: 7,
    title: "距离 Dream Job 的投递截止日期只剩两天了！", description: "匹配度没有满格，但心动值已经满了。你打算怎样送出这份申请？",
    tags: ["deadline", "application"], cooldownTags: ["deadline"], choices: [
      choice("direct", "不为它定制简历和材料，先投出去。相信自己能进入后续流程，到那时再充分展现自己", { action: 4, resilience: 1 }, { effects: { time: -5, energy: -3 }, counters: { applications: 1 }, successModel: "profile_screen", success: outcome("screen", "你的简历已经足够过线，面试邀请来了。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("quiet", "暂时没有回音，但你保住了时间去看更多机会。", { confidence: -2 }, { rejections: 1 }) }),
      choice("tailor", "认真定制 Resume 和 Cover Letter", { analysis: 3, expression: 3 }, { effects: { time: -12, energy: -8, profile: 4 }, counters: { applications: 1 }, probabilityBonus: 0.14, successModel: "profile_screen", success: outcome("screen", "努力没有白费，你的材料和 JD 对上了频道。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("quiet", "投入没有立刻换来结果，但这版材料还能复用。", { confidence: -1, profile: 2 }, { rejections: 1 }) }),
      choice("referral", "先问问认识的人，能否帮忙 Referral", { networking: 4, analysis: 1 }, { requirements: { minAttributes: { network: 20 } }, effects: { time: -8, energy: -5 }, successModel: "network_outreach", success: outcome("referred", "对方愿意帮忙，也提醒了你团队真正看重什么。", { confidence: 7, network: 5 }, { applications: 1, referrals: 1, interviewLeads: 1 }, { flags: ["referralPipeline"] }), failure: outcome("no-referral", "这次没有拿到 Referral，但你们的交流仍然让你学到了一些东西。", { confidence: -1, network: 1 }) }),
    ],
  },
  {
    id: "graduate-program-window", category: "application", stages: ["application"], baseWeight: 5,
    title: "大公司的 Graduate Programme 开放了申请入口", description: "流程很长，群面也躲不掉了，但这种通过轮岗接受系统性培训的项目有它自己的优势。",
    tags: ["graduate", "application"], cooldownTags: ["application"], choices: [
      choice("research", "研究清楚轮岗机制、培养方式和往届晋升去向，然后投递", { analysis: 4 }, { effects: { time: -8, energy: -3, profile: 3 }, counters: { applications: 1 }, probabilityBonus: 0.08, successModel: "graduate_screen", success: outcome("oa", "这些研究帮助你写出了有内容的 Motivation。", { confidence: 4 }, { interviewLeads: 1 }, { flags: ["graduateTrack"] }), failure: outcome("reject", "投递没有回音，但你更清楚自己是否喜欢这种项目。", { confidence: -2 }, { rejections: 1 }) }),
      choice("apply", "先申请，项目细节可以边走边了解", { action: 4, exploration: 1 }, { effects: { time: -5, energy: -4 }, counters: { applications: 1 }, successModel: "graduate_screen", success: outcome("oa", "你拿到了下一轮在线测试。", { confidence: 4 }, { interviewLeads: 1 }, { flags: ["graduateTrack"] }), failure: outcome("reject", "系统发来一封很标准的邮件。", { confidence: -3 }, { rejections: 1 }) }),
      choice("skip", "轮岗不太适合我，先不申请", { pacing: 2, analysis: 2 }, { effects: { time: -2, confidence: 1 }, consequence: "你确认轮岗安排和培养方式并不符合当前计划，于是没有为了热门项目勉强自己进入一条漫长流程。" }),
    ],
  },
  {
    id: "batch-application-night", category: "application", stages: ["application"], baseWeight: 6,
    title: "收藏的岗位越来越多，今晚投哪些？", description: "你已经收藏了一批岗位，其中几份很快就要关闭申请入口。精力有限，今晚怎样安排投递？",
    tags: ["batch", "application"], cooldownTags: ["batch"], choices: [
      choice("batch", "集中把这一批投完，并做统一记录", { action: 5, resilience: 1 }, { effects: { time: -10, energy: -10, confidence: 2 }, counters: { applications: 4, interviewLeads: 1 }, consequence: "你完成了一大批申请，也把岗位、进度补进 Tracker。今晚很累，但你很有成就感。" }),
      choice("shortlist", "先投快要截止的那些岗位，尽可能把投递材料写好", { analysis: 4, pacing: 1 }, { effects: { time: -7, energy: -6, profile: 2 }, counters: { applications: 2, interviewLeads: 1 }, consequence: "你为每个投递的岗位都写好了 Cover Letter。你相信你准备的材料足够充分，也赶上了最紧急的 ddl。" }),
      choice("recover", "关掉网页，明天带着清醒的大脑再投", { pacing: 4, resilience: 2 }, { effects: { time: -4, energy: 11, confidence: 2 }, consequence: "你记下最临近的截止日期，然后准时休息。第二天再打开收藏夹时，判断岗位的速度反而更快。" }),
    ],
  },
  {
    id: "crowded-role", category: "application", stages: ["application"], baseWeight: 5,
    title: "打开一个岗位，发现已经有 1000+ 人申请了", description: "竞争者确实很多，但庞大的数字不会告诉你其中多少人合适，也没说你不能成为其中之一。",
    tags: ["competition", "application"], cooldownTags: ["competition"], choices: [
      choice("apply", "投递，1000+ 里面为什么不能有我", { action: 4, resilience: 2 }, { effects: { time: -5, energy: -3 }, counters: { applications: 1 }, successModel: "profile_screen", success: outcome("screen", "你在众多申请人中脱颖而出。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("reject", "竞争确实激烈，不过你已经尝试过，没给自己留下遗憾。", { confidence: -2 }, { rejections: 1 }) }),
      choice("fit", "先判断匹配度，再决定值不值得投入", { analysis: 4, pacing: 1 }, { effects: { time: -7, energy: -3, profile: 3 }, counters: { applications: 1 }, probabilityBonus: 0.08, successModel: "profile_screen", success: outcome("screen", "你找到了真正匹配的证据，在千人当中脱颖而出。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("pass", "研究之后，你决定把精力留给别处。", { confidence: 1 }) }),
      choice("move", "继续看看刚开放、竞争更少的机会", { exploration: 3, pacing: 2 }, { effects: { time: -2, energy: 2 }, consequence: "你没有把时间押在一个竞争过于激烈的岗位上，而是找到几份刚开放的新机会。你相信好的投递时机会带给你更高的成功率。" }),
    ],
  },
  {
    id: "alumni-reply", category: "networking", stages: ["preparation", "application"], baseWeight: 5,
    title: "叮——昨天联系的校友回复了你的消息", description: "对方愿意聊二十分钟。聊点什么？",
    tags: ["alumni", "networking"], cooldownTags: ["networking"], choices: [
      choice("prepare", "准备具体问题，聊聊这个你感兴趣的岗位的真实日常", { networking: 4, analysis: 2 }, { effects: { time: -6, energy: -3 }, successModel: "network_outreach", success: outcome("insight", "你得到了一些 JD 里没有写的信息。", { network: 10, confidence: 5, profile: 3 }, { referrals: 1 }), failure: outcome("brief", "聊天很快结束，但你练习了如何自然地开口。", { network: 4, confidence: 1 }) }),
      choice("ask-referral", "开门见山，问问有没有 Referral 机会", { networking: 4, action: 2 }, { effects: { time: -4, energy: -4 }, successModel: "network_outreach", success: outcome("referral", "时机刚好，对方愿意推荐你这个潜力股。", { network: 8, confidence: 6 }, { referrals: 1, interviewLeads: 1 }, { flags: ["referralPipeline"] }), failure: outcome("too-fast", "对方没有答应，但也礼貌说明了原因。", { confidence: -2, network: 1 }) }),
    ],
  },
  {
    id: "career-fair", category: "networking", stages: ["preparation", "application"], baseWeight: 4,
    title: "参加了一场 Career Fair，会场人山人海", description: "每个摊位都在排队，而你的社交电量并不是无限的。",
    tags: ["career-fair", "networking"], cooldownTags: ["networking"], choices: [
      choice("target", "锁定几家最感兴趣的公司，排到之后认真咨询提前准备好的问题", { analysis: 3, networking: 3 }, { effects: { time: -8, energy: -9, network: 9, confidence: 3 }, counters: { interviewLeads: 1 }, consequence: "你和目标公司的招聘人员聊到了岗位细节，也留下了联系方式。回家时社交电量见底，但不是抱着一袋传单空手而归。" }),
      choice("explore", "随便走走，哪里有空隙就凑过去听一听，或许能了解到一些陌生的新方向", { exploration: 4, networking: 2 }, { effects: { time: -6, energy: -6, network: 5, confidence: 4 }, flags: ["unexpectedTrack"], consequence: "你停在一个原本不在关注列表里的公司摊位前，意外发现工作内容与你很合拍。目标清单里多了一条此前没想到的方向。" }),
      choice("online", "拿走传单，离开现场，回家再做调研", { pacing: 3, analysis: 2 }, { effects: { energy: 3, profile: 2 }, consequence: "你没有勉强自己在嘈杂现场硬聊，而是拿走几份传单，之后再查看官网和岗位。今天没有消耗太多时间与精力。" }),
    ],
  },
  {
    id: "coffee-chat-reply", category: "networking", stages: ["application"], baseWeight: 5,
    title: "Coffee Chat 邀请被行业里的前辈接受了", description: "这不是面试，但是一个获得信息和资源的好机会。你想怎样聊？",
    tags: ["coffee-chat", "networking"], cooldownTags: ["networking"], choices: [
      choice("curious", "聊职业发展路径、团队挑战和工作日常", { networking: 4, exploration: 2, analysis: 1 }, { effects: { time: -7, energy: -4, network: 10, confidence: 4 }, consequence: "对方讲了几件 JD 里看不到的日常，也解释了新人对工作内容最容易误解的地方。你更清楚自己是否喜欢这种工作了。" }),
      choice("pitch", "展现自己的优势和动机，说说自己为什么对这个方向感兴趣", { expression: 3, networking: 3 }, { effects: { time: -7, energy: -5, network: 8, profile: 3 }, counters: { interviewLeads: 1 }, consequence: "你既认真提问，也自然介绍了自己的相关经历。几天后，对方把一个正在招聘的团队联系人推给了你。" }),
    ],
  },
  {
    id: "oa-invitation", category: "application", stages: ["application", "interview"], baseWeight: 7,
    requirements: { minCounters: { applications: 1 } }, title: "你收到了一份在线测试邀请", description: "包含性格测试和简短的 video interview，完成期限就在几天之后。你需要决定是否准备，以及准备到什么程度。",
    tags: ["assessment", "deadline"], cooldownTags: ["assessment"], choices: [
      choice("practice", "在网上查找攻略，熟悉题型，练习几遍之后再去做测试", { analysis: 3, reflection: 2 }, { effects: { time: -8, energy: -7 }, probabilityBonus: 0.12, successModel: "profile_screen", success: outcome("pass", "用心的准备让你更熟悉网测的节奏，恭喜，下一轮见。", { confidence: 5 }, { interviewLeads: 1 }), failure: outcome("fail", "虽然没有过线，也是为下一次的网测做铺垫。", { confidence: -3 }, { rejections: 1 }, { failureTags: ["online_test"] }) }),
      choice("start", "现在就做，相信第一反应和临场状态", { action: 4, resilience: 1 }, { effects: { time: -5, energy: -5 }, successModel: "profile_screen", success: outcome("pass", "你相信公司想看到真实的你自己。", { confidence: 6 }, { interviewLeads: 1 }), failure: outcome("fail", "测试过程是双向选择，你排除了一个或许没那么适合真实的你的工作。", { confidence: -4 }, { rejections: 1 }, { failureTags: ["online_test"] }) }),
      choice("withdraw", "对这个公司和岗位兴趣不大，不想花时间做测评了", { pacing: 4, analysis: 1 }, { effects: { time: -1, energy: 3, confidence: 1 }, consequence: "你确认这份岗位并非优先目标，于是主动退出。时间和精力回到了更重要的申请上。" }),
    ],
  },
  {
    id: "hr-screening", category: "interview", stages: ["interview"], baseWeight: 8,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "HR 来电，这是一次 Screening Call", description: "对方想快速了解你的申请动机、经历和基本期望。",
    tags: ["hr", "interview"], cooldownTags: ["interview"], choices: [
      choice("prepare", "准备短版自我介绍、动机和关键经历", { expression: 4, analysis: 1 }, { effects: { time: -8, energy: -5 }, successModel: "general_interview", success: outcome("pass", "回答清楚，也留下了继续了解的空间。招聘团队邀请你进入下一轮面试。", { confidence: 7 }, { interviews: 1, interviewLeads: 1 }), failure: outcome("fail", "对话没有推进，或许你和这个岗位没有那么合适。", { confidence: -4 }, { interviews: 1, rejections: 1 }, { failureTags: ["hr_interview"] }) }),
      choice("natural", "放松一点，把它当作双向了解", { exploration: 2, resilience: 2, expression: 1 }, { effects: { time: -5, energy: -4 }, successModel: "general_interview", success: outcome("pass", "交流感让双方都更快判断了匹配度。下一轮面试也随之进入日程。", { confidence: 6 }, { interviews: 1, interviewLeads: 1 }), failure: outcome("fail", "或许是彼此没有对上频道，或许下次还是要多准备一下。", { confidence: -2 }, { interviews: 1, rejections: 1 }) }),
    ],
  },
  {
    id: "technical-interview", category: "interview", stages: ["interview"], baseWeight: 7,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "收到了一场 Technical Interview 邀请，就在下周", description: "面试可能会问到专业知识或让你现场解题。面试官不只看最终答案，也会观察你怎样拆解陌生问题。",
    tags: ["technical", "interview"], cooldownTags: ["interview"], choices: [
      choice("drill", "刷高频题，并练习把思路说出来", { reflection: 3, action: 2 }, { effects: { time: -10, energy: -8, profile: 4 }, probabilityBonus: 0.12, successModel: "technical_interview", success: outcome("pass", "功夫不负有心人，你的流畅作答让面试官频频点头。", { confidence: 8 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "有些知识点没接住，但你的练习已经为下一次面试铺了路。", { confidence: -5 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
      choice("fundamentals", "复习基础知识，确保能够应对题库以外的灵活问题", { analysis: 2, reflection: 3, pacing: 1 }, { effects: { time: -9, energy: -6, profile: 5 }, successModel: "technical_interview", success: outcome("pass", "扎实的基础让你轻松应对各种灵活问题。", { confidence: 7 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "理解更扎实了，作答速度仍需要更多练习。", { confidence: -3, profile: 2 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
      choice("wing", "头脑清醒才是关键，这周需要多休息，而不是在脑海里塞满知识点", { pacing: 4, resilience: 2 }, { effects: { time: -4, energy: 8 }, successModel: "technical_interview", success: outcome("pass", "你的大脑为了回报你对它的照顾，在面试时运转得飞快。", { confidence: 9 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "面试官的问题打了你个措手不及。看来下次还是要多花些时间准备。", { confidence: -5 }, { interviews: 1, rejections: 1 }, { failureTags: ["technical_interview"] }) }),
    ],
  },
  {
    id: "behavioral-interview", category: "interview", stages: ["interview"], baseWeight: 7,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "Behavioral Question 问到你“曾经的一次失败经历”，要怎么讲呢？", description: "你有几段真实经历可以使用，但需要决定哪一段最能说明自己的行动与成长。",
    tags: ["behavioral", "interview"], cooldownTags: ["interview"], choices: [
      choice("stories", "讲一个真实故事，说清楚前因后果和从中学到了什么", { expression: 3, reflection: 3 }, { effects: { time: -8, energy: -5 }, probabilityBonus: 0.1, successModel: "general_interview", success: outcome("pass", "真实的故事有细节，也有说服力，面试官被打动了。", { confidence: 7, profile: 2 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "故事很真实，但没能体现出岗位所需的能力。", { confidence: -3 }, { interviews: 1, rejections: 1 }, { failureTags: ["behavioral_interview"] }) }),
      choice("match", "围绕岗位所需能力，挑最匹配的故事来讲", { analysis: 3, expression: 3 }, { effects: { time: -9, energy: -6 }, successModel: "general_interview", success: outcome("pass", "你的证据和岗位要求完美匹配，面试官觉得你就是他们想要的人。", { confidence: 7 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "逻辑很完整，但真实感还可以更多一点。", { confidence: -2 }, { interviews: 1, rejections: 1 }) }),
    ],
  },
  {
    id: "group-interview", category: "interview", stages: ["interview"], baseWeight: 5,
    requirements: { minCounters: { interviewLeads: 1 } }, title: "你参加了一场 Group Interview，总共八个人围着一张桌子坐下", description: "同组的人都很优秀，也很会说。真正的任务不是抢到最多台词，而是一起把讨论推进下去。",
    tags: ["group", "interview"], cooldownTags: ["interview"], choices: [
      choice("facilitate", "你充当领导者的角色，梳理讨论、邀请他人，推动大家做决定", { networking: 3, analysis: 2, expression: 1 }, { effects: { time: -7, energy: -7 }, successModel: "group_interview", success: outcome("pass", "你让团队更像团队，而不只是轮流发言。你的领导力得到了认可。", { confidence: 8, network: 3 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "群面表现的评判角度很多，这次的失败不意味着你实力不足。你对群面的经验更丰富了。", { confidence: -3 }, { interviews: 1, rejections: 1 }, { failureTags: ["group_interview"] }) }),
      choice("lead", "你贡献了很多有效的观点，逻辑也很清晰", { action: 3, expression: 2 }, { effects: { time: -6, energy: -8 }, successModel: "group_interview", success: outcome("pass", "你的创新思维和批判性思考惊艳了所有人。", { confidence: 8 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "有时，面试官看重的不是观点，而是你所展现的合作与沟通方式。不过，你强大的思考能力总会遇见赏识它的人。", { confidence: -4 }, { interviews: 1, rejections: 1 }) }),
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
    requirements: { minCounters: { offerLeads: 1 } }, title: "披荆斩棘，你终于来到了终面现场", description: "能走到这里已经说明了很多。最后一轮仍然是双向选择，你既要回答问题，也要确认团队和岗位是否适合自己。",
    tags: ["final", "interview"], cooldownTags: ["final"], choices: [
      choice("deep", "查找资料，了解团队目前面临的真实挑战，准备深入聊聊", { analysis: 3, expression: 2 }, { effects: { time: -8, energy: -6 }, probabilityBonus: 0.1, successModel: "offer_decision", success: outcome("offer", "公司正需要你这种能够解决实际问题的人。书面 Offer 很快发来，恭喜！", { confidence: 12 }, { interviews: 1, pendingOffers: 1 }), failure: outcome("wait", "或许是公司正在进行横向比较，你进入了 Waitlist，结果尚未落地。", { confidence: -2 }, { interviews: 1, waitlists: 1 }) }),
      choice("authentic", "重点放在动机上，也确认彼此是否合适", { exploration: 2, resilience: 2, expression: 1 }, { effects: { time: -6, energy: -5 }, successModel: "offer_decision", success: outcome("dream", "理想的工作发来了 Offer，你拥有了属于自己的双向奔赴。", { confidence: 15 }, { interviews: 1, pendingOffers: 1 }, { flags: ["dreamOffer"] }), failure: outcome("wait", "或许是公司正在进行横向比较，你进入了 Waitlist，但你不后悔进行了真诚的沟通。", { confidence: -1 }, { interviews: 1, waitlists: 1 }) }),
    ],
  },
  {
    id: "rejection-wave", category: "offer", stages: ["decision"], baseWeight: 7,
    title: "拒信今天选择组团抵达", description: "拒信像提前开过会一样挤在同一天进入你的邮箱。",
    tags: ["rejection", "decision"], cooldownTags: ["rejection"], choices: [
      choice("review", "复盘原因，争取在接下来的流程当中做得更好", { reflection: 5, resilience: 2 }, { effects: { time: -6, energy: -3, confidence: 2, profile: 3 }, counters: { rejections: 2 }, consequence: "你没有替沉默的招聘方编造原因，只打磨申请材料和面试回答中值得优化的部分。你对接下来的申请更有信心了。" }),
      choice("apply", "过去的就让它过去吧，投几个新机会，这条求职之路还要继续向前走", { action: 5, resilience: 2 }, { effects: { time: -7, energy: -6, confidence: -1 }, counters: { applications: 3, interviewLeads: 1, rejections: 2 }, consequence: "你允许失落存在，同时送出了几份新申请。新的面试机会很快就出现了。" }),
      choice("pause", "允许自己难过一天，今天只恢复状态，不逼着自己前进", { pacing: 5, resilience: 3 }, { effects: { time: -5, energy: 10, confidence: 3 }, counters: { rejections: 2 }, consequence: "你关掉邮箱，找朋友吃了顿饭，也睡了一个懒觉。第二天的你找回了自己的节奏。" }),
    ],
  },
  {
    id: "waitlist", category: "offer", stages: ["decision"], baseWeight: 5,
    title: "公司通知你进入 Waitlist", description: "这不是拒绝，也不是确定的结果。对方没有给出明确日期，而你手上还有其他流程要继续。",
    tags: ["waitlist", "decision"], cooldownTags: ["decision"], choices: [
      choice("follow", "礼貌确认时间线，也表达持续兴趣", { expression: 2, pacing: 2, action: 1 }, { effects: { time: -4, energy: -2 }, successModel: "offer_decision", success: outcome("offer", "一个礼貌又真诚的 follow-up 让流程重新动了起来，公司发来了 Offer。", { confidence: 10 }, { pendingOffers: 1 }), failure: outcome("wait", "对方仍需要时间，你将重心转移到其他选择。", { confidence: -1 }, { waitlists: 1 }) }),
      choice("continue", "继续其它的申请，不为一个不确定的结果耗费更多精力", { action: 3, resilience: 3 }, { effects: { time: -6, energy: -4, confidence: 2 }, counters: { applications: 2, interviewLeads: 1 }, consequence: "你继续推进其他岗位。新的面试邀请让等待不再占据全部注意力。" }),
    ],
  },
  {
    id: "ordinary-offer", category: "offer", stages: ["decision"], baseWeight: 6,
    requirements: { minCounters: { offerLeads: 1 } }, title: "一份不完美、但可以接受的 Offer", description: "Offer 终于到达，但要不要接受它，你还要再认真想一想。",
    tags: ["offer", "decision"], cooldownTags: ["offer"], choices: [
      choice("accept", "核实条件后接受，虽然不是 Dream Offer，但也可以作为职业的起点", { pacing: 2, action: 2 }, { effects: { time: -4, confidence: 12, energy: 4 }, counters: { offers: 1 }, consequence: "你确认了薪酬、岗位、入职时间和书面条款，随后正式接受。它不必是终身答案，但会成为下一段经历的跳板。" }),
      choice("decline", "它离想要的生活太远，继续寻找", { exploration: 3, resilience: 3 }, { effects: { time: -4, confidence: 2 }, flags: ["declinedOffer"], consequence: "你礼貌拒绝了这份 Offer，并保留了对方的联系方式。拒绝一个不合适的入口，也是在为真正想要的生活做选择。" }),
    ],
  },
  {
    id: "referral-conclusion", category: "offer", stages: ["decision"], baseWeight: 7,
    requirements: { flagsAny: ["referralPipeline"] }, title: "Referral 真的把你送到了最后一关。这场面试成功，你的 Offer 就会到手", description: "Referral 帮你被招聘方看见，能否抓住机会还是要看自己的表现。",
    tags: ["referral", "offer"], cooldownTags: ["offer"], choices: [
      choice("finish", "认真完成这场面试，也感谢帮助过你的人", { networking: 3, expression: 2, resilience: 1 }, { effects: { time: -6, energy: -4 }, probabilityBonus: 0.12, successModel: "offer_decision", success: outcome("offer", "Referral 打开一扇门，你自己走完了后面的路。书面 Offer 已经到手，接下来由你决定。", { confidence: 14, network: 6 }, { pendingOffers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "没有拿到 Offer，但人脉积累仍然是你的财富。", { confidence: -2, network: 3 }, { rejections: 1 }) }),
      choice("pressure", "担心辜负别人的推荐，于是疯狂加码准备", { expression: 2, action: 3 }, { effects: { time: -9, energy: -12 }, probabilityBonus: 0.08, successModel: "offer_decision", success: outcome("offer", "高投入消耗了不少能量，但你对自己、推荐人和公司都很负责。你认真的态度换来一份不错的 Offer。", { confidence: 12 }, { pendingOffers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "推荐并不等于承诺，你无需替结果道歉。", { confidence: -5 }, { rejections: 1 }) }),
      choice("steady", "按自己的节奏完成，不把人情变成压力", { pacing: 4, resilience: 2 }, { effects: { time: -5, energy: -3 }, successModel: "offer_decision", success: outcome("offer", "有实力就有一切，稳定发挥让这次推荐结出了果实。恭喜获得 Offer。", { confidence: 13 }, { pendingOffers: 1 }, { flags: ["referralOffer"] }), failure: outcome("close", "结果没有落地。推荐是一方面，与公司和岗位的匹配度不能勉强。", { confidence: -1, network: 2 }) }),
    ],
  },
  {
    id: "surprise-track", category: "offer", stages: ["decision"], baseWeight: 6,
    requirements: { flagsAny: ["unexpectedTrack"] }, title: "一个 HR 发来消息，是你从没考虑过的岗位方向", description: "它不在最初的目标清单里，工作内容却和你之前的经历意外合拍。你需要决定是否继续了解下去。",
    tags: ["unexpected", "offer"], cooldownTags: ["offer"], choices: [
      choice("explore", "认真聊完再做判断，你也很好奇新世界的大门", { exploration: 5, analysis: 1 }, { effects: { time: -6, energy: -4 }, successModel: "offer_decision", success: outcome("offer", "这个意外方向最终给了你一份 Offer。它打破了你对职业生涯原计划，但你喜欢这种惊喜。", { confidence: 13 }, { pendingOffers: 1 }, { flags: ["unexpectedOffer"] }), failure: outcome("insight", "机会没有变成 Offer，但你对自己愿意尝试的方向有了新的认识。", { confidence: 2 }) }),
      choice("focus", "继续专注原方向，避免同时推进太多流程", { analysis: 2, pacing: 3 }, { effects: { time: -2, energy: 3, confidence: 1 }, consequence: "你感谢对方的联系，拒绝并说明原因。目标方向没有改变，手上的准备也因此保持集中。" }),
    ],
  },
];
