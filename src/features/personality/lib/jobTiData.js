import {
  INTERVIEW_BRANCH_OPTIONS,
  PILOT_STAGE_OPTIONS,
  PROFILE_BRANCH_OPTIONS,
  SEARCH_BRANCH_OPTIONS,
} from "../../navigation/lib/pilotPath";

export const JOBTI_STORAGE_KEY = "notes-system:job-seeker-personality:v2";

export const TYPES = {
  explorer: { code: "LINK", name: "林克", typeLabel: "开放探索型", eyebrow: "求职界林克，终有一天，到达你的塞尔达身边", color: "sky", summary: "你的求职地图不是一条规定路线，而是一片等待探索的开放世界。你会留意意料之外的行业、团队和生活方式，也允许方向随着经历更新。别人沿着攻略直奔终点时，你可能正在支线里捡到真正适合自己的入口。", buff: "开放世界玩家", skill: "在别人没注意的地方发现新入口", watch: "探索不需要标准答案；遇到真正喜欢的方向，也记得多走几步。" },
  radar: { code: "IN", name: "LinkedIn", typeLabel: "分析匹配型", eyebrow: "你甚至会研究 HR 的 HR 是谁", color: "blue", summary: "一份 JD 到你手里，很快就会变成岗位职责、团队位置、能力证据和发展路径的拆解报告。你希望每次申请都说得出理由，也擅长从零散信息里判断机会是否值得投入。", buff: "JD 信号捕捉器", skill: "从三行招聘描述里研究出一整条职业路径", watch: "有些信息只有走进流程才会出现，偶尔先申请、再继续研究也完全合理。" },
  engine: { code: "SEA", name: "海王", typeLabel: "行动执行型", eyebrow: "海投的王，也是海王", color: "orange", summary: "你的求职哲学很直接：机会出现，就让自己先进入候选池。面对不确定性，你更愿意用行动换信息，而不是花很久预测 HR 会不会喜欢自己。你的投递表可能已经长得像企业数据库。", buff: "Submit 键冷却为零", skill: "被拒之后光速寻找下一个入口", watch: "行动能增加被看见的机会，也可以把更多精力留给真正想去的岗位。" },
  alchemist: { code: "V∞", name: "X团神券", typeLabel: "表达优化型", eyebrow: "简历没有膨胀，只是无限靠近我的真实实力", color: "purple", summary: "你很懂同一段经历可以有不同的表达重点。分析岗看方法与结论，产品岗看需求与推进，客户岗位看沟通与影响。你愿意不断打磨材料，让别人更快看懂你做过什么、为什么重要。", buff: "经历表达增益券", skill: "同一段实习讲出多种 competency", watch: "把真实价值讲清楚就够了，不需要把自己改造成一个不存在的完美候选人。" },
  researcher: { code: "REV", name: "复仇者", typeLabel: "反思成长型", eyebrow: "我又双叒重生在面试的前一晚，这一次，我要……", color: "teal", summary: "申请、测试、面试、记录、复盘、Version 2.0——你很擅长把一次经历变成下一次升级的经验值。即使某场面试没有结果，你通常也能从问题、追问和自己的状态里带走一些东西。", buff: "EXP 获取速度 ×2", skill: "把一次社死变成下一场面试素材", watch: "不是每封拒信背后都有值得破解的深层原因；HC、时机、竞争和运气也会参与结果。" },
  protector: { code: "GPT", name: "GPT", typeLabel: "状态保护型", eyebrow: "我就在这里，稳稳地接住自己", color: "rose", summary: "当求职群开始播报开奖、缩 HC 和同学的第几个 Offer，你知道什么时候应该把消息设为免打扰。你愿意认真争取机会，也不准备让一份申请决定今天的晚饭是否好吃。", buff: "精神防御 +100", skill: "在求职群 99+ 中保持生命体征", watch: "照顾状态和继续行动可以同时发生；休息不是退出比赛。" },
  gardener: { code: "JGL", name: "野王", typeLabel: "自我节奏型", eyebrow: "发起投降和泉水挂机，就不算节奏了？", color: "green", summary: "你开始对统一的人生排行榜产生免疫力。工作、收入和成长仍然重要，但你也会认真问：这样的日常是不是自己想要的？你不急着复制别人的时间表，更愿意为自己的长期路线留出空间。", buff: "自带节奏权", skill: "在集体焦虑里重新找到自己的坐标", watch: "按自己的节奏走，也要记得主动为想要的生活创造机会。" },
  koi: { code: "KIM", name: "卡戴珊太后", typeLabel: "乐观幽默型", eyebrow: "保持快乐，保持好运，保持富态", color: "gold", summary: "你拥有一种高压环境里很珍贵的能力：把荒诞的招聘要求和随机流程变成段子。许愿、求职搭子和开奖群未必能左右 HR，但幽默感确实能给漫长流程增加一层缓冲。", buff: "幸运值？？？", skill: "把就业寒冬过成大型互联网真人秀", watch: "可以许愿，也记得点击 Submit Application。" },
};

