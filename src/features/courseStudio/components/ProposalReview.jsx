import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Collapse,
  Empty,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Space,
  Statistic,
  Table,
  Timeline,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  RocketOutlined,
  SendOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import CourseMetadata from "../../goals/components/CourseMetadata";
import SemanticChip from "../../../shared/ui/SemanticChip";
import OutlineEditor from "./OutlineEditor";

const { Paragraph, Text, Title } = Typography;

const EVENT_LABELS = {
  proposal_created: "Proposal created",
  proposal_updated: "Outline edited",
  concept_suggestions_decided: "Concept suggestions reviewed",
  conversational_revision: "Revision requested",
  course_created: "Course and first version created",
};

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180) || "my-course";
}

function decisionChip(status) {
  if (status === "accepted") return <SemanticChip variant="sage">Accepted</SemanticChip>;
  if (status === "rejected") return <SemanticChip variant="slate">Rejected</SemanticChip>;
  return <SemanticChip variant="amber">Suggested</SemanticChip>;
}

function ProposalReview({
  proposal,
  usage,
  auditEvents,
  saving,
  deciding,
  revising,
  finalizing,
  revisionFeedback,
  onSaveProposal,
  onDecide,
  onRevise,
  onFinalize,
  onStartAnother,
  onOpenCourses,
}) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [finalizeForm] = Form.useForm();
  const modules = proposal?.outline?.modules || [];
  const mappings = proposal?.concept_mappings || [];
  const gaps = proposal?.knowledge_gaps || [];
  const isFinalized = proposal?.status === "finalized";
  const pendingMappings = mappings.filter((item) => (item.status || "suggested") === "suggested");
  const acceptedMappings = mappings.filter((item) => item.status === "accepted");
  const lessonCount = modules.reduce((total, module) => total + (module.lessons?.length || 0), 0);
  const mappedLessonCount = new Set(
    acceptedMappings.map((item) => item.outline_item_id),
  ).size;
  const coverage = lessonCount ? Math.round((mappedLessonCount / lessonCount) * 100) : 0;
  const courseMetadata = {
    domain_slug: proposal?.domain_slug,
    domain_title: proposal?.domain_title,
    primary_archetype: proposal?.primary_archetype,
  };

  const auditItems = useMemo(() => (auditEvents || []).map((event) => ({
    color: event.action === "course_created" ? "green" : event.actor_type === "assistant" ? "blue" : "gray",
    children: (
      <div>
        <Text strong>{EVENT_LABELS[event.action] || event.action}</Text>
        <div>
          <Text type="secondary">
            Revision {event.revision_number} · {new Date(event.created_at).toLocaleString()}
          </Text>
        </div>
        {event.event_metadata?.assistant_message ? (
          <Paragraph className="course-studio__audit-note">
            {event.event_metadata.assistant_message}
          </Paragraph>
        ) : null}
      </div>
    ),
  })), [auditEvents]);

  const mappingColumns = [
    {
      title: "Outline item",
      dataIndex: "outline_item_title",
      key: "outline",
      render: (value) => <Text strong>{value}</Text>,
    },
    {
      title: "Canonical concept",
      dataIndex: "canonical_concept_title",
      key: "concept",
      render: (value, row) => (
        <Space orientation="vertical" size={2}>
          <Text><LinkOutlined /> {value}</Text>
          <Text type="secondary" className="course-studio__mono">{row.canonical_concept_id}</Text>
        </Space>
      ),
    },
    {
      title: "Confidence",
      dataIndex: "confidence",
      key: "confidence",
      width: 120,
      render: (value) => (
        <SemanticChip variant={value >= 0.75 ? "sage" : "amber"}>
          {Math.round(value * 100)}%
        </SemanticChip>
      ),
    },
    {
      title: "Decision",
      dataIndex: "status",
      key: "status",
      width: 132,
      render: (value) => decisionChip(value || "suggested"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 190,
      render: (_, row) => (
        <Space>
          <Button
            size="small"
            type={row.status === "accepted" ? "primary" : "default"}
            icon={<CheckCircleOutlined />}
            disabled={isFinalized || deciding}
            aria-label={`Accept mapping to ${row.canonical_concept_title}`}
            onClick={() => onDecide([{ mapping_id: row.id, decision: "accepted", rationale: "" }])}
          >
            Accept
          </Button>
          <Button
            size="small"
            danger={row.status !== "rejected"}
            icon={<CloseCircleOutlined />}
            disabled={isFinalized || deciding}
            aria-label={`Reject mapping to ${row.canonical_concept_title}`}
            onClick={() => onDecide([{ mapping_id: row.id, decision: "rejected", rationale: "" }])}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  const handleRevision = async () => {
    const trimmed = instruction.trim();
    if (trimmed.length < 3) return;
    const applied = await onRevise(trimmed);
    if (applied) setInstruction("");
  };

  const openFinalize = () => {
    finalizeForm.setFieldsValue({
      slug: slugify(proposal?.proposed_title),
      description: "",
      target_learner: "",
      visibility: "private",
      change_summary: "Created from an approved Course Studio proposal.",
    });
    setFinalizeOpen(true);
  };

  return (
    <section className="course-studio__review" aria-labelledby="course-studio-review-title">
      <div className="course-studio__review-hero">
        <div>
          <Text className="course-studio__eyebrow">
            Outline Proposal · {isFinalized ? "Finalized" : `Draft r${proposal?.revision_number || 1}`}
          </Text>
          <Title level={2} id="course-studio-review-title">{proposal?.proposed_title}</Title>
          <CourseMetadata course={courseMetadata} />
          <Paragraph>
            Review the course perspective while the canonical concept layer remains stable and
            admin-managed.
          </Paragraph>
        </div>
        <Progress
          type="circle"
          percent={coverage}
          size={112}
          strokeColor="var(--ns-color-primary)"
          format={(percent) => <span>{percent}%<small>accepted</small></span>}
        />
      </div>

      <Alert
        type={isFinalized ? "success" : "info"}
        showIcon
        title={isFinalized ? "This proposal has created a course" : "This is a private proposal, not a published course"}
        description={
          isFinalized
            ? "Its approved outline and concept links were captured in an immutable first course version."
            : "You can edit its structure, request revisions, and decide every concept suggestion before creating a draft course."
        }
      />

      <div className="course-studio__stats">
        <Card><Statistic title="Modules" value={modules.length} /></Card>
        <Card><Statistic title="Outline items" value={lessonCount} /></Card>
        <Card><Statistic title="Accepted links" value={acceptedMappings.length} /></Card>
        <Card><Statistic title="Pending decisions" value={pendingMappings.length} /></Card>
      </div>

      <Card
        title="Proposed course structure"
        extra={!isFinalized ? (
          <Button icon={<EditOutlined />} onClick={() => setEditorOpen(true)}>Edit outline</Button>
        ) : null}
        className="course-studio__review-card"
      >
        <Collapse
          bordered={false}
          defaultActiveKey={modules[0]?.id ? [modules[0].id] : []}
          items={modules.map((module, moduleIndex) => ({
            key: module.id,
            label: (
              <span className="course-studio__module-label">
                <span>{String(moduleIndex + 1).padStart(2, "0")}</span>
                <strong>{module.title}</strong>
                <Text type="secondary">{module.lessons?.length || 0} items</Text>
              </span>
            ),
            children: (
              <ol className="course-studio__lesson-list">
                {(module.lessons || []).map((lesson) => (
                  <li key={lesson.id}>
                    <span><CheckCircleOutlined /></span>
                    <div>
                      <Text strong>{lesson.title}</Text>
                      <Paragraph type="secondary">{lesson.summary}</Paragraph>
                    </div>
                  </li>
                ))}
              </ol>
            ),
          }))}
        />
      </Card>

      {!isFinalized ? (
        <Card
          title="Revise with your instructions"
          className="course-studio__review-card course-studio__revision-card"
        >
          <Paragraph type="secondary">
            Ask for a title change, a new module, removal of a module, or a different learning
            archetype. Revised outline items are mapped again without changing canonical knowledge.
          </Paragraph>
          <Input.TextArea
            value={instruction}
            rows={3}
            maxLength={10_000}
            showCount
            disabled={revising}
            aria-label="Revision instruction"
            placeholder='For example: "Add a module on safe deployment" or "Rename the course to Practical Python".'
            onChange={(event) => setInstruction(event.target.value)}
          />
          <div className="course-studio__revision-action">
            <Button
              type="primary"
              icon={<SendOutlined />}
              loading={revising}
              disabled={instruction.trim().length < 3}
              onClick={handleRevision}
            >
              Request revision
            </Button>
          </div>
          {revisionFeedback ? (
            <Alert
              type={revisionFeedback.applied_changes?.length ? "success" : "warning"}
              showIcon
              title={revisionFeedback.assistant_message}
              description={
                revisionFeedback.applied_changes?.length
                  ? revisionFeedback.applied_changes.join(" · ")
                  : "Try a more specific instruction or edit the outline directly."
              }
            />
          ) : null}
        </Card>
      ) : null}

      <Card
        title="Canonical concept mapping"
        extra={!isFinalized && pendingMappings.length ? (
          <Space wrap>
            <Text type="secondary">{usage?.canonical_concepts_considered || 0} considered</Text>
            <Button
              disabled={deciding}
              onClick={() => onDecide(pendingMappings.map((item) => ({
                mapping_id: item.id,
                decision: "rejected",
                rationale: "Bulk rejected during proposal review.",
              })))}
            >
              Reject remaining
            </Button>
            <Button
              type="primary"
              loading={deciding}
              onClick={() => onDecide(pendingMappings.map((item) => ({
                mapping_id: item.id,
                decision: "accepted",
                rationale: "Bulk accepted during proposal review.",
              })))}
            >
              Accept remaining
            </Button>
          </Space>
        ) : <Text type="secondary">{mappings.length} suggestions</Text>}
        className="course-studio__review-card"
      >
        {mappings.length ? (
          <Table
            rowKey="id"
            columns={mappingColumns}
            dataSource={mappings}
            pagination={{ pageSize: 8, hideOnSinglePage: true }}
            scroll={{ x: 900 }}
          />
        ) : (
          <Empty description="No confident canonical concept links were found." />
        )}
      </Card>

      <Card
        title={<Space><WarningOutlined /> Knowledge gaps to review</Space>}
        className="course-studio__review-card"
      >
        {gaps.length ? (
          <ul className="course-studio__gap-list">
            {gaps.map((gap) => (
              <li key={gap.outline_item_id}>
                <div>
                  <Text strong>{gap.outline_item_title}</Text>
                  <Text type="secondary">{gap.reason}</Text>
                </div>
                <SemanticChip variant="amber">Needs review</SemanticChip>
              </li>
            ))}
          </ul>
        ) : (
          <Alert type="success" showIcon title="Every outline item has at least one suggested canonical link." />
        )}
      </Card>

      <Card title="Proposal activity" className="course-studio__review-card">
        {auditItems.length ? <Timeline items={auditItems} /> : <Empty description="No activity recorded yet." />}
      </Card>

      <div className="course-studio__review-actions">
        <Button icon={<PlusOutlined />} onClick={onStartAnother}>Analyze another source</Button>
        {isFinalized ? (
          <Button type="primary" size="large" onClick={onOpenCourses}>View My Courses</Button>
        ) : (
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            disabled={pendingMappings.length > 0}
            onClick={openFinalize}
          >
            Create draft course
          </Button>
        )}
      </div>

      {editorOpen ? (
        <OutlineEditor
          open
          proposal={proposal}
          saving={saving}
          onCancel={() => setEditorOpen(false)}
          onSave={async (payload) => {
            const saved = await onSaveProposal(payload);
            if (saved) setEditorOpen(false);
          }}
        />
      ) : null}

      <Modal
        open={finalizeOpen}
        title="Create a draft course"
        okText="Create course and version"
        okButtonProps={{ loading: finalizing }}
        cancelButtonProps={{ disabled: finalizing }}
        onCancel={() => setFinalizeOpen(false)}
        onOk={() => finalizeForm.submit()}
      >
        <Alert
          type="info"
          showIcon
          title={`${acceptedMappings.length} accepted concept links will be included`}
          description="Rejected suggestions and the private source file are not copied into the course outline. The course starts private or unlisted and remains a draft."
        />
        <Form
          form={finalizeForm}
          layout="vertical"
          requiredMark={false}
          onFinish={async (values) => {
            const created = await onFinalize(values);
            if (created) setFinalizeOpen(false);
          }}
        >
          <Form.Item
            label="Course URL slug"
            name="slug"
            rules={[
              { required: true },
              { pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "Use lowercase letters, numbers, and hyphens." },
            ]}
          >
            <Input maxLength={191} disabled={finalizing} />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} maxLength={20_000} disabled={finalizing} />
          </Form.Item>
          <Form.Item label="Target learner" name="target_learner">
            <Input.TextArea rows={2} maxLength={10_000} disabled={finalizing} />
          </Form.Item>
          <Form.Item label="Visibility" name="visibility" rules={[{ required: true }]}>
            <Select
              disabled={finalizing}
              options={[
                { value: "private", label: "Private · only you" },
                { value: "unlisted", label: "Unlisted · accessible by link" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Version note" name="change_summary">
            <Input maxLength={5_000} disabled={finalizing} />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}

export default ProposalReview;
