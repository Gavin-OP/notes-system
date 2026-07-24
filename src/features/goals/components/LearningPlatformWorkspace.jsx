import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  App,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import {
  AimOutlined,
  ArrowRightOutlined,
  BookOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import SemanticChip from "../../../shared/ui/SemanticChip";
import {
  archiveGoal,
  createGoal,
  generateGoalCourseLearningPath,
  getPersonalLearningPath,
  listCourses,
  listGoals,
} from "../api/learningPlatform";
import { GOAL_TYPE_CONFIG, getGoalTypeConfig } from "../lib/goalMetadata";
import CourseMetadata from "./CourseMetadata";

import "../pages/GoalDiscoveryPage.css";

const { Paragraph, Text, Title } = Typography;

function uniqueById(items = []) {
  const seen = new Set();
  return items.filter((item) => {
    const id = String(item?.id || "");
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function normalizePath(payload) {
  const path = payload?.path || payload || {};
  const draft = payload?.draft || path?.draft || {};
  return {
    ...path,
    draft: {
      ...draft,
      nodes: Array.isArray(draft?.nodes) ? draft.nodes : [],
      edges: Array.isArray(draft?.edges) ? draft.edges : [],
    },
  };
}

function goalTypeOptions() {
  return GOAL_TYPE_CONFIG.map((item) => ({ value: item.type, label: item.label }));
}

function LearningPlatformWorkspace({
  mode = "builder",
  preferredGoalType = "",
  onOpenGoalDiscovery,
}) {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [goalForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [goals, setGoals] = useState([]);
  const [courses, setCourses] = useState([]);
  const [authoredCourseIds, setAuthoredCourseIds] = useState([]);
  const [learningPath, setLearningPath] = useState(normalizePath({}));
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalSaving, setGoalSaving] = useState(false);
  const [pathGenerating, setPathGenerating] = useState(false);

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setErrorText("");
    try {
      const [goalPayload, publicCourses, authoredCourses, pathPayload] = await Promise.all([
        listGoals(),
        listCourses(),
        listCourses({ mine: true }),
        getPersonalLearningPath().catch(() => ({})),
      ]);
      const nextGoals = Array.isArray(goalPayload) ? goalPayload : [];
      const nextCourses = uniqueById([
        ...(Array.isArray(authoredCourses) ? authoredCourses : []),
        ...(Array.isArray(publicCourses) ? publicCourses : []),
      ]);
      setGoals(nextGoals);
      setCourses(nextCourses);
      setAuthoredCourseIds((Array.isArray(authoredCourses) ? authoredCourses : []).map((item) => item.id));
      setLearningPath(normalizePath(pathPayload));
      setSelectedGoalId((current) => (
        nextGoals.some((item) => item.id === current)
          ? current
          : nextGoals.find((item) => item.status === "active")?.id || nextGoals[0]?.id || ""
      ));
      setSelectedCourseId((current) => (
        nextCourses.some((item) => item.id === current)
          ? current
          : nextCourses[0]?.id || ""
      ));
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not load goals and courses.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  useEffect(() => {
    if (!preferredGoalType) return;
    goalForm.setFieldValue("goal_type", preferredGoalType);
  }, [goalForm, preferredGoalType]);

  const selectedGoal = useMemo(
    () => goals.find((item) => item.id === selectedGoalId) || null,
    [goals, selectedGoalId],
  );
  const selectedCourse = useMemo(
    () => courses.find((item) => item.id === selectedCourseId) || null,
    [courses, selectedCourseId],
  );
  const activeGoals = useMemo(
    () => goals.filter((item) => item.status !== "archived"),
    [goals],
  );
  const authoredCourses = useMemo(
    () => courses.filter((item) => authoredCourseIds.includes(item.id)),
    [authoredCourseIds, courses],
  );
  const currentPathNodes = learningPath?.draft?.nodes || [];

  const openGoalModal = (goalType = "") => {
    goalForm.resetFields();
    goalForm.setFieldsValue({
      goal_type: goalType || preferredGoalType || "exploration",
      preferred_archetype: undefined,
      success_criteria: [],
    });
    setGoalModalOpen(true);
  };

  const handleCreateGoal = async (values) => {
    setGoalSaving(true);
    try {
      const created = await createGoal({
        title: values.title.trim(),
        goal_type: values.goal_type,
        description: values.description?.trim() || "",
        current_level: values.current_level?.trim() || "",
        desired_outcome: values.desired_outcome?.trim() || "",
        success_criteria: values.success_criteria || [],
        weekly_time_budget_minutes: values.weekly_time_budget_minutes ?? null,
        preferred_archetype: values.preferred_archetype || null,
      });
      setGoals((current) => [created, ...current]);
      setSelectedGoalId(created.id);
      setGoalModalOpen(false);
      message.success("Goal created.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not create the goal.");
    } finally {
      setGoalSaving(false);
    }
  };

  const handleArchiveGoal = async (goalId) => {
    try {
      await archiveGoal(goalId);
      setGoals((current) => current.filter((item) => item.id !== goalId));
      if (selectedGoalId === goalId) setSelectedGoalId("");
      message.success("Goal archived.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not archive the goal.");
    }
  };

  const handleGeneratePath = async () => {
    if (!selectedGoal || !selectedCourse) return;
    setPathGenerating(true);
    try {
      const response = await generateGoalCourseLearningPath({
        goal_type: selectedGoal.goal_type,
        goal_id: selectedGoal.id,
        goal_title: selectedGoal.title,
        goal_ref_id: selectedGoal.id,
        selected_course_ids: [selectedCourse.id],
        selected_course_version_ids: selectedCourse.current_version_id
          ? [selectedCourse.current_version_id]
          : [],
        subject_slugs: [selectedCourse.domain_slug],
        max_nodes: 48,
        save_as_draft: true,
        commit: true,
      });
      setLearningPath(normalizePath(response));
      message.success("Learning path generated from your goal and selected course.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not generate the learning path.");
    } finally {
      setPathGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="goal-workspace__state">
        <Spin size="large" aria-label="Loading your learning workspace" />
        <Text type="secondary">Loading your learning workspace...</Text>
      </div>
    );
  }

  if (errorText) {
    return (
      <Alert
        type="error"
        showIcon
        title="Learning workspace unavailable"
        description={errorText}
        action={<Button icon={<ReloadOutlined />} onClick={loadWorkspace}>Retry</Button>}
      />
    );
  }

  const goalList = (
    <div className="goal-workspace__list" role="list" aria-label="Your learning goals">
      {activeGoals.length ? activeGoals.map((goal) => {
        const config = getGoalTypeConfig(goal.goal_type);
        const selected = goal.id === selectedGoalId;
        return (
          <div key={goal.id} className={`goal-workspace__selection-card ${selected ? "is-selected" : ""}`}>
            <button
              type="button"
              className="goal-workspace__selection-main"
              aria-pressed={selected}
              onClick={() => setSelectedGoalId(goal.id)}
            >
              <span className="goal-workspace__selection-copy">
                <span className="goal-workspace__selection-title">{goal.title}</span>
                <span className="goal-workspace__selection-description">
                  {goal.desired_outcome || goal.description || config.description}
                </span>
              </span>
              <SemanticChip variant={config.variant}>{config.label}</SemanticChip>
            </button>
            <Popconfirm
              title="Archive this goal?"
              description="It will leave your active workspace but remain in your history."
              okText="Archive"
              onConfirm={() => handleArchiveGoal(goal.id)}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label={`Archive ${goal.title}`}
              />
            </Popconfirm>
          </div>
        );
      }) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Create a goal to describe the outcome you want from learning."
        >
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openGoalModal()}>
            Create your first goal
          </Button>
        </Empty>
      )}
    </div>
  );

  const courseList = (
    <div className="goal-workspace__course-grid" role="list" aria-label="Courses">
      {courses.length ? courses.map((course) => {
        const selected = course.id === selectedCourseId;
        return (
          <button
            type="button"
            key={course.id}
            className={`goal-workspace__course-card ${selected ? "is-selected" : ""}`}
            aria-pressed={selected}
            onClick={() => setSelectedCourseId(course.id)}
          >
            <span className="goal-workspace__course-title-row">
              <span className="goal-workspace__course-title">{course.title}</span>
              <SemanticChip variant={course.status === "published" ? "sage" : "slate"}>
                {course.status}
              </SemanticChip>
            </span>
            <CourseMetadata course={course} goal={selected ? selectedGoal : null} compact />
            <span className="goal-workspace__course-description">
              {course.description || course.target_learner || "A structured course over canonical knowledge."}
            </span>
          </button>
        );
      }) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No course versions are available yet. Course Studio will let authors create them."
        />
      )}
    </div>
  );

  if (mode === "overview") {
    return (
      <div className="goal-workspace goal-workspace--overview">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card className="goal-workspace__summary-card">
              <AimOutlined />
              <strong>{activeGoals.length}</strong>
              <span>Active goals</span>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="goal-workspace__summary-card">
              <BookOutlined />
              <strong>{courses.length}</strong>
              <span>Available courses</span>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="goal-workspace__summary-card">
              <ArrowRightOutlined />
              <strong>{currentPathNodes.length}</strong>
              <span>Path steps</span>
            </Card>
          </Col>
        </Row>
        <Card
          title="Current direction"
          extra={<Button type="link" onClick={onOpenGoalDiscovery}>Open Goal Discovery</Button>}
        >
          {selectedGoal || selectedCourse ? (
            <Space orientation="vertical" size={10}>
              <Title level={4}>{selectedGoal?.title || "Choose a learning goal"}</Title>
              {selectedCourse ? <CourseMetadata course={selectedCourse} goal={selectedGoal} /> : null}
              <Paragraph type="secondary">
                {currentPathNodes[0]?.title
                  ? `Next step: ${currentPathNodes.find((node) => node.status === "active")?.title || currentPathNodes[0].title}`
                  : "Choose a goal and course to generate a personal learning path."}
              </Paragraph>
            </Space>
          ) : (
            <Empty description="No active learning direction yet." />
          )}
        </Card>
      </div>
    );
  }

  if (mode === "goals") {
    return (
      <div className="goal-workspace">
        <div className="goal-workspace__section-head">
          <div>
            <Title level={4}>My Goals</Title>
            <Paragraph type="secondary">Outcomes you want your learning to support.</Paragraph>
          </div>
          <Space wrap>
            <Button onClick={onOpenGoalDiscovery}>Explore goal types</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openGoalModal()}>
              New goal
            </Button>
          </Space>
        </div>
        {goalList}
        <GoalModal
          open={goalModalOpen}
          form={goalForm}
          saving={goalSaving}
          onCancel={() => setGoalModalOpen(false)}
          onSubmit={handleCreateGoal}
        />
      </div>
    );
  }

  if (mode === "courses") {
    return (
      <div className="goal-workspace">
        <div className="goal-workspace__section-head">
          <div>
            <Title level={4}>My Courses</Title>
            <Paragraph type="secondary">
              Courses keep their own outline while sharing admin-managed canonical concepts.
            </Paragraph>
          </div>
          <Space wrap>
            <Button onClick={onOpenGoalDiscovery}>Match a course to a goal</Button>
            <Button onClick={() => navigate("/courses/community")}>Explore Course Community</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/course-studio")}>
              Open Course Studio
            </Button>
          </Space>
        </div>
        {authoredCourses.length ? (
          <div className="goal-workspace__course-grid" role="list" aria-label="Authored courses">
            {authoredCourses.map((course) => (
              <div key={course.id} className="goal-workspace__course-card goal-workspace__course-card--managed">
                <span className="goal-workspace__course-title-row">
                  <span className="goal-workspace__course-title">{course.title}</span>
                  <SemanticChip variant={course.status === "published" ? "sage" : "slate"}>
                    {course.status}
                  </SemanticChip>
                </span>
                <CourseMetadata course={course} compact />
                <span className="goal-workspace__course-description">
                  {course.description || course.target_learner || "A structured course over canonical knowledge."}
                </span>
                <Space wrap className="goal-workspace__managed-actions">
                  <Button onClick={() => navigate(`/course-authoring/${course.id}`)}>Author course</Button>
                  {course.status === "published" ? (
                    <Button type="link" onClick={() => navigate(`/courses/community/${course.id}`)}>
                      View public course
                    </Button>
                  ) : null}
                </Space>
              </div>
            ))}
          </div>
        ) : null}
        {authoredCourses.length === 0 ? (
          <Alert
            type="info"
            showIcon
            title="Build your first course proposal"
            description="Upload your notes in Course Studio to receive a private outline and canonical concept mapping."
            action={<Button type="link" onClick={() => navigate("/course-studio")}>Start in Course Studio</Button>}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div className="goal-workspace goal-workspace--builder">
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={10}>
          <Card
            title="1. Choose a goal"
            extra={<Button type="link" icon={<PlusOutlined />} onClick={() => openGoalModal(preferredGoalType)}>New goal</Button>}
            className="goal-workspace__builder-card"
          >
            {goalList}
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="2. Choose an author’s course" className="goal-workspace__builder-card">
            {courseList}
          </Card>
        </Col>
        <Col xs={24}>
          <Card className="goal-workspace__path-card">
            <div className="goal-workspace__path-head">
              <div>
                <Text className="goal-workspace__eyebrow">Goal + Course</Text>
                <Title level={3}>3. Generate your learning path</Title>
                <Paragraph type="secondary">
                  The course provides the structure. Your goal sets the destination. Canonical prerequisites remain guardrails.
                </Paragraph>
              </div>
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                loading={pathGenerating}
                disabled={!selectedGoal || !selectedCourse || !selectedCourse.current_version_id}
                onClick={handleGeneratePath}
              >
                Generate path
              </Button>
            </div>
            {selectedCourse && !selectedCourse.current_version_id ? (
              <Alert
                type="warning"
                showIcon
                title="This course does not have a version yet"
                description="A course version with a structured outline is required before it can drive a learning path."
              />
            ) : null}
            {selectedGoal || selectedCourse ? (
              <div className="goal-workspace__selected-context">
                {selectedCourse ? <CourseMetadata course={selectedCourse} goal={selectedGoal} /> : null}
              </div>
            ) : null}
            <LearningPathPreview path={learningPath} navigate={navigate} />
          </Card>
        </Col>
      </Row>
      <GoalModal
        open={goalModalOpen}
        form={goalForm}
        saving={goalSaving}
        onCancel={() => setGoalModalOpen(false)}
        onSubmit={handleCreateGoal}
      />
    </div>
  );
}

function GoalModal({ open, form, saving, onCancel, onSubmit }) {
  return (
    <Modal
      title="Create a learning goal"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      forceRender
      width={680}
    >
      <Form form={form} layout="vertical" requiredMark={false} onFinish={onSubmit}>
        <Form.Item
          label="Goal title"
          name="title"
          rules={[{ required: true, whitespace: true, message: "Describe the outcome you want to reach." }]}
          extra="Use a concrete outcome, such as “Join an amateur band.”"
        >
          <Input maxLength={255} disabled={saving} />
        </Form.Item>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Goal type" name="goal_type" rules={[{ required: true }]}>
              <Select options={goalTypeOptions()} disabled={saving} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Preferred learning style" name="preferred_archetype">
              <Select
                allowClear
                disabled={saving}
                options={[
                  { value: "conceptual", label: "Conceptual" },
                  { value: "practice_based", label: "Practice-based" },
                  { value: "creative", label: "Creative" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Desired outcome" name="desired_outcome">
          <Input.TextArea rows={3} maxLength={10000} disabled={saving} />
        </Form.Item>
        <Form.Item
          label="Success criteria"
          name="success_criteria"
          extra="Add observable milestones that tell you the goal has been reached."
        >
          <Select mode="tags" tokenSeparators={[","]} disabled={saving} />
        </Form.Item>
        <Row gutter={16}>
          <Col xs={24} md={14}>
            <Form.Item label="Current level" name="current_level">
              <Input maxLength={255} disabled={saving} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10}>
            <Form.Item label="Minutes per week" name="weekly_time_budget_minutes">
              <InputNumber min={0} max={10080} step={30} className="goal-workspace__number-input" disabled={saving} />
            </Form.Item>
          </Col>
        </Row>
        <div className="goal-workspace__modal-actions">
          <Button onClick={onCancel} disabled={saving}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={saving}>Create goal</Button>
        </div>
      </Form>
    </Modal>
  );
}

function LearningPathPreview({ path, navigate }) {
  const draft = path?.draft || {};
  const nodes = Array.isArray(draft.nodes) ? draft.nodes : [];
  if (!nodes.length) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Your generated path will appear here as an ordered set of course steps."
      />
    );
  }
  return (
    <ol className="goal-workspace__path-list">
      {nodes.map((node, index) => (
        <li key={node.node_id || `${node.title}-${index}`} className={`goal-workspace__path-step is-${node.status || "planned"}`}>
          <span className="goal-workspace__path-index">{index + 1}</span>
          <span className="goal-workspace__path-copy">
            <strong>{node.title}</strong>
            <small>
              {node.metadata?.module_title || node.metadata?.course_title || node.subject || "Course step"}
            </small>
          </span>
          <SemanticChip variant={node.status === "completed" ? "sage" : node.status === "active" ? "primary" : "slate"}>
            {node.status || "planned"}
          </SemanticChip>
          {node.note_url ? (
            <Button type="link" onClick={() => navigate(node.note_url)}>Open</Button>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export default LearningPlatformWorkspace;
