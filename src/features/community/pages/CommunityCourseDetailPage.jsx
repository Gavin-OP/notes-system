import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Collapse,
  Descriptions,
  Form,
  Input,
  Modal,
  Progress,
  Skeleton,
  Space,
  Statistic,
  Typography,
} from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  EditOutlined,
  ForkOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import CourseMetadata from "../../goals/components/CourseMetadata";
import SemanticChip from "../../../shared/ui/SemanticChip";
import {
  forkCourse,
  getAuthorProfile,
  getCommunityCourse,
  updateCourseLibrary,
} from "../../goals/api/learningPlatform";

import "./CourseCommunityPage.css";

const { Paragraph, Text, Title } = Typography;

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 170) || "community-course";
}

export default function CommunityCourseDetailPage() {
  const { courseId = "" } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [forkForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState("");
  const [errorText, setErrorText] = useState("");
  const [data, setData] = useState(null);
  const [forkOpen, setForkOpen] = useState(false);
  const [author, setAuthor] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorText("");
    try {
      setData(await getCommunityCourse(courseId));
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not load this course.");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateLibrary = async (action, enabled) => {
    setActing(action);
    try {
      const viewer = await updateCourseLibrary(courseId, action, enabled);
      setData((current) => ({
        ...current,
        viewer,
        save_count: Math.max(
          0,
          current.save_count + Number(viewer.saved) - Number(current.viewer.saved),
        ),
        install_count: Math.max(
          0,
          current.install_count + Number(viewer.installed) - Number(current.viewer.installed),
        ),
      }));
      message.success(action === "install" ? "Library installation updated." : "Saved-course status updated.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not update your library.");
    } finally {
      setActing("");
    }
  };

  const openAuthor = async () => {
    try {
      setAuthor(await getAuthorProfile(data.author.owner_user_id));
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not load the author profile.");
    }
  };

  const submitFork = async (values) => {
    setActing("fork");
    try {
      const response = await forkCourse(courseId, values);
      setForkOpen(false);
      message.success("Private course fork created.");
      navigate(`/course-authoring/${response.course.id}`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not fork this course.");
    } finally {
      setActing("");
    }
  };

  const course = data?.course;
  const version = data?.current_version;

  return (
    <AppPageShell
      title={course?.title || "Community Course"}
      subtitle="A moderated, versioned author perspective."
      backLabel="Back to Course Community"
      onBack={() => navigate("/courses/community")}
      showSiteFooter
      contentWidth="wide"
      contentClassName="community-course-detail"
    >
      {errorText ? <Alert type="error" showIcon title="Course unavailable" description={errorText} /> : null}
      {loading ? <Card><Skeleton active paragraph={{ rows: 12 }} /></Card> : null}
      {!loading && data ? (
        <>
          <section className="community-course-detail__hero">
            <div>
              <Space wrap>
                <SemanticChip variant="sage">Moderated · {data.quality.review_status}</SemanticChip>
                <SemanticChip variant="slate">Version {version.version_number}</SemanticChip>
              </Space>
              <Title level={1}>{course.title}</Title>
              <CourseMetadata course={course} />
              <Paragraph>{course.description || course.target_learner}</Paragraph>
              <Button type="link" icon={<UserOutlined />} onClick={openAuthor}>
                By {data.author.display_name} · @{data.author.handle}
              </Button>
            </div>
            <div className="community-course-detail__quality">
              <Progress type="circle" percent={data.quality.score} size={120} />
              <Text strong>Community quality</Text>
              <Text type="secondary">Completeness, mapping, provenance, and moderation</Text>
            </div>
          </section>

          <div className="community-course-detail__actions">
            <Button
              icon={<HeartOutlined />}
              loading={acting === "save"}
              onClick={() => updateLibrary("save", !data.viewer.saved)}
            >
              {data.viewer.saved ? "Remove saved" : "Save"}
            </Button>
            <Button
              type="primary"
              icon={<BookOutlined />}
              loading={acting === "install"}
              onClick={() => updateLibrary("install", !data.viewer.installed)}
            >
              {data.viewer.installed ? "Uninstall" : "Install course"}
            </Button>
            {data.viewer.can_fork ? (
              <Button
                icon={<ForkOutlined />}
                onClick={() => {
                  forkForm.setFieldsValue({
                    slug: `${slugify(course.title)}-remix`,
                    title: `${course.title} — Remix`,
                  });
                  setForkOpen(true);
                }}
              >
                Fork perspective
              </Button>
            ) : null}
            {data.viewer.is_author ? (
              <Button icon={<EditOutlined />} onClick={() => navigate(`/course-authoring/${course.id}`)}>
                Open authoring workspace
              </Button>
            ) : null}
          </div>

          <div className="community-course-detail__stats">
            <Card><Statistic title="Saves" value={data.save_count} /></Card>
            <Card><Statistic title="Installs" value={data.install_count} /></Card>
            <Card><Statistic title="Forks" value={data.fork_count} /></Card>
            <Card><Statistic title="Canonical coverage" value={data.quality.concept_coverage} suffix="%" /></Card>
          </div>

          <Card title="Course notes" className="community-course-detail__card">
            <Collapse
              defaultActiveKey={version.outline.modules?.[0]?.id ? [version.outline.modules[0].id] : []}
              items={(version.outline.modules || []).map((module, moduleIndex) => ({
                key: module.id,
                label: `${String(moduleIndex + 1).padStart(2, "0")} · ${module.title}`,
                children: (
                  <div className="community-course-detail__lessons">
                    {(module.lessons || []).map((lesson) => (
                      <article key={lesson.id}>
                        <Title level={4}>{lesson.title}</Title>
                        <Paragraph>{lesson.content_markdown || lesson.summary}</Paragraph>
                        {lesson.learning_objectives?.length ? (
                          <ul>
                            {lesson.learning_objectives.map((objective) => (
                              <li key={objective}><CheckCircleOutlined /> {objective}</li>
                            ))}
                          </ul>
                        ) : null}
                        {lesson.practice_prompt ? (
                          <Alert type="info" title="Practice" description={lesson.practice_prompt} />
                        ) : null}
                      </article>
                    ))}
                  </div>
                ),
              }))}
            />
          </Card>

          <div className="community-course-detail__evidence">
            <Card title="Quality indicators">
              <ul>
                {data.quality.indicators.map((indicator) => (
                  <li key={indicator}><CheckCircleOutlined /> {indicator}</li>
                ))}
              </ul>
            </Card>
            <Card title="Provenance">
              <Descriptions
                column={1}
                size="small"
                items={[
                  { key: "source", label: "Source", children: data.provenance.source_kind },
                  { key: "version", label: "Current version", children: data.provenance.current_version_number },
                  {
                    key: "canonical",
                    label: "Canonical layer",
                    children: <span><SafetyCertificateOutlined /> Unchanged</span>,
                  },
                  {
                    key: "fork",
                    label: "Fork lineage",
                    children: data.provenance.source_course_id
                      ? `Course ${data.provenance.source_course_id}`
                      : "Original perspective",
                  },
                ]}
              />
            </Card>
          </div>
        </>
      ) : null}

      <Modal
        open={forkOpen}
        title="Fork this course perspective"
        footer={null}
        onCancel={() => setForkOpen(false)}
      >
        <Alert
          type="info"
          showIcon
          title="Your fork starts private"
          description="Version 1 copies the current course structure and accepted concept references while preserving source lineage."
        />
        <Form form={forkForm} layout="vertical" requiredMark={false} onFinish={submitFork}>
          <Form.Item label="Course title" name="title" rules={[{ required: true }]}>
            <Input maxLength={255} />
          </Form.Item>
          <Form.Item
            label="Course slug"
            name="slug"
            rules={[
              { required: true },
              { pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "Use lowercase letters, numbers, and hyphens." },
            ]}
          >
            <Input maxLength={191} />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={acting === "fork"} block>
            Create private fork
          </Button>
        </Form>
      </Modal>

      <Modal
        open={Boolean(author)}
        title="Course author"
        footer={null}
        onCancel={() => setAuthor(null)}
      >
        {author ? (
          <div className="community-course-detail__author-modal">
            <div className="course-community__avatar"><UserOutlined /></div>
            <Title level={3}>{author.profile.display_name}</Title>
            <Text type="secondary">@{author.profile.handle}</Text>
            <Paragraph>{author.profile.headline}</Paragraph>
            <Paragraph>{author.profile.bio}</Paragraph>
            <Space wrap>
              {author.profile.expertise.map((item) => (
                <SemanticChip key={item} variant="teal">{item}</SemanticChip>
              ))}
            </Space>
            <div className="community-course-detail__author-counts">
              <Statistic title="Published" value={author.published_course_count} />
              <Statistic title="Forks" value={author.fork_count} />
              <Statistic title="Installs" value={author.install_count} />
            </div>
          </div>
        ) : null}
      </Modal>
    </AppPageShell>
  );
}
