import { Button, Form, Modal, Select, Space, Typography } from "antd";

import { CAREER_LEVEL_OPTIONS, formatCareerRoleLabel, formatTaxonomyLabel } from "../lib/careerDisplayUtils";

const { Paragraph, Text, Title } = Typography;

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

function dedupeValues(values = []) {
  const seen = new Set();
  const result = [];
  values.forEach((value) => {
    const label = formatTaxonomyLabel(value);
    const key = label.toLowerCase();
    if (!label || seen.has(key)) return;
    seen.add(key);
    result.push(label);
  });
  return result.sort((a, b) => a.localeCompare(b));
}

function toSelectOptions(values = []) {
  return dedupeValues(values).map((value) => ({ label: value, value }));
}

function buildOptions(taxonomy = []) {
  const profiles = Array.isArray(taxonomy) ? taxonomy : [];
  const degreeFields = profiles.flatMap((profile) =>
    (profile.degree_requirements || profile.degreeRequirements || []).flatMap(
      (requirement) => requirement.fields || [],
    ),
  );
  return {
    knowledge: toSelectOptions([...KNOWLEDGE_OPTIONS, ...degreeFields]),
    skills: toSelectOptions([
      ...SKILL_OPTIONS,
      ...profiles.flatMap((profile) => profile.hard_skills || profile.hardSkills || []),
    ]),
    tools: toSelectOptions([
      ...TOOL_OPTIONS,
      ...profiles.flatMap((profile) => profile.tools || []),
    ]),
    careers: toSelectOptions(
      profiles.map((profile) =>
        formatCareerRoleLabel(
          profile.title,
          profile.experience_level || profile.experienceLevel,
        ),
      ),
    ),
  };
}

function CareerOnboardingModal({
  open,
  taxonomy = [],
  loading = false,
  onSubmit,
  onCancel,
}) {
  const [form] = Form.useForm();
  const options = buildOptions(taxonomy);

  return (
    <Modal
      open={open}
      title={null}
      footer={null}
      closable
      maskClosable={!loading}
      width={680}
      centered
      onCancel={onCancel}
    >
      <Space direction="vertical" size={16} className="career-onboarding-modal">
        <div>
          <Title level={3}>Personalize your first learning step</Title>
          <Paragraph type="secondary">
            Tell us what you already know and where you want to go. We will recommend a first note and update your career profile.
          </Paragraph>
        </div>
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => onSubmit?.(values)}
          initialValues={{
            knowledgeAreas: [],
            skills: [],
            tools: [],
            careerInterests: [],
            experienceLevels: ["Entry"],
          }}
        >
          <Form.Item label="Knowledge Areas" name="knowledgeAreas">
            <Select
              mode="tags"
              placeholder="What areas do you already know?"
              options={options.knowledge}
              disabled={loading}
            />
          </Form.Item>
          <Form.Item label="Skills" name="skills">
            <Select
              mode="tags"
              placeholder="Add skills you already have"
              options={options.skills}
              disabled={loading}
            />
          </Form.Item>
          <Form.Item label="Tools" name="tools">
            <Select
              mode="tags"
              placeholder="Add tools you can use"
              options={options.tools}
              disabled={loading}
            />
          </Form.Item>
          <Form.Item label="Career Interests" name="careerInterests">
            <Select
              mode="tags"
              placeholder="Add career directions you are interested in"
              options={options.careers}
              disabled={loading}
            />
          </Form.Item>
          <Form.Item label="Level" name="experienceLevels">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select target levels"
              options={CAREER_LEVEL_OPTIONS}
              disabled={loading}
            />
          </Form.Item>
          <Space direction="vertical" size={8} className="career-onboarding-modal__footer">
            <Text type="secondary">
              You can edit these answers later from Career Matches.
            </Text>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Recommend my first note
            </Button>
          </Space>
        </Form>
      </Space>
    </Modal>
  );
}

export default CareerOnboardingModal;
