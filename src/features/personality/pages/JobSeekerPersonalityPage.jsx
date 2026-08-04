import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined, DownloadOutlined, HomeOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import "./JobSeekerPersonalityPage.css";

const STORAGE_KEY = "notes-system:job-seeker-personality:v1";

const TYPES = {
  explorer: { code: "WILD", name: "人生旷野探险家", eyebrow: "Offer 是入口，不是终点", color: "sky", summary: "你的秋招关键词是：可能性。比起找到一条所有人都认可的“正确路线”，你更在意自己究竟想去哪里。大厂、热门岗位、光鲜 Title 对你当然有吸引力，但它们很难成为你唯一的坐标。你会研究新的行业，会对意料之外的岗位产生兴趣，也允许自己的职业规划随着经历不断变化。", buff: "开放世界玩家", skill: "在别人没注意的地方发现新入口", watch: "探索可以没有标准路线，但记得给喜欢的方向多走几步。", path: "从「秋招定位与行动计划」出发，再去「理解岗位与市场」打开地图。" },
  radar: { code: "RADAR", name: "人形岗位雷达", eyebrow: "JD 一出现，大脑自动开始匹配", color: "blue", summary: "别人看到 JD：投就完事！你看到 JD：这个 team 在组织里负责什么？这个岗位真正解决什么问题？我的经历应该突出哪部分？未来 progression 怎么样？十分钟后，你已经快把公司组织架构研究明白了。你不太喜欢为了秋招而秋招，比起申请数量，更在意这个岗位究竟能把自己带到哪里。", buff: "JD 信号捕捉器", skill: "从三行招聘描述里研究出一整条职业路径", watch: "有些机会需要走进去以后才知道合不合适，允许自己偶尔先投再研究。", path: "优先看看「理解岗位与市场」和「寻找与筛选合适岗位」。" },
  engine: { code: "GO!", name: "秋招永动机", eyebrow: "焦虑解决不了问题，但海投五家可以", color: "orange", summary: "你的秋招哲学非常朴素：有机会，就试试。别人还在纠结“我只有 70% match 要不要投”，你的申请已经进入公司系统了。焦虑的时候投递，迷茫的时候投递，看到神仙打架还是投递。你知道就业市场里存在大量随机性，所以更愿意给自己增加一次被看见的机会。你的秋招 Excel 可能已经长得像企业数据库。", buff: "行动力 +100", skill: "被拒之后光速寻找下一个入口", watch: "数量能够增加概率，精力也值得留给真正想去的机会。", path: "进入「寻找与筛选合适岗位」和「投递与流程管理」，让行动更有章法。" },
  alchemist: { code: "V17", name: "求职炼金术士", eyebrow: "一份经历可以炼出八个版本", color: "purple", summary: "你深谙秋招世界的一条生存法则：同一段经历，可以有很多种讲法。Data Analyst 要数据分析，Product 要需求洞察，Consulting 要 problem-solving。然后你看着三个月前的自己：“当时怎么写得这么朴素？”你擅长理解招聘规则，也愿意研究怎样让自己的经历被别人更快看懂。面对竞争，你的第一反应通常是继续优化。", buff: "经历炼金术", skill: "同一段实习讲出八种 competency", watch: "让别人看见你的价值就够了，你无需把自己包装成一个不存在的完美候选人。", path: "从「准备简历与 Profile」开始，按需加入 Cover Letter、项目集或个人主页。" },
  researcher: { code: "R&D", name: "秋招学术研究员", eyebrow: "面试结束五分钟，复盘文档已经建好了", color: "teal", summary: "你的秋招可能已经形成完整闭环：申请 → 测评 → 面试 → 记录 → 复盘 → Version 2.0。别人面试结束开始刷小红书，你已经打开 Notion：Question 1、What went well、What could be improved、下次怎么回答。你相信很多事情可以通过练习变得更好，所以即使一场面试没有结果，它在你这里通常也不会完全浪费。", buff: "EXP 获取速度 ×2", skill: "把一次社死变成下一场面试素材", watch: "有些拒信没有值得复盘的深层原因。招聘本身也包含时机、HC、竞争结构和运气。", path: "优先进入「在线测试」「面试准备」和「面试复盘」。" },
  protector: { code: "OFF", name: "精神状态保护协会会长", eyebrow: "Offer 可以晚点来，觉必须今天睡", color: "rose", summary: "秋招群：“XX 开奖了！”“有人收到 OC 吗？”“今年是不是缩 HC？”“我同学已经三个 Offer 了。”你：消息免打扰。你已经逐渐意识到，秋招最危险的 KPI 可能不是投递数量，而是每天打开小红书之后的精神状态。你愿意努力，也允许自己休息。今天没有收到 Offer，不妨碍今天的晚饭依然好吃。", buff: "精神防御 +100", skill: "在“XX 届秋招互助群 99+”中保持生命体征", watch: "松弛感和行动力可以同时存在。该争取的机会，依然值得认真争取。", path: "从自己的节奏出发查看「秋招定位与行动计划」，需要时再调整 Path。" },
  gardener: { code: "GROW", name: "自己的人生园丁", eyebrow: "不赶别人的花期", color: "green", summary: "从高考到 GPA，从实习数量到大厂 Logo，再从 Offer 数量到起薪，好像人生永远存在下一张排行榜。你开始对这套排行榜产生了一点免疫力。你依然希望拥有一份好的工作，也希望获得成长、收入和成就感，只是越来越在意另一个问题：“这样的生活，是我自己想要的吗？”花期不同，人生没有统一的校招截止日期。", buff: "长期主义", skill: "在集体焦虑里重新找到自己的坐标", watch: "按自己的节奏走，也记得主动为想要的生活创造机会。", path: "先看「秋招定位与行动计划」，慢慢确认什么才是你想要的生活。" },
  koi: { code: "LUCK", name: "就业市场幸存锦鲤", eyebrow: "科学求职，玄学上岸", color: "gold", summary: "你的秋招方法论十分丰富：投递时间玄学、Offer 大楼、许愿帖、开奖群、求职搭子、转发锦鲤。你当然知道这些东西未必真的影响 HR，但是万一呢。更重要的是，你拥有一种在高压环境里非常珍贵的能力：把荒诞的事情变成段子。测评做麻了，可以笑；面试答崩了，可以笑；看到“3 年经验，应届生岗位”，更值得笑。", buff: "幸运值？？？", skill: "把就业寒冬过成大型互联网真人秀", watch: "可以许愿，也记得点击 Submit Application。", path: "看看「寻找与筛选合适岗位」，把好运落到一次真实的 Submit 上。" },
};