const personality = (id, title, hint, options) => ({ id, kind: "personality", title, hint, options });
const pathSingle = (id, field, title, hint, options) => ({ id, field, kind: "path-single", title, hint, options });
const pathMulti = (id, field, title, hint, options, emptyLabel) => ({ id, field, kind: "path-multi", title, hint, options, emptyLabel });

export const QUIZ_ITEMS = [
  personality("jd", "看到一份岗位 JD 写着“偏好名校背景、3段大厂、5段实习、垂直经历”，你的脑内弹幕是？", "凭第一反应选，求职已经够费脑子了。", [
    { label: "让我看看这个岗位到底有多少含金量", scores: ["researcher", "radar"] },
    { label: "符合多少算多少，先投了再说", scores: ["engine", "explorer"] },
    { label: "研究一下我的经历还能怎么膨胀", scores: ["gardener", "alchemist"] },
    { label: "好的，看来招聘市场也有自己的许愿池", scores: ["koi", "protector"] },
  ]),
  pathSingle("stage", "stage", "先定位一下：你现在走到求职的哪一站？", "这题会调整你的专属求职规划 Path 的起点，已经走过的准备阶段不会再排在前面。", PILOT_STAGE_OPTIONS),
  personality("competition", "当你发现“神仙打架”的岗位，页面已经显示2000+人申请……", "在做的 GPA 全部拉满！", [
    { label: "研究一下岗位，我和它合不合适才最重要", scores: ["gardener", "radar"] },
    { label: "先投。2000+人里为什么不能有我", scores: ["koi", "engine"] },
    { label: "继续看看其他刚开放的机会", scores: ["explorer", "protector"] },
    { label: "修改简历，争取让重点更突出", scores: ["alchemist", "researcher"] },
  ]),
  personality("resume", "改简历改到第 17 版时，什么最能给你一点成就感？", "放心，没有人会检查你的答案一致性。", [
    { label: "终于能用一句人话讲明白自己做过什么", scores: ["alchemist", "researcher"] },
    { label: "这版与 dream position 简直完美匹配", scores: ["radar", "engine"] },
    { label: "朋友看完说：你原来做过这么多东西？", scores: ["koi", "protector"] },
    { label: "简历只是一页纸，我的人生塞不完", scores: ["explorer", "gardener"] },
  ]),
  pathMulti("materials", "profile_branches", "除了简历，你的求职材料还想补齐哪些拼图？", "我们会把相关材料的准备方法加入你的 Path，可以多选。", PROFILE_BRANCH_OPTIONS, "暂时只准备简历"),
  personality("planning", "HR 问“你的职业规划是什么？”时，你的内心真实版本更接近？", "此处无需展示 leadership，请诚实作答。", [
    { label: "我有方向，也愿意一路修正", scores: ["radar", "alchemist"] },
    { label: "世界这么大，我想多看看有哪些可能", scores: ["koi", "explorer"] },
    { label: "先把眼前的事做好，答案会慢慢出现", scores: ["engine", "researcher"] },
    { label: "希望未来的我有工作、有下班，也有双休", scores: ["protector", "gardener"] },
  ]),
  pathMulti("search", "search_branches", "找岗位时，你想给自己增加哪些入口？", "除了直接投递，我们还有一些提升效率的方式。可以多选。", SEARCH_BRANCH_OPTIONS, "先使用基础岗位搜索流程"),
  personality("assessment", "收到招聘流程中的在线测试邀请，你会？", "它可能是能力测试、限时笔试或情境判断。", [
    { label: "先查清题目形式，找几道样题练手", scores: ["researcher", "radar"] },
    { label: "感觉麻木，秋招至今已经做过不下10套测评题", scores: ["gardener", "protector"] },
    { label: "先做再说，相信第一反应", scores: ["engine", "koi"] },
    { label: "认真准备，争取完美符合公司价值观", scores: ["alchemist", "explorer"] },
  ]),
  pathSingle("leetcode", "leetcode", "LeetCode 要不要加入这局？", "只有目标岗位确实会考算法、代码或 SQL 时，它才需要进入 Path。", [
    { value: true, label: "要，JD 或流程已经明确会考" },
    { value: false, label: "暂时不用，先把时间留给更相关的准备" },
  ]),
  personality("failure", "面试官问“你最大的失败是什么？”时，你的脑内第一反应？", "这里不用 STAR，选一个就行。", [
    { label: "挑一个真正让我学到东西的经历", scores: ["researcher", "gardener"] },
    { label: "寻找一个最适合这个岗位的故事", scores: ["radar", "engine"] },
    { label: "讲得真实、有逻辑，而且能看到成长", scores: ["alchemist", "explorer"] },
    { label: "还没找到工作就是我的失败", scores: ["protector", "koi"] },
  ]),
  pathSingle("certificates", "certificate_interest", "金融证书（CPA、CFA、FRM）要不要加入你的准备工作？", "这题只决定是否加入金融证书概览，不会替你报名，也不会擅自选择具体证书。", [
    { value: "skip", pathValue: false, label: "秋招已经很累了，没精力学习啦", scores: ["protector", "gardener"] },
    { value: "learn", pathValue: true, label: "想认真看看，至少先搞懂它们分别有什么用", scores: ["researcher", "radar"] },
    { value: "consider", pathValue: true, label: "已经报名了，主打一个骑虎难下", scores: ["engine", "koi"] },
    { value: "later", pathValue: false, label: "先把眼前的申请交了，证书以后再议", scores: ["explorer", "alchemist"] },
  ]),
  personality("silence", "连续一段时间没有新消息，你的做法更接近？", "先深呼吸。暂时没有消息，也是一种消息静音。", [
    { label: "重新评估自身，调整申请策略", scores: ["radar", "researcher"] },
    { label: "换几个申请渠道，也看看之前忽略的机会", scores: ["explorer", "engine"] },
    { label: "找朋友聊聊，一起吐槽就业市场", scores: ["protector", "koi"] },
    { label: "允许自己丧一会儿，然后继续生活", scores: ["gardener", "alchemist"] },
  ]),
  pathMulti("interviews", "interview_branches", "接下来，你会遇到什么形式的面试？", "我们为你提供综合性的建议，但你也可以选择对某种面试进行专项突击。可以多选。", INTERVIEW_BRANCH_OPTIONS, "暂时不确定，先看综合准备"),
  personality("message", "如果给这次求职的自己留一句话，你更想选？", "这一题不计鸡汤浓度，只看你现在想听哪句。", [
    { label: "我在寻找适合自己的生活，不是在参加比赛", scores: ["gardener", "radar"] },
    { label: "世界很大，一份 Offer 只是其中一个入口", scores: ["explorer", "koi"] },
    { label: "走过的路都会留下东西，暂时没有结果也算经历", scores: ["researcher", "engine"] },
    { label: "慢一点也可以，我有自己的时间表", scores: ["protector", "alchemist"] },
  ]),
];

