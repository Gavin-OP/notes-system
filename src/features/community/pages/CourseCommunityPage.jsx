import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Skeleton,
  Space,
  Statistic,
  Tabs,
  Typography,
} from "antd";
import {
  BookOutlined,
  CompassOutlined,
  EditOutlined,
  HeartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import CourseMetadata from "../../goals/components/CourseMetadata";
import SemanticChip from "../../../shared/ui/SemanticChip";
import {
  getMyAuthorProfile,
  listCommunityCourses,
  listCourseLibrary,
  updateMyAuthorProfile,
} from "../../goals/api/learningPlatform";

import "./CourseCommunityPage.css";

const { Paragraph, Text, Title } = Typography;

function CourseCard({ item, onOpen }) {
  const course = item.course || item;
  const isLibraryItem = typeof item.saved === "boolean";
  return (
    <button
      type="button"
      className="course-community__course-card"
      onClick={() => onOpen(course.id)}
    >
      <span className="course-community__card-title">
        {course.title}
        <SemanticChip variant="sage">Community course</SemanticChip>
      </span>
      <CourseMetadata course={course} compact />
      <span className="course-community__card-description">
        {course.description || course.target_learner || "A structured community course."}
      </span>
      <span className="course-community__card-footer">
        <span><UserOutlined /> {item.author?.display_name || "Course author"}</span>
        <span><HeartOutlined /> {item.save_count || 0}{isLibraryItem && item.saved ? " · Saved" : ""}</span>
      </span>
    </button>
  );
}

export default function CourseCommunityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const domainSlug = new URLSearchParams(location.search).get("domain") || "";
  const { message } = App.useApp();
  const [authorForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [courses, setCourses] = useState([]);
  const [library, setLibrary] = useState([]);
  const [profile, setProfile] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorText("");
    try {
      const [communityPayload, libraryPayload, profilePayload] = await Promise.all([
        listCommunityCourses({ domainSlug }),
        listCourseLibrary(),
        getMyAuthorProfile(),
      ]);
      setCourses(Array.isArray(communityPayload) ? communityPayload : []);
      setLibrary(Array.isArray(libraryPayload) ? libraryPayload : []);
      setProfile(profilePayload);
      authorForm.setFieldsValue({
        ...profilePayload,
        expertise: (profilePayload?.expertise || []).join(", "),
      });
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not load the course community.");
    } finally {
      setLoading(false);
    }
  }, [authorForm, domainSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const saveProfile = async (values) => {
    setSavingProfile(true);
    try {
      const updated = await updateMyAuthorProfile({
        ...values,
        expertise: String(values.expertise || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        links: profile?.links || [],
        is_public: true,
      });
      setProfile(updated);
      message.success("Author profile updated.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not update your author profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const openCourse = (courseId) => navigate(`/courses/community/${courseId}`);

  return (
    <AppPageShell
      title="Course Community"
      subtitle="Learn through different author perspectives over the same stable canonical knowledge."
      showSiteFooter
      contentWidth="wide"
      contentClassName="course-community"
    >
      {errorText ? <Alert type="error" showIcon title="Community unavailable" description={errorText} /> : null}

      {loading ? <Card><Skeleton active paragraph={{ rows: 10 }} /></Card> : (
        <Tabs
          size="large"
          items={[
            {
              key: "discover",
              label: <span><CompassOutlined /> Discover</span>,
              children: courses.length ? (
                <div className="course-community__grid">
                  {courses.map((item) => (
                    <CourseCard key={item.course.id} item={item} onOpen={openCourse} />
                  ))}
                </div>
              ) : (
                <Empty description="No community courses are public yet." />
              ),
            },
            {
              key: "library",
              label: <span><BookOutlined /> My Library</span>,
              children: library.length ? (
                <div className="course-community__grid">
                  {library.map((item) => (
                    <CourseCard key={item.course.id} item={item} onOpen={openCourse} />
                  ))}
                </div>
              ) : (
                <Empty description="Save a community course to add it here." />
              ),
            },
            {
              key: "author",
              label: <span><EditOutlined /> Author Profile</span>,
              children: (
                <div className="course-community__author-layout">
                  <Card className="course-community__author-preview">
                    <div className="course-community__avatar"><UserOutlined /></div>
                    <Title level={3}>{profile?.display_name}</Title>
                    <Text type="secondary">@{profile?.handle}</Text>
                    <Paragraph>{profile?.headline || "Add a concise author headline."}</Paragraph>
                    <Space wrap>
                      {(profile?.expertise || []).map((item) => (
                        <SemanticChip key={item} variant="teal">{item}</SemanticChip>
                      ))}
                    </Space>
                    <div className="course-community__author-stats">
                      <Statistic
                        title="Community courses"
                        value={courses.filter(
                          (item) => item.course.author_user_id === profile?.owner_user_id,
                        ).length}
                      />
                    </div>
                  </Card>
                  <Card title="Public author identity">
                    <Form
                      form={authorForm}
                      layout="vertical"
                      requiredMark={false}
                      onFinish={saveProfile}
                    >
                      <Form.Item label="Display name" name="display_name" rules={[{ required: true }]}>
                        <Input maxLength={120} />
                      </Form.Item>
                      <Form.Item
                        label="Handle"
                        name="handle"
                        rules={[
                          { required: true },
                          { pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "Use lowercase letters, numbers, and hyphens." },
                        ]}
                      >
                        <Input maxLength={64} addonBefore="@" />
                      </Form.Item>
                      <Form.Item label="Headline" name="headline">
                        <Input maxLength={255} />
                      </Form.Item>
                      <Form.Item label="Bio" name="bio">
                        <Input.TextArea rows={5} maxLength={10_000} showCount />
                      </Form.Item>
                      <Form.Item
                        label="Expertise"
                        name="expertise"
                        extra="Comma-separated topics shown on your public profile."
                      >
                        <Input maxLength={1_000} />
                      </Form.Item>
                      <Button type="primary" htmlType="submit" loading={savingProfile}>
                        Save author profile
                      </Button>
                    </Form>
                  </Card>
                </div>
              ),
            },
          ]}
        />
      )}
    </AppPageShell>
  );
}