const QUESTIONS = [
  ["看到“名校优先、3 段大厂、5 段实习”，你的脑内弹幕是？", "凭第一反应选，秋招已经够费脑子了。", [
    ["让我看看这个岗位到底有多少含金量", "radar", "researcher"], ["符合多少算多少，先投了再说", "engine", "explorer"], ["研究一下我的经历还能怎么膨胀", "alchemist", "radar"], ["好的，看来招聘市场也有自己的许愿池", "koi", "protector"],
  ]],
  ["秋招群里突然有人说“已开奖”，你的第一反应是？", "这里不是公司测评，这里没有标准答案。", [
    ["打开招聘软件：立刻海投五家减少焦虑", "engine", "radar"], ["打开自己的简历：是不是还能再抢救一下", "alchemist", "researcher"], ["打开小红书：开始在评论区狂发 Offer 大楼", "koi", "explorer"], ["关掉群聊，躺下睡觉", "protector", "gardener"],
  ]],
  ["当你发现“神仙打架”的岗位，JD 下面已经显示 1000+ 人申请……", "在做的 GPA 全部拉满！", [
    ["研究一下岗位，我和它合不合适才是最重要的", "radar", "gardener"], ["先投。1000+ 里面为什么不能有我", "engine", "koi"], ["默默关闭，开始刷新最新开放的岗位", "explorer", "protector"], ["修改简历，争取让自己显得更突出", "alchemist", "researcher"],
  ]],
  ["改简历改到第 17 版时，什么最能给你一点成就感？", "放心，没有人会检查你的答案一致性。", [
    ["终于能用一句人话讲明白自己做过什么", "alchemist", "researcher"], ["这版与 dream position 简直是完美匹配", "radar", "alchemist"], ["朋友看完崇拜地说：“你原来做过这么多东西？”", "alchemist", "koi"], ["简历只是一页纸，我的人生塞不完", "explorer", "gardener"],
  ]],
  ["HR 问：“你的职业规划是什么？”时，你的内心真实版本更接近？", "此处无需展现 leadership，请诚实作答。", [
    ["我有方向，也愿意一路修正", "radar", "gardener"], ["世界这么大，我想多看看有哪些可能", "explorer", "koi"], ["先把眼前的事情做好，答案会慢慢出现", "researcher", "engine"], ["希望未来的我有工作，有下班，也有双休", "protector", "gardener"],
  ]],
  ["收到测评链接，发现又是“限时 60 分钟，建议提前准备”，你会？", "选真实的你，不是公司价值观里的你。", [
    ["打开小红书，购买题库", "researcher", "koi"], ["直接打开，反正已经做过 20 套测评了", "researcher", "engine"], ["管它那么多，立刻开做", "engine", "koi"], ["认真准备，争取完美符合公司价值观", "alchemist", "radar"],
  ]],
  ["面试官问：“你最大的失败是什么？”时，你的脑内第一反应？", "这里不用 STAR，选一个就行。", [
    ["挑一个真正让我学到东西的经历", "researcher", "gardener"], ["寻找一个最适合这个岗位的故事", "radar", "alchemist"], ["想想怎么讲得真实、有逻辑、有成长", "alchemist", "researcher"], ["还没找到工作就是我的失败", "protector", "koi"],
  ]],
  ["一场面试结束，你走出会议室后的第一件事更可能是？", "面试已经结束，请停止保持职业微笑。", [
    ["趁记忆新鲜，记录问题和自己的回答", "researcher", "radar"], ["复盘两分钟，然后去吃点好吃的", "protector", "researcher"], ["给朋友发：“活着出来了”", "koi", "protector"], ["发 Thank you letter，这也是面试的一环", "alchemist", "radar"],
  ]],
  ["连续几周没有 Offer，你的做法更接近？", "先深呼吸。暂时没有消息，也是一种消息静音。", [
    ["重新看看方向，调整投递策略", "radar", "researcher"], ["换几个渠道，也看看之前忽略的机会", "explorer", "engine"], ["找朋友聊聊，一起吐槽就业市场", "protector", "koi"], ["允许自己丧一会儿，然后继续生活", "gardener", "protector"],
  ]],
  ["最后一题：如果给今年秋招的自己留一句话，你更想选？", "这一题不计鸡汤浓度，只看你现在想听哪句。", [
    ["我在寻找适合自己的生活，不是在参加比赛", "gardener", "radar"], ["世界很大，一份 Offer 只是其中一个入口", "explorer", "koi"], ["走过的路都会留下东西，暂时没有结果也算经历", "researcher", "engine"], ["慢一点也可以，我有自己的时间表", "protector", "gardener"],
  ]],
];

