import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import {
  BookOutlined,
  CommentOutlined,
  DownOutlined,
  EditOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

import SemanticChip from "../common/components/SemanticChip";
import {
  getCareerGoalChipVariant,
  getGapChipVariant,
  getKnowledgeAreaChipVariant,
  getMatchScoreChipVariant,
  getMatchScoreStrokeColor,
  getProgressStateChipVariant,
  getProgressStateStrokeColor,
  getSkillChipVariant,
  getSubjectChipVariant,
  getToolChipVariant,
} from "../common/utils/semanticChipUtils";
import {
  getCurrentUser,
  getMyNoteQuotes,
  getMyProfile,
  getUserProgress,
  logoutUser,
  updateMyGuideState,
} from "../common/api/user";
import {
  getCareerTaxonomy,
  getMyCareerBackground,
  getMyCareerRecommendations,
  getSubjectJobMatches,
  submitCareerOnboarding,
  updateMyCareerBackground,
} from "../common/api/careers";
import CareerBackgroundCard from "../common/components/careers/CareerBackgroundCard";
import CareerOnboardingModal from "../common/components/careers/CareerOnboardingModal";
import CareerRecommendationsCard from "../common/components/careers/CareerRecommendationsCard";
import CareerSkillGapPanel from "../common/components/careers/CareerSkillGapPanel";
import AchievementsPanel, { normalizeAchievements } from "../common/components/achievements/AchievementsPanel";
import { extractSubjectsFromNotesIndex } from "../common/components/achievements/achievementCatalog";
import { isConcreteNoteRoute, normalizeNoteRoute } from "../utils/notesIndexUtils";
import AppFeatureTour, { PENDING_NOTES_TOUR_KEY } from "../common/components/guide/AppFeatureTour";
import {
  createProfileGuideSteps,
  prepareProfileTourStep,
} from "../common/components/guide/productTours";

import "./UserProfilePage.css";

const { Title, Text, Paragraph } = Typography;
const CONTRIBUTION_TOTAL_WEEKS = 52;
const CAREER_MATCH_MIN_SCORE = 20;
const CAREER_RECOMMENDATION_LIMIT = 50;

function normalizeDate(rawValue) {
  if (!rawValue) return "";
  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) return String(rawValue);
  return date.toLocaleString();
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
    updatedAtRaw: note.updatedAt || note.updated_at || note.created_at || "",
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

function toDateKey(rawValue) {
  if (!rawValue) return "";
  const parsed = new Date(rawValue);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildContributionMatrix(activities = [], totalWeeks = 52) {
  const totalDays = totalWeeks * 7;
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(end.getDate() - (totalDays - 1));

  const detailByDate = new Map();
  activities.forEach((activity) => {
    const key = toDateKey(activity?.rawDate || activity?.date || "");
    if (!key) return;
    const existing = detailByDate.get(key) || [];
    const label = String(activity?.label || activity?.title || "").trim();
    detailByDate.set(key, label ? [...existing, label] : existing);
  });

  const cells = [];
  for (let i = 0; i < totalDays; i += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = toDateKey(date);
    cells.push({
      key,
      date,
      dateLabel: date.toLocaleDateString(),
      notes: detailByDate.get(key) || [],
    });
  }

  const maxCount = Math.max(0, ...cells.map((item) => item.notes.length));
  const levelOf = (count) => {
    if (count <= 0) return 0;
    if (maxCount <= 1) return 4;
    const ratio = count / maxCount;
    if (ratio >= 0.75) return 4;
    if (ratio >= 0.5) return 3;
    if (ratio >= 0.25) return 2;
    return 1;
  };

  const weeks = [];
  const monthLabels = [];
  let previousMonth = -1;
  for (let week = 0; week < totalWeeks; week += 1) {
    const weekDays = cells.slice(week * 7, week * 7 + 7).map((day) => ({
      ...day,
      count: day.notes.length,
      level: levelOf(day.notes.length),
    }));
    const firstDay = weekDays[0]?.date;
    if (firstDay && (week === 0 || firstDay.getMonth() !== previousMonth)) {
      monthLabels.push({
        id: `month-${week}`,
        label: firstDay.toLocaleString("en-US", { month: "short" }),
        column: week + 1,
      });
      previousMonth = firstDay.getMonth();
    }
    weeks.push({
      id: `week-${week + 1}`,
      days: weekDays,
    });
  }

  return {
    weeks,
    monthLabels,
    totalContributions: cells.reduce((sum, day) => sum + day.notes.length, 0),
  };
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
    completedAtRaw: item.completedAt || item.completed_at || "",
  }));
}

function formatScore(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.round(numeric) : 0;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]+/g, " ")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueValues(values = []) {
  return [
    ...new Set(
      values
        .map((value) => String(value || "").trim())
        .filter(Boolean),
    ),
  ];
}

