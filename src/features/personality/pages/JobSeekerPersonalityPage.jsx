import { useMemo, useState } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined, CopyOutlined, HomeOutlined, ReloadOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./JobSeekerPersonalityPage.css";

const STORAGE_KEY = "notes-system:job-seeker-personality:v1";

const TYPES = {
  navigator: { code: "NAV", name: "战略航海家", eyebrow: "方向感是你的超能力", color: "blue", summary: "你习惯先看清地图，再决定把时间放在哪里。比起追着所有机会跑，你更在意目标是否值得认真准备。", strengths: ["能把复杂信息整理成清晰路线", "做选择时有自己的判断标准", "愿意为重要机会投入深度准备"], watch: "地图画得太久，也可能错过从真实反馈中修正方向的机会。允许第一版计划不完美，会让你走得更快。", path: "从「秋招定位与行动计划」开始，再进入「理解岗位与市场」。" },
  radar: { code: "RAD", name: "机会雷达", eyebrow: "你总能发现下一扇门", color: "gold", summary: "你对新机会很敏锐，也愿意保持开放。别人还在犹豫要不要申请时，你可能已经发现了另一条有趣的路线。", strengths: ["信息搜集速度快、渠道多", "不容易被单一路径限制", "面对变化时很有适应力"], watch: "机会太多时，精力也容易被切得很碎。给申请设一条轻量筛选线，会让你的行动更从容。", path: "优先看看「寻找与筛选合适岗位」和「投递与流程管理」。" },
  curator: { code: "CUR", name: "故事策展人", eyebrow: "你擅长让经历被看见", color: "lavender", summary: "你会留意表达、细节与整体呈现，也懂得一段经历的价值不只在于做了什么，更在于怎样把它讲清楚。", strengths: ["善于提炼经历中的亮点", "对内容结构和呈现有感觉", "能让个人特点自然地被看见"], watch: "一份材料永远还能继续润色。把“足够清楚”当作阶段性完成，比等待完美更有帮助。", path: "从「准备简历与 Profile」出发，按需加入 Cover Letter、项目集或个人主页。" },
  connector: { code: "CON", name: "人脉连接者", eyebrow: "你从真实交流中获得答案", color: "teal", summary: "你相信人与人的交流能补上搜索框找不到的信息。你对团队氛围、真实体验和彼此是否合拍格外敏感。", strengths: ["容易从交流中发现隐性信息", "能建立自然、真诚的连接", "擅长理解不同人的视角"], watch: "Networking 不需要每次都带来结果。把好奇心放在“认识一个人”之前，交流会更轻松。", path: "把「Coffee Chat / Networking」加入 Path，并结合「理解岗位与市场」。" },
  experimenter: { code: "EXP", name: "实战迭代家", eyebrow: "你在行动里越走越清楚", color: "coral", summary: "你不太相信纸上谈兵，更习惯先试一次，再根据反馈调整。一次投递、一次测试或一场面试，都是你的新版本。", strengths: ["启动快，不容易困在准备阶段", "能把反馈迅速变成下一步", "临场适应力和恢复力较强"], watch: "行动很宝贵，偶尔停下来整理规律，会让下一轮尝试不只是“再来一次”。", path: "优先进入「在线测试」「面试准备」与「面试复盘」。" },
  planner: { code: "PLN", name: "稳健规划师", eyebrow: "你让混乱重新变得可控", color: "sage", summary: "面对秋招的多线程任务，你会本能地建立秩序。清单、时间线和进度状态，能让你安心地把事情一件件推进。", strengths: ["擅长管理截止时间与流程", "准备细致，遗漏较少", "在长期过程里保持稳定节奏"], watch: "计划是为了减轻负担，不是另一张需要满分完成的试卷。给变化留一点空间，会更舒服。", path: "从「秋招定位与行动计划」和「投递与流程管理」开始。" },
};