function readSavedAnswers() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    return Array.isArray(value) ? value.slice(0, QUESTIONS.length) : [];
  } catch { return []; }
}

function rankResults(answers) {
  const scores = Object.fromEntries(Object.keys(TYPES).map((key) => [key, 0]));
  answers.forEach((optionIndex, questionIndex) => {
    const option = QUESTIONS[questionIndex]?.[2]?.[optionIndex] || [];
    if (option[1]) scores[option[1]] += 2;
    if (option[2]) scores[option[2]] += 1;
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([key]) => key);
}

function splitSummary(summary) {
  const sentences = summary.match(/[^。！？]+(?:[。！？]+[”"』】）)]*|$)/g)?.map((item) => item.trim()).filter(Boolean) || [summary];
  const paragraphs = [];
  for (let index = 0; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(""));
  }
  return paragraphs;
}

function getPublicTestUrl() {
  const basePath = String(import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  return `${window.location.origin}${basePath}/job-seeker-personality`;
}

function TestHeader() {
  return <header className="personality-header"><span className="personality-header-note">秋招趣味测试</span></header>;
}

export default function JobSeekerPersonalityPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sharedResult = TYPES[searchParams.get("result")] ? searchParams.get("result") : "";
  const [answers, setAnswers] = useState(readSavedAnswers);
  const [step, setStep] = useState(sharedResult ? "result" : "intro");
  const [questionIndex, setQuestionIndex] = useState(Math.min(answers.length, QUESTIONS.length - 1));
  const [resultKey, setResultKey] = useState(sharedResult);
  const [shareStatus, setShareStatus] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const posterRef = useRef(null);
  const rankedResults = useMemo(() => rankResults(answers), [answers]);
  const result = TYPES[resultKey] || TYPES.explorer;
  const currentAnswer = answers[questionIndex];
  const currentQuestion = QUESTIONS[questionIndex];
  const resultParagraphs = useMemo(() => splitSummary(result.summary), [result.summary]);
  const publicTestUrl = typeof window === "undefined" ? "" : getPublicTestUrl();

  useEffect(() => {
    if (step !== "result" || !publicTestUrl) return;
    QRCode.toDataURL(publicTestUrl, { width: 240, margin: 1, color: { dark: "#17202a", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [publicTestUrl, step]);

  const startTest = () => {
    setAnswers([]); setQuestionIndex(0); setResultKey(""); setSearchParams({}); setStep("quiz");
    window.localStorage.removeItem(STORAGE_KEY);
  };
  const returnToTestHome = () => {
    setSearchParams({});
    setShareStatus("");
    setStep("intro");
  };
  const chooseAnswer = (optionIndex) => {
    const nextAnswers = answers.slice(0, questionIndex);
    nextAnswers[questionIndex] = optionIndex;
    setAnswers(nextAnswers);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAnswers));
  };
  const goNext = () => {
    if (currentAnswer === undefined) return;
    if (questionIndex < QUESTIONS.length - 1) return setQuestionIndex((value) => value + 1);
    const nextResult = rankResults(answers)[0];
    setResultKey(nextResult); setSearchParams({ result: nextResult }); setStep("result");
  };
  const saveResultPoster = async () => {
    if (!posterRef.current || !qrDataUrl || isSaving) return;
    setIsSaving(true);
    setShareStatus("正在生成长图…");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(posterRef.current, { backgroundColor: "#f4f6fb", scale: 2, useCORS: true, logging: false });
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Could not create image");
      const fileName = `我的求职者人格-${result.name}.png`;
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      setShareStatus("结果长图已保存，可在相册或下载目录查看");
    } catch (error) {
      if (error?.name !== "AbortError") setShareStatus("长图生成失败，请稍后再试");
    } finally {
      setIsSaving(false);
    }
  };

  return <div className="personality-page">
    <TestHeader />
    {step === "intro" && <main className="personality-intro">
      <section className="personality-hero" aria-labelledby="personality-title"><div className="personality-hero-copy">
        <span className="personality-kicker">10 道互联网生存题 · 大约 3 分钟</span>
        <h1 id="personality-title">测测你的<br /><span>求职者人格</span></h1>
        <p>面对机会、简历、Networking 和面试，每个人都有自己的自然节奏。看看你更像哪一种秋招玩家，也顺便发现最适合自己的下一步。</p>
        <div className="personality-hero-actions"><button type="button" className="personality-primary-button" onClick={startTest}>开始测试 <ArrowRightOutlined /></button>{answers.length > 0 && answers.length < QUESTIONS.length && <button type="button" className="personality-text-button" onClick={() => { setQuestionIndex(Math.min(answers.length, QUESTIONS.length - 1)); setStep("quiz"); }}>继续上次测试</button>}</div>
        <small>这是一项趣味测试，不评判能力，也不决定职业。答案只保存在你的浏览器中。</small>
      </div><div className="personality-hero-art" aria-hidden="true"><span /><span /><span /><div>?</div></div></section>
    </main>}
    {step === "quiz" && <main className="personality-quiz">
      <div className="personality-progress-meta"><span>求职者人格测试</span><strong>{questionIndex + 1} / {QUESTIONS.length}</strong></div>
      <div className="personality-progress" role="progressbar" aria-valuemin="1" aria-valuemax={QUESTIONS.length} aria-valuenow={questionIndex + 1}><span style={{ transform: `scaleX(${(questionIndex + 1) / QUESTIONS.length})` }} /></div>
      <section className="personality-question-card" aria-labelledby="personality-question"><span className="personality-question-number">QUESTION {String(questionIndex + 1).padStart(2, "0")}</span><h1 id="personality-question">{currentQuestion[0]}</h1><p>{currentQuestion[1]}</p>
        <div className="personality-options" role="radiogroup" aria-label={currentQuestion[0]}>{currentQuestion[2].map(([label], index) => <button type="button" role="radio" aria-checked={currentAnswer === index} className={`personality-option personality-option-${index + 1} ${currentAnswer === index ? "is-selected" : ""}`} key={label} onClick={() => chooseAnswer(index)}><span className="personality-option-letter">{String.fromCharCode(65 + index)}</span><span>{label}</span></button>)}</div>
        <div className="personality-question-actions"><button type="button" className="personality-back-button" onClick={() => questionIndex === 0 ? setStep("intro") : setQuestionIndex((value) => value - 1)}><ArrowLeftOutlined /> 返回</button><button type="button" className="personality-primary-button" onClick={goNext} disabled={currentAnswer === undefined}>{questionIndex === QUESTIONS.length - 1 ? "查看结果" : "下一题"} <ArrowRightOutlined /></button></div>
      </section>
    </main>}
    {step === "result" && <main className={`personality-result personality-result-${result.color}`}>
      <section className="personality-result-hero"><span className="personality-kicker">你的求职者人格是</span><div className="personality-result-title-row"><div className="personality-result-code">{result.code}</div><div><h1>{result.name}</h1><p>{result.eyebrow}</p></div></div><div className="personality-result-summary">{resultParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>{answers.length === QUESTIONS.length && rankedResults[0] === resultKey && rankedResults[1] && <span className="personality-secondary-type">你也带有一点「{TYPES[rankedResults[1]].name}」的特质</span>}</section>
      <section className="personality-result-grid"><article className="personality-result-card personality-buff-card"><span className="personality-card-label">你的秋招 Buff</span><strong>{result.buff}</strong><span className="personality-card-label">你的隐藏技能</span><p>{result.skill}</p></article><article className="personality-result-card"><span className="personality-card-label">你的秋招提醒</span><p>{result.watch}</p></article><article className="personality-result-card personality-path-card"><span className="personality-card-label">适合你的 Path 起点</span><p>{result.path}</p><button type="button" onClick={() => navigate("/note/fall-recruiting/autumn-recruitment-roadmap.md")}>去看看我的秋招 Path <ArrowRightOutlined /></button></article></section>
      <section className="personality-result-actions" aria-label="保存结果或重新测试"><button type="button" className="personality-primary-button" onClick={saveResultPoster} disabled={isSaving || !qrDataUrl}><DownloadOutlined /> {isSaving ? "正在生成…" : "保存结果长图"}</button><button type="button" className="personality-secondary-button" onClick={startTest}><ReloadOutlined /> 再测一次</button><button type="button" className="personality-icon-button" onClick={returnToTestHome} aria-label="返回测试首页"><HomeOutlined /></button><span className="personality-share-status" role="status" aria-live="polite">{shareStatus}</span></section>
      <div className={`personality-share-poster personality-share-poster-${result.color}`} ref={posterRef} aria-hidden="true">
        <div className="personality-poster-top"><span>求职者人格测试</span><small>MY JOB SEEKER PERSONA</small></div>
        <div className="personality-poster-heading"><div className="personality-poster-code">{result.code}</div><div><span>我的求职者人格是</span><h2>{result.name}</h2><p>{result.eyebrow}</p></div></div>
        <div className="personality-poster-summary">{resultParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <div className="personality-poster-cards"><div><span>我的秋招 Buff</span><strong>{result.buff}</strong></div><div><span>我的隐藏技能</span><strong>{result.skill}</strong></div><div><span>我的秋招提醒</span><strong>{result.watch}</strong></div></div>
        <div className="personality-poster-footer"><div><strong>你是哪一种求职者人格？</strong><span>{publicTestUrl}</span></div>{qrDataUrl && <img src={qrDataUrl} alt="求职者人格测试二维码" />}</div>
      </div>
    </main>}
  </div>;
}
