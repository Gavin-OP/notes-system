import { Empty, List, Space, Typography } from "antd";

import SemanticChip from "../SemanticChip";
import { getKnowledgeAreaChipVariant } from "../../utils/semanticChipUtils";

const { Text } = Typography;

function normalizeGap(gap) {
  return {
    skill: gap?.skill || "Unknown skill",
    category: gap?.category || "skill",
    reason: gap?.reason || "",
  };
}

function buildGapGroups(recommendations = []) {
  const byKey = new Map();
  recommendations.forEach((recommendation) => {
    (recommendation.skill_gaps || recommendation.skillGaps || []).forEach((rawGap) => {
      const gap = normalizeGap(rawGap);
      const key = `${gap.category}:${gap.skill.toLowerCase()}`;
      const existing = byKey.get(key) || {
        ...gap,
        roles: new Set(),
        count: 0,
      };
      existing.roles.add(recommendation.title);
      existing.count += 1;
      byKey.set(key, existing);
    });
  });
  return Array.from(byKey.values())
    .map((gap) => ({
      ...gap,
      roles: Array.from(gap.roles),
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

function CareerSkillGapPanel({ recommendations = [] }) {
  const gaps = buildGapGroups(recommendations);
  if (!gaps.length) {
    return <Empty description="No skill gaps yet." />;
  }

  return (
    <List
      size="small"
      dataSource={gaps}
      renderItem={(gap) => (
        <List.Item className="career-gap-item">
          <Space direction="vertical" size={4}>
            <Space wrap>
              <Text strong>{gap.skill}</Text>
              <SemanticChip variant={categoryChipVariant(gap.category)}>
                {categoryLabel(gap.category)}
              </SemanticChip>
              <SemanticChip variant="slate">
                {gap.count} role{gap.count > 1 ? "s" : ""}
              </SemanticChip>
            </Space>
            <Text type="secondary">Related to {gap.roles.slice(0, 3).join(", ")}</Text>
          </Space>
        </List.Item>
      )}
    />
  );
}

export default CareerSkillGapPanel;
