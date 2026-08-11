import { useState } from "react";
import { CheckOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";

import {
  APPLICATION_STRATEGY_OPTIONS,
  CANDIDATE_BACKGROUND_OPTIONS,
  COMPANY_TYPE_OPTIONS,
  PILOT_STAGE_OPTIONS,
  PROFILE_BRANCH_OPTIONS,
  SEARCH_BRANCH_OPTIONS,
  SKILL_BRANCH_OPTIONS,
  INTERVIEW_BRANCH_OPTIONS,
} from "../lib/pilotPath";
import {
  FALL_RECRUITING_CERTIFICATES,
  getNextCertificateWindow,
} from "../../fallRecruiting/lib/certificates";

import "./PilotPathSetupModal.css";
import useTranslation from "../../../i18n/useTranslation";

const CERTIFICATE_INTEREST_OPTIONS = [
  { value: true, label: "想进一步了解" },
  { value: false, label: "目前不加入 Path" },
];

function normalizeInitialProfile(initialProfile = {}) {
  return {
    stage: initialProfile.stage === "targeting" ? "getting_started" : initialProfile.stage || "getting_started",
    candidate_background: initialProfile.candidate_background || "other",
    company_types: Array.isArray(initialProfile.company_types) ? initialProfile.company_types : [],
    application_strategy: initialProfile.application_strategy || "auto",
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
  const updateCertificateInterest = (value) => {
    setProfile((current) => ({
      ...current,
      certificate_interest: value,
      certificate_branches: value ? current.certificate_branches : [],
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
      id: "company-types",
      title: "你想优先了解哪些公司或项目类型？",
      hint: "可以多选；这些介绍会从“理解岗位与市场”延伸出来。",
      content: (
        <MultiChoiceGrid options={COMPANY_TYPE_OPTIONS} value={profile.company_types} emptyLabel="暂时先看通用信息" disabled={pending} onChange={(value) => update("company_types", value)} />
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
      id: "application-strategy",
      title: "投递时，你更想怎样安排节奏？",
      hint: "可以沿用 JobTI 建议，也可以明确选择批量规划或精准投递。",
      content: (
        <SingleChoiceGrid options={APPLICATION_STRATEGY_OPTIONS} value={profile.application_strategy} disabled={pending} onChange={(value) => update("application_strategy", value)} />
      ),
    },
    {
      id: "certificates",
      title: "你想进一步了解金融证书吗？",
      hint: "想了解时会先加入概览；具体证书可以继续比较，这不是报名建议。",
      content: (
        <>
          <SingleChoiceGrid options={CERTIFICATE_INTEREST_OPTIONS} value={profile.certificate_interest} disabled={pending} onChange={updateCertificateInterest} />
          {profile.certificate_interest && <CertificateComparisonGrid
            value={profile.certificate_branches}
            disabled={pending}
            onChange={(value) => update("certificate_branches", value)}
          />}
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
  const { t } = useTranslation();
  const profile = normalizeInitialProfile(initialProfile);
  const update = (key, value) => onChange?.({ ...profile, [key]: value, setup_complete: true });
  const certificateOptions = FALL_RECRUITING_CERTIFICATES.map((certificate) => ({
    value: certificate.id,
    label: certificate.shortName,
  }));
  const updateCertificateInterest = (value) => onChange?.({
    ...profile,
    certificate_interest: value,
    certificate_branches: value ? profile.certificate_branches : [],
    setup_complete: true,
  });
  const localizeOptions = (options, prefix) => options.map((option) => ({
    ...option,
    label: t(`${prefix}.${option.value}`, option.label),
  }));

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
        <section>
          <div className="pilot-path-settings__question"><strong>{t("pilot.settings.stage")}</strong><small>{t("pilot.settings.stageHint")}</small></div>
          <SingleChoiceGrid options={localizeOptions(PILOT_STAGE_OPTIONS, "pilot.stage")} value={profile.stage} disabled={pending} onChange={(value) => update("stage", value)} />
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>{t("pilot.settings.background", "Student recruiting")}</strong><small>{t("pilot.settings.backgroundHint", "Student status adds campus-specific discovery routes.")}</small></div>
          <SingleChoiceGrid options={localizeOptions(CANDIDATE_BACKGROUND_OPTIONS, "pilot.background")} value={profile.candidate_background} disabled={pending} onChange={(value) => update("candidate_background", value)} />
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>{t("pilot.settings.companyTypes", "Company types")}</strong><small>{t("pilot.settings.companyTypesHint", "Choose the company or programme contexts you want to understand first.")}</small></div>
          <MultiChoiceGrid options={localizeOptions(COMPANY_TYPE_OPTIONS, "pilot.company")} value={profile.company_types} emptyLabel={t("pilot.settings.companyTypesEmpty", "Use the general market route")} disabled={pending} onChange={(value) => update("company_types", value)} />
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>{t("pilot.settings.profile")}</strong><small>{t("pilot.settings.profileHint")}</small></div>
          <MultiChoiceGrid options={localizeOptions(PROFILE_BRANCH_OPTIONS, "pilot.option")} value={profile.profile_branches} emptyLabel={t("pilot.settings.profileEmpty")} disabled={pending} onChange={(value) => update("profile_branches", value)} />
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>{t("pilot.settings.search")}</strong><small>{t("pilot.settings.searchHint")}</small></div>
          <MultiChoiceGrid options={localizeOptions(SEARCH_BRANCH_OPTIONS, "pilot.option")} value={profile.search_branches} emptyLabel={t("pilot.settings.searchEmpty")} disabled={pending} onChange={(value) => update("search_branches", value)} />
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>{t("pilot.settings.skills")}</strong><small>{t("pilot.settings.skillsHint")}</small></div>
          <MultiChoiceGrid options={localizeOptions(SKILL_BRANCH_OPTIONS, "pilot.option")} value={profile.skill_branches} emptyLabel={t("pilot.settings.skillsEmpty")} disabled={pending} onChange={(value) => update("skill_branches", value)} />
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>{t("pilot.settings.applicationStrategy", "Application style")}</strong><small>{t("pilot.settings.applicationStrategyHint", "Use the JobTI default or choose a route explicitly.")}</small></div>
          <SingleChoiceGrid options={localizeOptions(APPLICATION_STRATEGY_OPTIONS, "pilot.application")} value={profile.application_strategy} disabled={pending} onChange={(value) => update("application_strategy", value)} />
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>{t("pilot.settings.certificates")}</strong><small>{t("pilot.settings.certificatesHint")}</small></div>
          <SingleChoiceGrid options={CERTIFICATE_INTEREST_OPTIONS} value={profile.certificate_interest} disabled={pending} onChange={updateCertificateInterest} />
          {profile.certificate_interest && <MultiChoiceGrid options={certificateOptions} value={profile.certificate_branches} emptyLabel={t("pilot.settings.certificatesEmpty")} disabled={pending} onChange={(value) => update("certificate_branches", value)} />}
        </section>
        <section>
          <div className="pilot-path-settings__question"><strong>{t("pilot.settings.interviews")}</strong><small>{t("pilot.settings.interviewsHint")}</small></div>
          <MultiChoiceGrid options={localizeOptions(INTERVIEW_BRANCH_OPTIONS, "pilot.interview")} value={profile.interview_branches} emptyLabel={t("pilot.settings.interviewsEmpty")} disabled={pending} onChange={(value) => update("interview_branches", value)} />
        </section>
      </div>
      <footer className="pilot-path-settings__status" aria-live="polite">{pending ? t("pilot.settings.saving") : t("pilot.settings.saved")}</footer>
    </div>
  );
}

export default PilotPathSetupModal;