const QUESTIONS = [
  ["校招季快开始了，你最自然的第一步是？", [
    ["先画一张全局地图：岗位、公司和时间线", "navigator", "planner"], ["先打开招聘网站，看看最近都有什么机会", "radar", "experimenter"], ["先整理自己的经历，看看能讲出什么故事", "curator", "navigator"], ["先问问学长学姐，他们当时是怎么开始的", "connector", "radar"],
  ]],
  ["同时出现几个看起来不错的岗位，你通常会？", [
    ["研究发展路径，判断哪个更接近长期方向", "navigator", "planner"], ["先都收藏起来，继续观察新的可能", "radar", "connector"], ["挑几个先申请，反馈会帮我做判断", "experimenter", "radar"], ["比较自己能为每个岗位讲出怎样的匹配故事", "curator", "navigator"],
  ]],
  ["一份很想投的 JD 让你有点心动，你会先注意什么？", [
    ["岗位在团队和业务里到底解决什么问题", "navigator", "connector"], ["职责关键词和我现有经历如何对应", "curator", "planner"], ["截止时间和申请流程，先别错过窗口", "planner", "experimenter"], ["相似岗位、关联团队和其他潜在入口", "radar", "navigator"],
  ]],
  ["修改简历时，哪个瞬间最让你有成就感？", [
    ["终于用一句话说清了一个复杂项目", "curator", "navigator"], ["针对目标岗位做出了一版更匹配的版本", "navigator", "curator"], ["请别人看过后，立刻改掉了一个盲点", "connector", "experimenter"], ["文件名、版本和申请记录都整理得清清楚楚", "planner", "radar"],
  ]],
  ["遇到一个完全不了解的公司，你更想怎样认识它？", [
    ["从官网、年报和行业资料搭出完整脉络", "navigator", "planner"], ["找在职员工聊聊真实工作体验", "connector", "curator"], ["先申请再说，在流程中继续了解", "experimenter", "radar"], ["看看它还有哪些团队和不太显眼的岗位", "radar", "navigator"],
  ]],
  ["收到在线测试邀请时，你更可能？", [
    ["先做一次样题，看看真实手感", "experimenter", "radar"], ["查清题型，再安排针对性的准备节奏", "planner", "navigator"], ["找做过的人问问流程和注意事项", "connector", "planner"], ["复盘自己擅长怎样表达和解决问题", "curator", "experimenter"],
  ]],
  ["准备面试故事时，你最在意的是？", [
    ["故事能不能证明岗位真正需要的能力", "navigator", "curator"], ["细节是否生动，让对方容易记住我", "curator", "connector"], ["多练几轮，在实际表达中调整", "experimenter", "curator"], ["不同题型有没有覆盖，素材是否好调用", "planner", "navigator"],
  ]],
  ["一场面试结束后，你最想做什么？", [
    ["趁记忆新鲜，写下问题和回答卡点", "planner", "experimenter"], ["想想这家公司和我是否真的合拍", "navigator", "connector"], ["给帮助过我的人更新进展并表达感谢", "connector", "curator"], ["把发现的问题改好，准备下一场", "experimenter", "radar"],
  ]],
  ["如果申请暂时没有回音，哪种方式最能帮你找回节奏？", [
    ["重新检查方向和筛选标准", "navigator", "planner"], ["换一批渠道，寻找之前没看到的机会", "radar", "experimenter"], ["和信任的人聊聊，获得新的视角", "connector", "curator"], ["完成一个小动作，让流程重新转起来", "experimenter", "planner"],
  ]],
  ["朋友会怎样形容你处理重要任务的方式？", [
    ["想得清楚，知道为什么做", "navigator", "curator"], ["眼观六路，总能找到新办法", "radar", "connector"], ["边做边学，很快就有第一版", "experimenter", "radar"], ["靠谱细致，事情交给你很放心", "planner", "connector"],
  ]],
  ["如果秋招是一场旅行，你更想带上什么？", [
    ["一张能随时修正的路线图", "navigator", "planner"], ["一本记录沿途故事的手账", "curator", "connector"], ["一双随时可以出发的鞋", "experimenter", "radar"], ["一群可以交换消息的旅伴", "connector", "radar"],
  ]],
  ["最后一题：你希望这次秋招更像哪句话？", [
    ["我在做一项适合自己的选择", "navigator", "curator"], ["世界很大，我想看看还有哪些可能", "radar", "connector"], ["每次尝试，都会让我更接近答案", "experimenter", "curator"], ["一步一步来，我有自己的节奏", "planner", "navigator"],
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
    const option = QUESTIONS[questionIndex]?.[1]?.[optionIndex] || [];
    if (option[1]) scores[option[1]] += 2;
    if (option[2]) scores[option[2]] += 1;
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([key]) => key);
}

function TestHeader({ onHome }) {
  return <header className="personality-header"><button type="button" className="personality-brand" onClick={onHome} aria-label="返回 Notes System 学习空间"><span className="personality-brand-mark">NS</span><span>Notes System</span></button><span className="personality-header-note">秋招趣味测试</span></header>;
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
  const rankedResults = useMemo(() => rankResults(answers), [answers]);
  const result = TYPES[resultKey] || TYPES.navigator;
  const currentAnswer = answers[questionIndex];
  const currentQuestion = QUESTIONS[questionIndex];

  const startTest = () => {
    setAnswers([]); setQuestionIndex(0); setResultKey(""); setSearchParams({}); setStep("quiz");
    window.localStorage.removeItem(STORAGE_KEY);
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
  const shareResult = async () => {
    const text = `我的求职者人格是「${result.name}」——${result.eyebrow}。来测测你是哪一种：`;
    try {
      if (navigator.share) { await navigator.share({ title: "我的求职者人格", text, url: window.location.href }); setShareStatus("已打开分享菜单"); }
      else { await navigator.clipboard.writeText(`${text} ${window.location.href}`); setShareStatus("结果链接已复制"); }
    } catch (error) { if (error?.name !== "AbortError") setShareStatus("暂时无法分享，请复制浏览器地址"); }
  };

  return <div className="personality-page">
    <TestHeader onHome={() => navigate("/")} />
    {step === "intro" && <main className="personality-intro">
      <section className="personality-hero" aria-labelledby="personality-title"><div className="personality-hero-copy">
        <span className="personality-kicker">12 道轻松小题 · 大约 3 分钟</span>
        <h1 id="personality-title">测测你的<br /><span>求职者人格</span></h1>
        <p>面对机会、简历、Networking 和面试，每个人都有自己的自然节奏。看看你更像哪一种秋招玩家，也顺便发现最适合自己的下一步。</p>
        <div className="personality-hero-actions"><button type="button" className="personality-primary-button" onClick={startTest}>开始测试 <ArrowRightOutlined /></button>{answers.length > 0 && answers.length < QUESTIONS.length && <button type="button" className="personality-text-button" onClick={() => { setQuestionIndex(Math.min(answers.length, QUESTIONS.length - 1)); setStep("quiz"); }}>继续上次测试</button>}</div>
        <small>这是一项趣味测试，不评判能力，也不决定职业。答案只保存在你的浏览器中。</small>
      </div><div className="personality-orbit" aria-hidden="true"><div className="personality-orbit-center">你</div>{Object.values(TYPES).map((type, index) => <span key={type.code} className={`personality-orbit-chip personality-orbit-chip-${index + 1}`}>{type.name}</span>)}</div></section>
      <section className="personality-preview" aria-label="测试会告诉你什么"><div><strong>01</strong><span>你的自然优势</span></div><div><strong>02</strong><span>容易卡住的时刻</span></div><div><strong>03</strong><span>适合你的秋招起点</span></div></section>
    </main>}
    {step === "quiz" && <main className="personality-quiz">
      <div className="personality-progress-meta"><span>求职者人格测试</span><strong>{questionIndex + 1} / {QUESTIONS.length}</strong></div>
      <div className="personality-progress" role="progressbar" aria-valuemin="1" aria-valuemax={QUESTIONS.length} aria-valuenow={questionIndex + 1}><span style={{ transform: `scaleX(${(questionIndex + 1) / QUESTIONS.length})` }} /></div>
      <section className="personality-question-card" aria-labelledby="personality-question"><span className="personality-question-number">QUESTION {String(questionIndex + 1).padStart(2, "0")}</span><h1 id="personality-question">{currentQuestion[0]}</h1><p>跟随第一反应就好，不需要想哪一个答案更“正确”。</p>
        <div className="personality-options" role="radiogroup" aria-label={currentQuestion[0]}>{currentQuestion[1].map(([label], index) => <button type="button" role="radio" aria-checked={currentAnswer === index} className={`personality-option ${currentAnswer === index ? "is-selected" : ""}`} key={label} onClick={() => chooseAnswer(index)}><span className="personality-option-letter">{String.fromCharCode(65 + index)}</span><span>{label}</span></button>)}</div>
        <div className="personality-question-actions"><button type="button" className="personality-back-button" onClick={() => questionIndex === 0 ? setStep("intro") : setQuestionIndex((value) => value - 1)}><ArrowLeftOutlined /> 返回</button><button type="button" className="personality-primary-button" onClick={goNext} disabled={currentAnswer === undefined}>{questionIndex === QUESTIONS.length - 1 ? "查看结果" : "下一题"} <ArrowRightOutlined /></button></div>
      </section>
    </main>}
    {step === "result" && <main className={`personality-result personality-result-${result.color}`}>
      <section className="personality-result-hero"><span className="personality-kicker">你的求职者人格是</span><div className="personality-result-title-row"><div className="personality-result-code">{result.code}</div><div><h1>{result.name}</h1><p>{result.eyebrow}</p></div></div><p className="personality-result-summary">{result.summary}</p>{answers.length === QUESTIONS.length && rankedResults[0] === resultKey && rankedResults[1] && <span className="personality-secondary-type">你也带有一点「{TYPES[rankedResults[1]].name}」的特质</span>}</section>
      <section className="personality-result-grid"><article className="personality-result-card"><span className="personality-card-label">你的自然优势</span><ul>{result.strengths.map((strength) => <li key={strength}>{strength}</li>)}</ul></article><article className="personality-result-card"><span className="personality-card-label">给你的小提醒</span><p>{result.watch}</p></article><article className="personality-result-card personality-path-card"><span className="personality-card-label">适合你的 Path 起点</span><p>{result.path}</p><button type="button" onClick={() => navigate("/note/fall-recruiting/autumn-recruitment-roadmap.md")}>去看看我的秋招 Path <ArrowRightOutlined /></button></article></section>
      <section className="personality-result-actions" aria-label="分享或重新测试"><button type="button" className="personality-primary-button" onClick={shareResult}>{navigator.share ? <ShareAltOutlined /> : <CopyOutlined />} 分享结果</button><button type="button" className="personality-secondary-button" onClick={startTest}><ReloadOutlined /> 再测一次</button><button type="button" className="personality-icon-button" onClick={() => navigate("/")} aria-label="返回 Learning Workspace"><HomeOutlined /></button><span className="personality-share-status" role="status" aria-live="polite">{shareStatus}</span></section>
    </main>}
  </div>;
}
