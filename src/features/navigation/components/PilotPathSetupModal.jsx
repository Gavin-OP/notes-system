import { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";

import {
  PILOT_STAGE_OPTIONS,
  PROFILE_BRANCH_OPTIONS,
  SEARCH_BRANCH_OPTIONS,
  SKILL_BRANCH_OPTIONS,
} from "../lib/pilotPath";
import {
  FALL_RECRUITING_CERTIFICATES,
  getNextCertificateWindow,
} from "../../fallRecruiting/lib/certificates";

import "./PilotPathSetupModal.css";

const EMPTY_PROFILE = {
  stage: "getting_started",
  profile_branches: [],
  search_branches: [],
  skill_branches: [],
  certificate_branches: [],
};

function normalizeInitialProfile(initialProfile = {}) {
  return {
    stage: initialProfile.stage === "targeting" ? "getting_started" : initialProfile.stage || "getting_started",
    profile_branches: Array.isArray(initialProfile.profile_branches) ? initialProfile.profile_branches : [],
    search_branches: Array.isArray(initialProfile.search_branches) ? initialProfile.search_branches : [],
    skill_branches: Array.isArray(initialProfile.skill_branches)
      ? initialProfile.skill_branches.filter((value) => value !== "finance")
      : [],
    certificate_branches: Array.isArray(initialProfile.certificate_branches)
      ? initialProfile.certificate_branches
      : [],
  };
}

function ChoiceCard({ label, selected, muted = false, disabled, onClick }) {
  return (
    <button
      type="button"
      className={`pilot-path-choice${muted ? " pilot-path-choice--muted" : ""}${
        selected ? " pilot-path-choice--selected" : ""
      }`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <span>{label}</span>
      <span className="pilot-path-choice__indicator" aria-hidden="true">
        {selected ? <CheckOutlined /> : null}
      </span>
    </button>
  );
}

function SingleChoiceGrid({ options, value, disabled, onChange }) {
  return (
    <div className="pilot-path-question__options">
      {options.map((option) => (
        <ChoiceCard
          key={String(option.value)}
          label={option.label}
          selected={value === option.value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}

function MultiChoiceGrid({ options, value, emptyLabel, disabled, onChange }) {
  const selectedValues = new Set(value);
  const toggle = (optionValue) => {
    const next = selectedValues.has(optionValue)
      ? value.filter((currentValue) => currentValue !== optionValue)
      : [...value, optionValue];
    onChange(next);
  };

  return (
    <div className="pilot-path-question__options">
      {options.map((option) => (
        <ChoiceCard
          key={option.value}
          label={option.label}
          selected={selectedValues.has(option.value)}
          disabled={disabled}
          onClick={() => toggle(option.value)}
        />
      ))}
      <ChoiceCard
        label={emptyLabel}
        selected={value.length === 0}
        muted
        disabled={disabled}
        onClick={() => onChange([])}
      />
    </div>
  );
}

function CertificateComparisonGrid({ value, disabled, onChange }) {
  const selectedValues = new Set(value);

  const setDecision = (certificateId, shouldAdd) => {
    const next = shouldAdd
      ? [...new Set([...value, certificateId])]
      : value.filter((currentValue) => currentValue !== certificateId);
    onChange(next);
  };

  return (
    <div className="pilot-certificate-comparison">
      {FALL_RECRUITING_CERTIFICATES.map((certificate) => {
        const selected = selectedValues.has(certificate.id);
        const nextWindow = getNextCertificateWindow(certificate.id);
        return (
          <article
            key={certificate.id}
            className={`pilot-certificate-card${selected ? " pilot-certificate-card--selected" : ""}`}
          >
            <header>
              <span>{certificate.shortName}</span>
              <small>{certificate.name}</small>
            </header>
            <dl>
              <div>
                <dt>更常见于</dt>
                <dd>{certificate.fit}</dd>
              </div>
              <div>
                <dt>主要价值</dt>
                <dd>{certificate.value}</dd>
              </div>
              <div>
                <dt>准备投入</dt>
                <dd>{certificate.preparation}</dd>
              </div>
              <div className="pilot-certificate-card__window">
                <dt>下一考试窗口</dt>
                <dd>
                  <strong>{nextWindow.label}</strong>
                  <span>{nextWindow.detail}</span>
                </dd>
              </div>
            </dl>
            <details>
              <summary>判断前还要知道什么</summary>
              <p>{certificate.limitation}</p>
              <a href={certificate.officialUrl} target="_blank" rel="noreferrer">
                查看官方考试信息
              </a>
            </details>
            <div className="pilot-certificate-card__actions" aria-label={`${certificate.shortName} Path 选择`}>
              <button
                type="button"
                className={selected ? "is-selected" : ""}
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => setDecision(certificate.id, true)}
              >
                加入 Path，进一步了解
              </button>
              <button
                type="button"
                className={!selected ? "is-selected is-secondary" : ""}
                aria-pressed={!selected}
                disabled={disabled}
                onClick={() => setDecision(certificate.id, false)}
              >
                稍后考虑
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function PilotPathSetupWizard({ initialProfile, pending = false, onCancel, onSubmit, embedded = false }) {
  const [profile, setProfile] = useState(() => normalizeInitialProfile(initialProfile));
  const [stepIndex, setStepIndex] = useState(0);

  const update = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const questions = [
    {
      id: "stage",
      title: "你目前处于哪个求职阶段？",
      hint: "这会用来调整 Timeline 的起点与节奏。",
      content: (
        <SingleChoiceGrid
          options={PILOT_STAGE_OPTIONS}
          value={profile.stage}
          disabled={pending}
          onChange={(value) => update("stage", value)}
        />
      ),
    },
    {
      id: "profile",
      title: "简历与 Profile 中，你还需要准备什么？",
      hint: "简历会默认保留；这里只选择额外需要的分支，可以多选。",
      content: (
        <MultiChoiceGrid
          options={PROFILE_BRANCH_OPTIONS}
          value={profile.profile_branches}
          emptyLabel="暂时不添加额外分支"
          disabled={pending}
          onChange={(value) => update("profile_branches", value)}
        />
      ),
    },
    {
      id: "search",
      title: "寻找岗位时，你想加入哪些方式？",
      hint: "可以多选，也可以先沿用基础的岗位寻找与筛选流程。",
      content: (
        <MultiChoiceGrid
          options={SEARCH_BRANCH_OPTIONS}
          value={profile.search_branches}
          emptyLabel="暂时只使用基础流程"
          disabled={pending}
          onChange={(value) => update("search_branches", value)}
        />
      ),
    },
    {
      id: "skills",
      title: "你目前明确需要补充哪些技能？",
      hint: "先选择已经从 JD、笔试或面试反馈中确认的技能。",
      content: (
        <MultiChoiceGrid
          options={SKILL_BRANCH_OPTIONS}
          value={profile.skill_branches}
          emptyLabel="目前还不确定"
          disabled={pending}
          onChange={(value) => update("skill_branches", value)}
        />
      ),
    },
    {
      id: "certificates",
      title: "哪些金融证书值得你进一步了解？",
      hint: "先比较适用方向和投入，再决定是否加入 Path；这不是报名建议。",
      content: (
        <CertificateComparisonGrid
          value={profile.certificate_branches}
          disabled={pending}
          onChange={(value) => update("certificate_branches", value)}
        />
      ),
    },
  ];

  const currentStepIndex = Math.min(stepIndex, questions.length - 1);
  const question = questions[currentStepIndex];
  const isLastStep = currentStepIndex === questions.length - 1;
  const progress = ((currentStepIndex + 1) / questions.length) * 100;

  const goNext = () => {
    if (isLastStep) {
      onSubmit?.({ ...profile, setup_complete: true });
      return;
    }
    setStepIndex((current) => Math.min(current + 1, questions.length - 1));
  };

  const wizard = (
      <div className={`pilot-path-wizard${embedded ? " pilot-path-wizard--embedded" : ""}`}>
        <header className="pilot-path-wizard__progress">
          <div className="pilot-path-wizard__progress-meta">
            <span>调整你的秋招 Path</span>
            <span aria-live="polite">
              第 {currentStepIndex + 1} 题 / 共 {questions.length} 题
            </span>
          </div>
          <div
            className="pilot-path-wizard__progress-track"
            role="progressbar"
            aria-label="设置进度"
            aria-valuemin="1"
            aria-valuemax={questions.length}
            aria-valuenow={currentStepIndex + 1}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </header>

        <section key={question.id} className="pilot-path-question" aria-labelledby="pilot-path-question-title">
          <div className="pilot-path-question__heading">
            <p>只选择会直接改变 Path 的信息</p>
            <h2 id="pilot-path-question-title">{question.title}</h2>
            <span>{question.hint}</span>
          </div>
          {question.content}
        </section>

        <footer className="pilot-path-wizard__footer">
          <Button type="text" disabled={pending} onClick={onCancel}>
            取消
          </Button>
          <div>
            <Button
              disabled={pending || currentStepIndex === 0}
              onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            >
              上一步
            </Button>
            <Button type="primary" loading={pending} onClick={goNext}>
              {isLastStep ? "生成 Path" : "下一步"}
            </Button>
          </div>
        </footer>
      </div>
  );

  if (embedded) return wizard;
  return (
    <Modal
      open
      centered
      title={null}
      footer={null}
      width={920}
      className="pilot-path-setup-modal"
      closable={!pending}
      maskClosable={!pending}
      keyboard={!pending}
      onCancel={onCancel}
      destroyOnHidden
    >
      {wizard}
    </Modal>
  );
}

function PilotPathSetupModal(props) {
  if (!props.open) return null;
  return <PilotPathSetupWizard {...props} />;
}

export function PilotPathSetupPanel(props) {
  return <PilotPathSetupWizard {...props} embedded />;
}

export function PilotPathSettingsPanel({ initialProfile, pending = false, onClose, onChange }) {
  const profile = normalizeInitialProfile(initialProfile);
  const update = (key, value) => onChange?.({ ...profile, [key]: value, setup_complete: true });
  const certificateOptions = FALL_RECRUITING_CERTIFICATES.map((certificate) => ({
    value: certificate.id,
    label: `${certificate.shortName} · ${certificate.fit}`,
  }));

  return (
    <div className="pilot-path-settings">
      <header className="pilot-path-settings__header">
        <div>
          <span>PATH SETTINGS</span>
          <h2>调整你的求职 Path</h2>
          <p>更改选项后会立即更新左侧路线，并保存在当前浏览器。</p>
        </div>
        <button type="button" onClick={onClose}>返回阅读</button>
      </header>

      <div className="pilot-path-settings__body">
        <section>
          <div className="pilot-path-settings__question"><strong>当前求职阶段</strong><small>用于确定当前节点与 Timeline 起点</small></div>
          <SingleChoiceGrid options={PILOT_STAGE_OPTIONS} value={profile.stage} disabled={pending} onChange={(value) => update("stage", value)} />
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>简历与 Profile</strong><small>简历默认保留，可以添加需要准备的材料</small></div>
          <MultiChoiceGrid options={PROFILE_BRANCH_OPTIONS} value={profile.profile_branches} emptyLabel="暂时不添加额外分支" disabled={pending} onChange={(value) => update("profile_branches", value)} />
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>寻找岗位的方式</strong><small>选择希望加入 Path 的辅助方式</small></div>
          <MultiChoiceGrid options={SEARCH_BRANCH_OPTIONS} value={profile.search_branches} emptyLabel="暂时只使用基础流程" disabled={pending} onChange={(value) => update("search_branches", value)} />
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>技能补充</strong><small>选择已经从 JD、测试或面试中确认的需要</small></div>
          <MultiChoiceGrid options={SKILL_BRANCH_OPTIONS} value={profile.skill_branches} emptyLabel="目前还不确定" disabled={pending} onChange={(value) => update("skill_branches", value)} />
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>金融证书</strong><small>加入 Path 只是进一步了解，不代表需要报名</small></div>
          <MultiChoiceGrid options={certificateOptions} value={profile.certificate_branches} emptyLabel="暂时不加入证书分支" disabled={pending} onChange={(value) => update("certificate_branches", value)} />
        </section>
      </div>
      <footer className="pilot-path-settings__status" aria-live="polite">{pending ? "正在更新 Path…" : "所有更改都会自动保存"}</footer>
    </div>
  );
}

export default PilotPathSetupModal;