export function rankJobTiResults(responses = {}) {
  const scores = Object.fromEntries(Object.keys(TYPES).map((key) => [key, 0]));
  QUIZ_ITEMS.filter((item) => item.options.some((option) => option.scores?.length)).forEach((item) => {
    const response = responses[item.id];
    const option = item.kind === "personality"
      ? item.options[response]
      : item.options.find((candidate) => candidate.value === response);
    if (option?.scores?.[0]) scores[option.scores[0]] += 2;
    if (option?.scores?.[1]) scores[option.scores[1]] += 1;
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([key]) => key);
}

export function buildJobTiPathProfile(responses = {}, previous = {}) {
  const certificateOption = QUIZ_ITEMS.find((item) => item.id === "certificates")?.options.find((option) => option.value === responses.certificates);
  const certificateInterest = responses.certificates === true || Boolean(certificateOption?.pathValue);
  return {
    ...previous,
    stage: responses.stage || previous.stage || "getting_started",
    profile_branches: Array.isArray(responses.materials) ? responses.materials : [],
    search_branches: Array.isArray(responses.search) ? responses.search : [],
    skill_branches: responses.leetcode ? ["technical"] : [],
    certificate_interest: certificateInterest,
    certificate_branches: certificateInterest ? (previous.certificate_branches || []) : [],
    interview_branches: Array.isArray(responses.interviews) ? responses.interviews : [],
    jobti_path_version: 1,
    setup_complete: true,
  };
}

export function getJobTiPathSummary(responses = {}) {
  const stage = PILOT_STAGE_OPTIONS.find((option) => option.value === responses.stage)?.label || "刚开始准备求职";
  const materials = PROFILE_BRANCH_OPTIONS.filter((option) => responses.materials?.includes(option.value)).map((option) => option.label);
  const search = SEARCH_BRANCH_OPTIONS.filter((option) => responses.search?.includes(option.value)).map((option) => option.label);
  const interviews = INTERVIEW_BRANCH_OPTIONS.filter((option) => responses.interviews?.includes(option.value)).map((option) => option.label);
  return [
    `你的 Path 将从「${stage}」开始。`,
    materials.length ? `材料分支：${materials.join("、")}。` : "材料先从简历开始，需要时再扩展。",
    search.length ? `找岗方式：${search.join("、")}。` : "先沿用基础的岗位搜索与筛选流程。",
    responses.leetcode ? "LeetCode 已加入技能准备。" : "目前不额外加入 LeetCode。",
    responses.certificates === true || ["learn", "consider"].includes(responses.certificates) ? "先了解金融证书，再决定是否投入。" : "目前不把金融证书放进主线。",
    interviews.length ? `面试专项：${interviews.join("、")}。` : "暂时先从综合面试准备开始。",
  ];
}
