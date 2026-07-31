import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Typography,
} from "antd";
import {
  AimOutlined,
  AppstoreOutlined,
  ArrowRightOutlined,
  BookOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  RocketOutlined,
} from "@ant-design/icons";

import SemanticChip from "../../../shared/ui/SemanticChip";
import {
  deleteGoal,
  deletePersonalLearningPath,
  createGoal,
  generateGoalCourseLearningPath,
  getPersonalLearningPath,
  listPersonalLearningPaths,
  listCourses,
  listGoals,
} from "../api/learningPlatform";
import { GOAL_TYPE_CONFIG, getGoalTypeConfig } from "../lib/goalMetadata";
import CourseMetadata from "./CourseMetadata";
import { listCourseStudioDomains } from "../../courseStudio/api/courseStudio";
import { listAnalysisRuns } from "../../courseStudio/api/courseStudio";

import "../pages/GoalDiscoveryPage.css";

const { Paragraph, Text, Title } = Typography;

const GOAL_ICONS = {
  career: RocketOutlined,
  interest: AimOutlined,
};

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

function learningSetDisplayName(draft = {}) {
  const savedName = String(draft.learning_set_name || draft.goal_title || "").trim();
  if (savedName && savedName.toLowerCase() !== "learning set") return savedName;
  const subjectTitle = draft.nodes?.find((node) => node?.metadata?.subject_title)?.metadata?.subject_title;
  if (subjectTitle) return `${subjectTitle} Learning Set`;
  const firstTitle = draft.nodes?.find((node) => node?.title)?.title;
  return firstTitle ? `${firstTitle} Path` : "Untitled path";
}

function goalTypeOptions() {
  return GOAL_TYPE_CONFIG.map((item) => ({ value: item.type, label: item.label }));
}

