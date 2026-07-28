import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Collapse,
  Modal,
  Skeleton,
  Space,
  Statistic,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  EditOutlined,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import CourseMetadata from "../../goals/components/CourseMetadata";
import SemanticChip from "../../../shared/ui/SemanticChip";
import { getAuthorProfile, getCommunityCourse, updateCourseLibrary } from "../../goals/api/learningPlatform";

import "./CourseCommunityPage.css";

const { Paragraph, Text, Title } = Typography;

export default function CommunityCourseDetailPage() {
  const { courseId = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState("");
  const [errorText, setErrorText] = useState("");
  const [data, setData] = useState(null);
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

  useEffect(() => {
    if (!data || !location.hash) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [data, location.hash]);

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
      }));
      message.success("Saved-course status updated.");
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

  const course = data?.course;
  const version = data?.current_version;

  return (
    <AppPageShell
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
              <div className="community-course-detail__title-row">
                <Title level={1}>{course.title}</Title>
                <SemanticChip variant="sage">Community course</SemanticChip>
              </div>
              <CourseMetadata course={course} />
              <Paragraph>{course.description || course.target_learner}</Paragraph>
              <Button type="link" icon={<UserOutlined />} onClick={openAuthor}>
                By {data.author.display_name} · @{data.author.handle}
              </Button>
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
            {data.viewer.is_author ? (
              <Button icon={<EditOutlined />} onClick={() => navigate(`/course-authoring/${course.id}`)}>
                Open authoring workspace
              </Button>
            ) : null}
          </div>

          <div className="community-course-detail__stats">
            <Card><Statistic title="Saves" value={data.save_count} /></Card>
          </div>

          <Card title="Course notes" className="community-course-detail__card">
            <Collapse
              defaultActiveKey={[
                new URLSearchParams(location.search).get("module")
                || version.outline.modules?.[0]?.id,
              ].filter(Boolean)}
              items={(version.outline.modules || []).map((module, moduleIndex) => ({
                key: module.id,
                label: `${String(moduleIndex + 1).padStart(2, "0")} · ${module.title}`,
                children: (
                  <div className="community-course-detail__lessons">
                    {(module.lessons || []).map((lesson) => (
                      <article key={lesson.id} id={lesson.id}>
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

        </>
      ) : null}

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
            </div>
          </div>
        ) : null}
      </Modal>
    </AppPageShell>
  );
}
