import useTranslation from "../../../i18n/useTranslation";

import "./LearningPathControls.css";

function LearningPathControls({
  hasPersonalizedPath = false,
  hasEditableDraft = false,
  pathEditMode = false,
  learningPathPending = false,
  onPrimaryAction,
  onClearPath,
  canCreate = true,
}) {
  const { t } = useTranslation();
  const canClear = typeof onClearPath === "function" && hasPersonalizedPath;
  const canManage = hasPersonalizedPath || (hasEditableDraft && pathEditMode);

  if (!canCreate && !canManage) return null;

  const primaryLabel = learningPathPending
    ? t("learningPath.creating", "Creating...")
    : pathEditMode
      ? t("learningPath.doneEditing", "Done")
      : hasPersonalizedPath
        ? t("learningPath.editPath", "编辑 Path")
        : t("learningPath.createPath", "Create path");

  const primaryFilled = !canManage || pathEditMode;
  const useGroup = canManage && canClear;

  if (!useGroup) {
    return (
      <div className="learning-path-controls learning-path-controls--solo">
        <button
          type="button"
          className={`learning-path-controls__segment${
            primaryFilled ? " learning-path-controls__segment--filled" : ""
          }`}
          onClick={onPrimaryAction}
          disabled={learningPathPending}
        >
          {primaryLabel}
        </button>
      </div>
    );
  }

  return (
    <div
      className="learning-path-controls learning-path-controls--group"
      role="group"
      aria-label={t("learningPath.pathControls", "Learning path controls")}
    >
      <button
        type="button"
        className={`learning-path-controls__segment${
          primaryFilled ? " learning-path-controls__segment--filled" : " learning-path-controls__segment--lead"
        }`}
        onClick={onPrimaryAction}
        disabled={learningPathPending}
      >
        {primaryLabel}
      </button>
      <button
        type="button"
        className="learning-path-controls__segment learning-path-controls__segment--destructive"
        onClick={onClearPath}
        disabled={learningPathPending}
      >
        {t("learningPath.clearPath", "Clear path")}
      </button>
    </div>
  );
}

export default LearningPathControls;
