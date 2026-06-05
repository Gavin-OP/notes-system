import { Button, Empty, Form, Select, Space, Tag, Typography } from "antd";

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
  return values.map((value) => ({ label: value, value }));
}

function normalizeBackground(background = {}) {
  return {
    knowledgeAreas: background.knowledge_areas || background.knowledgeAreas || [],
    skills: background.skills || [],
    tools: background.tools || [],
    careerInterests: background.career_interests || background.careerInterests || [],
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
  const careerOptions = taxonomy.map((profile) => profile.title).filter(Boolean);
  const inferredKnowledge = learningTracks.map((track) => track.title).filter(Boolean);

  return (
    <Form
      layout="vertical"
      initialValues={{
        knowledgeAreas: normalized.knowledgeAreas.length ? normalized.knowledgeAreas : inferredKnowledge,
        skills: normalized.skills,
        tools: normalized.tools,
        careerInterests: normalized.careerInterests,
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
            options={toSelectOptions(KNOWLEDGE_OPTIONS)}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item label="Skills" name="skills">
          <Select
            mode="tags"
            placeholder="Add skills"
            options={toSelectOptions(SKILL_OPTIONS)}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item label="Tools" name="tools">
          <Select
            mode="tags"
            placeholder="Add tools"
            options={toSelectOptions(TOOL_OPTIONS)}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item label="Career Interests" name="careerInterests">
          <Select
            mode="tags"
            placeholder="Add career interests"
            options={toSelectOptions(careerOptions)}
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
              <Tag key={item}>{item}</Tag>
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