function getCareerSkillGaps(recommendation) {
  return (recommendation?.skill_gaps || recommendation?.skillGaps || []).filter(Boolean);
}

function getMatchJobTitle(match) {
  return match?.job_title || match?.jobTitle || "";
}

function getMatchSubjectSlug(match) {
  return match?.subject_slug || match?.subjectSlug || match?.subject_id || match?.subjectId || "";
}

function getMatchSubjectTitle(match) {
  return match?.subject_title || match?.subjectTitle || slugToSubjectTitle(getMatchSubjectSlug(match));
}

function getMatchTerms(match) {
  return (match?.matched_terms || match?.matchedTerms || []).filter(Boolean);
}

function normalizeCareerBackgroundForForm(background = {}) {
  return {
    knowledgeAreas: background.knowledge_areas || background.knowledgeAreas || [],
    skills: background.skills || [],
    tools: background.tools || [],
    careerInterests: background.career_interests || background.careerInterests || [],
    experienceLevels: background.experience_levels || background.experienceLevels || [],
    onboardingCompleted: Boolean(background.onboarding_completed ?? background.onboardingCompleted),
    recommendedNoteUrl: background.recommended_note_url || background.recommendedNoteUrl || "",
    recommendedNoteTitle: background.recommended_note_title || background.recommendedNoteTitle || "",
    recommendedSubject: background.recommended_subject || background.recommendedSubject || "",
  };
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
    max_streak: 0,
    total_learning_days: 0,
    assistant_sessions: 0,
    notes_saved: 0,
  },
  learning_tracks: [],
  assistant_conversations: [],
  saved_notes: [],
  completed_notes: [],
  achievements: [],
  learning_history: [],
};

