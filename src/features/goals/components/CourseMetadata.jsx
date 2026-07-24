import SemanticChip from "../../../shared/ui/SemanticChip";
import { formatArchetype, getGoalTypeConfig } from "../lib/goalMetadata";

function CourseMetadata({ course, goal, compact = false }) {
  const domainTitle = course?.domain_title || course?.domainTitle || course?.domain_slug || course?.domainSlug;
  const primaryArchetype = course?.primary_archetype || course?.primaryArchetype;
  const goalType = goal?.goal_type || goal?.goalType;
  const goalConfig = getGoalTypeConfig(goalType);

  return (
    <span className={`course-metadata ${compact ? "course-metadata--compact" : ""}`}>
      {domainTitle ? (
        <SemanticChip variant="primary" aria-label={`Domain: ${domainTitle}`}>
          Domain · {domainTitle}
        </SemanticChip>
      ) : null}
      {primaryArchetype ? (
        <SemanticChip variant="teal" aria-label={`Learning archetype: ${formatArchetype(primaryArchetype)}`}>
          Learning · {formatArchetype(primaryArchetype)}
        </SemanticChip>
      ) : null}
      {goalType ? (
        <SemanticChip variant={goalConfig.variant} aria-label={`Goal: ${goal?.title || goalConfig.label}`}>
          Goal · {goal?.title || goalConfig.label}
        </SemanticChip>
      ) : null}
    </span>
  );
}

export default CourseMetadata;
