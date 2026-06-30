import { useMemo, useState } from "react";
import {
  ApartmentOutlined,
  CompassOutlined,
  DragOutlined,
  NodeIndexOutlined,
  SplitCellsOutlined,
  CompressOutlined,
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
      nodeId: node.node_id || node.nodeId || "",
      title: node.title || node.note_url || node.noteUrl,
      module: node.metadata?.subject_title || node.subject || "",
      pathStatus: node.status || "planned",
      pathRelation: node.metadata?.path_relation || node.metadata?.pathRelation || "linear",
    }));
}

function buildSubjectLibrary(items = [], personalizedSteps = []) {
  const existing = new Set(personalizedSteps.map((step) => normalizeKey(step.key)));
  return (items || [])
    .filter((item) => Array.isArray(item.children) && item.children.length > 0)
    .map((item) => {
      const steps = collectPathSteps(item.children).filter((step) => !existing.has(normalizeKey(step.key)));
      return {
        key: item.key,
        title: typeof item.label === "string" ? item.label : item.key || "Subject",
        stepCount: steps.length,
        steps,
      };
    })
    .filter((subject) => subject.stepCount > 0);
}

const LearningNavigationPanel = ({
  items,
  currentNoteUrl,
  completedNoteUrls,
  learningPathDraft,
  learningPathPending = false,
  onGeneratePath,
  onAddPathNode,
  onReorderPathNodes,
  onRemovePathNode,
  onUpdatePathNodeRelation,
  onSelect,
  isMobile = false,
}) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const [draggedKey, setDraggedKey] = useState("");
  const [dragPayload, setDragPayload] = useState(null);
  const [isPathDropActive, setIsPathDropActive] = useState(false);
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
  const addCandidateSteps = useMemo(() => {
    const existing = new Set(personalizedSteps.map((step) => normalizeKey(step.key)));
    return collectPathSteps(items || []).filter((step) => !existing.has(normalizeKey(step.key)));
  }, [items, personalizedSteps]);
  const subjectLibrary = useMemo(
    () => buildSubjectLibrary(items, personalizedSteps),
    [items, personalizedSteps],
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

  const addCandidateToPath = (candidate) => {
    if (!candidate || typeof onAddPathNode !== "function") return;
    onAddPathNode(candidate);
  };

  const addSubjectToPath = (subject) => {
    if (!subject?.steps?.length || typeof onAddPathNode !== "function") return;
    onAddPathNode({
      type: "subject",
      title: subject.title,
      module: subject.title,
      steps: subject.steps,
    });
  };

  const handleLibraryDragStart = (event, payload) => {
    setDragPayload(payload);
    setDraggedKey(payload?.type === "course" ? payload.step?.key : "");
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("application/x-learning-path-item", JSON.stringify(payload));
    event.dataTransfer.setData("text/plain", payload?.step?.key || payload?.subject?.key || "");
  };

  const handlePathDrop = (event) => {
    if (!editMode) return;
    event.preventDefault();
    setIsPathDropActive(false);
    let payload = dragPayload;
    const rawPayload = event.dataTransfer.getData("application/x-learning-path-item");
    if (rawPayload) {
      try {
        payload = JSON.parse(rawPayload);
      } catch {
        payload = dragPayload;
      }
    }
    if (payload?.type === "subject") addSubjectToPath(payload.subject);
    if (payload?.type === "course") addCandidateToPath(payload.step);
    setDragPayload(null);
    setDraggedKey("");
  };

  const getRelationTitle = (relation) => {
    if (relation === "branch") return "Start a side branch from this course.";
    if (relation === "converge") return "Join branches back into one route here.";
    return "Continue straight from the previous course.";
  };

  const renderRelationControls = (step) => {
    const relationOptions = [
      { value: "linear", label: "Linear", icon: <NodeIndexOutlined /> },
      { value: "branch", label: "Split", icon: <SplitCellsOutlined /> },
      { value: "converge", label: "Join", icon: <CompressOutlined /> },
    ];
    return (
      <div className="learning-nav__edit-row" aria-label={`Edit relation for ${step.title}`}>
        {relationOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            className={
              step.pathRelation === option.value
                ? "learning-nav__edit-chip learning-nav__edit-chip--active"
                : "learning-nav__edit-chip"
            }
            onClick={() => onUpdatePathNodeRelation?.(step.key, option.value)}
            title={getRelationTitle(option.value)}
          >
            {option.icon}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const renderSteps = (steps, subjectLabel, options = {}) => {
    const allowRemove = Boolean(options.allowRemove && typeof onRemovePathNode === "function");
    const allowEdit = Boolean(options.allowEdit);
    const firstIncompleteIndex = steps.findIndex(
      (step) => !completedNoteUrls.has(normalizeKey(step.key)) && step.pathStatus !== "completed",
    );
    const handleDropOnStep = (targetKey) => {
      if (!draggedKey || draggedKey === targetKey || typeof onReorderPathNodes !== "function") return;
      const sourceIndex = steps.findIndex((step) => normalizeKey(step.key) === normalizeKey(draggedKey));
      const targetIndex = steps.findIndex((step) => normalizeKey(step.key) === normalizeKey(targetKey));
      if (sourceIndex < 0 || targetIndex < 0) return;
      const nextSteps = [...steps];
      const [moved] = nextSteps.splice(sourceIndex, 1);
      nextSteps.splice(targetIndex, 0, moved);
      onReorderPathNodes(nextSteps.map((step) => step.key));
      setDraggedKey("");
    };
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
              className={`learning-nav__step learning-nav__step--${status} learning-nav__step--${step.pathRelation || "linear"} ${
                draggedKey && normalizeKey(draggedKey) === stepKey ? "learning-nav__step--dragging" : ""
              }`}
              draggable={allowEdit}
              onDragStart={(event) => {
                if (!allowEdit) return;
                setDraggedKey(step.key);
                setDragPayload({ type: "path-node", step });
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", step.key);
              }}
              onDragOver={(event) => {
                if (!allowEdit || !draggedKey || dragPayload?.type === "course") return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
              }}
              onDrop={(event) => {
                if (!allowEdit) return;
                event.preventDefault();
                handleDropOnStep(step.key);
              }}
              onDragEnd={() => {
                setDraggedKey("");
                setDragPayload(null);
              }}
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
                  {step.pathRelation && step.pathRelation !== "linear" ? (
                    <span className={`learning-nav__relation learning-nav__relation--${step.pathRelation}`}>
                      {step.pathRelation}
                    </span>
                  ) : null}
                </span>
                <span className="learning-nav__connector learning-nav__connector--right" aria-hidden="true" />
              </button>
              {allowEdit ? renderRelationControls(step) : null}
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
    const goalTitle = learningPathDraft?.goal_title || learningPathDraft?.goalTitle || "Personalized path";
    const containsCurrent = personalizedSteps.some((step) => normalizeKey(step.key) === normalizedCurrent);
    return (
      <section
        className={`learning-nav__section learning-nav__section--personalized ${
          containsCurrent ? "learning-nav__section--active" : ""
        }`}
      >
        <div className="learning-nav__section-header">
          <button
            type="button"
            className={`learning-nav__section-start ${editMode ? "learning-nav__section-start--active" : ""}`}
            onClick={() => setEditMode((value) => !value)}
          >
            {editMode ? "Done" : "Edit"}
          </button>
        </div>
        {editMode ? (
          <div className="learning-nav__editor">
            <div className="learning-nav__library" aria-label="Course library">
              {subjectLibrary.map((subject) => (
                <button
                  key={subject.key}
                  type="button"
                  className="learning-nav__library-card learning-nav__library-card--subject"
                  draggable
                  onDragStart={(event) => handleLibraryDragStart(event, { type: "subject", subject })}
                  onClick={() => addSubjectToPath(subject)}
                  title={`Add ${subject.title}`}
                >
                  <span className="learning-nav__library-card-icon" aria-hidden="true">
                    <ApartmentOutlined />
                  </span>
                  <span className="learning-nav__library-card-copy">
                    <span className="learning-nav__library-card-title">{subject.title}</span>
                    <span className="learning-nav__library-card-meta">{subject.stepCount} courses</span>
                  </span>
                  <DragOutlined />
                </button>
              ))}
              {addCandidateSteps.map((step) => (
                <button
                  key={step.key}
                  type="button"
                  className="learning-nav__library-card"
                  draggable
                  onDragStart={(event) => handleLibraryDragStart(event, { type: "course", step })}
                  onClick={() => addCandidateToPath(step)}
                  title={`Add ${step.title}`}
                >
                  <span className="learning-nav__library-card-copy">
                    {step.module ? <span className="learning-nav__library-card-meta">{step.module}</span> : null}
                    <span className="learning-nav__library-card-title">{step.title}</span>
                  </span>
                  <DragOutlined />
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div
          className={`learning-nav__drop-zone ${isPathDropActive ? "learning-nav__drop-zone--active" : ""}`}
          onDragOver={(event) => {
            if (!editMode) return;
            event.preventDefault();
            event.dataTransfer.dropEffect =
              dragPayload?.type === "path-node" ? "move" : "copy";
            setIsPathDropActive(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPathDropActive(false);
          }}
          onDrop={handlePathDrop}
        >
          {renderSteps(personalizedSteps, goalTitle, { allowRemove: true, allowEdit: editMode })}
        </div>
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
