import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { buildDefaultPilotDraft, buildPersonalizedPilotDraft } from "../../navigation/lib/pilotPath";
import { loadPilotPathDraft, savePilotPathDraft } from "../../navigation/lib/pilotPathStorage";
import { advanceCareerRun, createCareerRun, restoreCareerRun, summarizeCareerRun } from "../domain/careerRun";
import { LEGACY_BY_ID } from "../config/legacyPool";
import "./CareerRunPage.css";

const STORAGE_KEY = "notes-system:career-run:v1";
const LEGACY_STORAGE_KEY = "notes-system:career-run:legacy:v1";
const ATTRIBUTE_META = {
  time: { label: "Time", description: "剩余求职时间", icon: "time" },
  energy: { label: "Energy", description: "继续行动的能量", icon: "energy" },
  confidence: { label: "Confidence", description: "面对不确定性的底气", icon: "confidence" },
  profile: { label: "Profile", description: "材料与能力展示", icon: "profile" },
  network: { label: "Network", description: "职业连接与信息来源", icon: "network" },
};
const CATEGORY_LABELS = {
  profile: "PROFILE PREPARATION",
  application: "APPLICATION",
  networking: "NETWORKING",
  interview: "INTERVIEW",
  offer: "OFFER / REJECTION",
};
const BEHAVIOR_LABELS = {
  exploration: "探索新入口",
  analysis: "研究后行动",
  action: "快速推进",
  expression: "打磨表达",
  reflection: "复盘成长",
  resilience: "恢复与继续",
  networking: "主动连接",
  pacing: "管理节奏",
};
const ATTRIBUTE_RESULT_LABELS = {
  time: "时间管理", energy: "行动能量", confidence: "信心", profile: "求职材料", network: "职业连接",
};