function UserProfilePage() {
  const navigate = useNavigate();
  const rawNotesIndex = useSelector((state) => state.notesIndex?.data);
  const notesIndex = useMemo(() => rawNotesIndex || [], [rawNotesIndex]);
  const [conversationWorkspaceOpen, setConversationWorkspaceOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [profileInfo, setProfileInfo] = useState({});
  const [personalNoteQuotes, setPersonalNoteQuotes] = useState([]);
  const [fallbackProgress, setFallbackProgress] = useState(null);
  const [careerRecommendations, setCareerRecommendations] = useState([]);
  const [careerBackground, setCareerBackground] = useState({});
  const [careerTaxonomy, setCareerTaxonomy] = useState([]);
  const [subjectJobMatches, setSubjectJobMatches] = useState([]);
  const [careerLoading, setCareerLoading] = useState(false);
  const [careerSaving, setCareerSaving] = useState(false);
  const [careerGoalSaving, setCareerGoalSaving] = useState(false);
  const [careerErrorText, setCareerErrorText] = useState("");
  const [careerOnboardingOpen, setCareerOnboardingOpen] = useState(false);
  const [careerOnboardingSubmitting, setCareerOnboardingSubmitting] = useState(false);
  const [recommendedFirstNote, setRecommendedFirstNote] = useState(null);
  const [tourPromptOpen, setTourPromptOpen] = useState(false);
  const [profileTourStartToken, setProfileTourStartToken] = useState(0);
  const [chainNotesTourAfterProfile, setChainNotesTourAfterProfile] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewNotice, setPreviewNotice] = useState("");
  const [activeDashboard, setActiveDashboard] = useState("learning");
  const [learningRecordsTab, setLearningRecordsTab] = useState("study");
  const [selectedCareerRole, setSelectedCareerRole] = useState("");
  const [achievementsViewAllOpen, setAchievementsViewAllOpen] = useState(false);
  const location = useLocation();
  const profileHeroRef = useRef(null);
  const profileDashboardTabsRef = useRef(null);
  const profileLearningRef = useRef(null);
  const profileCareerRef = useRef(null);
  const profileRecordsRef = useRef(null);

  useEffect(() => {
    if (location.state?.dashboard === "career") {
      setActiveDashboard("career");
    }
  }, [location.state]);

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
        let noteQuotesPayload = [];
        try {
          noteQuotesPayload = await getMyNoteQuotes();
        } catch {
          noteQuotesPayload = [];
        }
        let fallback = null;
        try {
          fallback = await getUserProgress(normalizedUser.id);
        } catch {
          fallback = null;
        }
        if (!mounted) return;
        setUserInfo(normalizedUser);
        setProfileInfo(normalizeProfile(profilePayload));
        setPersonalNoteQuotes(Array.isArray(noteQuotesPayload) ? noteQuotesPayload : []);
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
        setPersonalNoteQuotes([]);
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

  useEffect(() => {
    if (!userInfo?.id || previewMode) return;
    let mounted = true;
    async function loadCareerData() {
      setCareerLoading(true);
      setCareerErrorText("");
      try {
        const [recommendationsPayload, backgroundPayload, taxonomyPayload, subjectMatchesPayload] = await Promise.all([
          getMyCareerRecommendations({
            limit: CAREER_RECOMMENDATION_LIMIT,
            minimumMatchScore: CAREER_MATCH_MIN_SCORE,
          }),
          getMyCareerBackground(),
          getCareerTaxonomy(),
          getSubjectJobMatches(),
        ]);
        if (!mounted) return;
        setCareerRecommendations(recommendationsPayload?.recommendations || []);
        setCareerBackground(backgroundPayload || {});
        setCareerTaxonomy(taxonomyPayload?.profiles || []);
        setSubjectJobMatches(subjectMatchesPayload?.matches || []);
      } catch (error) {
        if (!mounted) return;
        setCareerErrorText(error instanceof Error ? error.message : "Failed to load career data.");
      } finally {
        if (mounted) setCareerLoading(false);
      }
    }
    loadCareerData();
    return () => {
      mounted = false;
    };
  }, [previewMode, userInfo?.id]);

  useEffect(() => {
    if (previewMode || !userInfo?.id || careerLoading || careerErrorText) return;
    if (!careerTaxonomy.length) return;
    const normalized = normalizeCareerBackgroundForForm(careerBackground);
    if (!normalized.onboardingCompleted) {
      setCareerOnboardingOpen(true);
    }
  }, [
    careerBackground,
    careerErrorText,
    careerLoading,
    careerTaxonomy.length,
    previewMode,
    userInfo?.id,
  ]);

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
  const completedNotes = useMemo(
    () => normalizeCompletedNotes(profileInfo),
    [profileInfo],
  );
  const achievements = useMemo(
    () => normalizeAchievements(profileInfo),
    [profileInfo],
  );
  const achievementSubjects = useMemo(
    () => extractSubjectsFromNotesIndex(notesIndex),
    [notesIndex],
  );
  const profileOverview = profileInfo.overview || {};

  useEffect(() => {
    if (!recentChats.length) return;
    if (!activeConversationId || !recentChats.some((item) => item.id === activeConversationId)) {
      setActiveConversationId(recentChats[0].id);
    }
  }, [activeConversationId, recentChats]);

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

  const contributionMatrix = useMemo(() => {
    const history = profileInfo.learningHistory || profileInfo.learning_history || profileInfo.timeline || [];
    const historyActivities = Array.isArray(history)
      ? history.map((item) => ({
          rawDate: item.date || item.created_at || item.createdAt || item.updated_at || item.updatedAt,
          label: item.note_title || item.noteTitle || item.title || item.text || item.description || "Learning activity",
        }))
      : [];
    return buildContributionMatrix(
      [
        ...historyActivities,
        ...recentNotes.map((note) => ({ rawDate: note.updatedAtRaw, label: toReadableLabel(note.title) })),
        ...completedNotes.map((note) => ({ rawDate: note.completedAtRaw, label: toReadableLabel(note.title) })),
      ],
      CONTRIBUTION_TOTAL_WEEKS,
    );
  }, [completedNotes, profileInfo, recentNotes]);

  const accumulationDashboard = useMemo(() => {
    const fromCareerKnowledge = careerBackground.knowledge_areas || careerBackground.knowledgeAreas || [];
    const fromCareerSkills = careerBackground.skills || [];
    const fromCareerTools = careerBackground.tools || [];
    const inferredKnowledge = [
      ...learningTracks.map((track) => track.title),
      ...decoratedCompletedNotes.map((note) => note.displaySubject),
    ];
    const inferredSkills = recentNotes.flatMap((note) => note.tags || []);

    const dedupe = (values) =>
      [
        ...new Set(
          (Array.isArray(values) ? values : [])
            .map((value) => String(value || "").trim())
            .filter(Boolean),
        ),
      ];

    return {
      knowledge: dedupe([...fromCareerKnowledge, ...inferredKnowledge]),
      skills: dedupe([...fromCareerSkills, ...inferredSkills]),
      tools: dedupe(fromCareerTools),
    };
  }, [careerBackground, decoratedCompletedNotes, learningTracks, recentNotes]);

  const visibleCareerRecommendations = useMemo(
    () =>
      careerRecommendations.filter(
        (item) => formatScore(item?.match_score ?? item?.matchScore) >= CAREER_MATCH_MIN_SCORE,
      ),
    [careerRecommendations],
  );

  const careerGoals = useMemo(
    () => normalizeCareerBackgroundForForm(careerBackground).careerInterests,
    [careerBackground],
  );

  const selectedCareerRecommendation = useMemo(
    () => visibleCareerRecommendations.find((item) => item?.title === selectedCareerRole),
    [selectedCareerRole, visibleCareerRecommendations],
  );

  const selectedRoleSubjectMatches = useMemo(() => {
    const normalizedRole = normalizeText(selectedCareerRole);
    if (!normalizedRole) return [];
    return subjectJobMatches
      .filter((match) => normalizeText(getMatchJobTitle(match)) === normalizedRole)
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [selectedCareerRole, subjectJobMatches]);

  const selectedCareerSubjects = useMemo(
    () => selectedRoleSubjectMatches.map((match) => ({
      title: getMatchSubjectTitle(match),
      slug: getMatchSubjectSlug(match),
      score: formatScore((match.score || 0) * 100),
    })),
    [selectedRoleSubjectMatches],
  );

  const selectedCareerSkills = useMemo(
    () => uniqueValues([
      ...getCareerSkillGaps(selectedCareerRecommendation).map((gap) => gap.skill),
      ...selectedRoleSubjectMatches.flatMap((match) => getMatchTerms(match)),
    ]),
    [selectedCareerRecommendation, selectedRoleSubjectMatches],
  );

  const selectedCareerIsGoal = useMemo(() => {
    return careerGoals.some(
      (item) => String(item || "").trim().toLowerCase() === selectedCareerRole.toLowerCase(),
    );
  }, [careerGoals, selectedCareerRole]);

  useEffect(() => {
    if (!visibleCareerRecommendations.length) {
      setSelectedCareerRole("");
      return;
    }
    const exists = visibleCareerRecommendations.some((item) => item?.title === selectedCareerRole);
    if (!exists) {
      setSelectedCareerRole(visibleCareerRecommendations[0]?.title || "");
    }
  }, [selectedCareerRole, visibleCareerRecommendations]);

  const continueLearningUrl = useMemo(() => {
    const FALLBACK_NOTE = "/note/disclaimer.md";
    const normalizedCareerBackground = normalizeCareerBackgroundForForm(careerBackground);

    const tried = [];
    tried.push(
      normalizedCareerBackground.recommendedNoteUrl,
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
  }, [careerBackground, fallbackProgress, learningTracks, profileInfo]);

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

  const handleCareerBackgroundSave = async (values) => {
    if (previewMode) {
      message.info("Preview mode cannot save career background.");
      return;
    }
    setCareerSaving(true);
    try {
      const nextBackground = await updateMyCareerBackground(values);
      const recommendationsPayload = await getMyCareerRecommendations({
        limit: CAREER_RECOMMENDATION_LIMIT,
        minimumMatchScore: CAREER_MATCH_MIN_SCORE,
      });
      setCareerBackground(nextBackground || {});
      setCareerRecommendations(recommendationsPayload?.recommendations || []);
      message.success("Career background updated.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to update career background.");
    } finally {
      setCareerSaving(false);
    }
  };

  const handleCareerOnboardingSubmit = async (values) => {
    if (previewMode) return;
    setCareerOnboardingSubmitting(true);
    try {
      const response = await submitCareerOnboarding(values);
      const nextBackground = response?.background || {};
      const nextRecommendations = response?.recommendations || [];
      const nextRecommendedNote = response?.recommended_note || response?.recommendedNote || null;
      setCareerBackground(nextBackground);
      setCareerRecommendations(nextRecommendations);
      setRecommendedFirstNote(nextRecommendedNote);
      setCareerOnboardingOpen(false);
      setTourPromptOpen(true);
      message.success("Your first note is ready.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to save onboarding answers.");
    } finally {
      setCareerOnboardingSubmitting(false);
    }
  };

  const handleSkipProfileTour = async () => {
    setTourPromptOpen(false);
    setChainNotesTourAfterProfile(false);
    try {
      await updateMyGuideState({
        guideKey: "profile_page",
        seen: true,
        completed: false,
        currentStep: 0,
      });
    } catch {
      // The question-mark button can still start the local tour if this fails.
    }
  };

  const resolveRecommendedNoteUrl = () =>
    recommendedFirstNote?.note_url ||
    recommendedFirstNote?.noteUrl ||
    continueLearningUrl;

  const handleStartProfileTour = async () => {
    setTourPromptOpen(false);
    setChainNotesTourAfterProfile(true);
    try {
      await updateMyGuideState({
        guideKey: "profile_page",
        seen: true,
        completed: false,
        currentStep: 0,
      });
    } catch {
      // Ignore guide-state persistence failures.
    }
    setProfileTourStartToken((value) => value + 1);
  };

  const handleProfileTourAfterFinish = () => {
    if (!chainNotesTourAfterProfile) return;
    setChainNotesTourAfterProfile(false);
    try {
      window.sessionStorage.setItem(PENDING_NOTES_TOUR_KEY, "1");
    } catch {
      // Ignore storage errors; user can still open the note-page guide manually.
    }
    navigate(resolveRecommendedNoteUrl());
  };

  const handleAddCareerGoal = async () => {
    if (previewMode) {
      message.info("Preview mode cannot save career goals.");
      return;
    }
    if (!selectedCareerRecommendation?.title) return;
    if (selectedCareerIsGoal) {
      message.info(`${selectedCareerRecommendation.title} is already in your career goals.`);
      return;
    }

    const normalized = normalizeCareerBackgroundForForm(careerBackground);
    const nextCareerInterests = [...normalized.careerInterests, selectedCareerRecommendation.title];
    setCareerGoalSaving(true);
    try {
      const nextBackground = await updateMyCareerBackground({
        ...normalized,
        careerInterests: nextCareerInterests,
      });
      const recommendationsPayload = await getMyCareerRecommendations({
        limit: CAREER_RECOMMENDATION_LIMIT,
        minimumMatchScore: CAREER_MATCH_MIN_SCORE,
      });
      setCareerBackground(nextBackground || {});
      setCareerRecommendations(recommendationsPayload?.recommendations || []);
      message.success(`${selectedCareerRecommendation.title} added as a career goal.`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to add career goal.");
    } finally {
      setCareerGoalSaving(false);
    }
  };

  const profileGuideSteps = useMemo(
    () =>
      createProfileGuideSteps({
        profileHeroRef,
        profileDashboardTabsRef,
        profileLearningRef,
        profileRecordsRef,
        profileCareerRef,
      }),
    [],
  );

  const handleProfileTourStepChange = useCallback(
    (stepIndex) =>
      prepareProfileTourStep(stepIndex, {
        setActiveDashboard,
        setLearningRecordsTab,
      }),
    [],
  );

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

  const dashboardTabs = (
    <div
      className="user-profile-page__folder-tabs"
      ref={profileDashboardTabsRef}
      role="tablist"
      aria-label="Dashboard switch"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeDashboard === "learning"}
        className={`user-profile-page__folder-tab ${activeDashboard === "learning" ? "is-active" : ""}`}
        onClick={() => setActiveDashboard("learning")}
      >
        Learning
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeDashboard === "career"}
        className={`user-profile-page__folder-tab ${activeDashboard === "career" ? "is-active" : ""}`}
        onClick={() => setActiveDashboard("career")}
      >
        Career
      </button>
    </div>
  );

  return (
    <div className="user-profile-page">
      <CareerOnboardingModal
        open={careerOnboardingOpen}
        taxonomy={careerTaxonomy}
        loading={careerOnboardingSubmitting}
        onSubmit={handleCareerOnboardingSubmit}
      />
      <Modal
        open={tourPromptOpen}
        title="Your first note is ready"
        onCancel={handleSkipProfileTour}
        footer={[
          <Button key="later" onClick={handleSkipProfileTour}>
            Skip tour for now
          </Button>,
          <Button key="tour" type="default" onClick={handleStartProfileTour}>
            View tours now
          </Button>,
          <Button
            key="note"
            type="primary"
            onClick={() => {
              setTourPromptOpen(false);
              setChainNotesTourAfterProfile(false);
              navigate(resolveRecommendedNoteUrl());
            }}
          >
            Start recommended note
          </Button>,
        ]}
      >
        <Space direction="vertical" size={8}>
          <Paragraph>
            We recommend starting with{" "}
            <Text strong>
              {recommendedFirstNote?.note_title ||
                recommendedFirstNote?.noteTitle ||
                "your first recommended note"}
            </Text>
            .
          </Paragraph>
          <Paragraph type="secondary">
            View a short profile tour, then a learning workspace tour on your recommended note. Skip
            for now, or reopen either anytime with the question-mark button.
          </Paragraph>
        </Space>
      </Modal>
      <div className="user-profile-page__container">
        <div>
          <Card className="user-profile-page__hero" ref={profileHeroRef}>
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
                <Button icon={<BookOutlined />} onClick={() => navigate(continueLearningUrl)}>
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
                  startToken={profileTourStartToken}
                  onBeforeStepChange={handleProfileTourStepChange}
                  onAfterFinish={handleProfileTourAfterFinish}
                />
              </Space>
            </div>
          </Space>
          </Card>
        </div>

        {activeDashboard === "learning" ? (
        <div ref={profileLearningRef}>
          <Card title={dashboardTabs} className="user-profile-page__section user-profile-page__dashboard-card">
            <Tabs
              activeKey={learningRecordsTab}
              onChange={setLearningRecordsTab}
              items={[
                {
                  key: "study",
                  label: "Study Records",
                  children: (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} lg={12}>
                        <Card type="inner" title="Learning Progress" extra={<Button type="link">View all</Button>}>
                          {learningTracks.length > 0 ? (
                            <Space direction="vertical" className="user-profile-page__block" size={16}>
                              {learningTracks.map((track) => (
                                <div key={track.id}>
                                  <div className="user-profile-page__track-head">
                                    <Text strong>{track.title}</Text>
                                    <SemanticChip variant={getProgressStateChipVariant(track.status)}>
                                      {track.status}
                                    </SemanticChip>
                                  </div>
                                  <Progress
                                    percent={track.progress}
                                    strokeColor={getProgressStateStrokeColor(track.status, track.progress)}
                                  />
                                  <Text type="secondary">Current topic: {track.current}</Text>
                                </div>
                              ))}
                            </Space>
                          ) : (
                            <Empty description="No learning progress yet." />
                          )}
                        </Card>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Card
                          type="inner"
                          title="Achievements"
                          extra={
                            <Button type="link" onClick={() => setAchievementsViewAllOpen(true)}>
                              View all
                            </Button>
                          }
                        >
                          <AchievementsPanel
                            achievements={achievements}
                            overview={profileOverview}
                            subjects={achievementSubjects}
                            viewAllOpen={achievementsViewAllOpen}
                            onViewAllClose={() => setAchievementsViewAllOpen(false)}
                          />
                        </Card>
                      </Col>
                      <Col xs={24}>
                        <Card type="inner" title="Learning History" className="user-profile-page__timeline-card">
                          <div className="user-profile-page__contrib">
                            <div className="user-profile-page__contrib-body">
                              <div className="user-profile-page__contrib-weekdays">
                                <span>Mon</span>
                                <span>Wed</span>
                                <span>Fri</span>
                              </div>
                              <div className="user-profile-page__contrib-main">
                                <div
                                  className="user-profile-page__contrib-months"
                                  style={{
                                    gridTemplateColumns: `repeat(${contributionMatrix.weeks.length}, minmax(7px, 1fr))`,
                                  }}
                                >
                                  {contributionMatrix.monthLabels.map((item) => (
                                    <span
                                      key={item.id}
                                      className="user-profile-page__contrib-month"
                                      style={{ gridColumnStart: item.column }}
                                    >
                                      {item.label}
                                    </span>
                                  ))}
                                </div>
                                <div
                                  className="user-profile-page__contrib-grid"
                                  style={{
                                    gridTemplateColumns: `repeat(${contributionMatrix.weeks.length}, minmax(7px, 1fr))`,
                                  }}
                                >
                                  {contributionMatrix.weeks.map((week) => (
                                    <div key={week.id} className="user-profile-page__contrib-week">
                                      {week.days.map((day) => (
                                        <Tooltip
                                          key={day.key}
                                          placement="top"
                                          title={
                                            <div className="user-profile-page__contrib-tooltip">
                                              <div>
                                                <strong>{day.dateLabel}</strong> · {day.count} notes
                                              </div>
                                              {day.count > 0 ? (
                                                <ul className="user-profile-page__contrib-tooltip-list">
                                                  {[...new Set(day.notes)].slice(0, 6).map((note) => (
                                                    <li key={`${day.key}-${note}`}>{note}</li>
                                                  ))}
                                                </ul>
                                              ) : (
                                                <div>No study activity on this day.</div>
                                              )}
                                            </div>
                                          }
                                        >
                                          <span className={`user-profile-page__contrib-cell level-${day.level}`} />
                                        </Tooltip>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          {contributionMatrix.totalContributions === 0 ? (
                            <Empty description="No learning history yet." />
                          ) : null}
                        </Card>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: "interactions",
                  label: "Interaction Records",
                  children: (
                    <div ref={profileRecordsRef}>
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
                              personalNoteQuotes.length > 0 ? (
                                <List
                                  dataSource={personalNoteQuotes}
                                  renderItem={(item) => (
                                    <List.Item
                                      className="user-profile-page__quote-note"
                                      onClick={() => {
                                        const quoteUrl = `${item.note_url}${item.note_url.includes("?") ? "&" : "?"}quoteId=${encodeURIComponent(item.quote_id)}`;
                                        navigate(quoteUrl);
                                      }}
                                    >
                                      <List.Item.Meta
                                        title={item.note_title || item.note_url}
                                        description={
                                          item.created_at
                                            ? `${item.subject || "General"} · ${normalizeDate(item.created_at)}`
                                            : `${item.subject || "General"}`
                                        }
                                      />
                                      <Paragraph className="user-profile-page__quote-text">
                                        {item.selected_text}
                                      </Paragraph>
                                    </List.Item>
                                  )}
                                />
                              ) : (
                                <Empty description="No saved notes yet." />
                              )
                            ),
                          },
                        ]}
                        tabBarExtraContent={
                          <Button type="link" onClick={() => setConversationWorkspaceOpen(true)}>
                            Open conversation workspace
                          </Button>
                        }
                      />
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </div>
        ) : null}

        {activeDashboard === "career" ? (
        <div ref={profileCareerRef}>
          <Card title={dashboardTabs} className="user-profile-page__section user-profile-page__dashboard-card">
            <Card type="inner" title="My Background Atlas" className="user-profile-page__section">
              <Space direction="vertical" className="user-profile-page__block" size={12}>
                <div>
                  <Text strong>Knowledge Areas</Text>
                  <div className="user-profile-page__tag-wall">
                    {accumulationDashboard.knowledge.length > 0 ? (
                      accumulationDashboard.knowledge.map((item) => (
                        <SemanticChip key={`knowledge-${item}`} variant={getKnowledgeAreaChipVariant(item)}>
                          {item}
                        </SemanticChip>
                      ))
                    ) : (
                      <Text type="secondary">No knowledge areas yet.</Text>
                    )}
                  </div>
                </div>
                <div>
                  <Text strong>Skills</Text>
                  <div className="user-profile-page__tag-wall">
                    {accumulationDashboard.skills.length > 0 ? (
                      accumulationDashboard.skills.map((item) => (
                        <SemanticChip key={`skill-${item}`} variant={getSkillChipVariant(item)}>
                          {item}
                        </SemanticChip>
                      ))
                    ) : (
                      <Text type="secondary">No skills tagged yet.</Text>
                    )}
                  </div>
                </div>
                <div>
                  <Text strong>Tools</Text>
                  <div className="user-profile-page__tag-wall">
                    {accumulationDashboard.tools.length > 0 ? (
                      accumulationDashboard.tools.map((item) => (
                        <SemanticChip key={`tool-${item}`} variant={getToolChipVariant()}>
                          {item}
                        </SemanticChip>
                      ))
                    ) : (
                      <Text type="secondary">No tools tracked yet.</Text>
                    )}
                  </div>
                </div>
              </Space>
            </Card>
            <Card type="inner" title="My Career Goal" className="user-profile-page__section">
              {careerGoals.length > 0 ? (
                <div className="user-profile-page__tag-wall">
                  {careerGoals.map((goal) => (
                    <SemanticChip key={`career-goal-${goal}`} variant={getCareerGoalChipVariant()}>
                      {goal}
                    </SemanticChip>
                  ))}
                </div>
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No career goals yet. Add one from Career Matches."
                />
              )}
            </Card>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={17}>
                <Card type="inner" title="Career Matches">
                  <Row gutter={[20, 20]}>
                    <Col xs={24} lg={11}>
                      <div className="user-profile-page__career-pane">
                        <CareerBackgroundCard
                          key={JSON.stringify(careerBackground)}
                          background={careerBackground}
                          taxonomy={careerTaxonomy}
                          learningTracks={learningTracks}
                          onSave={handleCareerBackgroundSave}
                          saving={careerSaving}
                          disabled={previewMode}
                        />
                      </div>
                    </Col>
                    <Col xs={24} lg={13}>
                      <div className="user-profile-page__career-pane">
                        <CareerRecommendationsCard
                          recommendations={visibleCareerRecommendations}
                          loading={careerLoading}
                          errorText={careerErrorText}
                          selectedTitle={selectedCareerRole}
                          minimumScore={CAREER_MATCH_MIN_SCORE}
                          onSelect={(roleTitle) => setSelectedCareerRole(roleTitle)}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} lg={7}>
                <Card type="inner" title="Role Details">
                  {selectedCareerRecommendation ? (
                    <Space direction="vertical" size={12} className="user-profile-page__block">
                      <div className="user-profile-page__role-detail-head">
                        <Text strong>{selectedCareerRecommendation.title}</Text>
                        <SemanticChip
                          variant={getMatchScoreChipVariant(
                            selectedCareerRecommendation.match_score ?? selectedCareerRecommendation.matchScore,
                          )}
                        >
                          {formatScore(
                            selectedCareerRecommendation.match_score ?? selectedCareerRecommendation.matchScore,
                          )}% match
                        </SemanticChip>
                      </div>
                      <Progress
                        percent={formatScore(
                          selectedCareerRecommendation.match_score ?? selectedCareerRecommendation.matchScore,
                        )}
                        showInfo={false}
                        strokeColor={getMatchScoreStrokeColor(
                          selectedCareerRecommendation.match_score ?? selectedCareerRecommendation.matchScore,
                        )}
                      />
                      <Space wrap size={[8, 8]}>
                        <SemanticChip
                          variant={getMatchScoreChipVariant(
                            selectedCareerRecommendation.knowledge_match ??
                              selectedCareerRecommendation.knowledgeMatch,
                          )}
                        >
                          Knowledge{" "}
                          {formatScore(
                            selectedCareerRecommendation.knowledge_match ??
                              selectedCareerRecommendation.knowledgeMatch,
                          )}
                          %
                        </SemanticChip>
                        <SemanticChip
                          variant={getMatchScoreChipVariant(
                            selectedCareerRecommendation.skill_match ?? selectedCareerRecommendation.skillMatch,
                          )}
                        >
                          Skills{" "}
                          {formatScore(
                            selectedCareerRecommendation.skill_match ??
                              selectedCareerRecommendation.skillMatch,
                          )}
                          %
                        </SemanticChip>
                        <SemanticChip
                          variant={getMatchScoreChipVariant(
                            selectedCareerRecommendation.work_style_match ??
                              selectedCareerRecommendation.workStyleMatch,
                          )}
                        >
                          Work Style{" "}
                          {formatScore(
                            selectedCareerRecommendation.work_style_match ??
                              selectedCareerRecommendation.workStyleMatch,
                          )}
                          %
                        </SemanticChip>
                      </Space>
                      <Paragraph className="career-recommendation-card__reasoning">
                        {selectedCareerRecommendation.reasoning ||
                          "This role has partial overlap with your learning record."}
                      </Paragraph>
                      <div className="user-profile-page__role-related">
                        <Text strong>Related Subjects</Text>
                        <div className="user-profile-page__tag-wall">
                          {selectedCareerSubjects.length > 0 ? (
                            selectedCareerSubjects.map((subject) => (
                              <SemanticChip
                                key={`role-subject-${subject.slug}`}
                                variant={getSubjectChipVariant(subject.score)}
                              >
                                {subject.title} {subject.score ? `${subject.score}%` : ""}
                              </SemanticChip>
                            ))
                          ) : (
                            <Text type="secondary">No subject links yet.</Text>
                          )}
                        </div>
                      </div>
                      <div className="user-profile-page__role-related">
                        <Text strong>Related Skills</Text>
                        <div className="user-profile-page__tag-wall">
                          {selectedCareerSkills.length > 0 ? (
                            selectedCareerSkills.slice(0, 12).map((skill) => (
                              <SemanticChip key={`role-skill-${skill}`} variant={getSkillChipVariant(skill)}>
                                {skill}
                              </SemanticChip>
                            ))
                          ) : (
                            <Text type="secondary">No related skills yet.</Text>
                          )}
                        </div>
                      </div>
                      <Space wrap size={[8, 8]}>
                        {(selectedCareerRecommendation.skill_gaps ||
                          selectedCareerRecommendation.skillGaps ||
                          []).slice(0, 6).map((gap) => (
                          <SemanticChip
                            key={`${selectedCareerRecommendation.job_id || selectedCareerRecommendation.jobId}-${gap.category}-${gap.skill}`}
                            variant={getGapChipVariant()}
                          >
                            {gap.skill}
                          </SemanticChip>
                        ))}
                      </Space>
                      <Divider style={{ margin: "4px 0" }} />
                      <div className="user-profile-page__career-gaps">
                        <Text strong>Skill Gap</Text>
                        <CareerSkillGapPanel
                          recommendations={visibleCareerRecommendations.filter(
                            (item) => item?.title === selectedCareerRole,
                          )}
                        />
                      </div>
                      <Space wrap>
                        <Button
                          size="small"
                          type="link"
                          onClick={() => {
                            const jobId =
                              selectedCareerRecommendation.job_id ||
                              selectedCareerRecommendation.jobId ||
                              "";
                            if (jobId) {
                              navigate(`/careers/${encodeURIComponent(jobId)}`);
                              return;
                            }
                            const matchedProfile = careerTaxonomy.find(
                              (item) => item?.title === selectedCareerRecommendation.title,
                            );
                            if (matchedProfile?.job_id || matchedProfile?.jobId) {
                              navigate(
                                `/careers/${encodeURIComponent(matchedProfile.job_id || matchedProfile.jobId)}`,
                              );
                            }
                          }}
                        >
                          Open full role profile
                        </Button>
                        <Button
                          size="small"
                          type="link"
                          loading={careerGoalSaving}
                          disabled={previewMode || selectedCareerIsGoal}
                          onClick={handleAddCareerGoal}
                        >
                          {selectedCareerIsGoal ? "Career goal added" : "Add as career goal"}
                        </Button>
                      </Space>
                    </Space>
                  ) : (
                    <Empty description="Select a role to view details." />
                  )}
                </Card>
              </Col>
            </Row>
            <button
              type="button"
              className="ns-career-nav-link user-profile-page__explore-careers"
              onClick={() => navigate("/careers")}
            >
              <span className="ns-career-nav-link__label">Explore Careers</span>
              <DownOutlined className="ns-career-nav-link__icon" aria-hidden="true" />
            </button>
          </Card>
        </div>
        ) : null}
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
                  <SemanticChip variant="slate">{activeConversation.note}</SemanticChip>
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
