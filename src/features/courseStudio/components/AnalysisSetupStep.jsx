import { Alert, Button, Col, Form, Input, Row, Select, Space, Typography } from "antd";
import { ArrowLeftOutlined, BranchesOutlined, FileTextOutlined } from "@ant-design/icons";

import SemanticChip from "../../../shared/ui/SemanticChip";

const { Paragraph, Text, Title } = Typography;
const ARCHETYPES = [
  { value: "conceptual", label: "Conceptual" },
  { value: "practice_based", label: "Practice-based" },
  { value: "creative", label: "Creative" },
];

function AnalysisSetupStep({ sourceAsset, domains, analyzing, onBack, onSubmit }) {
  const [form] = Form.useForm();
  const filenameTitle = sourceAsset?.original_filename
    ?.replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "";
  const applyDomainRecommendation = (domainSlug) => {
    const domain = domains.find((item) => item.slug === domainSlug);
    if (!domain) return;
    form.setFieldsValue({
      primary_archetype: domain.primary_archetype || "conceptual",
      secondary_archetypes: domain.secondary_archetypes || [],
    });
  };

  return (
    <section className="course-studio__step-panel" aria-labelledby="course-studio-analyze-title">
      <div className="course-studio__step-heading">
        <span className="course-studio__step-icon"><BranchesOutlined /></span>
        <div>
          <Text className="course-studio__eyebrow">Analysis brief</Text>
          <Title level={3} id="course-studio-analyze-title">Set the course perspective</Title>
          <Paragraph>
            Choose the stable Domain, then review the Learning Archetype recommended during semantic
            classification. These decisions are made before outline generation and stored with the proposal.
          </Paragraph>
        </div>
      </div>

      <Alert
        type="success"
        showIcon
        title={`${sourceAsset?.original_filename || "Source"} is parsed and ready`}
        description={`${Math.max(1, Math.round((sourceAsset?.byte_size || 0) / 1024))} KB · ${sourceAsset?.parser_metadata?.characters || 0} readable characters`}
      />

      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        initialValues={{
          proposed_title: filenameTitle,
          primary_archetype: "conceptual",
          secondary_archetypes: [],
          user_prompt: "",
        }}
        onFinish={onSubmit}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Canonical Domain"
              name="domain_slug"
              rules={[{ required: true, message: "Choose the canonical Domain for this course." }]}
              extra="Domain identity and its concepts stay stable under admin management."
            >
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Choose a Domain"
                disabled={analyzing}
                onChange={applyDomainRecommendation}
                options={domains.map((domain) => ({
                  value: domain.slug,
                  label: `${domain.title} · ${domain.concept_count} concepts`,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Course title"
              name="proposed_title"
              rules={[{ required: true, whitespace: true, message: "Give this course perspective a title." }]}
            >
              <Input maxLength={255} disabled={analyzing} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Primary Learning Archetype"
              name="primary_archetype"
              rules={[{ required: true }]}
              extra="Recommended from the Domain and source analysis; review it before generating the outline."
            >
              <Select options={ARCHETYPES} disabled={analyzing} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Secondary archetypes"
              name="secondary_archetypes"
              extra="Optional. Select only meaningful secondary modes."
            >
              <Select mode="multiple" maxCount={2} options={ARCHETYPES} disabled={analyzing} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Instructions for later course generation"
          name="user_prompt"
          extra="Stored with this draft for the generation and revision phase. For example: prioritize intuition, preserve my examples, and end each module with practice."
        >
          <Input.TextArea
            rows={5}
            maxLength={10_000}
            showCount
            disabled={analyzing}
            placeholder="Describe the audience, emphasis, order, or teaching style you want..."
          />
        </Form.Item>

        <div className="course-studio__metadata-preview">
          <Text type="secondary">Proposal metadata</Text>
          <Space wrap>
            <SemanticChip variant="primary">Domain · selected above</SemanticChip>
            <SemanticChip variant="teal">Learning · course-specific</SemanticChip>
            <SemanticChip variant="slate">Goal · selected by each learner later</SemanticChip>
          </Space>
        </div>

        <div className="course-studio__panel-footer">
          <Button icon={<ArrowLeftOutlined />} onClick={onBack} disabled={analyzing}>
            Replace source
          </Button>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            icon={<FileTextOutlined />}
            loading={analyzing}
          >
            Analyze and propose outline
          </Button>
        </div>
      </Form>
    </section>
  );
}

export default AnalysisSetupStep;