function AttributeIcon({ type }) {
  const paths = {
    time: <><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></>,
    energy: <path d="m13 2-7 11h5l-1 9 8-12h-5V2Z" />,
    confidence: <><path d="M4 17 9 12l3 3 7-8" /><path d="M14 7h5v5" /></>,
    profile: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h4" /></>,
    network: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="7" r="2.5" /><path d="M3.5 20c.4-4 2-6 4.5-6s4.1 2 4.5 6M13 14c3.4-.8 6.5 1 7 5" /></>,
  };
  return <svg className={`career-run-attribute-icon is-${type}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}

function readSavedRun() {
  if (typeof window === "undefined") return null;
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    return restoreCareerRun(value);
  } catch {
    return null;
  }
}

function persistRun(run) {
  try {
    if (run?.status === "playing") window.localStorage.setItem(STORAGE_KEY, JSON.stringify(run));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Persistence is optional when browser storage is blocked.
  }
}

function readLegacyMeta() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(LEGACY_STORAGE_KEY) || "null");
    return {
      equippedLegacyId: LEGACY_BY_ID.has(saved?.equippedLegacyId) ? saved.equippedLegacyId : null,
      unlockedIds: Array.isArray(saved?.unlockedIds) ? saved.unlockedIds.filter((id) => LEGACY_BY_ID.has(id)) : [],
    };
  } catch {
    return { equippedLegacyId: null, unlockedIds: [] };
  }
}

function persistLegacyMeta(meta) {
  try { window.localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(meta)); } catch { /* Optional browser-local progression. */ }
}

function resourceLevel(key, value) {
  if (!["time", "energy"].includes(key)) return "normal";
  if (value <= 15) return "danger";
  if (value <= 35) return "warning";
  return "normal";
}

function resourceLevelLabel(level) {
  if (level === "danger") return "紧急";
  if (level === "warning") return "偏低";
  return "充足";
}

function AttributeMeters({ attributes, compact = false, legacy = null }) {
  return (
    <div className={`career-run-attributes ${compact ? "is-compact" : ""}`} aria-label="当前属性">
      {Object.entries(ATTRIBUTE_META).map(([key, meta]) => {
        const level = resourceLevel(key, attributes[key]);
        const legacyAmount = legacy?.initialEffects?.[key];
        return (
          <div className="career-run-attribute" key={key}>
            <div className="career-run-attribute-heading">
              <span className="career-run-attribute-label"><AttributeIcon type={meta.icon} />{meta.label}</span><strong>{attributes[key]}</strong>
            </div>
            <div className={`career-run-meter is-${level}`} role="progressbar" aria-label={meta.description} aria-valuemin="0" aria-valuemax="100" aria-valuenow={attributes[key]} aria-valuetext={`${attributes[key]}，${resourceLevelLabel(level)}`}>
              <span style={{ width: `${attributes[key]}%` }} />
            </div>
            {legacyAmount ? (
              <div className="career-run-attribute-legacy">
                <span aria-hidden="true">◆</span>
                <span><strong>{legacy.title}</strong><small>{meta.label} +{legacyAmount}</small></span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function DeltaList({ deltas }) {
  const entries = Object.entries(deltas || {});
  if (!entries.length) return <span className="career-run-no-change">属性没有直接变化</span>;
  return (
    <div className="career-run-deltas" aria-label="本次属性变化">
      {entries.map(([key, value]) => (
        <span className={value > 0 ? "is-positive" : "is-negative"} key={key}>
          {ATTRIBUTE_META[key]?.label || key} {value > 0 ? "+" : ""}{value}
        </span>
      ))}
    </div>
  );
}

function Intro({ savedRun, equippedLegacy, onStart, onResume }) {
  return (
    <main className="career-run-shell career-run-intro">
      <section className="career-run-intro-card">
        <div className="career-run-intro-copy">
          <span className="career-run-overline">LIGHTHOUSE · CAREER RUN</span>
          <h1>应届生开荒局</h1>
          <p className="career-run-lead">你有一段有限的求职季，也有很多并不完美的选择。投递、准备、社交、休息——每一步都会影响之后发生的事。</p>
          <div className="career-run-rules" aria-label="游戏说明">
            <div><strong>5–10 分钟</strong><span>完成一轮求职过程</span></div>
            <div><strong>没有标准答案</strong><span>只有不同资源与策略</span></div>
            <div><strong>留在浏览器</strong><span>不调用 AI 或后端 API</span></div>
          </div>
          <div className="career-run-intro-actions">
            {savedRun ? <button className="career-run-primary" type="button" onClick={onResume}>继续上次进度</button> : null}
            <button className={savedRun ? "career-run-secondary" : "career-run-primary"} type="button" onClick={onStart}>
              {savedRun ? "重新开一局" : "开始这一局"}
            </button>
          </div>
          {equippedLegacy ? <p className="career-run-equipped-legacy">本局携带：<strong>{equippedLegacy.title}</strong> · {equippedLegacy.description}</p> : null}
          <p className="career-run-footnote">这是一个趣味互动体验，不预测真实招聘结果，也不评判你的能力。</p>
        </div>
      </section>
    </main>
  );
}

function Play({ run, showingOutcome, interactionError, onChoose, onContinue, onRestart }) {
  const event = run.currentEvent;
  const displayedCategory = showingOutcome ? run.history.at(-1)?.category : event?.category;
  const legacyHasDirectResourceEffect = Boolean(Object.keys(run.legacy?.initialEffects || {}).length);
  return (
    <main className="career-run-shell career-run-play">
      <header className="career-run-header">
        <div><span className="career-run-overline">CAREER RUN · {String(run.turn + 1).padStart(2, "0")}</span><h1>应届生开荒局</h1></div>
        <button className="career-run-text-button" type="button" onClick={onRestart}>重新开始</button>
      </header>
      <div className="career-run-game-grid">
        <aside className="career-run-status-card">
          <div className="career-run-status-heading"><span>你的状态</span><small>{run.stage.toUpperCase()}</small></div>
          <AttributeMeters attributes={run.attributes} legacy={run.legacy} />
          {run.legacy && !legacyHasDirectResourceEffect ? (
            <div className="career-run-active-legacy">
              <span>本局道具</span>
              <strong>{run.legacy.title}</strong>
              <small>{run.legacy.description.replace(/^下一局/, "本局")}</small>
            </div>
          ) : null}
          <div className="career-run-counter-grid">
            <span><strong>{run.counters.applications}</strong>Applications</span>
            <span><strong>{run.counters.interviews}</strong>Interviews</span>
            <span><strong>{run.counters.referrals}</strong>Referrals</span>
            <span><strong>{run.counters.offers}</strong>Offers</span>
          </div>
        </aside>

        <section className={`career-run-event-card category-${displayedCategory || "profile"}`}>
          {showingOutcome ? (
            <div className="career-run-card-content career-run-outcome" aria-live="polite">
              <span className="career-run-overline">这次选择带来了</span>
              <h2>{run.history.at(-1)?.choiceLabel}</h2>
              <p>{run.lastOutcome.message}</p>
              <DeltaList deltas={run.lastOutcome.deltas} />
              <button className="career-run-primary" type="button" onClick={onContinue}>
                {run.status === "complete" ? "查看本局结果" : "看看接下来发生什么"}
              </button>
            </div>
          ) : (
            <div className="career-run-card-content">
              <span className="career-run-category">{CATEGORY_LABELS[event.category]}</span>
              <h2>{event.title}</h2>
              <p className="career-run-event-description">{event.description}</p>
              <div className="career-run-choices">
                {event.choices.map((choice, index) => (
                  <button key={choice.id} type="button" disabled={!choice.available} onClick={() => onChoose(choice.id)}>
                    <span className="career-run-choice-letter">{String.fromCharCode(65 + index)}</span>
                    <span><strong>{choice.label}</strong>{!choice.available ? <small>当前资源不足</small> : null}</span>
                  </button>
                ))}
              </div>
              {interactionError ? <p className="career-run-interaction-error" role="alert">{interactionError}</p> : null}
            </div>
          )}
        </section>

        <aside className="career-run-log-card">
          <span className="career-run-overline">RECENT EVENTS</span>
          <h2>最近发生的事</h2>
          {run.history.length ? (
            <ol>{run.history.slice(-4).reverse().map((entry) => (
              <li key={`${entry.eventId}-${entry.choiceId}`}>
                <strong>{entry.eventTitle}</strong>
                <span>{entry.choiceLabel}</span>
                <p>{entry.outcomeMessage}</p>
              </li>
            ))}</ol>
          ) : <p>你的第一条行动记录会出现在这里。</p>}
        </aside>
      </div>
    </main>
  );
}

function Result({ result, run, selectedLegacyId, onSelectLegacy, onRestart, onSavePath }) {
  return (
    <main className="career-run-shell career-run-result">
      <header className="career-run-result-hero">
        <span className="career-run-overline">RUN COMPLETE</span>
        <p>这一轮求职发生了什么？</p>
        <h1>{result.ending.title}</h1>
        <p className="career-run-lead">{result.ending.description}</p>
      </header>

      <section className="career-run-result-grid">
        <article className="career-run-story-card">
          <span className="career-run-overline">这一局的故事</span>
          <h2>你这样走过了这一轮</h2>
          <p>{result.runStory}</p>
          <div className="career-run-records">
            <span>最低 Energy <strong>{result.runRecord.minimumEnergy}</strong></span>
            <span>最高 Profile <strong>{result.runRecord.maximumProfile}</strong></span>
            <span>最高 Network <strong>{result.runRecord.maximumNetwork}</strong></span>
            <span>Life Satisfaction <strong>{result.runRecord.lifeSatisfaction}</strong></span>
          </div>
          {result.runRecord.standoutEvent ? <p className="career-run-standout">本局意外事件：<strong>{result.runRecord.standoutEvent}</strong></p> : null}
          <div className="career-run-strategy"><span>本局最常使用</span><strong>{BEHAVIOR_LABELS[result.strongestStrategy]}</strong></div>
        </article>
        <article className="career-run-stats-card">
          <span className="career-run-overline">本局数据</span>
          <div>{Object.entries(result.stats).map(([key, value]) => <span key={key}><strong>{value}</strong>{key}</span>)}</div>
        </article>
        <article className="career-run-final-attributes">
          <span className="career-run-overline">最终属性</span>
          <AttributeMeters attributes={run.attributes} compact />
          <p>最强项：<strong>{ATTRIBUTE_RESULT_LABELS[result.strength]}</strong> · 最容易卡住：<strong>{ATTRIBUTE_RESULT_LABELS[result.bottleneck]}</strong></p>
        </article>
      </section>

      <section className="career-run-achievement-card">
        <div className="career-run-section-heading"><span className="career-run-overline">RUN ACHIEVEMENTS</span><h2>本局成就</h2></div>
        <div className="career-run-achievement-grid">
          {result.achievements.map((achievement) => (
            <article key={achievement.id}><span aria-hidden="true">✓</span><div><strong>{achievement.title}</strong><p>{achievement.description}</p></div></article>
          ))}
        </div>
      </section>

      <section className="career-run-legacy-card">
        <div><span className="career-run-overline">TAKE ONE WITH YOU</span><h2>下一局，带走一件东西</h2><p>选择一项本局解锁的经验。它会保存在当前浏览器，并在下一次新开局时生效。</p></div>
        <div className="career-run-legacy-grid">
          {result.legacyChoices.map((legacy) => (
            <button className={selectedLegacyId === legacy.id ? "is-selected" : ""} key={legacy.id} type="button" onClick={() => onSelectLegacy(legacy.id)}>
              <strong>{legacy.title}</strong><span>{legacy.description}</span><small>{selectedLegacyId === legacy.id ? "下一局已装备" : "选择并装备"}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="career-run-path-card">
        <div>
          <span className="career-run-overline">YOUR PERSONALIZED CAREER PATH</span>
          <h2>把这一局的线索，变成下一步</h2>
          <p>Path 只使用本局真实选择和卡点生成，你之后仍然可以随时修改。</p>
          <ul>{result.path.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
        </div>
        <button className="career-run-primary" type="button" onClick={onSavePath}>生成并查看我的 Path</button>
      </section>
      <div className="career-run-result-actions"><button className="career-run-secondary" type="button" onClick={onRestart}>再开一局</button></div>
    </main>
  );
}

export default function CareerRunPage() {
  const navigate = useNavigate();
  const [savedRun, setSavedRun] = useState(() => readSavedRun());
  const [run, setRun] = useState(null);
  const [screen, setScreen] = useState("intro");
  const [showingOutcome, setShowingOutcome] = useState(false);
  const [interactionError, setInteractionError] = useState("");
  const [legacyMeta, setLegacyMeta] = useState(() => readLegacyMeta());

  const start = () => {
    const next = createCareerRun({ seed: Date.now(), legacyId: legacyMeta.equippedLegacyId });
    persistRun(next);
    setSavedRun(null);
    setRun(next);
    setShowingOutcome(false);
    setInteractionError("");
    setScreen("play");
  };
  const resume = () => { setRun(savedRun); setShowingOutcome(false); setInteractionError(""); setScreen("play"); };
  const choose = (choiceId) => {
    try {
      const next = advanceCareerRun(run, choiceId);
      persistRun(next);
      setSavedRun(next.status === "playing" ? next : null);
      setRun(next);
      setInteractionError("");
      setShowingOutcome(true);
    } catch {
      setInteractionError("这份旧进度无法继续当前选择。请返回首页重新载入，或重新开始这一局。");
    }
  };
  const continueRun = () => {
    if (run.status === "complete") {
      const summary = summarizeCareerRun(run);
      const nextMeta = { ...legacyMeta, unlockedIds: [...new Set([...legacyMeta.unlockedIds, ...summary.unlockedLegacyIds])] };
      persistLegacyMeta(nextMeta);
      setLegacyMeta(nextMeta);
      setScreen("result");
    }
    else setShowingOutcome(false);
  };
  const restart = () => {
    persistRun(null);
    setSavedRun(null);
    setRun(null);
    setShowingOutcome(false);
    setInteractionError("");
    setScreen("intro");
  };
  const result = screen === "result" && run ? summarizeCareerRun(run) : null;
  const selectLegacy = (legacyId) => {
    const nextMeta = { equippedLegacyId: legacyId, unlockedIds: [...new Set([...legacyMeta.unlockedIds, legacyId])] };
    persistLegacyMeta(nextMeta);
    setLegacyMeta(nextMeta);
  };
  const savePath = () => {
    const existing = loadPilotPathDraft();
    if (existing && !window.confirm("这会用本局结果更新你当前浏览器里的求职 Path。要继续吗？")) return;
    const source = existing || buildDefaultPilotDraft();
    const draft = buildPersonalizedPilotDraft(source, { ...result.path.profile, setup_complete: true });
    if (savePilotPathDraft(draft)) navigate("/note/fall-recruiting/autumn-recruitment-roadmap.md");
  };

  if (screen === "intro") return <Intro savedRun={savedRun} equippedLegacy={LEGACY_BY_ID.get(legacyMeta.equippedLegacyId)} onStart={start} onResume={resume} />;
  if (screen === "result") return <Result result={result} run={run} selectedLegacyId={legacyMeta.equippedLegacyId} onSelectLegacy={selectLegacy} onRestart={restart} onSavePath={savePath} />;
  return <Play run={run} showingOutcome={showingOutcome} interactionError={interactionError} onChoose={choose} onContinue={continueRun} onRestart={restart} />;
}
