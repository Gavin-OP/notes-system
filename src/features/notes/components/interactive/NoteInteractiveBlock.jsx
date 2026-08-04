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
        <p>选择只会保存在这台设备上；最终是否加入 Path，请在“调整你的秋招 Path”中确认。</p>
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
        <h3 id={`${id}-title`}>同一段经历，不同岗位先展示什么？</h3>
        <p>切换岗位方向，看看简历前 1/3 和 bullet 应该优先呈现的证据。</p>
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
          <span>前 1/3 优先出现</span>
          <strong>{activeRole.lead}</strong>
        </div>
        <ul>
          {activeRole.emphasis.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <p><strong>不要改动事实：</strong>{activeRole.caution}</p>
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
  if (config.type === "evidence-matrix") return <EvidenceMatrixLab id={config.id} items={config.items} />;
  if (config.type === "profile-kit") return <ProfileKitLab id={config.id} />;
  return null;
}
