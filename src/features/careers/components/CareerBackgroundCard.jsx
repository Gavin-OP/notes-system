import { Button, Empty, Form, Select, Space, Typography } from "antd";

import SemanticChip from "../../../shared/ui/SemanticChip";
import { getKnowledgeAreaChipVariant } from "../../../shared/lib/semanticChipUtils";

import { CAREER_LEVEL_OPTIONS, formatCareerRoleLabel } from "../lib/careerDisplayUtils";

const { Text } = Typography;

const KNOWLEDGE_OPTIONS = [
  "Data Science",
  "Computer Science",
  "Statistics",
  "Business Analytics",
  "Python",
  "Machine Learning",
];

const SKILL_OPTIONS = [
  "Machine Learning",
  "Data Visualization",
  "Statistics",
  "SQL",
  "Experimentation",
  "Data Cleaning",
];

const TOOL_OPTIONS = ["Python", "SQL", "Pandas", "PyTorch", "Tableau", "Power BI"];

function toSelectOptions(values = []) {
  return dedupeValues(values).map((value) => ({ label: value, value }));
}

function dedupeValues(values = []) {
  const seen = new Set();
  const result = [];
  values.forEach((value) => {
    const label = String(value || "").trim();
    const key = label.toLowerCase();
    if (!label || seen.has(key)) return;
    seen.add(key);
    result.push(label);
  });
  return result.sort((a, b) => a.localeCompare(b));
}

function buildTaxonomyOptions(taxonomy = [], normalized = {}, inferredKnowledge = []) {
  const profiles = Array.isArray(taxonomy) ? taxonomy : [];
  const degreeFields = profiles.flatMap((profile) =>
    (profile.degree_requirements || profile.degreeRequirements || []).flatMap(
      (requirement) => requirement.fields || [],
    ),
  );
  return {
    knowledge: dedupeValues([
      ...KNOWLEDGE_OPTIONS,
      ...degreeFields,
      ...inferredKnowledge,
      ...(normalized.knowledgeAreas || []),
    ]),
    skills: dedupeValues([
      ...SKILL_OPTIONS,
      ...profiles.flatMap((profile) => profile.hard_skills || profile.hardSkills || []),
      ...(normalized.skills || []),
    ]),
    tools: dedupeValues([
      ...TOOL_OPTIONS,
      ...profiles.flatMap((profile) => profile.tools || []),
      ...(normalized.tools || []),
    ]),
    careers: dedupeValues([
      ...profiles.map((profile) =>
        formatCareerRoleLabel(
          profile.title,
          profile.experience_level || profile.experienceLevel,
        ),
      ),
      ...(normalized.careerInterests || []),
    ]),
  };
}

function normalizeBackground(background = {}) {
  return {
    knowledgeAreas: background.knowledge_areas || background.knowledgeAreas || [],
    skills: background.skills || [],
    tools: background.tools || [],
    careerInterests: background.career_interests || background.careerInterests || [],
    experienceLevels: background.experience_levels || background.experienceLevels || [],
  };
}

function CareerBackgroundCard({
  background,
  taxonomy = [],
  learningTracks = [],
  onSave,
  saving = false,
  disabled = false,
}) {
  const normalized = normalizeBackground(background);
  const inferredKnowledge = learningTracks.map((track) => track.title).filter(Boolean);
  const taxonomyOptions = buildTaxonomyOptions(taxonomy, normalized, inferredKnowledge);

  return (
    <Form
      layout="vertical"
      initialValues={{
        knowledgeAreas: normalized.knowledgeAreas.length ? normalized.knowledgeAreas : inferredKnowledge,
        skills: normalized.skills,
        tools: normalized.tools,
        careerInterests: normalized.careerInterests,
        experienceLevels: normalized.experienceLevels,
      }}
      onFinish={(values) => onSave?.(values)}
    >
      <Space direction="vertical" size={12} className="career-background-card">
        <Text type="secondary">
          Keep your background current so career matches can reflect what you know and what you want to learn next.
        </Text>
        <Form.Item label="Knowledge Areas" name="knowledgeAreas">
          <Select
            mode="tags"
            placeholder="Add knowledge areas"
            options={toSelectOptions(taxonomyOptions.knowledge)}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item label="Skills" name="skills">
          <Select
            mode="tags"
            placeholder="Add skills"
            options={toSelectOptions(taxonomyOptions.skills)}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item label="Tools" name="tools">
          <Select
            mode="tags"
            placeholder="Add tools"
            options={toSelectOptions(taxonomyOptions.tools)}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item label="Career Interests" name="careerInterests">
          <Select
            mode="tags"
            placeholder="Add career interests"
            options={toSelectOptions(taxonomyOptions.careers)}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item label="Level" name="experienceLevels">
          <Select
            mode="multiple"
            allowClear
            placeholder="Select preferred levels"
            options={CAREER_LEVEL_OPTIONS}
            disabled={disabled}
          />
        </Form.Item>
        {!normalized.knowledgeAreas.length && !inferredKnowledge.length ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No background yet." />
        ) : null}
        {inferredKnowledge.length ? (
          <Space wrap>
            <Text type="secondary">Inferred from learning:</Text>
            {inferredKnowledge.map((item) => (
              <SemanticChip key={item} variant={getKnowledgeAreaChipVariant(item)}>
                {item}
              </SemanticChip>
            ))}
          </Space>
        ) : null}
        <Button type="primary" htmlType="submit" loading={saving} disabled={disabled}>
          Update recommendations
        </Button>
      </Space>
    </Form>
  );
}

export default CareerBackgroundCard;
