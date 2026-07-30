import { Empty, List, Space, Tooltip, Typography } from "antd";

import SemanticChip from "../../../shared/ui/SemanticChip";
import { getKnowledgeAreaChipVariant } from "../../../shared/lib/semanticChipUtils";

const { Text } = Typography;

function normalizeGap(gap, fallbackSubjects = []) {
  return {
    skill: gap?.skill || "Unknown skill",
    category: gap?.category || "skill",
    reason: gap?.reason || "",
    relatedSubjects: (gap?.related_subjects || gap?.relatedSubjects || fallbackSubjects).filter(Boolean),
  };
}

function normalizeSubjectLabels(subjects = []) {
  return subjects
    .map((subject) => {
      if (typeof subject === "string") return subject;
      return subject?.title || subject?.subject_title || subject?.subjectTitle || subject?.subject_slug || subject?.slug || "";
    })
    .map((label) => String(label || "").trim())
    .filter(Boolean);
}

function buildGapGroups(recommendations = [], relatedSubjects = []) {
  const byKey = new Map();
  const fallbackSubjects = normalizeSubjectLabels(relatedSubjects);
  recommendations.forEach((recommendation) => {
    (recommendation.skill_gaps || recommendation.skillGaps || []).forEach((rawGap) => {
      const gap = normalizeGap(rawGap, fallbackSubjects);
      const key = `${gap.category}:${gap.skill.toLowerCase()}`;
      const existing = byKey.get(key) || {
        ...gap,
        roles: new Set(),
        relatedSubjects: new Set(),
        count: 0,
      };
      existing.roles.add(recommendation.title);
      gap.relatedSubjects.forEach((subject) => existing.relatedSubjects.add(subject));
      existing.count += 1;
      byKey.set(key, existing);
    });
  });
  return Array.from(byKey.values())
    .map((gap) => ({
      ...gap,
      roles: Array.from(gap.roles),
      relatedSubjects: Array.from(gap.relatedSubjects),
    }))
    .sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill))
    .slice(0, 8);
}

function categoryLabel(category) {
  if (category === "tool") return "Tools";
  if (category === "hard_skill") return "Skills";
  return "Knowledge";
}

function categoryChipVariant(category) {
  if (category === "tool") return "sage";
  if (category === "hard_skill") return "primary";
  return getKnowledgeAreaChipVariant(category);
}

function formatList(items = [], limit = 3) {
  const visibleItems = items.slice(0, limit);
  const remainingCount = items.length - visibleItems.length;
  if (remainingCount <= 0) return visibleItems.join(", ");
  return `${visibleItems.join(", ")} +${remainingCount} more`;
}

function detailText(label, items = []) {
  if (!items.length) return `No related ${label.toLowerCase()} yet.`;
  return `Related ${label.toLowerCase()}: ${formatList(items, 6)}`;
}

function CareerSkillGapPanel({ recommendations = [], relatedSubjects = [] }) {
  const gaps = buildGapGroups(recommendations, relatedSubjects);
  if (!gaps.length) {
    return <Empty description="No next skills yet." />;
  }

  return (
    <List
      size="small"
      dataSource={gaps}
      renderItem={(gap) => (
        <List.Item className="career-gap-item">
          <Space direction="vertical" size={6}>
            <Text strong>{gap.skill}</Text>
            <Space wrap size={[8, 8]} align="center">
              <SemanticChip variant={categoryChipVariant(gap.category)}>
                {categoryLabel(gap.category)}
              </SemanticChip>
              <Tooltip title={detailText("roles", gap.roles)}>
                <span>
                  <SemanticChip variant="wisdom">
                    {gap.roles.length} role{gap.roles.length > 1 ? "s" : ""}
                  </SemanticChip>
                </span>
              </Tooltip>
              <Tooltip title={detailText("subjects", gap.relatedSubjects)}>
                <span>
                  <SemanticChip variant="teal">
                    {gap.relatedSubjects.length} subject{gap.relatedSubjects.length > 1 ? "s" : ""}
                  </SemanticChip>
                </span>
              </Tooltip>
            </Space>
          </Space>
        </List.Item>
      )}
    />
  );
}

export default CareerSkillGapPanel;
