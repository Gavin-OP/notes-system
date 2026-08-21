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

export const STANDARD_EVENT_ADDITIONS = [
  {
    id: "late-recruiter-message", category: "application", stages: ["application", "interview"], baseWeight: 4,
    title: "晚上十点，HR 突然发来消息", description: "对方问你明天是否方便快速聊聊。机会来得突然，可是已经很晚了。", tags: ["unexpected", "interview"],
    incidentEffects: { energy: { min: -2, max: -1 }, confidence: { min: 1, max: 3 } },
    choices: [
      choice("reply", "立刻确认收到，并约一个自己能准备好的时间", { pacing: 2, expression: 2 }, { effects: { time: -2, confidence: 3 }, counters: { interviewLeads: 1 }, consequence: "你礼貌确认了时间。第二天的沟通没有仓促开场。", metrics: { careerMomentum: 5 } }),
      choice("tomorrow", "时间太晚了，明天再回复吧", { pacing: 3, resilience: 1 }, { effects: { energy: 3, confidence: 1 }, counters: { interviewLeads: 1 }, consequence: "第二天醒来以后，你整理好状态回复了对方。机会还在那里，昨晚也没有因此少睡几个小时。", metrics: { careerMomentum: 3 } }),
    ],
  },
  {
    id: "family-question", category: "offer", stages: ["application", "interview", "closing"], baseWeight: 4,
    title: "家里人问：所以你找到工作了吗？", description: "他们可能只是关心，但这个问题仍然精准落在你最焦虑的地方。", tags: ["wellbeing"],
    incidentEffects: { energy: { min: -2, max: 0 }, confidence: { min: -5, max: -3 } },
    choices: [
      choice("explain", "说说流程正在怎样推进，也说明现在需要什么支持", { expression: 2, resilience: 2 }, { effects: { confidence: 3, energy: 2 }, consequence: "家里未必完全理解招聘流程，但对话不再只剩一句追问。", metrics: { lifeSatisfaction: 6 } }),
      choice("boundary", "告诉他们有结果会主动说，今天先不聊", { pacing: 3, resilience: 1 }, { effects: { energy: 5, confidence: 2 }, consequence: "你结束了这场不合时宜的更新会，也守住了今晚的状态。", metrics: { lifeSatisfaction: 5 } }),
      choice("spiral", "开始怀疑自己是不是落后了", { reflection: 1 }, { effects: { energy: -7, confidence: -7 }, consequence: "你刷了很久别人的进度，最后只得到一晚更差的睡眠。", metrics: { lifeSatisfaction: -9 } }),
    ],
  },
  {
    id: "classmate-offer", category: "offer", stages: ["application", "interview", "closing"], baseWeight: 4,
    title: "同学在朋友圈宣布拿到 Offer", description: "你真心替对方高兴，但焦虑不由得涌上心头。", tags: ["wellbeing"],
    incidentEffects: { confidence: { min: -4, max: -2 } },
    choices: [
      choice("congratulate", "认真祝贺，然后回到自己的节奏", { resilience: 3, pacing: 2 }, { effects: { confidence: 3, energy: 2 }, consequence: "别人的好消息没有抢走你的机会。你关掉群聊，继续做今天计划里的事。", metrics: { lifeSatisfaction: 5 } }),
      choice("learn", "祝贺后问问流程里有哪些值得准备的地方", { networking: 2, reflection: 2 }, { effects: { network: 4, profile: 2, confidence: 2 }, consequence: "同学分享了几条具体经验，你也没有把交流变成比较。", metrics: { careerMomentum: 3 } }),
      choice("compare", "默默打开招聘软件，焦虑地再投一批", { action: 3 }, { effects: { time: -6, energy: -8, confidence: -4 }, counters: { applications: 3 }, consequence: "申请数增加了，今晚的精力却被比较感提前用完。", metrics: { lifeSatisfaction: -7 } }),
    ],
  },
  {
    id: "unexpected-interview-question", category: "interview", stages: ["interview"], baseWeight: 5,
    requirements: { minCounters: { interviewLeads: 1 } }, repeatable: { maxOccurrences: 2 },
    title: "面试官问了一个你完全没准备过的问题", description: "大脑短暂空白。你可以诚实思考，也可以根据即时反应快速作出回答。", tags: ["interview", "unexpected"], cooldownTags: ["interview-pressure"],
    incidentEffects: { energy: { min: -2, max: -1 }, confidence: { min: -2, max: 0 } },
    lateFromTurn: 11, lateIncidentEffects: { energy: { min: -4, max: -2 }, confidence: { min: -3, max: -1 } },
    choices: [
      choice("think", "承认需要想一下，再把思路一步步说出来", { resilience: 2, analysis: 2 }, { effects: { confidence: 5 }, counters: { interviews: 1, offerLeads: 1 }, consequence: "你没有立刻给出漂亮答案，却让面试官看见了真实的思考过程。", metrics: { careerMomentum: 5 } }),
      choice("improvise", "快速开个头，边讲边让大脑飞速运转", { expression: 2, exploration: 2 }, {
        probabilityRule: "interview_improv",
        success: outcome("resolved", "你的快速反应能力让你接住了这个问题。讲到一半时思路逐渐清晰，你顺利把陌生问题接回了自己的经验。", { confidence: 4, profile: 2 }, { interviews: 1, offerLeads: 1 }, { metrics: { careerMomentum: 4 } }),
        failure: outcome("resolved", "你开头说得很快，后面的思路却没有及时跟上。几次追问以后，答案越来越散，这一轮最终没能继续推进。", { confidence: -4 }, { interviews: 1, rejections: 1 }, { metrics: { lifeSatisfaction: -2 }, failureTags: ["behavioral_interview"] }),
      }),
    ],
  },
  {
    id: "process-cancelled", category: "offer", stages: ["interview", "closing"], baseWeight: 4,
    requirements: { minCounters: { interviews: 1 } }, repeatable: { maxOccurrences: 2 },
    title: "流程走了一半，公司说岗位取消了", description: "不是你的表现出了问题，而是 HC、预算或团队安排改变了。但它就这样降临在你头上。", tags: ["rejection", "unexpected"], cooldownTags: ["process-shock"],
    incidentEffects: { energy: { min: -3, max: -1 }, confidence: { min: -6, max: -4 } },
    choices: [
      choice("respond", "感谢通知，询问能否保留未来联系", { resilience: 3, networking: 1 }, { effects: { confidence: -1, network: 3 }, counters: { rejections: 1 }, consequence: "抓住每一次可用的机会，万一公司因此记住了你呢？", metrics: { lifeSatisfaction: -2 } }),
      choice("pause", "默默消化这个结果，明天继续投递新的公司", { pacing: 3, resilience: 2 }, { effects: { energy: 7, confidence: 2 }, counters: { rejections: 1 }, consequence: "你允许失望存在，也没有把公司的变化解释成自己的失败。", metrics: { lifeSatisfaction: 4 } }),
    ],
  },
  {
    id: "blank-saturday", category: "profile", stages: ["preparation", "application", "interview"], baseWeight: 3,
    title: "因为工作日的高效努力，你提前完成了 to-do list 里的全部事项。这周六你没有任何事情要做", description: "没有测试、没有面试、也没有必须今天投的岗位。这段空白要怎样使用？", tags: ["wellbeing", "reflection"],
    incidentEffects: { energy: { min: 2, max: 5 }, confidence: { min: 1, max: 3 } },
    choices: [
      choice("rest", "真正放松休息一天", { pacing: 4, resilience: 2 }, { effects: { energy: 15, confidence: 4 }, consequence: "你睡到自然醒、吃了顿美食、出门走了走。你感到自己焕然一新。", metrics: { lifeSatisfaction: 12 } }),
      choice("review", "轻量复盘最近的流程", { reflection: 4, pacing: 2 }, { effects: { energy: 5, profile: 4, confidence: 3 }, consequence: "你在简历中找到两个能改的小问题，也准时关掉了文档。", metrics: { careerMomentum: 3, lifeSatisfaction: 5 } }),
      choice("grind", "难得有空，把收藏夹里的岗位全部投完", { action: 4 }, { effects: { time: -8, energy: -12 }, counters: { applications: 4, interviewLeads: 1 }, consequence: "流程推进了一大截，但下一个休息日何时才会到来？", metrics: { careerMomentum: 4, lifeSatisfaction: -8 } }),
    ],
  },
  {
    id: "group-interview-linkedin", category: "networking", stages: ["interview", "closing"], baseWeight: 4,
    requirements: { minCounters: { groupInterviews: 1 } },
    title: "你刷到和你参加了同一场群面的求职者的 LinkedIn", description: "大厂实习、比赛冠军、论文发表……还有一排你甚至没听说过的证书。", tags: ["comparison", "networking"],
    incidentEffects: { confidence: { min: -3, max: -1 } },
    choices: [
      choice("coffee-chat", "研究一下对方的经历，约个 coffee chat 交流一下", { analysis: 2, exploration: 2, networking: 3 }, { effects: { time: -6, energy: -4, confidence: -1, profile: 2, network: 6 }, consequence: "你虽然感到了压力，却也把它变成了一次学习和自我提升的契机。你们并非纯粹的竞争关系，也有可能成为志同道合的伙伴。" }),
      choice("withdraw", "越看越觉得自己完全没有竞争力，干脆放弃这个岗位", { analysis: 2, pacing: 2, exploration: 1 }, { effects: { time: -3, energy: 2, confidence: -3 }, consequence: "你觉得自己十成里有十一成是没戏了。十分钟后，你已经从「这个人履历不错」推导到了「我大概找不到工作」。" }),
      choice("focus", "立刻关闭 LinkedIn 界面，去做自己该做的事", { resilience: 3, pacing: 3 }, { effects: { time: -2, energy: 3, confidence: 4 }, consequence: "你觉得自己已经做到了最好，因此无需和别人比较。别人的履历不会改变你的进度。" }),
    ],
  },
  {
    id: "direction-doubt", category: "profile", stages: ["application", "interview"], baseWeight: 4,
    requirements: { minTurn: 5, minCountersAny: { rejections: 1, waitlists: 1 } },
    title: "你突然开始怀疑：我真的适合当前这个求职方向吗？", description: "求职进行了一段时间，却迟迟没有明显进展。最开始确定的目标出现了松动。", tags: ["direction", "reflection"],
    incidentEffects: { confidence: { min: -3, max: -1 } },
    choices: [
      choice("broaden", "投一些别的岗位，给自己多一点选择的空间", { exploration: 4, action: 2, resilience: 1 }, { effects: { time: -7, energy: -5, confidence: 1 }, counters: { applications: 2 }, consequence: "你没有把鸡蛋放在同一个篮子里。多一些选择，多了一些进展，少了一些焦虑。" }),
      choice("industry-chat", "找一个相关行业的人聊聊真实工作场景和自己的适配度", { networking: 3, exploration: 3, analysis: 1 }, { effects: { time: -6, energy: -4, network: 7, confidence: 3, profile: 3 }, consequence: "你发现自己依然对这个行业和岗位感兴趣，也补足了简历和面试材料中的一些不足之处。" }),
      choice("continue", "放松心情，暂时按照原计划继续", { pacing: 4, resilience: 2 }, { effects: { time: -2, energy: 5, confidence: 2 }, consequence: "你决定不去想那么多，先处理眼前能够推进的事情。" }),
    ],
  },
  {
    id: "wrong-resume-version", category: "application", stages: ["application", "interview"], baseWeight: 5,
    requirements: { minCounters: { applications: 1 } },
    title: "你发现自己投错了简历版本", description: "申请已经提交，附件里却是两周前的那一版，其中有一条项目经历还没有更新。", tags: ["application", "profile"], cooldownTags: ["application-mistake"],
    incidentEffects: { confidence: { min: -3, max: -1 } },
    choices: [
      choice("correct", "找 HR 或往招聘邮箱礼貌补发新版", { action: 3, expression: 3 }, { effects: { time: -4, energy: -3, confidence: -1 }, successModel: "network_outreach", probabilityBonus: 0.05, success: outcome("corrected", "对方回复，已经帮你把新版的简历替换了上去。看来及时沟通是有作用的。", { confidence: 4, profile: 1 }), failure: outcome("unconfirmed", "没有收到回复。但是或许对方已经默默帮你替换了简历。", { confidence: 1 }) }),
      choice("leave", "不处理了，这版也没有严重错误，发邮件说明反而显得自己粗心大意", { pacing: 3, analysis: 2, resilience: 1 }, { effects: { time: -1, energy: 2, confidence: 1 }, consequence: "旧版本简历依然能够展示你的经历，虽然少了一些亮点。你接受这次小失误，然后继续下一份申请。" }),
    ],
  },
  {
    id: "instant-rejection", category: "application", stages: ["application", "interview"], baseWeight: 7,
    requirements: { minCounters: { applications: 1 } }, repeatable: { maxOccurrences: 2 },
    title: "刚投递了一个岗位，十分钟后就收获了拒信", description: "你甚至还没来得及忘记自己投过这个岗位。", tags: ["application", "rejection"], cooldownTags: ["rejection"],
    incidentEffects: { confidence: { min: -3, max: -1 } },
    choices: [
      choice("inspect", "检查是不是资格条件或者关键词出了问题", { analysis: 4, reflection: 3 }, { effects: { time: -5, energy: -3, confidence: -2, profile: 4 }, counters: { rejections: 1 }, consequence: "你发现有一项硬性资格要求你并不符合，也顺便调整了之后筛选岗位的方法。" }),
      choice("keep-applying", "不管了，接着投递下一份", { action: 4, resilience: 3 }, { effects: { time: -4, energy: -3, confidence: -1 }, counters: { applications: 2, rejections: 1 }, consequence: "十秒后你就忘记了这件事。" }),
      choice("self-doubt", "有些自我怀疑，我的简历连机器筛选都过不了吗？", { reflection: 3, analysis: 2 }, { effects: { time: -3, energy: -4, confidence: -4, profile: 2 }, counters: { rejections: 1 }, consequence: "你的信心下降了。但其实，一次机筛后的拒信完全无法反映你的真实实力。公司也有可能会因为某个硬性标准失去与人才接触的机会。" }),
    ],
  },
  {
    id: "networking-silence", category: "networking", stages: ["application", "interview"], baseWeight: 6,
    requirements: { minTurn: 3, minAttributes: { network: 12 } }, repeatable: { maxOccurrences: 2 },
    title: "你在 LinkedIn 上发出了五条 Networking 邀请，三天后依旧一条回复都没有收到", description: "你焦急地等待着手机弹出新的消息提醒。", tags: ["networking", "rejection"], cooldownTags: ["networking"],
    incidentEffects: { confidence: { min: -3, max: -1 } },
    choices: [
      choice("rewrite", "调整消息模板，再尝试联系另一批人", { reflection: 3, networking: 4, resilience: 1 }, { effects: { time: -6, energy: -5, confidence: -1, network: 6 }, consequence: "你缩短了自我介绍，也把问题写得更具体。这次，你很快就收到了一些回复。" }),
      choice("known-contacts", "暂时停止与陌生人建立 Connection，先与认识的同学聊一聊", { pacing: 3, networking: 3, exploration: 1 }, { effects: { time: -4, energy: -2, confidence: 3, network: 7 }, consequence: "你和几个已经认识的同学聊了起来。他们分享了一些经验，也帮你引荐了更多人脉。" }),
      choice("profile-focus", "暂时放弃 Networking，把时间放在简历润色或技能补充上", { pacing: 3, analysis: 2, resilience: 2 }, { effects: { time: -6, energy: -4, confidence: 2, profile: 6 }, consequence: "Networking 不是求职道路上必须要做的事，它会有用，但做好自己的事带来的回报也很明显。" }),
    ],
  },
  {
    id: "group-interruption", category: "interview", stages: ["interview"], baseWeight: 7,
    requirements: { minCounters: { interviewLeads: 1 } }, repeatable: { maxOccurrences: 2 },
    title: "群面中，另一位候选人连续打断了你两次", description: "你需要决定怎样把观点带回讨论，同时不让团队协作变成抢话比赛。", tags: ["interview", "group"], cooldownTags: ["interview-pressure"],
    incidentEffects: { energy: { min: -2, max: -1 }, confidence: { min: 1, max: 3 } },
    lateFromTurn: 11, lateIncidentEffects: { energy: { min: -5, max: -3 }, confidence: { min: -1, max: 1 } },
    choices: [
      choice("wait-turn", "等待合适的时机，再把观点完整说完", { resilience: 3, pacing: 2, expression: 2 }, { effects: { time: -5, energy: -5, confidence: -1 }, successModel: "group_interview", probabilityBonus: 0.05, success: outcome("pass", "你没有陷入抢话之争，也依然让自己的观点被看见。", { confidence: 7 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "机会出现得太少，面试结束时你也没有来得及说完自己的观点。", { confidence: -3 }, { interviews: 1, rejections: 1 }) }),
      choice("reclaim", "不接受被打断，主动把讨论拉回自己的观点", { action: 3, expression: 4, resilience: 1 }, { effects: { time: -5, energy: -7, confidence: 1 }, successModel: "group_interview", success: outcome("pass", "你稳稳地拿回了发言空间。", { confidence: 8 }, { interviews: 1, offerLeads: 1 }), failure: outcome("fail", "讨论逐渐变成了争夺话语权。", { confidence: -4 }, { interviews: 1, rejections: 1 }) }),
    ],
  },
  {
    id: "great-interview-rejection", category: "offer", stages: ["interview", "closing"], baseWeight: 6,
    requirements: { minCounters: { interviews: 1 } }, repeatable: { maxOccurrences: 2 },
    title: "参加完一场面试，你的自我感觉极佳，然而——", description: "回答流畅，交流自然，面试官全程保持微笑。三天后，拒信来了。", tags: ["interview", "rejection"], cooldownTags: ["rejection"],
    incidentEffects: { energy: { min: -3, max: -1 }, confidence: { min: -5, max: -3 } },
    choices: [
      choice("accept", "接受这个结果，提醒自己面试表现和最终录用之间还有很多变量，继续下一场", { resilience: 4, pacing: 2 }, { effects: { time: -3, energy: -2, confidence: -2 }, counters: { rejections: 1 }, consequence: "失望依然存在，但你没有因此推翻自己对整场面试表现的判断。下一次，你依旧信心满满地展现自己。" }),
      choice("request-feedback", "好奇到底是哪里出了问题，礼貌请求 Feedback", { reflection: 4, expression: 2 }, { effects: { time: -4, energy: -3, confidence: -3 }, counters: { rejections: 1 }, successModel: "network_outreach", success: outcome("feedback", "对方给了反馈，你明白了下一次可以怎样提升。", { profile: 5, confidence: 3 }), failure: outcome("no-reply", "没有得到回复，这次流程正式结束于此。", { confidence: -1 }) }),
      choice("self-doubt", "有些自我怀疑，不明白到底要做到什么程度才能收获 Offer", { reflection: 3, exploration: 2 }, { effects: { time: -4, energy: -4, confidence: -5, profile: 2 }, counters: { rejections: 1 }, consequence: "这封拒信击中了你，因为你原本真的相信自己会成功。但是求职路上的变动因素很多，有时只是差了一点缘分，或许更适合你的公司和岗位还在后面等着你。" }),
    ],
  },
];