function LearningPlatformWorkspace({
  mode = "builder",
  preferredGoalType = "",
  preferredDomain = "",
  onOpenGoalDiscovery,
  onGoalTypeChange,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const [goalForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [goals, setGoals] = useState([]);
  const [courses, setCourses] = useState([]);
  const [domains, setDomains] = useState([]);
  const [authoredCourseIds, setAuthoredCourseIds] = useState([]);
  const [courseStudioDrafts, setCourseStudioDrafts] = useState([]);
  const [learningPath, setLearningPath] = useState(normalizePath({}));
  const [learningSets, setLearningSets] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalSaving, setGoalSaving] = useState(false);
  const [pathGenerating, setPathGenerating] = useState(false);
  const [discoveryType, setDiscoveryType] = useState(preferredGoalType);
  const [selectedDiscoveryDomain, setSelectedDiscoveryDomain] = useState("");
  const [discoveryStep, setDiscoveryStep] = useState(0);
  const [discoverySaving, setDiscoverySaving] = useState(false);
  const [setNamingOpen, setSetNamingOpen] = useState(false);
  const [setName, setSetName] = useState("");
  const [setNote, setSetNote] = useState("");

  useEffect(() => {
    if (preferredDomain) setSelectedDiscoveryDomain(preferredDomain);
  }, [preferredDomain]);

  const loadWorkspace = useCallback(async () => {
    setLoading(true);
    setErrorText("");
    try {
      const [goalPayload, publicCourses, authoredCourses, pathPayload, pathListPayload, domainPayload, studioRuns] = await Promise.all([
        listGoals(),
        listCourses(),
        listCourses({ mine: true }),
        getPersonalLearningPath().catch(() => ({})),
        listPersonalLearningPaths().catch(() => []),
        listCourseStudioDomains(),
        listAnalysisRuns().catch(() => []),
      ]);
      const nextGoals = Array.isArray(goalPayload) ? goalPayload : [];
      const nextCourses = uniqueById([
        ...(Array.isArray(authoredCourses) ? authoredCourses : []),
        ...(Array.isArray(publicCourses) ? publicCourses : []),
      ]);
      setGoals(nextGoals);
      setCourses(nextCourses);
      setDomains(Array.isArray(domainPayload) ? domainPayload : []);
      setAuthoredCourseIds((Array.isArray(authoredCourses) ? authoredCourses : []).map((item) => item.id));
      setCourseStudioDrafts((Array.isArray(studioRuns) ? studioRuns : []).filter((run) => run.outline_proposal?.status !== "finalized"));
      setLearningPath(normalizePath(pathPayload));
      setLearningSets((Array.isArray(pathListPayload) ? pathListPayload : []).map(normalizePath));
      setSelectedGoalId((current) => (
        nextGoals.some((item) => item.id === new URLSearchParams(location.search).get("resumeGoal"))
          ? new URLSearchParams(location.search).get("resumeGoal")
          : nextGoals.some((item) => item.id === current)
          ? current
          : nextGoals.find((item) => item.status === "active")?.id || nextGoals[0]?.id || ""
      ));
      setSelectedCourseId((current) => (
        nextCourses.some((item) => item.id === current)
          ? current
          : nextCourses[0]?.id || ""
      ));
      if (new URLSearchParams(location.search).get("resumeGoal")) setDiscoveryStep(2);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not load goals and courses.");
    } finally {
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    loadWorkspace();
  }, [loadWorkspace]);

  useEffect(() => {
    if (!preferredGoalType) return;
    goalForm.setFieldValue("goal_type", preferredGoalType);
    setDiscoveryType(preferredGoalType);
  }, [goalForm, preferredGoalType]);

  const selectDiscoveryType = (goalType) => {
    setDiscoveryType(goalType);
    setSelectedDiscoveryDomain("");
    setDiscoveryStep(goalType ? 1 : 0);
    onGoalTypeChange?.(goalType);
  };

  const discoveryDomain = useMemo(
    () => domains.find((domain) => domain.slug === selectedDiscoveryDomain) || null,
    [domains, selectedDiscoveryDomain],
  );

  const selectedGoal = useMemo(
    () => goals.find((item) => item.id === selectedGoalId) || null,
    [goals, selectedGoalId],
  );
  const activeGoals = useMemo(
    () => goals.filter((item) => item.status !== "archived"),
    [goals],
  );
  const authoredCourses = useMemo(
    () => courses.filter((item) => authoredCourseIds.includes(item.id)),
    [authoredCourseIds, courses],
  );
  const recommendedCourses = useMemo(() => {
    if (!selectedGoal) return [];
    const domainSlug = selectedGoal.metadata?.domain_slug || selectedGoal.metadata?.domainSlug || "";
    if (!domainSlug) return [];
    const domain = domains.find((item) => item.slug === domainSlug);
    const official = domain ? {
      id: `official:${domain.slug}`,
      slug: `${domain.slug}-foundations`,
      title: domain.title,
      domain_slug: domain.slug,
      domain_title: domain.title,
      primary_archetype: domain.primary_archetype,
      secondary_archetypes: domain.secondary_archetypes || [],
      current_version_id: `canonical:${domain.slug}`,
      is_official: true,
      status: "published",
    } : null;
    return official ? [official] : [];
  }, [domains, selectedGoal]);
  const selectedCourse = useMemo(
    () => recommendedCourses.find((item) => item.id === selectedCourseId) || null,
    [recommendedCourses, selectedCourseId],
  );

  useEffect(() => {
    if (selectedGoal?.goal_type !== "interest") return;
    const officialPackage = recommendedCourses[0];
    if (!officialPackage?.is_official) return;
    setSelectedCourseId((current) => current === officialPackage.id ? current : officialPackage.id);
  }, [recommendedCourses, selectedGoal?.goal_type]);

  const currentPathNodes = learningPath?.draft?.nodes || [];

  const openGoalModal = (goalType = "") => {
    goalForm.resetFields();
    goalForm.setFieldsValue({
      goal_type: goalType || preferredGoalType || "interest",
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
      setSelectedCourseId(`official:${discoveryDomain.slug}`);
      setGoalModalOpen(false);
      message.success("Goal created.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not create the goal.");
    } finally {
      setGoalSaving(false);
    }
  };

  const handleCreateDiscoveryGoal = async () => {
    if (!discoveryDomain || discoveryType !== "interest") return;
    setDiscoverySaving(true);
    try {
      const created = await createGoal({
        title: `Explore ${discoveryDomain.title}`,
        goal_type: discoveryType,
        description: `Develop a structured understanding of ${discoveryDomain.title}.`,
        desired_outcome: `Explore the core concepts and learning paths available in ${discoveryDomain.title}.`,
        success_criteria: [`Complete an introductory course in ${discoveryDomain.title}`],
        preferred_archetype: "conceptual",
        metadata: {
          source: "goal_discovery",
          domain_slug: discoveryDomain.slug,
          domain_title: discoveryDomain.title,
        },
      });
      setGoals((current) => [created, ...current]);
      setSelectedGoalId(created.id);
      setSelectedCourseId(`official:${discoveryDomain.slug}`);
      setSelectedDiscoveryDomain("");
      setDiscoveryStep(2);
      message.success("Interest goal created.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not create this goal.");
    } finally {
      setDiscoverySaving(false);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      setGoals((current) => current.filter((item) => item.id !== goalId));
      if (selectedGoalId === goalId) setSelectedGoalId("");
      message.success("Goal deleted.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not delete the goal.");
    }
  };

  const handleDeleteLearningSet = async (pathId) => {
    try {
      await deletePersonalLearningPath(pathId);
      setLearningSets((current) => current.filter((item) => item?.draft?.path_id !== pathId));
      message.success("Learning set deleted.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not delete the learning set.");
    }
  };

  const handleGeneratePath = async (naming = {}) => {
    if (!selectedGoal || !selectedCourse) return;
    const learningSetName = typeof naming?.learningSetName === "string" ? naming.learningSetName : "";
    const learningSetNote = typeof naming?.learningSetNote === "string" ? naming.learningSetNote : "";
    setPathGenerating(true);
    try {
      const response = await generateGoalCourseLearningPath({
        path_id: `goal:${selectedGoal.id}`,
        goal_type: selectedGoal.goal_type,
        goal_id: selectedGoal.id,
        goal_title: selectedGoal.title,
        learning_set_name: learningSetName.trim() || selectedCourse.title,
        learning_set_note: learningSetNote.trim(),
        goal_ref_id: selectedGoal.id,
        selected_course_ids: selectedCourse.is_official ? [] : [selectedCourse.id],
        selected_course_version_ids: !selectedCourse.is_official && selectedCourse.current_version_id
          ? [selectedCourse.current_version_id]
          : [],
        subject_slugs: [selectedCourse.domain_slug],
        max_nodes: 48,
        save_as_draft: true,
        commit: true,
      });
      setLearningPath(normalizePath(response));
      setLearningSets((current) => [
        normalizePath(response),
        ...current.filter((item) => item?.draft?.path_id !== response?.draft?.path_id),
      ]);
      message.success("Learning path generated from your goal and selected course.");
      setSetNamingOpen(false);
      setSetName("");
      setSetNote("");
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
              onClick={() => {
                setSelectedGoalId(goal.id);
                const domainSlug = goal.metadata?.domain_slug || goal.metadata?.domainSlug || "";
                setSelectedCourseId(domainSlug ? `official:${domainSlug}` : "");
                setDiscoveryStep(2);
              }}
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
              title="Delete this goal?"
              description="This cannot be undone."
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={() => handleDeleteGoal(goal.id)}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                aria-label={`Delete ${goal.title}`}
              />
            </Popconfirm>
          </div>
        );
      }) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Choose Career or Interest below to create your first goal."
        />
      )}
    </div>
  );

  const courseList = (
    <div className="goal-workspace__course-grid" role="list" aria-label="Courses">
      {recommendedCourses.length ? recommendedCourses.map((course) => {
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
              <SemanticChip variant={course.is_official ? "primary" : authoredCourseIds.includes(course.id) && course.status !== "published" ? "slate" : "sage"}>
                {course.is_official ? "Official" : authoredCourseIds.includes(course.id) && course.status !== "published" ? "Private course" : "Community course"}
              </SemanticChip>
            </span>
            <CourseMetadata course={course} compact />
          </button>
        );
      }) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No complete course package is available for this goal yet."
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
      <>
      <div className="goal-workspace">
        <div className="goal-workspace__section-head goal-workspace__section-head--saved">
          <Title level={4}>My Goals</Title>
        </div>
        {goalList}
        <div className="goal-workspace__section-head">
          <Title level={4}>Goal Discovery</Title>
        </div>
        <div className="goal-workspace__discovery-progress" aria-label="Goal setup progress">
          {["Goal", "Direction", "Course package"].map((label, index) => (
            <span key={label} className={discoveryStep >= index ? "is-active" : ""}>
              <b>{index + 1}</b>{label}
            </span>
          ))}
        </div>
        <div className="goal-workspace__goal-types" role="group" aria-label="Goal types">
          {GOAL_TYPE_CONFIG.map((item) => {
            const Icon = GOAL_ICONS[item.type] || AimOutlined;
            const selected = discoveryType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                aria-pressed={selected}
                className={`goal-workspace__goal-type ${selected ? "is-selected" : ""}`}
                onClick={() => selectDiscoveryType(selected ? "" : item.type)}
              >
                <span className="goal-workspace__goal-type-icon" aria-hidden="true"><Icon /></span>
                <span>
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              </button>
            );
          })}
        </div>
        {discoveryType === "interest" ? (
          <div className="goal-workspace__interest-workspace">
            <Card type="inner" title="My Interest" className="goal-workspace__profile-section">
              <div className="goal-workspace__discovery-fields">
                <label>
                  <span>Knowledge Domain</span>
                  <Select
                    showSearch
                    optionFilterProp="label"
                    size="large"
                    value={selectedDiscoveryDomain || undefined}
                    placeholder="Choose a knowledge domain"
                    options={domains.map((domain) => ({ value: domain.slug, label: domain.title }))}
                    onChange={setSelectedDiscoveryDomain}
                  />
                </label>
              </div>
              <div className="goal-workspace__discovery-actions">
                <Button type="primary" loading={discoverySaving} disabled={!discoveryDomain} onClick={handleCreateDiscoveryGoal}>
                  Find course package
                </Button>
              </div>
            </Card>
            {discoveryStep >= 2 && selectedGoal ? (
              <Card type="inner" title="Interest Matches" className="goal-workspace__profile-section">
                  {selectedCourse ? (
                    <div className="goal-workspace__package-detail">
                      <div>
                        <Text className="goal-workspace__eyebrow">Official Course Package</Text>
                        <Title level={4}>{selectedCourse.title}</Title>
                        <CourseMetadata course={selectedCourse} compact />
                      </div>
                      <Button type="primary" size="large" onClick={() => navigate(`/course-packages/official/${selectedCourse.domain_slug}`)}>
                        Review course package
                      </Button>
                    </div>
                  ) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No official course package is available for this interest yet." />}
              </Card>
            ) : null}
          </div>
        ) : null}
      </div>
      <SetNamingModal
        open={setNamingOpen}
        name={setName}
        note={setNote}
        saving={pathGenerating}
        onNameChange={setSetName}
        onNoteChange={setSetNote}
        onCancel={() => setSetNamingOpen(false)}
        onSave={() => handleGeneratePath({ learningSetName: setName, learningSetNote: setNote })}
      />
      </>
    );
  }

  if (mode === "learning") {
    return (
      <div className="goal-workspace">
        <div className="goal-workspace__section-head">
          <Title level={4}>Current Learning Set</Title>
          <Button icon={<AppstoreOutlined />} onClick={() => navigate("/courses/community")}>Course Community</Button>
        </div>
        {learningSets.length ? (
          <div className="goal-workspace__learning-sets">
            {learningSets.map((set, index) => {
              const draft = set.draft || {};
              const active = draft.nodes?.find((node) => node.status === "active") || draft.nodes?.[0];
              const completed = (draft.nodes || []).filter((node) => node.status === "completed").length;
              const percent = draft.nodes?.length ? Math.round((completed / draft.nodes.length) * 100) : 0;
              return (
                <div key={draft.path_id} className="goal-workspace__learning-set-entry">
                {index === 1 ? <Title level={5}>Other Learning Sets</Title> : null}
                <Card
                  className={`goal-workspace__learning-set ${index === 0 ? "goal-workspace__learning-set--current" : ""}`}
                >
                  <div>
                    <Text strong>{learningSetDisplayName(draft)}</Text>
                    {draft.learning_set_note ? <Text type="secondary">{draft.learning_set_note}</Text> : null}
                    <Text type="secondary">{completed} of {draft.nodes?.length || 0} steps complete</Text>
                    <Progress percent={percent} size="small" showInfo={false} />
                  </div>
                  <Space wrap className="goal-workspace__learning-set-actions">
                    <Popconfirm
                      title="Delete this learning set?"
                      description="Its saved path and progress view will be removed."
                      okText="Delete"
                      okButtonProps={{ danger: true }}
                      onConfirm={() => handleDeleteLearningSet(draft.path_id)}
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} aria-label={`Delete ${learningSetDisplayName(draft)}`} />
                    </Popconfirm>
                    <Button
                      type={index === 0 ? "primary" : "default"}
                      disabled={!active?.note_url}
                      onClick={() => active?.note_url && navigate(active.note_url, { state: { learningPathId: draft.path_id } })}
                    >
                      {index === 0 ? "Continue learning" : "Open"}
                    </Button>
                  </Space>
                </Card>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty
            description={activeGoals.length ? "Choose a course for this goal." : "Choose what you want to achieve."}
          >
            <Button
              type="primary"
              onClick={() => {
                if (activeGoals[0]?.id) {
                  navigate(`/user/profile?section=goals&resumeGoal=${encodeURIComponent(activeGoals[0].id)}`);
                } else {
                  onOpenGoalDiscovery?.();
                }
              }}
            >
              Open Goal Discovery
            </Button>
          </Empty>
        )}
      </div>
    );
  }

  if (mode === "courses") {
    return (
      <div className="goal-workspace">
        <div className="goal-workspace__section-head">
          <Title level={4}>My Courses</Title>
          <Space wrap>
            <Button icon={<AppstoreOutlined />} onClick={() => navigate("/courses/community")}>
              Explore Course Community
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate("/course-studio")}>
              Create or import a course
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
                    {course.status === "published" ? "Community course" : "Private course"}
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
        {courseStudioDrafts.length ? (
          <div className="goal-workspace__learning-sets">
            {courseStudioDrafts.slice(0, 3).map((run) => (
              <Card key={run.id} className="goal-workspace__learning-set">
                <div>
                  <Text strong>{run.outline_proposal?.proposed_title || "Course setup"}</Text>
                  <Text type="secondary">Review · saved draft</Text>
                </div>
                <Button onClick={() => navigate(`/course-studio?run=${encodeURIComponent(run.id)}`)}>
                  Continue setup
                </Button>
              </Card>
            ))}
          </div>
        ) : null}
        {authoredCourses.length === 0 && courseStudioDrafts.length === 0 ? (
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
                onClick={() => {
                  setSetName(selectedCourse?.title || selectedGoal?.title || "Learning set");
                  setSetNote("");
                  setSetNamingOpen(true);
                }}
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
      <SetNamingModal
        open={setNamingOpen}
        name={setName}
        note={setNote}
        saving={pathGenerating}
        onNameChange={setSetName}
        onNoteChange={setSetNote}
        onCancel={() => setSetNamingOpen(false)}
        onSave={() => handleGeneratePath({ learningSetName: setName, learningSetNote: setNote })}
      />
    </div>
  );
}

function SetNamingModal({ open, name, note, saving, onNameChange, onNoteChange, onCancel, onSave }) {
  return (
    <Modal
      title="Save learning set"
      open={open}
      onCancel={onCancel}
      okText="Save set"
      confirmLoading={saving}
      okButtonProps={{ disabled: !name.trim() }}
      onOk={onSave}
      destroyOnHidden
    >
      <Space direction="vertical" size={16} className="goal-workspace__naming-fields">
        <label>
          <Text strong>Name</Text>
          <Input value={name} maxLength={255} onChange={(event) => onNameChange(event.target.value)} />
        </label>
        <label>
          <Text strong>Note <Text type="secondary">(optional)</Text></Text>
          <Input.TextArea value={note} maxLength={1000} rows={3} onChange={(event) => onNoteChange(event.target.value)} />
        </label>
      </Space>
    </Modal>
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
