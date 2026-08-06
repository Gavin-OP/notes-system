import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftOutlined, ArrowRightOutlined, DownloadOutlined, InfoCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import QRCode from "qrcode";
import {
  JOBTI_STORAGE_KEY,
  QUIZ_ITEMS,
  TYPES,
  buildJobTiPathProfile,
  getJobTiPathSummary,
  rankJobTiResults,
} from "../lib/jobTiData";
import { buildDefaultPilotDraft, buildPersonalizedPilotDraft } from "../../navigation/lib/pilotPath";
import { loadPilotPathDraft, savePilotPathDraft } from "../../navigation/lib/pilotPathStorage";
import "./JobSeekerPersonalityPage.css";

// Shared with the lightweight type-gallery route.
// eslint-disable-next-line react-refresh/only-export-components
export { TYPES };

function readSavedResponses() {
  try {
    const value = JSON.parse(window.localStorage.getItem(JOBTI_STORAGE_KEY) || "null");
    return value && typeof value.responses === "object" ? value.responses : {};
  } catch { return {}; }
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

export function PersonalityMark({ type, className = "" }) {
  const paths = {
    explorer: <><circle cx="32" cy="32" r="20" /><path d="m39 22-5 13-13 5 5-13 13-5Z" /></>,
    radar: <><circle cx="32" cy="32" r="20" /><circle cx="32" cy="32" r="11" /><path d="M32 32 47 20" /></>,
    engine: <><path d="M18 27a16 16 0 0 1 27-8l3 4m0-8 .5 8-8-.5M46 37a16 16 0 0 1-27 8l-3-4m0 8-.5-8 8 .5" /></>,
    alchemist: <><path d="m32 11 18 11-7 23-11 8-11-8-7-23 18-11Z" /><path d="m14 22 18 11 18-11M32 33v20" /></>,
    researcher: <><path d="M17 17h24v24H17zM25 17v24M33 17v24M17 25h24M17 33h24" /><circle cx="43" cy="43" r="8" /><path d="m49 49 7 7" /></>,
    protector: <><path d="M32 11 49 18v13c0 11-7 18-17 23-10-5-17-12-17-23V18l17-7Z" /><path d="M38 21a10 10 0 1 0 4 17 11 11 0 0 1-4-17Z" /></>,
    gardener: <><path d="M32 53V29M31 34C18 34 15 24 16 17c9 0 17 4 17 14M33 27c1-10 8-15 17-15 1 8-3 17-17 18M18 53h28" /></>,
    koi: <><path d="M12 36c10-19 29-20 41-5-9 19-29 22-41 5Z" /><circle cx="43" cy="30" r="2" /><path d="M20 30c6 5 6 10 0 15M12 36 5 28v16l7-8Z" /></>,
  };
  return <svg className={`personality-mark ${className}`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type] || paths.explorer}</svg>;
}

