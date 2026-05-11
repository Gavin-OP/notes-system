import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Avatar,
  Alert,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  List,
  message,
  Modal,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Tag,
  Tabs,
  Timeline,
  Typography,
} from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  EditOutlined,
  LogoutOutlined,
  RobotOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getCurrentUser, getMyProfile, getUserProgress, logoutUser } from "../common/api/user";
import { isConcreteNoteRoute, normalizeNoteRoute } from "../utils/notesIndexUtils";
import AppFeatureTour from "../common/components/guide/AppFeatureTour";

import "./UserProfilePage.css";

const { Title, Text, Paragraph } = Typography;

function normalizeDate(rawValue) {
  if (!rawValue) return "";
  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) return String(rawValue);
  return date.toLocaleString();
}

function toNumberOrNull(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toReadableLabel(rawValue) {
  const source = String(rawValue || "")
    .replace(/\.md$/i, "")
    .replace(/^_index$/i, "index")
    .replace(/[-_]+/g, " ")
    .trim();
  if (!source) return "Untitled";
  return source.replace(/\b\w/g, (char) => char.toUpperCase());
}

function slugToSubjectTitle(slug) {
  return toReadableLabel(String(slug || "").replace(/^\/+|\/+$/g, ""));
}

function normalizeUser(payload) {
  const source = payload?.user && typeof payload.user === "object" ? payload.user : payload;
  if (!source || typeof source !== "object") return null;
  return {
    id: source.id ?? source.userId ?? source.user_id ?? "",
    email: source.email ?? source.userEmail ?? "",
    displayName:
      source.displayName ?? source.display_name ?? source.name ?? source.full_name ?? "Learner",
    createdAt: source.createdAt ?? source.created_at ?? "",
  };
}

function normalizeProfile(payload) {
  const source = payload?.profile && typeof payload.profile === "object" ? payload.profile : payload;
  if (!source || typeof source !== "object") return {};
  return source;
}

function normalizeLearningTracks(profile) {
  const tracks =
    profile.learningTracks ||
    profile.learning_tracks ||
    profile.courseProgress ||
    profile.course_progress ||
    profile.progress?.tracks ||
    [];
  if (!Array.isArray(tracks)) return [];
  return tracks.map((track, index) => {
    const progressValue =
      typeof track.progress === "number"
        ? track.progress
        : typeof track.percent === "number"
          ? track.percent
          : typeof track.completionRate === "number"
            ? Math.round(track.completionRate * 100)
            : typeof track.completion_rate === "number"
              ? Math.round(track.completion_rate * 100)
              : 0;
    return {
      id: track.id || `track-${index + 1}`,
      title: track.title || track.name || track.subject || `Track ${index + 1}`,
      progress: Math.max(0, Math.min(100, progressValue)),
      status: progressValue >= 100 ? "Completed" : "In progress",
      current:
        track.currentTopic ||
        track.current_topic ||
        track.currentLesson ||
        track.current_lesson ||
        "Continue learning",
      continuePath:
        track.noteUrl ||
        track.note_url ||
        track.currentNoteUrl ||
        track.current_note_url ||
        "",
    };
  });
}

function normalizeConversations(profile) {
  const rawConversations =
    profile.assistantConversations || profile.assistant_conversations || profile.conversations || [];
  if (!Array.isArray(rawConversations)) return [];
  return rawConversations.map((conversation, index) => ({
    id: conversation.id || conversation.conversation_id || `conv-${index + 1}`,
    title: conversation.title || conversation.topic || `Conversation ${index + 1}`,
    time: normalizeDate(conversation.updatedAt || conversation.updated_at || conversation.created_at),
    summary: conversation.summary || conversation.preview || "No summary available.",
    note:
      conversation.noteTitle ||
      conversation.note_title ||
      conversation.noteUrl ||
      conversation.note_url ||
      "No linked note",
    messages: Array.isArray(conversation.messages)
      ? conversation.messages.map((msg) => ({
          role: msg.role || "assistant",
          text: msg.content || msg.text || "",
        }))
      : [],
  }));
}

function normalizeNotes(profile) {
  const rawNotes = profile.savedNotes || profile.saved_notes || profile.personalNotes || profile.personal_notes || [];
  if (!Array.isArray(rawNotes)) return [];
  return rawNotes.map((note, index) => ({
    id: note.id || `note-${index + 1}`,
    title:
      note.displayTitle ||
      note.display_title ||
      note.noteTitle ||
      note.note_title ||
      note.title ||
      note.name ||
      `Note ${index + 1}`,
    updatedAt: normalizeDate(note.updatedAt || note.updated_at || note.created_at),
    subject:
      note.subjectTitle ||
      note.subject_title ||
      note.subject ||
      note.directory ||
      "",
    noteUrl: note.noteUrl || note.note_url || note.url || "",
    tags: Array.isArray(note.tags) ? note.tags : [],
  }));
}

function normalizeHistoryItems(profile) {
  const history = profile.learningHistory || profile.learning_history || profile.timeline || [];
  if (!Array.isArray(history)) return [];
  return history.map((item, index) => ({
    color:
      item.color ||
      (item.status === "completed" ? "green" : item.status === "in_progress" ? "blue" : "gray"),
    children: item.text || item.title || item.description || `History item ${index + 1}`,
  }));
}

function normalizeCompletedNotes(profile) {
  const completed =
    profile.completedNotes ||
    profile.completed_notes ||
    [];
  if (!Array.isArray(completed)) return [];
  return completed.map((item, index) => ({
    id: item.noteId || item.note_id || item.note_url || `completed-note-${index + 1}`,
    title: item.noteTitle || item.note_title || item.note_url || `Completed note ${index + 1}`,
    noteUrl: item.noteUrl || item.note_url || "",
    subject: item.subject || "",
    completedAt: normalizeDate(item.completedAt || item.completed_at),
  }));
}

const PREVIEW_USER = {
  id: "preview-user",
  email: "preview@local",
  displayName: "Preview Learner",
  createdAt: "",
};

const PREVIEW_PROFILE = {
  overview: {
    completed_lessons: 0,
    current_streak: 0,
    assistant_sessions: 0,
    notes_saved: 0,
  },
  learning_tracks: [],
  assistant_conversations: [],
  saved_notes: [],
  completed_notes: [],
  learning_history: [],
};

function UserProfilePage() {
  const navigate = useNavigate();
  const notesIndex = useSelector((state) => state.notesIndex?.data) || [];
  const [conversationWorkspaceOpen, setConversationWorkspaceOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [profileInfo, setProfileInfo] = useState({});
  const [fallbackProgress, setFallbackProgress] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewNotice, setPreviewNotice] = useState("");
  const profileStatsRef = useRef(null);
  const profileLearningRef = useRef(null);
  const profileCompletedRef = useRef(null);
  const profileRecordsRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      setLoading(true);
      setErrorText("");
      setPreviewMode(false);
      setPreviewNotice("");
      try {
        const mePayload = await getCurrentUser();
        const normalizedUser = normalizeUser(mePayload);
        if (!normalizedUser?.id) {
          throw new Error("Unable to resolve current user.");
        }
        const profilePayload = await getMyProfile();
        let fallback = null;
        try {
          fallback = await getUserProgress(normalizedUser.id);
        } catch {
          fallback = null;
        }
        if (!mounted) return;
        setUserInfo(normalizedUser);
        setProfileInfo(normalizeProfile(profilePayload));
        setFallbackProgress(fallback);
      } catch (error) {
        if (!mounted) return;
        const messageText = error instanceof Error ? error.message : "Failed to load profile.";
        // Public static deployment can run without backend APIs; render a preview shell instead of hard fail.
        setPreviewMode(true);
        setPreviewNotice(
          messageText ||
            "Backend services are unavailable in this deployment. Showing profile preview mode.",
        );
        setErrorText("");
        setUserInfo(PREVIEW_USER);
        setProfileInfo(PREVIEW_PROFILE);
        setFallbackProgress(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const learningTracks = useMemo(
    () => normalizeLearningTracks(profileInfo),
    [profileInfo],
  );
  const recentChats = useMemo(
    () => normalizeConversations(profileInfo),
    [profileInfo],
  );
  const recentNotes = useMemo(
    () => normalizeNotes(profileInfo),
    [profileInfo],
  );
  const timelineItems = useMemo(
    () => normalizeHistoryItems(profileInfo),
    [profileInfo],
  );
  const completedNotes = useMemo(
    () => normalizeCompletedNotes(profileInfo),
    [profileInfo],
  );

  useEffect(() => {
    if (!recentChats.length) return;
    if (!activeConversationId || !recentChats.some((item) => item.id === activeConversationId)) {
      setActiveConversationId(recentChats[0].id);
    }
  }, [activeConversationId, recentChats]);

  const overview = useMemo(() => {
    const raw = profileInfo.overview || profileInfo.stats || {};
    const completedLessons =
      toNumberOrNull(raw.completedLessons) ??
      toNumberOrNull(raw.completed_lessons) ??
      toNumberOrNull(fallbackProgress?.completed_lessons) ??
      0;
    const currentStreak =
      toNumberOrNull(raw.currentStreak) ??
      toNumberOrNull(raw.current_streak) ??
      toNumberOrNull(fallbackProgress?.current_streak) ??
      0;
    const assistantSessions =
      toNumberOrNull(raw.assistantSessions) ??
      toNumberOrNull(raw.assistant_sessions) ??
      recentChats.length;
    const notesSaved =
      toNumberOrNull(raw.notesSaved) ??
      toNumberOrNull(raw.notes_saved) ??
      recentNotes.length;

    return {
      completedLessons,
      currentStreak,
      assistantSessions,
      notesSaved,
    };
  }, [fallbackProgress, profileInfo, recentChats.length, recentNotes.length]);

  const activeConversation =
    recentChats.find((conversation) => conversation.id === activeConversationId) || recentChats[0];

  const noteLabelByUrl = useMemo(() => {
    const map = new Map();
    const walk = (items) => {
      if (!Array.isArray(items)) return;
      items.forEach((item) => {
        if (!item || typeof item !== "object") return;
        if (item.type === "file" && typeof item.url === "string") {
          const titleCandidate = item.title || item.name || item.slug || item.url;
          map.set(item.url, toReadableLabel(titleCandidate));
        }
        if (Array.isArray(item.children) && item.children.length > 0) {
          walk(item.children);
        }
      });
    };
    walk(notesIndex);
    return map;
  }, [notesIndex]);

  const decoratedRecentNotes = useMemo(() => {
    return recentNotes.map((note) => {
      const normalizedUrl = typeof note.noteUrl === "string" ? note.noteUrl.split("#")[0] : "";
      const fallbackTitle = toReadableLabel(note.title);
      const displayTitle = (normalizedUrl && noteLabelByUrl.get(normalizedUrl)) || fallbackTitle;
      const rawSubject =
        note.subject ||
        (normalizedUrl.startsWith("/note/") ? normalizedUrl.replace(/^\/note\//, "").split("/")[0] : "");
      return {
        ...note,
        displayTitle,
        displaySubject: slugToSubjectTitle(rawSubject),
      };
    });
  }, [noteLabelByUrl, recentNotes]);

  const decoratedCompletedNotes = useMemo(() => {
    return completedNotes.map((item) => {
      const normalizedUrl = typeof item.noteUrl === "string" ? item.noteUrl.split("#")[0] : "";
      const titleFromUrl = normalizedUrl ? noteLabelByUrl.get(normalizedUrl) : "";
      const fallbackTitle = toReadableLabel(item.title);
      const displayTitle = titleFromUrl || fallbackTitle;
      const rawSubject =
        item.subject ||
        (normalizedUrl.startsWith("/note/") ? normalizedUrl.replace(/^\/note\//, "").split("/")[0] : "");
      return {
        ...item,
        displayTitle,
        displaySubject: slugToSubjectTitle(rawSubject),
      };
    });
  }, [completedNotes, noteLabelByUrl]);

  const continueLearningPath = useMemo(() => {
    const FALLBACK_NOTE = "/note/disclaimer.md";

    const tried = [];
    tried.push(
      profileInfo.currentNoteUrl,
      profileInfo.current_note_url,
      profileInfo.currentLessonUrl,
      profileInfo.current_lesson_url,
    );
    learningTracks.forEach((track) => tried.push(track.continuePath));
    tried.push(fallbackProgress?.current_note_url, fallbackProgress?.currentNoteUrl);

    for (const raw of tried) {
      if (typeof raw !== "string" || !raw.trim()) continue;
      if (!isConcreteNoteRoute(raw)) continue;
      const normalized = normalizeNoteRoute(raw);
      if (!normalized) continue;
      return normalized.split("#")[0];
    }

    return FALLBACK_NOTE;
  }, [fallbackProgress, learningTracks, profileInfo]);

  const handleLogout = async () => {
    if (previewMode) {
      message.info("Preview mode has no active backend session to logout.");
      return;
    }
    try {
      await logoutUser();
      message.success("Logged out.");
      navigate("/user/login");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Logout failed.");
    }
  };

  const profileGuideSteps = [
    {
      title: "Overview Metrics",
      description:
        "Get a quick pulse of your progress: completed lessons, streak, assistant sessions, and saved notes.",
      target: () => profileStatsRef.current,
      placement: "bottom",
    },
    {
      title: "Learning Progress",
      description:
        "Review subject-by-subject progress and see exactly where to continue next.",
      target: () => profileLearningRef.current,
      placement: "right",
    },
    {
      title: "Completed Notes",
      description:
        "Celebrate wins here: every finished note is recorded with completion time.",
      target: () => profileCompletedRef.current,
      placement: "right",
    },
    {
      title: "Knowledge Records",
      description:
        "Revisit recent AI conversations and personal notes anytime. Ready to keep building? Jump back into your next lesson now!",
      target: () => profileRecordsRef.current,
      placement: "left",
    },
  ];

  if (loading) {
    return (
      <div className="user-profile-page user-profile-page--state">
        <Spin tip="Loading profile..." />
      </div>
    );
  }

  if (errorText) {
    return (
      <div className="user-profile-page user-profile-page--state">
        <Card className="user-profile-page__state-card">
          <Space direction="vertical" size={12}>
            <Alert type="error" showIcon message={errorText} />
            <Space>
              <Button type="primary" onClick={() => navigate("/user/login")}>
                Go to login
              </Button>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </Space>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="user-profile-page__container">
        <div>
          <Card className="user-profile-page__hero">
          <Space align="start" size={16}>
            <Avatar size={72} icon={<UserOutlined />} />
            <div>
              {previewMode ? (
                <Alert
                  type="warning"
                  showIcon
                  style={{ marginBottom: 12 }}
                  message="Profile preview mode"
                  description={
                    previewNotice ||
                    "Backend services are currently unavailable. Data below is a read-only preview."
                  }
                />
              ) : null}
              <Title level={3} className="user-profile-page__hero-title">
                {userInfo?.displayName || "Learner"}
              </Title>
              <Text type="secondary">{userInfo?.email || "-"}</Text>
              <Paragraph className="user-profile-page__hero-desc">
                Personalized learning workspace for progress tracking, AI conversations, and study notes.
              </Paragraph>
              <Space wrap>
                <Button type="primary" icon={<EditOutlined />} disabled={previewMode}>
                  Edit profile
                </Button>
                <Button icon={<BookOutlined />} onClick={() => navigate(continueLearningPath)}>
                  Continue learning
                </Button>
                <Button icon={<LogoutOutlined />} onClick={handleLogout} disabled={previewMode}>
                  Logout
                </Button>
                <AppFeatureTour
                  guideKey="profile_page"
                  steps={profileGuideSteps}
                  startLabel="Guide"
                  iconOnly
                  buttonAriaLabel="Open profile guide"
                />
              </Space>
            </div>
          </Space>
          </Card>
        </div>

        <div ref={profileStatsRef}>
          <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Completed Lessons" value={overview.completedLessons} prefix={<CheckCircleOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Current Streak" value={overview.currentStreak} suffix="days" />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Assistant Sessions" value={overview.assistantSessions} prefix={<RobotOutlined />} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Saved Notes" value={overview.notesSaved} prefix={<EditOutlined />} />
            </Card>
          </Col>
          </Row>
        </div>

        <Row gutter={[16, 16]} className="user-profile-page__main-grid">
          <Col xs={24} lg={14}>
            <div ref={profileLearningRef}>
              <Card title="Learning Progress" extra={<Button type="link">View all</Button>}>
              {learningTracks.length > 0 ? (
                <Space direction="vertical" className="user-profile-page__block" size={16}>
                  {learningTracks.map((track) => (
                    <div key={track.id}>
                      <div className="user-profile-page__track-head">
                        <Text strong>{track.title}</Text>
                        <Tag color={track.status === "Completed" ? "green" : "blue"}>{track.status}</Tag>
                      </div>
                      <Progress
                        percent={track.progress}
                        strokeColor={track.progress >= 100 ? "#52c41a" : "#1677ff"}
                      />
                      <Text type="secondary">Current topic: {track.current}</Text>
                    </div>
                  ))}
                </Space>
              ) : (
                <Empty description="No learning progress yet." />
              )}
              </Card>
            </div>

            <Card title="Learning History Timeline" className="user-profile-page__section">
              {timelineItems.length > 0 ? (
                <Timeline items={timelineItems} />
              ) : (
                <Empty description="No learning history yet." />
              )}
              <Divider />
              <Button block>Export learning report</Button>
            </Card>

            <div ref={profileCompletedRef}>
              <Card title="Completed Notes" className="user-profile-page__section">
              {decoratedCompletedNotes.length > 0 ? (
                <List
                  dataSource={decoratedCompletedNotes}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.displayTitle}
                        description={
                          item.displaySubject
                            ? `${item.displaySubject}${item.completedAt ? ` · ${item.completedAt}` : ""}`
                            : item.completedAt || "Marked as completed"
                        }
                      />
                      <Tag color="green">Completed</Tag>
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No completed notes yet." />
              )}
              </Card>
            </div>
          </Col>

          <Col xs={24} lg={10}>
            <div ref={profileRecordsRef}>
              <Card
                title="Knowledge Records"
                className="user-profile-page__section"
                extra={
                <Button type="link" onClick={() => setConversationWorkspaceOpen(true)}>
                  Open conversation workspace
                </Button>
              }
              >
              <Tabs
                items={[
                  {
                    key: "conversations",
                    label: "Recent Assistant Conversations",
                    children: (
                      recentChats.length > 0 ? (
                        <List
                          itemLayout="vertical"
                          dataSource={recentChats}
                          renderItem={(item) => (
                            <List.Item
                              actions={[
                                <Button
                                  key={`open-${item.id}`}
                                  type="link"
                                  onClick={() => {
                                    setActiveConversationId(item.id);
                                    setConversationWorkspaceOpen(true);
                                  }}
                                >
                                  Open conversation
                                </Button>,
                              ]}
                            >
                              <List.Item.Meta
                                avatar={<Avatar icon={<CommentOutlined />} />}
                                title={item.title}
                                description={`${item.time || "Unknown time"} · ${item.note}`}
                              />
                              <Paragraph>{item.summary}</Paragraph>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Empty description="No assistant conversations yet." />
                      )
                    ),
                  },
                  {
                    key: "notes",
                    label: "Saved Personal Notes",
                    children: (
                      decoratedRecentNotes.length > 0 ? (
                        <List
                          dataSource={decoratedRecentNotes}
                          renderItem={(item) => (
                            <List.Item>
                              <List.Item.Meta
                                title={item.displayTitle}
                                description={
                                  item.updatedAt
                                    ? `${item.displaySubject || "General"} · ${item.updatedAt}`
                                    : `${item.displaySubject || "General"}`
                                }
                              />
                              <Space wrap>
                                {item.tags.map((tag) => (
                                  <Tag key={`${item.id}-${tag}`}>{tag}</Tag>
                                ))}
                              </Space>
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Empty description="No saved notes yet." />
                      )
                    ),
                  },
                ]}
              />
              </Card>
            </div>
          </Col>
        </Row>
      </div>

      <Modal
        title="Assistant Conversations"
        open={conversationWorkspaceOpen}
        onCancel={() => setConversationWorkspaceOpen(false)}
        footer={null}
        width={980}
        className="user-profile-page__conversation-modal"
      >
        <div className="user-profile-page__conversation-workspace">
          <aside className="user-profile-page__conversation-list">
            {recentChats.length > 0 ? (
              <List
                dataSource={recentChats}
                renderItem={(item) => (
                  <List.Item
                    className={`user-profile-page__conversation-item ${
                      item.id === activeConversationId ? "is-active" : ""
                    }`}
                    onClick={() => setActiveConversationId(item.id)}
                  >
                    <List.Item.Meta title={item.title} description={`${item.time || "Unknown time"} · ${item.note}`} />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No conversations available." />
            )}
          </aside>
          <section className="user-profile-page__conversation-thread">
            {activeConversation ? (
              <>
                <div className="user-profile-page__conversation-thread-header">
                  <Text strong>{activeConversation.title}</Text>
                  <Tag>{activeConversation.note}</Tag>
                </div>
                <div className="user-profile-page__conversation-messages">
                  {(activeConversation.messages || []).map((message, index) => (
                    <div
                      key={`${activeConversation.id}-msg-${index}`}
                      className={`user-profile-page__conversation-bubble user-profile-page__conversation-bubble--${message.role}`}
                    >
                      <Text strong>{message.role === "assistant" ? "Assistant" : "You"}</Text>
                      <Paragraph>{message.text}</Paragraph>
                    </div>
                  ))}
                  {activeConversation.messages.length === 0 ? (
                    <Empty description="No message details in this conversation." />
                  ) : null}
                </div>
              </>
            ) : (
              <Empty description="Select a conversation to view details." />
            )}
          </section>
        </div>
      </Modal>
    </div>
  );
}

export default UserProfilePage;
