import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { buildDefaultPilotDraft, buildPersonalizedPilotDraft } from "../../navigation/lib/pilotPath";
import { loadPilotPathDraft, savePilotPathDraft } from "../../navigation/lib/pilotPathStorage";
import { advanceCareerRun, createCareerRun, summarizeCareerRun } from "../domain/careerRun";
import "./CareerRunPage.css";

const STORAGE_KEY = "notes-system:career-run:v1";
const ATTRIBUTE_META = {
  time: { label: "Time", description: "剩余求职时间" },
  energy: { label: "Energy", description: "继续行动的能量" },
  confidence: { label: "Confidence", description: "面对不确定性的底气" },
  profile: { label: "Profile", description: "材料与能力展示" },
  network: { label: "Network", description: "职业连接与信息来源" },
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

function readSavedRun() {
  if (typeof window === "undefined") return null;
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    return value?.version === 1 && value?.status === "playing" && value?.currentEvent ? value : null;
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

function AttributeMeters({ attributes, compact = false }) {
  return (
    <div className={`career-run-attributes ${compact ? "is-compact" : ""}`} aria-label="当前属性">
      {Object.entries(ATTRIBUTE_META).map(([key, meta]) => (
        <div className="career-run-attribute" key={key}>
          <div className="career-run-attribute-heading">
            <span>{meta.label}</span><strong>{attributes[key]}</strong>
          </div>
          <div className="career-run-meter" role="progressbar" aria-label={meta.description} aria-valuemin="0" aria-valuemax="100" aria-valuenow={attributes[key]}>
            <span style={{ width: `${attributes[key]}%` }} />
          </div>
        </div>
      ))}
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

function Intro({ savedRun, onStart, onResume }) {
  return (
    <main className="career-run-shell career-run-intro">
      <section className="career-run-intro-card">
        <span className="career-run-overline">LIGHTHOUSE · CAREER RUN</span>
        <h1>应届生开荒局</h1>
        <p className="career-run-lead">你有一段有限的求职季，也有很多并不完美的选择。投递、准备、社交、休息——每一步都会改变下一张牌。</p>
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
        <p className="career-run-footnote">这是一个趣味互动体验，不预测真实招聘结果，也不评判你的能力。</p>
      </section>
    </main>
  );
}

function Play({ run, showingOutcome, onChoose, onContinue, onRestart }) {
  const event = run.currentEvent;
  const progress = Math.min(100, Math.round((run.turn / 12) * 100));
  return (
    <main className="career-run-shell career-run-play">
      <header className="career-run-header">
        <div><span className="career-run-overline">CAREER RUN · {String(run.turn + 1).padStart(2, "0")}</span><h1>应届生开荒局</h1></div>
        <button className="career-run-text-button" type="button" onClick={onRestart}>重新开始</button>
      </header>
      <div className="career-run-progress" aria-label={`游戏进度 ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
      <div className="career-run-game-grid">
        <aside className="career-run-status-card">
          <div className="career-run-status-heading"><span>你的状态</span><small>{run.stage.toUpperCase()}</small></div>
          <AttributeMeters attributes={run.attributes} />
          <div className="career-run-counter-grid">
            <span><strong>{run.counters.applications}</strong>Applications</span>
            <span><strong>{run.counters.interviews}</strong>Interviews</span>
            <span><strong>{run.counters.referrals}</strong>Referrals</span>
            <span><strong>{run.counters.offers}</strong>Offers</span>
          </div>
        </aside>

        <section className={`career-run-event-card category-${event?.category || "profile"}`}>
          {showingOutcome ? (
            <div className="career-run-outcome" aria-live="polite">
              <span className="career-run-overline">CHOICE RESOLVED</span>
              <h2>{run.history.at(-1)?.choiceLabel}</h2>
              <p>{run.lastOutcome.message}</p>
              <DeltaList deltas={run.lastOutcome.deltas} />
              <button className="career-run-primary" type="button" onClick={onContinue}>
                {run.status === "complete" ? "查看本局结果" : "翻开下一张牌"}
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </section>

        <aside className="career-run-log-card">
          <span className="career-run-overline">RUN LOG</span>
          <h2>这一路发生了什么</h2>
          {run.history.length ? (
            <ol>{run.history.slice(-4).reverse().map((entry) => <li key={`${entry.eventId}-${entry.choiceId}`}><strong>{entry.eventTitle}</strong><span>{entry.choiceLabel}</span></li>)}</ol>
          ) : <p>你的第一条行动记录会出现在这里。</p>}
        </aside>
      </div>
    </main>
  );
}

function Result({ result, run, onRestart, onSavePath }) {
  return (
    <main className="career-run-shell career-run-result">
      <header className="career-run-result-hero">
        <span className="career-run-overline">RUN COMPLETE</span>
        <p>这一轮求职发生了什么？</p>
        <h1>{result.ending.title}</h1>
        <p className="career-run-lead">{result.ending.description}</p>
      </header>

      <section className="career-run-result-grid">
        <article className="career-run-persona-card">
          <span className="career-run-overline">你的求职方式更像</span>
          <h2>{result.persona.name}</h2>
          <p>{result.persona.description}</p>
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

  const start = () => {
    const next = createCareerRun({ seed: Date.now() });
    persistRun(next);
    setSavedRun(null);
    setRun(next);
    setShowingOutcome(false);
    setScreen("play");
  };
  const resume = () => { setRun(savedRun); setShowingOutcome(false); setScreen("play"); };
  const choose = (choiceId) => {
    const next = advanceCareerRun(run, choiceId);
    persistRun(next);
    setSavedRun(next.status === "playing" ? next : null);
    setRun(next);
    setShowingOutcome(true);
  };
  const continueRun = () => {
    if (run.status === "complete") setScreen("result");
    else setShowingOutcome(false);
  };
  const restart = () => {
    persistRun(null);
    setSavedRun(null);
    setRun(null);
    setShowingOutcome(false);
    setScreen("intro");
  };
  const result = screen === "result" && run ? summarizeCareerRun(run) : null;
  const savePath = () => {
    const existing = loadPilotPathDraft();
    if (existing && !window.confirm("这会用本局结果更新你当前浏览器里的求职 Path。要继续吗？")) return;
    const source = existing || buildDefaultPilotDraft();
    const draft = buildPersonalizedPilotDraft(source, { ...result.path.profile, setup_complete: true });
    if (savePilotPathDraft(draft)) navigate("/note/fall-recruiting/autumn-recruitment-roadmap.md");
  };

  if (screen === "intro") return <Intro savedRun={savedRun} onStart={start} onResume={resume} />;
  if (screen === "result") return <Result result={result} run={run} onRestart={restart} onSavePath={savePath} />;
  return <Play run={run} showingOutcome={showingOutcome} onChoose={choose} onContinue={continueRun} onRestart={restart} />;
}
