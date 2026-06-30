import { useMemo, useState } from "react";
import {
  ApartmentOutlined,
  CompassOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";

import useTranslation from "../../i18n/useTranslation";

import "./LearningNavigationPanel.css";

function normalizeKey(key) {
  return String(key || "").replace(/\/+$/, "");
}

function countLeafSteps(items = []) {
  return items.reduce((count, item) => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      return count + countLeafSteps(item.children);
    }
    return typeof item.key === "string" && item.iconType === "file" ? count + 1 : count;
  }, 0);
}

function collectPathSteps(items = [], trail = [], list = []) {
  items.forEach((item) => {
    const label = typeof item.label === "string" ? item.label : "";
    const nextTrail = label ? [...trail, label] : trail;
    if (Array.isArray(item.children) && item.children.length > 0) {
      collectPathSteps(item.children, nextTrail, list);
      return;
    }
    if (typeof item.key !== "string" || item.iconType !== "file") return;
    list.push({
      key: item.key,
      title: label || item.key.split("/").pop() || item.key,
      module: trail.length > 0 ? trail[trail.length - 1] : "",
      trail,
    });
  });
  return list;
}

function sectionContainsCurrent(section, currentNoteUrl) {
  const steps = collectPathSteps(section.children || []);
  return steps.some((step) => normalizeKey(step.key) === currentNoteUrl);
}

function getFirstStep(section) {
  return collectPathSteps(section.children || [section])[0] || null;
}

function collectLearningPathSteps(learningPathDraft) {
  const nodes = Array.isArray(learningPathDraft?.nodes) ? learningPathDraft.nodes : [];
  return nodes
    .filter((node) => node?.note_url || node?.noteUrl)
    .map((node) => ({
      key: node.note_url || node.noteUrl,
      title: node.title || node.note_url || node.noteUrl,
      module: node.metadata?.subject_title || node.subject || "",
      pathStatus: node.status || "planned",
    }));
}

