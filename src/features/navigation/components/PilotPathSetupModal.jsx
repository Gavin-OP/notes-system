import { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";

import {
  CANDIDATE_BACKGROUND_OPTIONS,
  EXPERIENCE_BRANCH_OPTIONS,
  EXPERIENCE_LEVEL_OPTIONS,
  PILOT_STAGE_OPTIONS,
  PROFILE_BRANCH_OPTIONS,
  SKILL_BRANCH_OPTIONS,
  INTERVIEW_BRANCH_OPTIONS,
} from "../lib/pilotPath";
import {
  FALL_RECRUITING_CERTIFICATES,
  getNextCertificateWindow,
} from "../../fallRecruiting/lib/certificates";

import "./PilotPathSetupModal.css";
import useTranslation from "../../../i18n/useTranslation";

function normalizeInitialProfile(initialProfile = {}) {
  return {
    stage: initialProfile.stage === "targeting" ? "getting_started" : initialProfile.stage || "getting_started",
    candidate_background: initialProfile.candidate_background || "other",
    experience_branches: Array.isArray(initialProfile.experience_branches)
      ? initialProfile.experience_branches
      : ["first_internship", "transition_first_internship"],
    application_strategy: initialProfile.application_strategy || "auto",
    information_style: initialProfile.information_style || "core",
    experience_level: initialProfile.experience_level || "established",
    jobti_type: initialProfile.jobti_type || "",
    profile_branches: Array.isArray(initialProfile.profile_branches) ? initialProfile.profile_branches : [],
    search_branches: Array.isArray(initialProfile.search_branches) ? initialProfile.search_branches : [],
    skill_branches: Array.isArray(initialProfile.skill_branches)
      ? initialProfile.skill_branches.filter((value) => value !== "finance")
      : [],
    certificate_branches: Array.isArray(initialProfile.certificate_branches)
      ? initialProfile.certificate_branches
      : [],
    certificate_interest: Boolean(initialProfile.certificate_interest || initialProfile.certificate_branches?.length),
    interview_branches: Array.isArray(initialProfile.interview_branches)
      ? initialProfile.interview_branches
      : [],
  };
}

const SEARCH_SOCIAL_BRANCHES = ["networking"];
const SEARCH_INDEPENDENT_BRANCHES = ["job_board", "company_career_page", "social_media_research"];

function RouteFamilyChoice({ title, items, selected, disabled, onClick, tone = "search", sequence = [] }) {
  return (
    <button
      type="button"
      className={`pilot-route-family-choice pilot-route-family-choice--${tone}${selected ? " is-selected" : ""}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="pilot-route-family-choice__heading">
        <strong>{title}</strong>
        <span className="pilot-path-choice__indicator" aria-hidden="true">{selected ? <CheckOutlined /> : null}</span>
      </span>
      {sequence.length > 0 ? (
        <span className="pilot-route-family-choice__sequence">
          {sequence.map((label, index) => <span key={label}>{index > 0 ? <i aria-hidden="true">→</i> : null}<b>{label}</b></span>)}
        </span>
      ) : (
        <span className="pilot-route-family-choice__items">
          {items.map((item) => <span key={item}>{item}</span>)}
        </span>
      )}
    </button>
  );
}

function SearchRouteFamilySelector({ profile, disabled, onChange, t }) {
  const branches = new Set(profile.search_branches || []);
  const socialSelected = ["social", "balanced"].includes(profile.information_style)
    || SEARCH_SOCIAL_BRANCHES.some((value) => branches.has(value));
  const independentSelected = ["independent", "balanced"].includes(profile.information_style)
    || SEARCH_INDEPENDENT_BRANCHES.some((value) => branches.has(value));
  const updateFamilies = (nextSocial, nextIndependent) => {
    const nextBranches = new Set([...branches].filter((value) => (
      !SEARCH_SOCIAL_BRANCHES.includes(value) && !SEARCH_INDEPENDENT_BRANCHES.includes(value)
    )));
    if (nextSocial) SEARCH_SOCIAL_BRANCHES.forEach((value) => nextBranches.add(value));
    if (nextIndependent) SEARCH_INDEPENDENT_BRANCHES.forEach((value) => nextBranches.add(value));
    onChange({
      information_style: nextSocial && nextIndependent ? "balanced" : nextSocial ? "social" : nextIndependent ? "independent" : "core",
      search_branches: [...nextBranches],
    });
  };
  const toggleAi = () => {
    const nextBranches = new Set(branches);
    if (nextBranches.has("ai_job_search")) nextBranches.delete("ai_job_search");
    else nextBranches.add("ai_job_search");
    onChange({ search_branches: [...nextBranches] });
  };
  return <div className="pilot-route-family-selector">
    <RouteFamilyChoice
      title={t("pilot.family.searchSocial", "直接与人交流")}
      items={[t("pilot.node.networking", "Coffee Chat / Networking"), t("pilot.node.referral", "Referral")]}
      selected={socialSelected}
      disabled={disabled}
      onClick={() => updateFamilies(!socialSelected, independentSelected)}
    />
    <RouteFamilyChoice
      title={t("pilot.family.searchIndependent", "自己查找和整理信息")}
      items={[t("pilot.node.job-board", "Job Board"), t("pilot.node.company-career-page", "Company Career Page"), t("pilot.node.social-media-research", "社媒平台")]}
      selected={independentSelected}
      disabled={disabled}
      onClick={() => updateFamilies(socialSelected, !independentSelected)}
    />
    <ChoiceCard
      label={t("pilot.option.ai_job_search", "用 AI 辅助找岗位")}
      selected={branches.has("ai_job_search")}
      disabled={disabled}
      onClick={toggleAi}
    />
  </div>;
}

function ApplicationStrategySelector({ value, disabled, onChange, t }) {
  const batchItems = ["Application Batch Planning", "Application Tracker", "Resume Version Management"];
  const precisionItems = ["Company Research", "JD Deep Dive", "Tailored Resume / Cover Letter"];
  return <div className="pilot-route-family-selector pilot-route-family-selector--applications">
    <RouteFamilyChoice title={t("pilot.application.batch", "海投 / 批量规划")} items={batchItems} selected={value === "batch"} disabled={disabled} onClick={() => onChange("batch")} tone="application" />
    <RouteFamilyChoice title={t("pilot.application.precision", "精准投递")} items={precisionItems} selected={value === "precision"} disabled={disabled} onClick={() => onChange("precision")} tone="application" />
    <RouteFamilyChoice title={t("pilot.application.batch_then_precision", "先海投探索，再转向精准投递")} sequence={[t("pilot.family.applicationBatch", "批量投递"), t("pilot.family.applicationPrecision", "精准投递")]} selected={value === "batch_then_precision"} disabled={disabled} onClick={() => onChange("batch_then_precision")} tone="application" />
    <RouteFamilyChoice title={t("pilot.application.precision_then_batch", "先打磨重点岗位，再扩大投递")} sequence={[t("pilot.family.applicationPrecision", "精准投递"), t("pilot.family.applicationBatch", "批量投递")]} selected={value === "precision_then_batch"} disabled={disabled} onClick={() => onChange("precision_then_batch")} tone="application" />
  </div>;
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
  const { t } = useTranslation();
  const [profile, setProfile] = useState(() => normalizeInitialProfile(initialProfile));
  const [stepIndex, setStepIndex] = useState(0);

  const update = (key, value) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };
  const updateCertificateBranches = (value) => {
    setProfile((current) => ({
      ...current,
      certificate_interest: value.length > 0,
      certificate_branches: value,
    }));
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
      id: "background",
      title: "你目前仍是在校学生吗？",
      hint: "学生身份会加入 Campus Recruiting、Career Fair 和 Alumni Networking 路线。",
      content: (
        <SingleChoiceGrid options={CANDIDATE_BACKGROUND_OPTIONS} value={profile.candidate_background} disabled={pending} onChange={(value) => update("candidate_background", value)} />
      ),
    },
    {
      id: "experience",
      title: "你需要从第一段实习开始准备吗？",
      hint: "这些内容会作为求职起步阶段的支线加入，可以多选。",
      content: (
        <MultiChoiceGrid options={EXPERIENCE_BRANCH_OPTIONS} value={profile.experience_branches} emptyLabel="暂时不加入第一段实习支线" disabled={pending} onChange={(value) => update("experience_branches", value)} />
      ),
    },
    {
      id: "experience-level",
      title: "你需要补充更多可展示的经历吗？",
      hint: "经历较少时会加入商赛、Kaggle 和课程项目打磨支线。",
      content: (
        <SingleChoiceGrid options={EXPERIENCE_LEVEL_OPTIONS} value={profile.experience_level} disabled={pending} onChange={(value) => update("experience_level", value)} />
      ),
    },
    {
      id: "search",
      title: "你更习惯怎样寻找岗位和获取信息？",
      hint: "可以选择直接交流、自己查找，也可以把两种方式都加入 Path。AI 辅助找岗位会单独显示。",
      content: (
        <SearchRouteFamilySelector
          profile={profile}
          disabled={pending}
          t={t}
          onChange={(patch) => setProfile((current) => ({ ...current, ...patch }))}
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
      id: "application-strategy",
      title: "投递时，你更想怎样安排节奏？",
      hint: "两种路线都可以使用；组合路线会按照你选择的先后顺序连接。",
      content: (
        <ApplicationStrategySelector value={profile.application_strategy} disabled={pending} t={t} onChange={(value) => update("application_strategy", value)} />
      ),
    },
    {
      id: "certificates",
      title: "你想进一步了解金融证书吗？",
      hint: "想了解时会先加入概览；具体证书可以继续比较，这不是报名建议。",
      content: (
        <>
          <CertificateComparisonGrid
            value={profile.certificate_branches}
            disabled={pending}
            onChange={updateCertificateBranches}
          />
        </>
      ),
    },
    {
      id: "interviews",
      title: "接下来可能进行哪些形式的面试？",
      hint: "可以多选；综合面试准备会始终保留，专项课程会作为分支加入。",
      content: (
        <MultiChoiceGrid
          options={INTERVIEW_BRANCH_OPTIONS}
          value={profile.interview_branches}
          emptyLabel="暂时不确定，先看综合准备"
          disabled={pending}
          onChange={(value) => update("interview_branches", value)}
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
            <span>调整你的求职 Path</span>
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
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState("start");
  const profile = normalizeInitialProfile(initialProfile);
  const updateFields = (patch) => onChange?.({ ...profile, ...patch, setup_complete: true });
  const update = (key, value) => updateFields({ [key]: value });
  const certificateOptions = FALL_RECRUITING_CERTIFICATES.map((certificate) => ({
    value: certificate.id,
    label: certificate.shortName,
  }));
  const updateCertificateBranches = (value) => updateFields({
    certificate_interest: value.length > 0,
    certificate_branches: value,
  });
  const localizeOptions = (options, prefix) => options.map((option) => ({
    ...option,
    label: t(`${prefix}.${option.value}`, option.label),
  }));

  const sections = [
    { id: "start", label: t("pilot.settings.section.start", "起点") },
    { id: "materials", label: t("pilot.settings.section.materials", "材料与经历") },
    { id: "search", label: t("pilot.settings.section.search", "寻找岗位") },
    { id: "applications", label: t("pilot.settings.section.applications", "投递策略") },
    { id: "skills", label: t("pilot.settings.section.skills", "技能补充") },
    { id: "interviews", label: t("pilot.settings.section.interviews", "面试准备") },
  ];

  const field = (title, hint, content) => (
    <section className="pilot-path-settings__field">
      <div className="pilot-path-settings__question"><strong>{title}</strong><small>{hint}</small></div>
      {content}
    </section>
  );

  const panels = {
    start: <>
      {field(t("pilot.settings.stage"), t("pilot.settings.stageHint"), <SingleChoiceGrid options={localizeOptions(PILOT_STAGE_OPTIONS, "pilot.stage")} value={profile.stage} disabled={pending} onChange={(value) => update("stage", value)} />)}
      {field(t("pilot.settings.background", "Student recruiting"), t("pilot.settings.backgroundHint", "Student status adds campus-specific discovery routes."), <SingleChoiceGrid options={localizeOptions(CANDIDATE_BACKGROUND_OPTIONS, "pilot.background")} value={profile.candidate_background} disabled={pending} onChange={(value) => update("candidate_background", value)} />)}
      {field(t("pilot.settings.experience", "First internship"), t("pilot.settings.experienceHint", "Add the first-internship guidance that fits your situation."), <MultiChoiceGrid options={localizeOptions(EXPERIENCE_BRANCH_OPTIONS, "pilot.experience")} value={profile.experience_branches} emptyLabel={t("pilot.settings.experienceEmpty", "Skip first-internship routes")} disabled={pending} onChange={(value) => update("experience_branches", value)} />)}
    </>,
    materials: <>
      {field(t("pilot.settings.experienceLevel"), t("pilot.settings.experienceLevelHint"), <SingleChoiceGrid options={localizeOptions(EXPERIENCE_LEVEL_OPTIONS, "pilot.experienceLevel")} value={profile.experience_level} disabled={pending} onChange={(value) => update("experience_level", value)} />)}
      {field(t("pilot.settings.profile"), t("pilot.settings.profileHint"), <MultiChoiceGrid options={localizeOptions(PROFILE_BRANCH_OPTIONS, "pilot.option")} value={profile.profile_branches} emptyLabel={t("pilot.settings.profileEmpty")} disabled={pending} onChange={(value) => update("profile_branches", value)} />)}
    </>,
    search: <>
      {field(t("pilot.settings.search"), t("pilot.settings.searchHint"), <SearchRouteFamilySelector profile={profile} disabled={pending} t={t} onChange={updateFields} />)}
    </>,
    applications: <>
      {field(t("pilot.settings.applicationStrategy", "Application style"), t("pilot.settings.applicationStrategyHint", "Choose batch planning, precision applications, or a combination of both."), <ApplicationStrategySelector value={profile.application_strategy} disabled={pending} t={t} onChange={(value) => update("application_strategy", value)} />)}
    </>,
    skills: <>
      {field(t("pilot.settings.skills"), t("pilot.settings.skillsHint"), <MultiChoiceGrid options={localizeOptions(SKILL_BRANCH_OPTIONS, "pilot.option")} value={profile.skill_branches} emptyLabel={t("pilot.settings.skillsEmpty")} disabled={pending} onChange={(value) => update("skill_branches", value)} />)}
      {field(t("pilot.settings.certificates"), t("pilot.settings.certificatesHint"), <MultiChoiceGrid options={certificateOptions} value={profile.certificate_branches} emptyLabel={t("pilot.settings.certificatesEmpty")} disabled={pending} onChange={updateCertificateBranches} />)}
    </>,
    interviews: <>
      {field(t("pilot.settings.interviews"), t("pilot.settings.interviewsHint"), <MultiChoiceGrid options={localizeOptions(INTERVIEW_BRANCH_OPTIONS, "pilot.interview")} value={profile.interview_branches} emptyLabel={t("pilot.settings.interviewsEmpty")} disabled={pending} onChange={(value) => update("interview_branches", value)} />)}
    </>,
  };

  const currentSection = sections.find((section) => section.id === activeSection) || sections[0];

  return (
    <div className="pilot-path-settings">
      <header className="pilot-path-settings__header">
        <div>
          <span>PATH SETTINGS</span>
          <h2>{t("pilot.settings.title")}</h2>
          <p>{t("pilot.settings.description")}</p>
        </div>
        <button type="button" onClick={onClose}>{t("pilot.path.backToReading")}</button>
      </header>

      <div className="pilot-path-settings__body">
        <nav className="pilot-path-settings__index" aria-label={t("pilot.settings.title")}>
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className={section.id === activeSection ? "is-active" : ""}
              aria-current={section.id === activeSection ? "page" : undefined}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>
        <div className="pilot-path-settings__panel" key={activeSection}>
          <header className="pilot-path-settings__panel-header">
            <span>{currentSection.label}</span>
          </header>
          {panels[activeSection]}
        </div>
      </div>
      <footer className="pilot-path-settings__status" aria-live="polite">{pending ? t("pilot.settings.saving") : t("pilot.settings.saved")}</footer>
    </div>
  );
}

export default PilotPathSetupModal;
