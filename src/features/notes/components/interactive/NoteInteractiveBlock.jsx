import { useMemo, useState } from "react";
import { CheckOutlined } from "@ant-design/icons";

import {
  FALL_RECRUITING_CERTIFICATES,
  getNextCertificateWindow,
} from "../../../fallRecruiting/lib/certificates";

import "./NoteInteractiveBlock.css";

function readSavedState(id, fallback) {
  if (!id || typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(`notes-system:interaction:${id}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function useSavedInteractionState(id, fallback) {
  const [state, setState] = useState(() => readSavedState(id, fallback));
  const update = (nextState) => {
    setState(nextState);
    try {
      window.localStorage.setItem(`notes-system:interaction:${id}`, JSON.stringify(nextState));
    } catch {
      // The interaction still works when local storage is unavailable.
    }
  };
  return [state, update];
}

function CertificateComparisonLab({ id }) {
  const [selectedIds, setSelectedIds] = useSavedInteractionState(id, []);
  const selected = new Set(Array.isArray(selectedIds) ? selectedIds : []);

  const toggle = (certificateId) => {
    const next = selected.has(certificateId)
      ? selectedIds.filter((currentId) => currentId !== certificateId)
      : [...selectedIds, certificateId];
    setSelectedIds(next);
  };

  return (
    <section className="note-interaction" aria-labelledby={`${id}-title`}>
      <header className="note-interaction__header">
        <span>互动比较</span>
        <h3 id={`${id}-title`}>先判断哪些证书值得继续了解</h3>
        <p>最终是否要将它们加入你的求职 Path，请在“调整你的求职 Path”中确认。</p>
      </header>
      <div className="note-certificate-grid">
        {FALL_RECRUITING_CERTIFICATES.map((certificate) => {
          const isSelected = selected.has(certificate.id);
          const nextWindow = getNextCertificateWindow(certificate.id);
          return (
            <article key={certificate.id} className={`note-certificate${isSelected ? " is-selected" : ""}`}>
              <header>
                <strong>{certificate.shortName}</strong>
                <span>{certificate.name}</span>
              </header>
              <dl>
                <div><dt>更常见于</dt><dd>{certificate.fit}</dd></div>
                <div><dt>主要价值</dt><dd>{certificate.value}</dd></div>
                <div><dt>下一窗口</dt><dd>{nextWindow.label}</dd></div>
              </dl>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggle(certificate.id)}
              >
                {isSelected ? <CheckOutlined aria-hidden="true" /> : null}
                {isSelected ? "已标记：进一步了解" : "进一步了解"}
              </button>
              <a href={certificate.officialUrl} target="_blank" rel="noreferrer">查看官方信息</a>
            </article>
          );
        })}
      </div>
      <div className="note-interaction__result" aria-live="polite">
        <strong>{selected.size ? `已选 ${selected.size} 项` : "还没有选择"}</strong>
        <span>
          {selected.size
            ? FALL_RECRUITING_CERTIFICATES.filter((item) => selected.has(item.id)).map((item) => item.shortName).join("、")
            : "如果证书与目标岗位关系不明确，先回到 JD，而不是急着报名。"}
        </span>
      </div>
    </section>
  );
}

function ResumeFocusLab({ id, roles = [] }) {
  const [selectedRole, setSelectedRole] = useSavedInteractionState(id, roles[0]?.id || "");
  const activeRole = roles.find((role) => role.id === selectedRole) || roles[0];

  if (!activeRole) return null;

  return (
    <section className="note-interaction" aria-labelledby={`${id}-title`}>
      <header className="note-interaction__header">
        <span>版本对比</span>
        <h3 id={`${id}-title`}>申请不同的岗位时，挑选最有说服力的经历，调整讲述它的方式</h3>
        <p>切换可能的岗位方向，看看该如何呈现你拥有的证据。</p>
      </header>
      <div className="note-segmented" role="group" aria-label="选择岗位方向">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            className={role.id === activeRole.id ? "is-selected" : ""}
            aria-pressed={role.id === activeRole.id}
            onClick={() => setSelectedRole(role.id)}
          >
            {role.label}
          </button>
        ))}
      </div>
      <div className="note-resume-preview" aria-live="polite">
        <div>
          <span>优先选择</span>
          <strong>{activeRole.lead}</strong>
        </div>
        <ul>
          {activeRole.emphasis.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p><strong>Tips：</strong>{activeRole.caution}</p>
      </div>
    </section>
  );
}

function StarFrameworkLab({ id, eyebrow, title, description, steps = [] }) {
  const [selectedStepId, setSelectedStepId] = useSavedInteractionState(id, steps[0]?.id || "");
  const activeStep = steps.find((step) => step.id === selectedStepId) || steps[0];

  if (!activeStep) return null;

  return (
    <section className="note-interaction note-star-framework" aria-labelledby={`${id}-title`}>
      <header className="note-interaction__header">
        <span>{eyebrow}</span>
        <h3 id={`${id}-title`}>{title}</h3>
        <p>{description}</p>
      </header>

      <div className="note-star-framework__steps" role="group" aria-label={title}>
        {steps.map((step, index) => {
          const isSelected = step.id === activeStep.id;
          return (
            <button
              key={step.id}
              type="button"
              className={isSelected ? "is-selected" : ""}
              aria-pressed={isSelected}
              aria-controls={`${id}-detail`}
              onClick={() => setSelectedStepId(step.id)}
            >
              <span className="note-star-framework__code" aria-hidden="true">{step.code}</span>
              <span className="note-star-framework__step-copy">
                <strong>{step.label}</strong>
                <small>{step.summary}</small>
              </span>
              <span className="note-star-framework__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          );
        })}
      </div>

      <article id={`${id}-detail`} className="note-star-framework__detail" aria-live="polite">
        <div className="note-star-framework__detail-heading">
          <span>{activeStep.code}</span>
          <div>
            <small>{activeStep.label}</small>
            <strong>{activeStep.detail}</strong>
          </div>
        </div>
        <div className="note-star-framework__detail-grid">
          <div>
            <span>{activeStep.questionLabel}</span>
            <ul>
              {(activeStep.questions || []).map((question) => <li key={question}>{question}</li>)}
            </ul>
          </div>
          <aside>
            <span>{activeStep.tipLabel}</span>
            <p>{activeStep.tip}</p>
          </aside>
        </div>
      </article>
    </section>
  );
}

function ResumeChecklistLab({
  id,
  eyebrow,
  title,
  description,
  items = [],
  progressLabel,
  inProgressMessage,
  completedMessage,
  resetLabel,
}) {
  const [savedCheckedIds, setSavedCheckedIds] = useSavedInteractionState(id, []);
  const checkedIds = Array.isArray(savedCheckedIds) ? savedCheckedIds : [];
  const checked = new Set(checkedIds);
  const completedCount = items.filter((item) => checked.has(item.id)).length;
  const progress = items.length ? Math.round((completedCount / items.length) * 100) : 0;
  const isComplete = items.length > 0 && completedCount === items.length;

  const toggle = (itemId) => {
    const next = checked.has(itemId)
      ? checkedIds.filter((currentId) => currentId !== itemId)
      : [...checkedIds, itemId];
    setSavedCheckedIds(next);
  };

  return (
    <section className="note-interaction note-resume-checklist" aria-labelledby={`${id}-title`}>
      <header className="note-interaction__header">
        <span>{eyebrow}</span>
        <h3 id={`${id}-title`}>{title}</h3>
        <p>{description}</p>
      </header>

      <div className="note-resume-checklist__progress" aria-live="polite">
        <div>
          <strong>{progressLabel}</strong>
          <span>{completedCount} / {items.length}</span>
        </div>
        <div
          className="note-resume-checklist__track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax={items.length}
          aria-valuenow={completedCount}
          aria-label={progressLabel}
        >
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        <p>{isComplete ? completedMessage : inProgressMessage}</p>
        {completedCount > 0 ? (
          <button type="button" onClick={() => setSavedCheckedIds([])}>{resetLabel}</button>
        ) : null}
      </div>

      <div className="note-resume-checklist__items">
        {items.map((item) => {
          const isChecked = checked.has(item.id);
          return (
            <label key={item.id} className={isChecked ? "is-checked" : ""}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(item.id)}
              />
              <span>{item.text}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}

function CoverLetterArgumentLab({
  id,
  eyebrow,
  title,
  description,
  columns = [],
  examples = [],
  exampleLabel,
  yourTurnLabel,
  savedHint,
  resetLabel,
}) {
  const emptyDraft = Object.fromEntries(columns.map((column) => [column.id, ""]));
  const [savedDraft, setSavedDraft] = useSavedInteractionState(id, emptyDraft);
  const draft = { ...emptyDraft, ...(savedDraft || {}) };
  const hasDraft = columns.some((column) => String(draft[column.id] || "").trim());

  const updateField = (fieldId, value) => {
    setSavedDraft({ ...draft, [fieldId]: value });
  };

  return (
    <section className="note-interaction note-cover-letter-argument" aria-labelledby={`${id}-title`}>
      <header className="note-interaction__header">
        <span>{eyebrow}</span>
        <h3 id={`${id}-title`}>{title}</h3>
        <p>{description}</p>
      </header>

      <div className="note-cover-letter-argument__table">
        <div className="note-cover-letter-argument__columns" aria-hidden="true">
          {columns.map((column) => <strong key={column.id}>{column.label}</strong>)}
        </div>

        {examples.map((example, index) => (
          <article key={example.id} className="note-cover-letter-argument__row">
            <span className="note-cover-letter-argument__row-label">
              {exampleLabel} {String(index + 1).padStart(2, "0")}
            </span>
            <div className="note-cover-letter-argument__cells">
              {columns.map((column) => (
                <div key={column.id}>
                  <small>{column.label}</small>
                  <p>{example[column.id]}</p>
                </div>
              ))}
            </div>
          </article>
        ))}

        <article className="note-cover-letter-argument__row note-cover-letter-argument__row--draft">
          <span className="note-cover-letter-argument__row-label">{yourTurnLabel}</span>
          <div className="note-cover-letter-argument__cells">
            {columns.map((column) => (
              <label key={column.id}>
                <span>{column.label}</span>
                <textarea
                  rows="4"
                  value={draft[column.id] || ""}
                  placeholder={column.placeholder}
                  onChange={(event) => updateField(column.id, event.target.value)}
                />
              </label>
            ))}
          </div>
          <footer>
            <span>{savedHint}</span>
            {hasDraft ? (
              <button type="button" onClick={() => setSavedDraft(emptyDraft)}>{resetLabel}</button>
            ) : null}
          </footer>
        </article>
      </div>
    </section>
  );
}

const EVIDENCE_STATES = [
  { id: "evidence", label: "已有证据" },
  { id: "gap", label: "需要补强" },
  { id: "defer", label: "暂不投入" },
];

function EvidenceMatrixLab({ id, items = [] }) {
  const initialState = useMemo(
    () => Object.fromEntries(items.map((item) => [item.id, "gap"])),
    [items],
  );
  const [decisions, setDecisions] = useSavedInteractionState(id, initialState);
  const currentDecisions = { ...initialState, ...decisions };

  const counts = EVIDENCE_STATES.map((state) => ({
    ...state,
    count: items.filter((item) => currentDecisions[item.id] === state.id).length,
  }));

  const setDecision = (itemId, stateId) => {
    setDecisions({ ...currentDecisions, [itemId]: stateId });
  };

  return (
    <section className="note-interaction" aria-labelledby={`${id}-title`}>
      <header className="note-interaction__header">
        <span>JD 证据矩阵</span>
        <h3 id={`${id}-title`}>把岗位要求分成三类</h3>
        <p>逐行判断，优先处理重复出现在多份 JD 中、但你还缺少证据的要求。</p>
      </header>
      <div className="note-evidence-matrix">
        {items.map((item) => (
          <div key={item.id} className="note-evidence-row">
            <div><strong>{item.label}</strong><span>{item.hint}</span></div>
            <div role="group" aria-label={`${item.label}的准备状态`}>
              {EVIDENCE_STATES.map((state) => (
                <button
                  key={state.id}
                  type="button"
                  className={currentDecisions[item.id] === state.id ? "is-selected" : ""}
                  aria-pressed={currentDecisions[item.id] === state.id}
                  onClick={() => setDecision(item.id, state.id)}
                >
                  {state.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="note-interaction__summary" aria-live="polite">
        {counts.map((state) => (
          <span key={state.id}><strong>{state.count}</strong>{state.label}</span>
        ))}
      </div>
    </section>
  );
}

function RoleAnatomyLab({ id, eyebrow, title, description, dimensions = [] }) {
  const initialState = useMemo(
    () => Object.fromEntries(dimensions.map((dimension) => [dimension.id, []])),
    [dimensions],
  );
  const [selections, setSelections] = useSavedInteractionState(id, initialState);
  const currentSelections = { ...initialState, ...selections };

  const toggleOption = (dimensionId, option) => {
    const selected = Array.isArray(currentSelections[dimensionId])
      ? currentSelections[dimensionId]
      : [];
    const next = selected.includes(option)
      ? selected.filter((item) => item !== option)
      : [...selected, option];
    setSelections({ ...currentSelections, [dimensionId]: next });
  };

  const selectedDimensions = dimensions.filter(
    (dimension) => currentSelections[dimension.id]?.length,
  );

  return (
    <section className="note-interaction note-role-anatomy" aria-labelledby={`${id}-title`}>
      <header className="note-interaction__header">
        <span>{eyebrow}</span>
        <h3 id={`${id}-title`}>{title}</h3>
        <p>{description}</p>
      </header>
      <div className="note-role-anatomy__grid">
        {dimensions.map((dimension, index) => (
          <article key={dimension.id} className="note-role-anatomy__dimension">
            <header>
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <strong>{dimension.label}</strong>
            </header>
            <div role="group" aria-label={dimension.label}>
              {dimension.options.map((option) => {
                const isSelected = currentSelections[dimension.id]?.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    className={isSelected ? "is-selected" : ""}
                    aria-pressed={isSelected}
                    onClick={() => toggleOption(dimension.id, option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>
      <div className="note-role-anatomy__summary" aria-live="polite">
        <span>岗位轮廓</span>
        {selectedDimensions.length ? (
          <dl>
            {selectedDimensions.map((dimension) => (
              <div key={dimension.id}>
                <dt>{dimension.label}</dt>
                <dd>{currentSelections[dimension.id].join(" · ")}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p>从任意一项开始点选，把抽象的 Title 慢慢还原成具体工作。</p>
        )}
      </div>
    </section>
  );
}

const PROFILE_GOALS = [
  {
    id: "public-profile",
    label: "让别人快速了解我的职业方向",
    materials: ["linkedin"],
  },
  {
    id: "motivation",
    label: "解释我为什么选择这家公司或岗位",
    materials: ["cover-letter"],
  },
  {
    id: "project-depth",
    label: "展示简历放不下的作品和过程",
    materials: ["portfolio"],
  },
  {
    id: "single-entry",
    label: "把经历、项目和外部链接放在同一个入口",
    materials: ["personal-site"],
  },
];

const PROFILE_MATERIALS = [
  { id: "resume", label: "简历", note: "快速呈现与岗位最相关的证据" },
  { id: "linkedin", label: "LinkedIn", note: "建立公开职业身份，也方便 Networking" },
  { id: "cover-letter", label: "Cover Letter", note: "展开动机，以及经历与岗位之间的连接" },
  { id: "portfolio", label: "项目集", note: "深入展示作品、方法、过程和个人贡献" },
  { id: "personal-site", label: "个人主页", note: "用一个稳定入口串起介绍、经历与链接" },
];

function ProfileKitLab({ id }) {
  const [selectedGoals, setSelectedGoals] = useSavedInteractionState(id, []);
  const selected = new Set(Array.isArray(selectedGoals) ? selectedGoals : []);
  const recommendedIds = new Set(["resume"]);

  PROFILE_GOALS.forEach((goal) => {
    if (!selected.has(goal.id)) return;
    goal.materials.forEach((materialId) => recommendedIds.add(materialId));
  });

  const toggle = (goalId) => {
    const next = selected.has(goalId)
      ? selectedGoals.filter((currentId) => currentId !== goalId)
      : [...selectedGoals, goalId];
    setSelectedGoals(next);
  };

  return (
    <section className="note-interaction" aria-labelledby={`${id}-title`}>
      <header className="note-interaction__header">
        <span>材料组合预览</span>
        <h3 id={`${id}-title`}>你还希望招聘方看见什么？</h3>
        <p>点选符合你的情况，看看哪些材料更适合承接这些内容。选择只保存在当前设备，不会修改 Path。</p>
      </header>
      <div className="note-profile-goals" role="group" aria-label="选择希望呈现的内容">
        {PROFILE_GOALS.map((goal) => {
          const isSelected = selected.has(goal.id);
          return (
            <button
              key={goal.id}
              type="button"
              className={isSelected ? "is-selected" : ""}
              aria-pressed={isSelected}
              onClick={() => toggle(goal.id)}
            >
              <span className="note-profile-goals__check" aria-hidden="true">
                {isSelected ? <CheckOutlined /> : null}
              </span>
              {goal.label}
            </button>
          );
        })}
      </div>
      <div className="note-profile-kit" aria-live="polite">
        {PROFILE_MATERIALS.filter((material) => recommendedIds.has(material.id)).map((material) => (
          <article key={material.id}>
            <CheckOutlined aria-hidden="true" />
            <div><strong>{material.label}</strong><span>{material.note}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}

const OFFER_DIMENSIONS = [
  { id: "work", label: "实际工作内容", hint: "日常任务是否愿意长期投入" },
  { id: "team", label: "团队与管理方式", hint: "沟通、反馈和新人支持" },
  { id: "growth", label: "学习与发展", hint: "能力积累、轮岗与后续路径" },
  { id: "life", label: "地点与生活", hint: "通勤、节奏和个人安排" },
  { id: "rewards", label: "薪酬与保障", hint: "基本薪酬、奖金、福利与稳定性" },
];

function OfferComparisonLab({ id }) {
  const initialScores = Object.fromEntries(
    OFFER_DIMENSIONS.map((dimension) => [dimension.id, { a: 3, b: 3 }]),
  );
  const [state, setState] = useSavedInteractionState(id, {
    names: { a: "Offer A", b: "Offer B" },
    priorities: [],
    scores: initialScores,
  });
  const names = { a: "Offer A", b: "Offer B", ...(state.names || {}) };
  const priorities = new Set(Array.isArray(state.priorities) ? state.priorities : []);
  const scores = { ...initialScores, ...(state.scores || {}) };

  const updateName = (key, value) => setState({ ...state, names: { ...names, [key]: value } });
  const togglePriority = (dimensionId) => {
    const next = priorities.has(dimensionId)
      ? [...priorities].filter((currentId) => currentId !== dimensionId)
      : [...priorities, dimensionId];
    setState({ ...state, priorities: next });
  };
  const updateScore = (dimensionId, offerKey, value) => {
    setState({
      ...state,
      scores: {
        ...scores,
        [dimensionId]: { ...scores[dimensionId], [offerKey]: Number(value) },
      },
    });
  };
  const totals = ["a", "b"].reduce((result, offerKey) => {
    result[offerKey] = OFFER_DIMENSIONS.reduce((sum, dimension) => {
      const weight = priorities.has(dimension.id) ? 2 : 1;
      return sum + Number(scores[dimension.id]?.[offerKey] || 0) * weight;
    }, 0);
    return result;
  }, {});

  return (
    <section className="note-interaction" aria-labelledby={`${id}-title`}>
      <header className="note-interaction__header">
        <span>Offer 对比</span>
        <h3 id={`${id}-title`}>把重要条件放在同一张表里</h3>
        <p>点亮你最在意的维度，它会获得更高权重。分数只帮助整理想法，不替你做决定。</p>
      </header>
      <div className="note-offer-names">
        {["a", "b"].map((offerKey) => (
          <label key={offerKey}>
            <span>{offerKey === "a" ? "第一个选择" : "第二个选择"}</span>
            <input
              value={names[offerKey]}
              onChange={(event) => updateName(offerKey, event.target.value)}
              aria-label={`${offerKey === "a" ? "第一个" : "第二个"} Offer 名称`}
            />
          </label>
        ))}
      </div>
      <div className="note-offer-grid">
        {OFFER_DIMENSIONS.map((dimension) => (
          <article key={dimension.id} className={priorities.has(dimension.id) ? "is-priority" : ""}>
            <header>
              <div><strong>{dimension.label}</strong><span>{dimension.hint}</span></div>
              <button
                type="button"
                aria-pressed={priorities.has(dimension.id)}
                onClick={() => togglePriority(dimension.id)}
              >
                {priorities.has(dimension.id) ? "重点考虑" : "设为重点"}
              </button>
            </header>
            <div className="note-offer-scores">
              {["a", "b"].map((offerKey) => (
                <label key={offerKey}>
                  <span>{names[offerKey] || (offerKey === "a" ? "Offer A" : "Offer B")}</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={scores[dimension.id]?.[offerKey] || 3}
                    onChange={(event) => updateScore(dimension.id, offerKey, event.target.value)}
                  />
                  <strong>{scores[dimension.id]?.[offerKey] || 3}</strong>
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="note-interaction__summary note-offer-total" aria-live="polite">
        <span><strong>{totals.a}</strong>{names.a || "Offer A"}</span>
        <span><strong>{totals.b}</strong>{names.b || "Offer B"}</span>
        <small>书面事实、口头信息和个人推测记得分开核实。</small>
      </div>
    </section>
  );
}

const FUNNEL_STAGES = [
  { id: "saved", label: "认真考虑的岗位" },
  { id: "applied", label: "实际投递" },
  { id: "assessment", label: "进入测试 / VI" },
  { id: "interview", label: "进入面试" },
  { id: "offer", label: "收到 Offer" },
];

function ApplicationFunnelLab({ id }) {
  const [counts, setCounts] = useSavedInteractionState(
    id,
    Object.fromEntries(FUNNEL_STAGES.map((stage) => [stage.id, ""])),
  );
  const transitions = FUNNEL_STAGES.slice(1).map((stage, index) => {
    const previous = FUNNEL_STAGES[index];
    const from = Number(counts[previous.id]);
    const to = Number(counts[stage.id]);
    return {
      label: `${previous.label} → ${stage.label}`,
      rate: from > 0 && to >= 0 ? Math.min(100, Math.round((to / from) * 100)) : null,
    };
  });
  const availableTransitions = transitions.filter((item) => item.rate !== null);
  const lowest = availableTransitions.length
    ? [...availableTransitions].sort((a, b) => a.rate - b.rate)[0]
    : null;

  return (
    <section className="note-interaction" aria-labelledby={`${id}-title`}>
      <header className="note-interaction__header">
        <span>求职漏斗</span>
        <h3 id={`${id}-title`}>看看反馈集中出现在哪里</h3>
        <p>只填已有数据即可。阶段转化用来发现模式，不用和别人的数字比较。</p>
      </header>
      <div className="note-funnel-inputs">
        {FUNNEL_STAGES.map((stage) => (
          <label key={stage.id}>
            <span>{stage.label}</span>
            <input
              type="number"
              min="0"
              inputMode="numeric"
              value={counts[stage.id] ?? ""}
              placeholder="—"
              onChange={(event) => setCounts({ ...counts, [stage.id]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="note-funnel-transitions" aria-live="polite">
        {transitions.map((transition) => (
          <span key={transition.label}>
            <small>{transition.label}</small>
            <strong>{transition.rate === null ? "—" : `${transition.rate}%`}</strong>
          </span>
        ))}
      </div>
      <div className="note-interaction__result">
        <strong>{lowest ? "目前最值得回看" : "等待更多数据"}</strong>
        <span>{lowest ? `${lowest.label}（${lowest.rate}%）` : "填入相邻阶段后，这里会显示转化较低的一段。"}</span>
      </div>
    </section>
  );
}

const INTERNSHIP_REVIEW_STEPS = [
  { id: "problem", label: "解决了什么问题？" },
  { id: "method", label: "使用了哪些工具或方法？" },
  { id: "challenge", label: "遇到了什么困难？" },
  { id: "decision", label: "自己做了什么决定？" },
  { id: "feedback", label: "得到了什么反馈？" },
  { id: "result", label: "最后的结果是什么？" },
];

function InternshipReviewCycleLab({ id }) {
  const emptyState = {
    completed: "",
    story: "",
    steps: Object.fromEntries(INTERNSHIP_REVIEW_STEPS.map((step) => [step.id, ""])),
  };
  const [savedState, setSavedState] = useSavedInteractionState(id, emptyState);
  const state = {
    ...emptyState,
    ...savedState,
    steps: { ...emptyState.steps, ...(savedState?.steps || {}) },
  };

  const updateField = (field, value) => setSavedState({ ...state, [field]: value });
  const updateStep = (stepId, value) => setSavedState({
    ...state,
    steps: { ...state.steps, [stepId]: value },
  });

  return (
    <section className="note-interaction note-internship-review" aria-labelledby={`${id}-title`}>
      <header className="note-interaction__header">
        <span>每周实习复盘</span>
        <h3 id={`${id}-title`}>把一周的工作，慢慢沉淀成下一次求职的故事</h3>
        <p>不需要一次写得很完整。先留下关键词，内容会自动保存在这台设备上。</p>
      </header>

      <label className="note-internship-review__bookend note-internship-review__bookend--start">
        <span>这一周完成了什么？</span>
        <textarea
          rows="2"
          value={state.completed}
          placeholder="例如：完成了新功能用户行为分析，并在周会上分享发现。"
          onChange={(event) => updateField("completed", event.target.value)}
        />
      </label>

      <div className="note-internship-cycle" aria-label="从问题到结果的六步复盘循环">
        <svg className="note-internship-cycle__path" viewBox="0 0 900 420" aria-hidden="true">
          <defs>
            <marker id={`${id}-arrow`} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          <path d="M 170 98 H 438 H 715 Q 790 98 790 180 V 242 Q 790 322 715 322 H 445 H 175 Q 100 322 100 242 V 180 Q 100 98 170 98" markerEnd={`url(#${id}-arrow)`} />
        </svg>
        {INTERNSHIP_REVIEW_STEPS.map((step, index) => (
          <label key={step.id} className={`note-internship-cycle__step note-internship-cycle__step--${index + 1}`}>
            <span className="note-internship-cycle__number" aria-hidden="true">{index + 1}</span>
            <strong>{step.label}</strong>
            <textarea
              rows="3"
              value={state.steps[step.id]}
              aria-label={step.label}
              placeholder="记下关键词…"
              onChange={(event) => updateStep(step.id, event.target.value)}
            />
          </label>
        ))}
      </div>

      <label className="note-internship-review__bookend note-internship-review__bookend--finish">
        <span>这件事以后可以怎样写进 Resume 或 STAR Story？</span>
        <textarea
          rows="3"
          value={state.story}
          placeholder="试着串起来：在什么背景下，我为了解决什么问题，采取了哪些行动，最后带来了什么结果？"
          onChange={(event) => updateField("story", event.target.value)}
        />
      </label>
    </section>
  );
}

export default function NoteInteractiveBlock({ configText }) {
  const config = useMemo(() => {
    try {
      return JSON.parse(configText);
    } catch {
      return null;
    }
  }, [configText]);

  if (!config?.type || !config?.id) return null;
  if (config.type === "certificate-comparison") return <CertificateComparisonLab id={config.id} />;
  if (config.type === "resume-focus") return <ResumeFocusLab id={config.id} roles={config.roles} />;
  if (config.type === "star-framework") {
    return (
      <StarFrameworkLab
        id={config.id}
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        steps={config.steps}
      />
    );
  }
  if (config.type === "resume-checklist") {
    return (
      <ResumeChecklistLab
        id={config.id}
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        items={config.items}
        progressLabel={config.progressLabel}
        inProgressMessage={config.inProgressMessage}
        completedMessage={config.completedMessage}
        resetLabel={config.resetLabel}
      />
    );
  }
  if (config.type === "cover-letter-argument") {
    return (
      <CoverLetterArgumentLab
        id={config.id}
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        columns={config.columns}
        examples={config.examples}
        exampleLabel={config.exampleLabel}
        yourTurnLabel={config.yourTurnLabel}
        savedHint={config.savedHint}
        resetLabel={config.resetLabel}
      />
    );
  }
  if (config.type === "evidence-matrix") return <EvidenceMatrixLab id={config.id} items={config.items} />;
  if (config.type === "role-anatomy") {
    return (
      <RoleAnatomyLab
        id={config.id}
        eyebrow={config.eyebrow}
        title={config.title}
        description={config.description}
        dimensions={config.dimensions}
      />
    );
  }
  if (config.type === "profile-kit") return <ProfileKitLab id={config.id} />;
  if (config.type === "offer-comparison") return <OfferComparisonLab id={config.id} />;
  if (config.type === "application-funnel") return <ApplicationFunnelLab id={config.id} />;
  if (config.type === "internship-review-cycle") return <InternshipReviewCycleLab id={config.id} />;
  return null;
}