const LearningNavigationPanel = ({
  items,
  currentNoteUrl,
  completedNoteUrls,
  learningPathDraft,
  learningPathPending = false,
  onGeneratePath,
  onRemovePathNode,
  onSelect,
  isMobile = false,
}) => {
  const { t } = useTranslation();
  const normalizedCurrent = normalizeKey(currentNoteUrl);
  const personalizedSteps = useMemo(
    () => collectLearningPathSteps(learningPathDraft),
    [learningPathDraft],
  );
  const hasPersonalizedPath = personalizedSteps.length > 0;
  const subjectSections = useMemo(
    () =>
      (items || [])
        .filter((item) => Array.isArray(item.children) && item.children.length > 0)
        .map((item) => ({
          ...item,
          stepCount: countLeafSteps(item.children),
          steps: collectPathSteps(item.children),
        }))
        .filter((item) => item.stepCount > 0),
    [items],
  );
  const standaloneSteps = useMemo(
    () =>
      collectPathSteps((items || []).filter((item) => !Array.isArray(item.children) || item.children.length === 0)),
    [items],
  );
  const initialExpandedKey = useMemo(() => {
    const currentSection = subjectSections.find((section) =>
      section.steps.some((step) => normalizeKey(step.key) === normalizedCurrent),
    );
    return currentSection?.key || subjectSections[0]?.key || "standalone";
  }, [normalizedCurrent, subjectSections]);
  const [expandedKeys, setExpandedKeys] = useState(() => new Set([initialExpandedKey]));
  const effectiveExpandedKeys = useMemo(() => {
    const next = new Set(expandedKeys);
    if (hasPersonalizedPath) next.add("personalized");
    if (initialExpandedKey) next.add(initialExpandedKey);
    return next;
  }, [expandedKeys, hasPersonalizedPath, initialExpandedKey]);

  const toggleSection = (sectionKey) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  };

  const renderSteps = (steps, subjectLabel, options = {}) => {
    const allowRemove = Boolean(options.allowRemove && typeof onRemovePathNode === "function");
    const firstIncompleteIndex = steps.findIndex(
      (step) => !completedNoteUrls.has(normalizeKey(step.key)) && step.pathStatus !== "completed",
    );
    return (
      <ol className="learning-nav__path" aria-label={`${subjectLabel} path`}>
        {steps.map((step, index) => {
          const stepKey = normalizeKey(step.key);
          const isCurrent = stepKey === normalizedCurrent;
          const isDone = completedNoteUrls.has(stepKey) || step.pathStatus === "completed";
          const isNext = !isCurrent && !isDone && index === firstIncompleteIndex;
          const status = isCurrent ? "current" : isDone ? "done" : isNext ? "next" : "todo";
          return (
            <li
              key={step.key}
              className={`learning-nav__step learning-nav__step--${status}`}
            >
              <button
                type="button"
                className="learning-nav__node"
                onClick={() => onSelect(step.key)}
                aria-current={isCurrent ? "page" : undefined}
              >
                <span className="learning-nav__connector learning-nav__connector--left" aria-hidden="true" />
                <span className="learning-nav__node-body">
                  {step.module ? (
                    <span className="learning-nav__module">{step.module}</span>
                  ) : null}
                  <span className="learning-nav__node-title">{step.title}</span>
                </span>
                <span className="learning-nav__connector learning-nav__connector--right" aria-hidden="true" />
              </button>
              {allowRemove ? (
                <button
                  type="button"
                  className="learning-nav__remove-node"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemovePathNode(step.key);
                  }}
                  aria-label={`Remove ${step.title} from path`}
                  title="Remove from path"
                >
                  ×
                </button>
              ) : null}
            </li>
          );
        })}
      </ol>
    );
  };

  const renderSubjectSection = (section) => {
    const isExpanded = effectiveExpandedKeys.has(section.key);
    const completedCount = section.steps.filter((step) =>
      completedNoteUrls.has(normalizeKey(step.key)),
    ).length;
    const containsCurrent = sectionContainsCurrent(section, normalizedCurrent);
    const firstStep = getFirstStep(section);
    return (
      <section
        key={section.key}
        className={`learning-nav__section ${containsCurrent ? "learning-nav__section--active" : ""}`}
      >
        <div className="learning-nav__section-header">
          <button
            type="button"
            className="learning-nav__section-toggle"
            onClick={() => toggleSection(section.key)}
            aria-expanded={isExpanded}
          >
            <span className="learning-nav__section-icon" aria-hidden="true">
              <ApartmentOutlined />
            </span>
            <span className="learning-nav__section-copy">
              <span className="learning-nav__section-title">{section.label}</span>
              <span className="learning-nav__section-meta">
                {completedCount}/{section.stepCount} {t("learningPath.steps")}
              </span>
            </span>
          </button>
          {firstStep ? (
            <button
              type="button"
              className="learning-nav__section-start"
              onClick={() => onSelect(firstStep.key)}
            >
              {containsCurrent ? t("learningPath.resume") : t("learningPath.open")}
            </button>
          ) : null}
        </div>
        {isExpanded ? renderSteps(section.steps, section.label) : null}
      </section>
    );
  };

  const renderPersonalizedSection = () => {
    if (!hasPersonalizedPath) return null;
    const completedCount = personalizedSteps.filter((step) => {
      const stepKey = normalizeKey(step.key);
      return completedNoteUrls.has(stepKey) || step.pathStatus === "completed";
    }).length;
    const goalTitle = learningPathDraft?.goal_title || learningPathDraft?.goalTitle || "Personalized path";
    const containsCurrent = personalizedSteps.some((step) => normalizeKey(step.key) === normalizedCurrent);
    const firstStep = personalizedSteps[0];
    return (
      <section
        className={`learning-nav__section learning-nav__section--personalized ${
          containsCurrent ? "learning-nav__section--active" : ""
        }`}
      >
        <div className="learning-nav__section-header">
          <button
            type="button"
            className="learning-nav__section-toggle"
            onClick={() => toggleSection("personalized")}
            aria-expanded={effectiveExpandedKeys.has("personalized")}
          >
            <span className="learning-nav__section-icon" aria-hidden="true">
              <NodeIndexOutlined />
            </span>
            <span className="learning-nav__section-copy">
              <span className="learning-nav__section-title">{goalTitle}</span>
              <span className="learning-nav__section-meta">
                {completedCount}/{personalizedSteps.length} {t("learningPath.steps")} · personalized
              </span>
            </span>
          </button>
          {firstStep ? (
            <button
              type="button"
              className="learning-nav__section-start"
              onClick={() => onSelect(firstStep.key)}
            >
              {containsCurrent ? t("learningPath.resume") : t("learningPath.open")}
            </button>
          ) : null}
        </div>
        {effectiveExpandedKeys.has("personalized")
          ? renderSteps(personalizedSteps, goalTitle, { allowRemove: true })
          : null}
      </section>
    );
  };

  return (
    <nav
      className={`learning-nav ${isMobile ? "learning-nav--mobile" : ""}`}
      aria-label={t("learningPath.title")}
    >
      <div className="learning-nav__intro">
        <span className="learning-nav__intro-icon" aria-hidden="true">
          <NodeIndexOutlined />
        </span>
        <div>
          <p className="learning-nav__eyebrow">{t("learningPath.eyebrow")}</p>
          <p className="learning-nav__description">{t("learningPath.description")}</p>
          {!hasPersonalizedPath && typeof onGeneratePath === "function" ? (
            <button
              type="button"
              className="learning-nav__create-path"
              onClick={onGeneratePath}
              disabled={learningPathPending}
            >
              {learningPathPending ? "Creating..." : "Create path"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="learning-nav__legend" aria-label={t("learningPath.legend")}>
        <span className="learning-nav__legend-item learning-nav__legend-item--done">
          {t("learningPath.completed")}
        </span>
        <span className="learning-nav__legend-item learning-nav__legend-item--current">
          {t("learningPath.current")}
        </span>
        <span className="learning-nav__legend-item learning-nav__legend-item--next">
          {t("learningPath.next")}
        </span>
      </div>

      <div className="learning-nav__sections">
        {renderPersonalizedSection()}
        {!hasPersonalizedPath ? subjectSections.map(renderSubjectSection) : null}
        {!hasPersonalizedPath && standaloneSteps.length > 0 ? (
          <section className="learning-nav__section learning-nav__section--active">
            <div className="learning-nav__section-header">
              <div className="learning-nav__section-toggle learning-nav__section-toggle--static">
                <span className="learning-nav__section-icon" aria-hidden="true">
                  <CompassOutlined />
                </span>
                <span className="learning-nav__section-copy">
                  <span className="learning-nav__section-title">{t("learningPath.general")}</span>
                  <span className="learning-nav__section-meta">
                    {standaloneSteps.length} {t("learningPath.steps")}
                  </span>
                </span>
              </div>
            </div>
            {renderSteps(standaloneSteps, t("learningPath.general"))}
          </section>
        ) : null}
      </div>
    </nav>
  );
};

export default LearningNavigationPanel;
