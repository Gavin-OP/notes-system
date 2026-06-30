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

const LearningNavigationPanel = ({
  items,
  currentNoteUrl,
  completedNoteUrls,
  onSelect,
  isMobile = false,
}) => {
  const { t } = useTranslation();
  const normalizedCurrent = normalizeKey(currentNoteUrl);
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
    if (initialExpandedKey) next.add(initialExpandedKey);
    return next;
  }, [expandedKeys, initialExpandedKey]);

  const toggleSection = (sectionKey) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(sectionKey)) next.delete(sectionKey);
      else next.add(sectionKey);
      return next;
    });
  };

  const renderSteps = (steps, subjectLabel) => {
    const firstIncompleteIndex = steps.findIndex(
      (step) => !completedNoteUrls.has(normalizeKey(step.key)),
    );
    return (
      <ol className="learning-nav__path" aria-label={`${subjectLabel} path`}>
        {steps.map((step, index) => {
          const stepKey = normalizeKey(step.key);
          const isCurrent = stepKey === normalizedCurrent;
          const isDone = completedNoteUrls.has(stepKey);
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
        {subjectSections.map(renderSubjectSection)}
        {standaloneSteps.length > 0 ? (
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