export default function JobSeekerPersonalityPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const sharedResult = TYPES[searchParams.get("result")] ? searchParams.get("result") : "";
  const [responses, setResponses] = useState(readSavedResponses);
  const [step, setStep] = useState(sharedResult ? "result" : "intro");
  const [questionIndex, setQuestionIndex] = useState(() => {
    const saved = readSavedResponses();
    const firstUnanswered = QUIZ_ITEMS.findIndex((item) => !Object.prototype.hasOwnProperty.call(saved, item.id));
    return firstUnanswered < 0 ? 0 : firstUnanswered;
  });
  const [resultKey, setResultKey] = useState(sharedResult);
  const [shareStatus, setShareStatus] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const posterRef = useRef(null);
  const rankedResults = useMemo(() => rankJobTiResults(responses), [responses]);
  const result = TYPES[resultKey] || TYPES.explorer;
  const currentQuestion = QUIZ_ITEMS[questionIndex];
  const currentResponse = responses[currentQuestion.id];
  const resultParagraphs = useMemo(() => splitSummary(result.summary), [result.summary]);
  const pathSummary = useMemo(() => getJobTiPathSummary(responses), [responses]);
  const publicTestUrl = typeof window === "undefined" ? "" : getPublicTestUrl();

  useEffect(() => {
    if (step !== "result" || !publicTestUrl) return;
    QRCode.toDataURL(publicTestUrl, { width: 240, margin: 1, color: { dark: "#17202a", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [publicTestUrl, step]);

  const startTest = () => {
    setResponses({}); setQuestionIndex(0); setResultKey(""); setSearchParams({}); setStep("quiz");
    window.localStorage.removeItem(JOBTI_STORAGE_KEY);
  };
  const advanceTimerRef = useRef(null);
  const saveResponses = (nextResponses) => {
    setResponses(nextResponses);
    window.localStorage.setItem(JOBTI_STORAGE_KEY, JSON.stringify({ version: 2, responses: nextResponses }));
  };
  const finishTest = useCallback((nextResponses) => {
    const nextResult = rankJobTiResults(nextResponses)[0];
    const existingDraft = loadPilotPathDraft() || buildDefaultPilotDraft();
    const previousProfile = existingDraft.metadata?.personalization || {};
    const profile = buildJobTiPathProfile(nextResponses, previousProfile);
    savePilotPathDraft(buildPersonalizedPilotDraft(existingDraft, profile));
    setResultKey(nextResult);
    setSearchParams({ result: nextResult });
    setStep("result");
  }, [setSearchParams]);
  const advance = useCallback((nextResponses) => {
    if (questionIndex < QUIZ_ITEMS.length - 1) setQuestionIndex((value) => value + 1);
    else finishTest(nextResponses);
  }, [finishTest, questionIndex]);
  const chooseAnswer = useCallback((optionIndex) => {
    const option = currentQuestion.options[optionIndex];
    const value = currentQuestion.kind === "personality" ? optionIndex : option.value;
    const nextResponses = { ...responses, [currentQuestion.id]: value };
    saveResponses(nextResponses);
    window.clearTimeout(advanceTimerRef.current);
    advanceTimerRef.current = window.setTimeout(() => advance(nextResponses), 260);
  }, [advance, currentQuestion, responses]);
  const toggleMultiAnswer = (value) => {
    const selected = Array.isArray(currentResponse) ? currentResponse : [];
    const next = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
    saveResponses({ ...responses, [currentQuestion.id]: next });
  };
  const confirmMultiAnswer = () => {
    const nextResponses = Object.prototype.hasOwnProperty.call(responses, currentQuestion.id)
      ? responses
      : { ...responses, [currentQuestion.id]: [] };
    saveResponses(nextResponses);
    advance(nextResponses);
  };
  useEffect(() => {
    if (step !== "quiz") return undefined;
    const onKeyDown = (event) => {
      const numeric = Number(event.key);
      if (currentQuestion.kind !== "path-multi" && numeric >= 1 && numeric <= currentQuestion.options.length) {
        event.preventDefault(); chooseAnswer(numeric - 1); return;
      }
      if (event.key === "ArrowLeft" && questionIndex > 0) {
        event.preventDefault(); window.clearTimeout(advanceTimerRef.current); setQuestionIndex((value) => value - 1);
      }
      if (event.key === "ArrowRight" && currentResponse !== undefined && questionIndex < QUIZ_ITEMS.length - 1) {
        event.preventDefault(); window.clearTimeout(advanceTimerRef.current); setQuestionIndex((value) => value + 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chooseAnswer, currentResponse, currentQuestion, questionIndex, step]);
  const saveResultPoster = async () => {
    if (!posterRef.current || !qrDataUrl || isSaving) return;
    setIsSaving(true);
    setShareStatus("正在生成长图…");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(posterRef.current, { backgroundColor: "#f4f6fb", scale: 2, useCORS: true, logging: false });
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("Could not create image");
      const fileName = `jobti-${resultKey || "personality"}-result.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `我的 JobTI：${result.name}` });
        setShareStatus("已打开系统分享面板，可选择存储图像");
        return;
      }
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
    {step === "intro" && <main className="personality-intro">
      <section className="personality-hero" aria-labelledby="personality-title"><div className="personality-hero-copy">
        <span className="personality-brand">JobTI</span><span className="personality-kicker">14 道人格与 Path 情境题 · 约 4 分钟</span>
        <h1 id="personality-title">测测你的<br /><span>求职者人格</span></h1>
        <p>面对机会、简历、Networking 和面试，每个人都有自己的自然节奏。看看你更像哪一种求职玩家，也顺便认识自己的下一步。</p>
        <div className="personality-hero-actions"><button type="button" className="personality-primary-button" onClick={startTest}>开始测试 <ArrowRightOutlined /></button>{Object.keys(responses).length > 0 && Object.keys(responses).length < QUIZ_ITEMS.length && <button type="button" className="personality-text-button" onClick={() => setStep("quiz")}>继续上次测试</button>}</div>
        <small>人格题不评判能力；带 Path 标记的题会生成一条可随时修改的求职路线。答案只保存在你的浏览器中。</small>
      </div></section>
    </main>}
    {step === "quiz" && <main className="personality-quiz">
      <div className="personality-progress-meta"><span>JobTI · 人格与求职 Path</span><strong>{questionIndex + 1} / {QUIZ_ITEMS.length}</strong></div>
      <div className="personality-progress" role="progressbar" aria-valuemin="1" aria-valuemax={QUIZ_ITEMS.length} aria-valuenow={questionIndex + 1}><span style={{ transform: `scaleX(${(questionIndex + 1) / QUIZ_ITEMS.length})` }} /></div>
      <section className={`personality-question-card${currentQuestion.kind.startsWith("path-") ? " personality-question-card--path" : ""}`} aria-labelledby="personality-question"><span className="personality-question-number">{currentQuestion.kind.startsWith("path-") ? "用于生成你的 PATH" : `PERSONALITY ${String(questionIndex + 1).padStart(2, "0")}`}</span><h1 id="personality-question">{currentQuestion.title}</h1><p>{currentQuestion.hint}</p>
        <div className="personality-options" role={currentQuestion.kind === "path-multi" ? "group" : "radiogroup"} aria-label={currentQuestion.title}>{currentQuestion.options.map((option, index) => {
          const optionValue = currentQuestion.kind === "personality" ? index : option.value;
          const selected = currentQuestion.kind === "path-multi" ? (currentResponse || []).includes(option.value) : currentResponse === optionValue;
          return <button type="button" role={currentQuestion.kind === "path-multi" ? undefined : "radio"} aria-checked={currentQuestion.kind === "path-multi" ? undefined : selected} aria-pressed={currentQuestion.kind === "path-multi" ? selected : undefined} className={`personality-option personality-option-${index + 1} ${selected ? "is-selected" : ""}`} key={`${currentQuestion.id}-${String(option.value ?? index)}`} onClick={() => currentQuestion.kind === "path-multi" ? toggleMultiAnswer(option.value) : chooseAnswer(index)}><span className="personality-option-letter">{String.fromCharCode(65 + index)}</span><span>{option.label}</span></button>;
        })}{currentQuestion.kind === "path-multi" && <button type="button" className={`personality-option personality-option-muted ${(currentResponse || []).length === 0 ? "is-selected" : ""}`} onClick={() => saveResponses({ ...responses, [currentQuestion.id]: [] })}><span className="personality-option-letter">—</span><span>{currentQuestion.emptyLabel}</span></button>}</div>
        <div className="personality-question-actions"><button type="button" className="personality-back-button" onClick={() => questionIndex === 0 ? setStep("intro") : setQuestionIndex((value) => value - 1)}><ArrowLeftOutlined /> 上一题</button>{currentQuestion.kind === "path-multi" ? <button type="button" className="personality-primary-button personality-confirm-button" onClick={confirmMultiAnswer}>确认并继续 <ArrowRightOutlined /></button> : <span className="personality-auto-hint">选择后自动进入下一题</span>}</div>
      </section>
    </main>}
    {step === "result" && <main className={`personality-result personality-result-${result.color}`}>
      <section className="personality-result-hero"><div className="personality-result-eyebrow-row"><span className="personality-kicker">你的求职者人格是</span><button type="button" className="personality-types-link" onClick={() => navigate(`/job-seeker-personality/types?result=${resultKey}`)}><InfoCircleOutlined /> 查看全部人格</button></div><div className="personality-result-title-row"><PersonalityMark type={resultKey} /><div><h1>{result.name}</h1><strong className="personality-type-label">{result.typeLabel}</strong><p>{result.eyebrow}</p></div></div><div className="personality-result-summary">{resultParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>{rankedResults[0] === resultKey && rankedResults[1] && <span className="personality-secondary-type">你也带有一点「{TYPES[rankedResults[1]].name}」的特质</span>}</section>
      {Object.keys(responses).length >= QUIZ_ITEMS.length && <section className="personality-result-card personality-path-summary"><span className="personality-card-label">你的实际求职设置</span><h2>这次不只看人设，也给你一点能马上用的东西</h2><ul>{pathSummary.map((item) => <li key={item}>{item}</li>)}</ul></section>}
      <section className="personality-path-gateway"><div className="personality-path-gateway__preview" aria-hidden="true"><span /><span /><span /><i /><i /></div><div><span className="personality-card-label">你的 Path 已经准备好</span><h2>认识了自己的求职人格，接下来看看真实路线</h2><p>刚才的选择已经生成 Path；进入后仍然可以随时调整。</p></div><button type="button" onClick={() => navigate(`/note/fall-recruiting/autumn-recruitment-roadmap.md${Object.keys(responses).length >= QUIZ_ITEMS.length ? "" : "?pathSetup=1"}`)}>打开我的求职 Path <ArrowRightOutlined /></button></section>
      <section className="personality-result-grid"><article className="personality-result-card personality-buff-card"><span className="personality-card-label">你的求职 Buff</span><strong>{result.buff}</strong><span className="personality-card-label">你的隐藏技能</span><p>{result.skill}</p></article><article className="personality-result-card"><span className="personality-card-label">你的求职提醒</span><p>{result.watch}</p></article></section>
      <section className="personality-result-actions" aria-label="保存结果或重新测试"><button type="button" className="personality-primary-button" onClick={saveResultPoster} disabled={isSaving || !qrDataUrl}><DownloadOutlined /> {isSaving ? "正在生成…" : "保存结果长图"}</button><button type="button" className="personality-secondary-button" onClick={startTest}><ReloadOutlined /> 重新测试</button><span className="personality-share-status" role="status" aria-live="polite">{shareStatus}</span></section>
      <div className={`personality-share-poster personality-share-poster-${result.color}`} ref={posterRef} aria-hidden="true">
        <div className="personality-poster-top"><span>求职者人格测试</span><small>MY JOB SEEKER PERSONA</small></div>
        <div className="personality-poster-heading"><PersonalityMark type={resultKey} className="personality-poster-mark" /><div><span>我的求职者人格是 · {result.typeLabel}</span><h2>{result.name}</h2><p>{result.eyebrow}</p></div></div>
        <div className="personality-poster-summary">{resultParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <div className="personality-poster-cards"><div><span>我的秋招 Buff</span><strong>{result.buff}</strong></div><div><span>我的隐藏技能</span><strong>{result.skill}</strong></div><div><span>我的秋招提醒</span><strong>{result.watch}</strong></div></div>
        <div className="personality-poster-footer"><div><strong>你是哪一种求职者人格？</strong><span>{publicTestUrl}</span></div>{qrDataUrl && <img src={qrDataUrl} alt="求职者人格测试二维码" />}</div>
      </div>
    </main>}
  </div>;
}
