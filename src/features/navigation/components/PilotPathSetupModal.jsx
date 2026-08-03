import { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";

import {
  PILOT_REGION_OPTIONS,
  PILOT_STAGE_OPTIONS,
  PROFILE_BRANCH_OPTIONS,
  SEARCH_BRANCH_OPTIONS,
  SKILL_BRANCH_OPTIONS,
} from "../lib/pilotPath";

import "./PilotPathSetupModal.css";

const EMPTY_PROFILE = {
  region: "香港",
  stage: "getting_started",
  work_authorization: "",
  profile_branches: [],
  search_branches: [],
  skill_branches: [],
  learn_cantonese: false,
};

const WORK_AUTHORIZATION_OPTIONS = [
  { value: "已具备", label: "已具备" },
  { value: "需要签证或雇主支持", label: "需要签证或雇主支持" },
  { value: "尚不确定", label: "尚不确定" },
  { value: "", label: "稍后确认" },
];

function normalizeInitialProfile(initialProfile = {}) {
  return {
    region: initialProfile.region || EMPTY_PROFILE.region,
    stage: initialProfile.stage === "targeting" ? "getting_started" : initialProfile.stage || "getting_started",
    work_authorization: initialProfile.work_authorization || "",
    profile_branches: Array.isArray(initialProfile.profile_branches) ? initialProfile.profile_branches : [],
    search_branches: Array.isArray(initialProfile.search_branches) ? initialProfile.search_branches : [],
    skill_branches: Array.isArray(initialProfile.skill_branches) ? initialProfile.skill_branches : [],
    learn_cantonese: Boolean(initialProfile.learn_cantonese),
  };
}

function ChoiceCard({ label, selected, disabled, onClick }) {
  return (
    <button
      type="button"
      className={`pilot-path-choice${selected ? " pilot-path-choice--selected" : ""}`}
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
        disabled={disabled}
        onClick={() => onChange([])}
      />
    </div>
  );
}

function PilotPathSetupDialog({ initialProfile, pending = false, onCancel, onSubmit }) {
  const [profile, setProfile] = useState(() => normalizeInitialProfile(initialProfile));
  const [stepIndex, setStepIndex] = useState(0);

  const update = (key, value) => {
    setProfile((current) => ({
      ...current,
      [key]: value,
      ...(key === "region" && value !== "香港" ? { learn_cantonese: false } : {}),
    }));
  };

  const questions = [
    {
      id: "region",
      title: "你准备在哪个地区参加下一轮校招？",
      hint: "选择主要目标地区即可，之后可以随时调整。",
      content: (
        <SingleChoiceGrid
          options={PILOT_REGION_OPTIONS.map((value) => ({ value, label: value }))}
          value={profile.region}
          disabled={pending}
          onChange={(value) => update("region", value)}
        />
      ),
    },
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
      id: "work-authorization",
      title: "你具备目标地区的工作资格吗？",
      hint: "请以目标地区官方信息和招聘方的最新要求为准。",
      content: (
        <SingleChoiceGrid
          options={WORK_AUTHORIZATION_OPTIONS}
          value={profile.work_authorization}
          disabled={pending}
          onChange={(value) => update("work_authorization", value)}
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
      hint: "不确定可以先不选，之后再根据 JD 或面试反馈加入。",
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
  ];

  if (profile.region === "香港") {
    questions.push({
      id: "language",
      title: "你是否需要为香港求职学习粤语？",
      hint: "只有选择需要后，粤语准备才会加入 Path。",
      content: (
        <SingleChoiceGrid
          options={[
            { value: true, label: "需要学习粤语" },
            { value: false, label: "暂时不加入" },
          ]}
          value={profile.learn_cantonese}
          disabled={pending}
          onChange={(value) => update("learn_cantonese", value)}
        />
      ),
    });
  }

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
      <div className="pilot-path-wizard">
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
    </Modal>
  );
}

function PilotPathSetupModal(props) {
  if (!props.open) return null;
  return <PilotPathSetupDialog {...props} />;
}

export default PilotPathSetupModal;
