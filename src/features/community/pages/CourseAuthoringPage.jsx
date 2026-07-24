import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Tabs,
  Timeline,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  SaveOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import CourseMetadata from "../../goals/components/CourseMetadata";
import SemanticChip from "../../../shared/ui/SemanticChip";
import {
  createAuthoringVersion,
  createCanonicalSuggestion,
  getCourse,
  listCanonicalSuggestions,
  listCourseVersions,
  listPublicationReviews,
  reviseCourse,
  submitPublicationReview,
} from "../../goals/api/learningPlatform";

import "./CourseAuthoringPage.css";

const { Paragraph, Text, Title } = Typography;

function newId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value || { schema_version: "course-outline-proposal/v1", modules: [] }));
}

function restoreLocalDraft(serializedDraft) {
  if (!serializedDraft) return null;
  try {
    const parsed = JSON.parse(serializedDraft);
    if (!parsed || !Array.isArray(parsed.modules)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function CourseContentEditor({ outline, onChange }) {
  const updateModule = (moduleIndex, updater) => {
    onChange({
      ...outline,
      modules: outline.modules.map((module, index) => (
        index === moduleIndex ? updater(module) : module
      )),
    });
  };

  return (
    <div className="course-authoring__editor">
      {(outline.modules || []).map((module, moduleIndex) => (
        <Card
          key={module.id}
          title={`Module ${moduleIndex + 1}`}
          extra={(
            <Popconfirm
              title="Remove this module?"
              disabled={outline.modules.length === 1}
              onConfirm={() => onChange({
                ...outline,
                modules: outline.modules.filter((_, index) => index !== moduleIndex),
              })}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={outline.modules.length === 1}
                aria-label={`Remove module ${moduleIndex + 1}`}
              />
            </Popconfirm>
          )}
        >
          <label className="course-authoring__field">
            <Text strong>Module title</Text>
            <Input
              value={module.title}
              maxLength={180}
              onChange={(event) => updateModule(moduleIndex, (current) => ({
                ...current,
                title: event.target.value,
              }))}
            />
          </label>
          <div className="course-authoring__lesson-list">
            {(module.lessons || []).map((lesson, lessonIndex) => (
              <article key={lesson.id}>
                <div className="course-authoring__lesson-head">
                  <Text strong>Note {lessonIndex + 1}</Text>
                  <Popconfirm
                    title="Remove this note?"
                    disabled={module.lessons.length === 1}
                    onConfirm={() => updateModule(moduleIndex, (current) => ({
                      ...current,
                      lessons: current.lessons.filter((_, index) => index !== lessonIndex),
                    }))}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={module.lessons.length === 1}
                      aria-label={`Remove note ${lessonIndex + 1}`}
                    />
                  </Popconfirm>
                </div>
                <label className="course-authoring__field">
                  <Text>Note title</Text>
                  <Input
                    value={lesson.title}
                    maxLength={180}
                    onChange={(event) => updateModule(moduleIndex, (current) => ({
                      ...current,
                      lessons: current.lessons.map((item, index) => (
                        index === lessonIndex ? { ...item, title: event.target.value } : item
                      )),
                    }))}
                  />
                </label>
                <label className="course-authoring__field">
                  <Text>Summary</Text>
                  <Input.TextArea
                    value={lesson.summary}
                    rows={2}
                    maxLength={2_000}
                    onChange={(event) => updateModule(moduleIndex, (current) => ({
                      ...current,
                      lessons: current.lessons.map((item, index) => (
                        index === lessonIndex ? { ...item, summary: event.target.value } : item
                      )),
                    }))}
                  />
                </label>
                <label className="course-authoring__field">
                  <Text>Learning note</Text>
                  <Input.TextArea
                    value={lesson.content_markdown || ""}
                    rows={8}
                    maxLength={50_000}
                    showCount
                    placeholder="Write the explanation, examples, and learner-facing guidance in Markdown..."
                    onChange={(event) => updateModule(moduleIndex, (current) => ({
                      ...current,
                      lessons: current.lessons.map((item, index) => (
                        index === lessonIndex ? { ...item, content_markdown: event.target.value } : item
                      )),
                    }))}
                  />
                </label>
                <label className="course-authoring__field">
                  <Text>Practice prompt</Text>
                  <Input.TextArea
                    value={lesson.practice_prompt || ""}
                    rows={2}
                    maxLength={5_000}
                    onChange={(event) => updateModule(moduleIndex, (current) => ({
                      ...current,
                      lessons: current.lessons.map((item, index) => (
                        index === lessonIndex ? { ...item, practice_prompt: event.target.value } : item
                      )),
                    }))}
                  />
                </label>
              </article>
            ))}
            <Button
              icon={<PlusOutlined />}
              onClick={() => updateModule(moduleIndex, (current) => ({
                ...current,
                lessons: [
                  ...current.lessons,
                  {
                    id: newId(`${current.id}-note`),
                    title: "New note",
                    summary: "",
                    source_excerpt: "",
                    content_markdown: "",
                    learning_objectives: [],
                    practice_prompt: "",
                    resources: [],
                  },
                ],
              }))}
            >
              Add note
            </Button>
          </div>
        </Card>
      ))}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() => {
          const moduleId = newId("module");
          onChange({
            ...outline,
            modules: [
              ...outline.modules,
              {
                id: moduleId,
                title: "New module",
                lessons: [{
                  id: newId(`${moduleId}-note`),
                  title: "New note",
                  summary: "",
                  source_excerpt: "",
                  content_markdown: "",
                  learning_objectives: [],
                  practice_prompt: "",
                  resources: [],
                }],
              },
            ],
          });
        }}
      >
        Add module
      </Button>
    </div>
  );
}

export default function CourseAuthoringPage() {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [saveForm] = Form.useForm();
  const [reviewForm] = Form.useForm();
  const [suggestionForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [errorText, setErrorText] = useState("");
  const [course, setCourse] = useState(null);
  const [versions, setVersions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [outline, setOutline] = useState({ schema_version: "course-outline-proposal/v1", modules: [] });
  const [dirty, setDirty] = useState(false);
  const [revisionInstruction, setRevisionInstruction] = useState("");
  const [revisionFeedback, setRevisionFeedback] = useState(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);

  const draftKey = `notes-system:course-authoring:${courseId}`;

  const load = useCallback(async () => {
    setLoading(true);
    setErrorText("");
    try {
      const [coursePayload, versionPayload, reviewPayload, suggestionPayload] = await Promise.all([
        getCourse(courseId),
        listCourseVersions(courseId),
        listPublicationReviews(courseId),
        listCanonicalSuggestions(courseId),
      ]);
      const nextVersions = Array.isArray(versionPayload) ? versionPayload : [];
      setCourse(coursePayload);
      setVersions(nextVersions);
      setReviews(Array.isArray(reviewPayload) ? reviewPayload : []);
      setSuggestions(Array.isArray(suggestionPayload) ? suggestionPayload : []);
      const localDraft = restoreLocalDraft(window.localStorage.getItem(draftKey));
      if (localDraft) {
        setOutline(localDraft);
        setDirty(true);
      } else {
        window.localStorage.removeItem(draftKey);
        setOutline(clone(nextVersions[0]?.outline));
        setDirty(false);
      }
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not load this authoring workspace.");
    } finally {
      setLoading(false);
    }
  }, [courseId, draftKey]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!dirty) return;
    window.localStorage.setItem(draftKey, JSON.stringify(outline));
  }, [dirty, draftKey, outline]);

  useEffect(() => {
    const warn = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const latestVersion = versions[0] || null;
  const conceptOptions = useMemo(() => {
    const seen = new Set();
    return (latestVersion?.concept_mappings || [])
      .filter((mapping) => {
        const id = String(mapping.canonical_concept_id || "");
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .map((mapping) => ({
        value: mapping.canonical_concept_id,
        label: `${mapping.canonical_concept_title || mapping.canonical_concept_id}`,
      }));
  }, [latestVersion]);

  const updateOutline = (next) => {
    setOutline(next);
    setDirty(true);
  };

  const saveVersion = async (values) => {
    setBusy("save");
    try {
      const created = await createAuthoringVersion(courseId, {
        outline,
        change_summary: values.change_summary.trim(),
      });
      setVersions((current) => [created, ...current]);
      setCourse((current) => ({
        ...current,
        current_version_id: created.id,
        status: "draft",
        visibility: "private",
      }));
      setDirty(false);
      window.localStorage.removeItem(draftKey);
      setSaveOpen(false);
      message.success(`Immutable version ${created.version_number} created.`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not create this course version.");
    } finally {
      setBusy("");
    }
  };

  const requestRevision = async () => {
    setBusy("revision");
    try {
      const response = await reviseCourse(courseId, revisionInstruction);
      setRevisionFeedback(response);
      setCourse(response.course);
      if (response.applied_changes?.length) {
        setVersions((current) => [response.version, ...current.filter((item) => item.id !== response.version.id)]);
        setOutline(clone(response.version.outline));
        setDirty(false);
        window.localStorage.removeItem(draftKey);
        setRevisionInstruction("");
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not revise this course.");
    } finally {
      setBusy("");
    }
  };

  const submitReview = async (values) => {
    setBusy("review");
    try {
      const created = await submitPublicationReview(courseId, values.submission_note || "");
      setReviews((current) => [created, ...current]);
      setReviewOpen(false);
      message.success("Course submitted for community moderation.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not submit this course.");
    } finally {
      setBusy("");
    }
  };

  const submitSuggestion = async (values) => {
    setBusy("suggestion");
    try {
      const created = await createCanonicalSuggestion(courseId, {
        ...values,
        evidence: [],
      });
      setSuggestions((current) => [created, ...current]);
      setSuggestionOpen(false);
      message.success("Canonical change suggestion sent to the admin queue.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not submit this suggestion.");
    } finally {
      setBusy("");
    }
  };

  return (
    <AppPageShell
      title={course?.title || "Course Authoring"}
      subtitle="Create a new immutable version, then submit it for moderated community publication."
      backLabel="Back to profile"
      onBack={() => navigate("/user/profile", { state: { dashboard: "courses" } })}
      showSiteFooter
      contentWidth="wide"
      contentClassName="course-authoring"
    >
      {errorText ? <Alert type="error" showIcon title="Authoring unavailable" description={errorText} /> : null}
      {loading ? <Card><Skeleton active paragraph={{ rows: 12 }} /></Card> : null}
      {!loading && course ? (
        <>
          <section className="course-authoring__hero">
            <div>
              <Text className="course-authoring__eyebrow">Author workspace</Text>
              <Title level={2}>{course.title}</Title>
              <CourseMetadata course={course} />
              <Paragraph>{course.description || "Add learner-facing content to this course perspective."}</Paragraph>
            </div>
            <Space wrap>
              <SemanticChip variant={course.status === "published" ? "sage" : "slate"}>
                {course.status}
              </SemanticChip>
              <SemanticChip variant="primary">Version {latestVersion?.version_number || 0}</SemanticChip>
              <SemanticChip variant={dirty ? "amber" : "sage"}>
                {dirty ? "Local draft saved" : "Server version saved"}
              </SemanticChip>
            </Space>
          </section>

          <Alert
            type="info"
            showIcon
            title="Every server save creates a new immutable version"
            description="Edits are autosaved locally until you create a version. Publishing always uses a specific reviewed version."
          />

          <Tabs
            items={[
              {
                key: "content",
                label: <span><EditOutlined /> Course content</span>,
                children: (
                  <>
                    <CourseContentEditor outline={outline} onChange={updateOutline} />
                    <div className="course-authoring__sticky-actions">
                      <Text type="secondary">
                        {dirty ? "Local draft is protected in this browser." : "No unsaved edits."}
                      </Text>
                      <Space wrap>
                        <Popconfirm
                          title="Discard this local draft?"
                          description="The latest immutable server version will be restored."
                          disabled={!dirty}
                          onConfirm={() => {
                            setOutline(clone(latestVersion?.outline));
                            setDirty(false);
                            window.localStorage.removeItem(draftKey);
                          }}
                        >
                          <Button disabled={!dirty}>Discard local draft</Button>
                        </Popconfirm>
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          disabled={!dirty}
                          onClick={() => {
                            saveForm.setFieldsValue({ change_summary: "Updated course notes and structure." });
                            setSaveOpen(true);
                          }}
                        >
                          Create new version
                        </Button>
                      </Space>
                    </div>
                  </>
                ),
              },
              {
                key: "revision",
                label: <span><SendOutlined /> AI revision</span>,
                children: (
                  <Card title="Revise through conversation">
                    <Paragraph type="secondary">
                      Supported local commands include adding a module, adding a note to a module,
                      and renaming the course. Applied changes become a new immutable version.
                    </Paragraph>
                    <Input.TextArea
                      aria-label="Course revision instruction"
                      value={revisionInstruction}
                      rows={4}
                      maxLength={10_000}
                      showCount
                      onChange={(event) => setRevisionInstruction(event.target.value)}
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      loading={busy === "revision"}
                      disabled={revisionInstruction.trim().length < 3}
                      onClick={requestRevision}
                    >
                      Request revision
                    </Button>
                    {revisionFeedback ? (
                      <Alert
                        type={revisionFeedback.applied_changes?.length ? "success" : "warning"}
                        showIcon
                        title={revisionFeedback.assistant_message}
                        description={(revisionFeedback.applied_changes || []).join(" · ")}
                      />
                    ) : null}
                  </Card>
                ),
              },
              {
                key: "publish",
                label: <span><RocketOutlined /> Publish & history</span>,
                children: (
                  <div className="course-authoring__publish-grid">
                    <Card title="Community publication">
                      <Paragraph>
                        Moderation checks structure, provenance, consent, canonical safety, and
                        learner-facing completeness.
                      </Paragraph>
                      <Button
                        type="primary"
                        icon={<RocketOutlined />}
                        disabled={dirty || reviews.some((item) => item.status === "pending")}
                        onClick={() => {
                          reviewForm.setFieldsValue({ submission_note: "" });
                          setReviewOpen(true);
                        }}
                      >
                        Submit current version for review
                      </Button>
                    </Card>
                    <Card title="Version history">
                      <Timeline
                        items={versions.map((version) => ({
                          color: version.id === course.current_version_id ? "green" : "gray",
                          children: (
                            <div>
                              <Text strong>Version {version.version_number}</Text>
                              <div><Text type="secondary">{version.change_summary || "No version note"}</Text></div>
                            </div>
                          ),
                        }))}
                      />
                    </Card>
                    <Card title="Moderation history">
                      {reviews.length ? (
                        <Timeline
                          items={reviews.map((review) => ({
                            color: review.status === "approved" ? "green" : review.status === "rejected" ? "red" : "blue",
                            children: (
                              <div>
                                <Space>
                                  <Text strong>{review.status}</Text>
                                  <Text type="secondary">Version snapshot</Text>
                                </Space>
                                <Paragraph type="secondary">
                                  {review.reviewer_note || review.submission_note || "Awaiting reviewer feedback."}
                                </Paragraph>
                              </div>
                            ),
                          }))}
                        />
                      ) : <Empty description="No publication submissions yet." />}
                    </Card>
                  </div>
                ),
              },
              {
                key: "canonical",
                label: <span><SafetyCertificateOutlined /> Canonical suggestions</span>,
                children: (
                  <Card
                    title="Canonical change suggestion queue"
                    extra={(
                      <Button icon={<PlusOutlined />} onClick={() => setSuggestionOpen(true)}>
                        Propose a change
                      </Button>
                    )}
                  >
                    <Alert
                      type="info"
                      showIcon
                      title="Suggestions never mutate canonical knowledge directly"
                      description="Admins review the proposal independently. Your course remains usable regardless of the decision."
                    />
                    {suggestions.length ? (
                      <Timeline
                        items={suggestions.map((item) => ({
                          color: item.status === "approved" ? "green" : item.status === "rejected" ? "red" : "blue",
                          children: (
                            <div>
                              <Text strong>{item.title}</Text>
                              <div><Text type="secondary">{item.suggestion_type} · {item.status}</Text></div>
                              <Paragraph>{item.rationale}</Paragraph>
                            </div>
                          ),
                        }))}
                      />
                    ) : <Empty description="No canonical change suggestions from this course." />}
                  </Card>
                ),
              },
            ]}
          />
        </>
      ) : null}

      <Modal
        open={saveOpen}
        title="Create an immutable course version"
        footer={null}
        onCancel={() => setSaveOpen(false)}
      >
        <Form form={saveForm} layout="vertical" onFinish={saveVersion}>
          <Form.Item
            label="What changed?"
            name="change_summary"
            rules={[{ required: true, whitespace: true }]}
          >
            <Input.TextArea rows={3} maxLength={5_000} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={busy === "save"} block>
            Create version {Number(latestVersion?.version_number || 0) + 1}
          </Button>
        </Form>
      </Modal>

      <Modal
        open={reviewOpen}
        title="Submit for community moderation"
        footer={null}
        onCancel={() => setReviewOpen(false)}
      >
        <Form form={reviewForm} layout="vertical" onFinish={submitReview}>
          <Form.Item
            label="Note for the reviewer"
            name="submission_note"
            extra="Optional. Explain the audience, evidence, or important authoring decisions."
          >
            <Input.TextArea rows={4} maxLength={5_000} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={busy === "review"} block>
            Submit current version
          </Button>
        </Form>
      </Modal>

      <Modal
        open={suggestionOpen}
        title="Suggest a canonical knowledge change"
        footer={null}
        onCancel={() => setSuggestionOpen(false)}
      >
        <Form
          form={suggestionForm}
          layout="vertical"
          requiredMark={false}
          initialValues={{ suggestion_type: "definition" }}
          onFinish={submitSuggestion}
        >
          <Form.Item
            label="Canonical concept"
            name="canonical_concept_id"
            rules={[{ required: true }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              options={conceptOptions}
              placeholder="Select a concept referenced by this course"
            />
          </Form.Item>
          <Form.Item label="Suggestion type" name="suggestion_type" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "definition", label: "Clarify definition" },
                { value: "relationship", label: "Change relationship" },
                { value: "merge", label: "Merge concepts" },
                { value: "other", label: "Other" },
              ]}
            />
          </Form.Item>
          <Form.Item label="Title" name="title" rules={[{ required: true, whitespace: true }]}>
            <Input maxLength={255} />
          </Form.Item>
          <Form.Item
            label="Rationale"
            name="rationale"
            rules={[{ required: true, min: 10 }]}
          >
            <Input.TextArea rows={3} maxLength={10_000} />
          </Form.Item>
          <Form.Item
            label="Proposed change"
            name="proposed_change"
            rules={[{ required: true, min: 3 }]}
          >
            <Input.TextArea rows={4} maxLength={20_000} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={busy === "suggestion"} block>
            Send to admin review
          </Button>
        </Form>
      </Modal>
    </AppPageShell>
  );
}
