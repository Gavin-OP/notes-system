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
  Form,
  Input,
  List,
  message,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import {
  BookOutlined,
  CloseOutlined,
  CommentOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import SemanticChip from "../../../shared/ui/SemanticChip";
import {
  getCareerGoalChipVariant,
  getKnowledgeAreaChipVariant,
  getMatchScoreChipVariant,
  getMatchScoreStrokeColor,
  getProgressStateChipVariant,
  getProgressStateStrokeColor,
  getSkillChipVariant,
  getSubjectChipVariant,
  getToolChipVariant,
} from "../../../shared/lib/semanticChipUtils";
import {
  deleteMyAnnotation,
  getCurrentUser,
  getMyNoteQuotes,
  getMyProfile,
  getUserProgress,
  logoutUser,
  updateMyGuideState,
  updateMyProfile,
  UserApiError,
} from "../api/user";
import {
  getCareerTaxonomy,
  getMyCareerBackground,
  getMyCareerRecommendations,
  getSubjectJobMatches,
  submitCareerOnboarding,
  updateMyCareerBackground,
} from "../../careers/api/careers";
import CareerBackgroundCard from "../../careers/components/CareerBackgroundCard";
import CareerOnboardingModal from "../../careers/components/CareerOnboardingModal";
import CareerRecommendationsCard from "../../careers/components/CareerRecommendationsCard";
import CareerSkillGapPanel from "../../careers/components/CareerSkillGapPanel";
import AchievementsPanel, { normalizeAchievements } from "../components/achievements/AchievementsPanel";
import { extractSubjectsFromNotesIndex } from "../components/achievements/achievementCatalog";
import { isConcreteNoteRoute, normalizeNoteRoute } from "../../navigation/lib/notesIndexUtils";
import AppFeatureTour, { PENDING_NOTES_TOUR_KEY } from "../components/guide/AppFeatureTour";
import { CAREER_LEVEL_OPTIONS, formatCareerRoleLabel, formatTaxonomyLabel } from "../../careers/lib/careerDisplayUtils";
import useTranslatedContent from "../../../i18n/useTranslatedContent";
import useTranslation from "../../../i18n/useTranslation";
import { generateLearningPath } from "../../assistant/api/assistant";
import {
  createProfileGuideSteps,
  prepareProfileTourStep,
} from "../components/guide/productTours";

import "./UserProfilePage.css";

const { Title, Text, Paragraph } = Typography;
const CONTRIBUTION_TOTAL_WEEKS = 52;
const CAREER_MATCH_MIN_SCORE = 20;
const CAREER_RECOMMENDATION_LIMIT = 50;
const PROFILE_PREVIEW_ENABLED =
  import.meta.env.VITE_ENABLE_PROFILE_PREVIEW === "true" &&
  !String(import.meta.env.VITE_API_BASE_URL || "").trim();

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
  const seen = new Set();
  const result = [];
  values.forEach((value) => {
    const label = formatTaxonomyLabel(value);
    const key = label.toLowerCase();
    if (!label || seen.has(key)) return;
    seen.add(key);
    result.push(label);
  });
  return result.sort((a, b) => a.localeCompare(b));
}

function toSelectOptions(values = []) {
  return uniqueValues(values).map((value) => ({ label: value, value }));
}

function buildProfileEditOptions(taxonomy = [], normalized = {}, inferredKnowledge = []) {
  const profiles = Array.isArray(taxonomy) ? taxonomy : [];
  const degreeFields = profiles.flatMap((profile) =>
    (profile.degree_requirements || profile.degreeRequirements || []).flatMap(
      (requirement) => requirement.fields || [],
    ),
  );
  return {
    knowledge: toSelectOptions([
      "Data Science",
      "Computer Science",
      "Statistics",
      "Business Analytics",
      "Python",
      "Machine Learning",
      ...degreeFields,
      ...inferredKnowledge,
      ...(normalized.knowledgeAreas || []),
    ]),
    skills: toSelectOptions([
      "Machine Learning",
      "Data Visualization",
      "Statistics",
      "SQL",
      "Experimentation",
      "Data Cleaning",
      ...profiles.flatMap((profile) => profile.hard_skills || profile.hardSkills || []),
      ...(normalized.skills || []),
    ]),
    tools: toSelectOptions([
      "Python",
      "SQL",
      "Pandas",
      "PyTorch",
      "Tableau",
      "Power BI",
      ...profiles.flatMap((profile) => profile.tools || []),
      ...(normalized.tools || []),
    ]),
    careers: toSelectOptions([
      ...profiles.map((profile) =>
        formatCareerRoleLabel(
          profile.title,
          profile.experience_level || profile.experienceLevel,
        ),
      ),
      ...(normalized.careerInterests || []),
    ]),
  };
}

function getCareerRelatedSubjects(recommendation) {
  return (recommendation?.related_subjects || recommendation?.relatedSubjects || []).filter(Boolean);
}

function getCareerRelatedSkills(recommendation) {
  return (recommendation?.related_skills || recommendation?.relatedSkills || []).filter(Boolean);
}

function getCareerDescription(recommendation, profile) {
  return recommendation?.description || profile?.description || "";
}

function getCareerJobId(item) {
  return item?.job_id || item?.jobId || "";
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

function getSubjectScore(subject) {
  const rawScore = subject?.score ?? subject?.match_score ?? subject?.matchScore ?? 0;
  const numeric = Number(rawScore);
  if (!Number.isFinite(numeric)) return 0;
  return numeric <= 1 ? numeric * 100 : numeric;
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

const AVATAR_PALETTE = [
  { background: "#3A6EA5", color: "#FFFFFF" },
  { background: "#F4D06F", color: "#5A4615" },
  { background: "#7BAE7F", color: "#FFFFFF" },
  { background: "#4FA3A5", color: "#FFFFFF" },
  { background: "#D9826B", color: "#FFFFFF" },
  { background: "#9B8ACB", color: "#FFFFFF" },
];

function getAvatarSeed(user) {
  return user?.displayName || user?.email || user?.id || "Learner";
}

function getAvatarInitial(user) {
  const seed = getAvatarSeed(user).trim();
  if (!seed) return "L";
  const namePart = seed.includes("@") ? seed.split("@")[0] : seed;
  const firstToken = namePart.trim().split(/\s+/)[0] || namePart;
  return Array.from(firstToken)[0]?.toUpperCase() || "L";
}

function getPaletteIndex(seed) {
  return Array.from(seed || "Learner").reduce((sum, char) => sum + char.charCodeAt(0), 0) % AVATAR_PALETTE.length;
}

function UserProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const rawNotesIndex = useSelector((state) => state.notesIndex?.data);
  const notesIndex = useMemo(() => rawNotesIndex || [], [rawNotesIndex]);
  const [conversationWorkspaceOpen, setConversationWorkspaceOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [profileInfo, setProfileInfo] = useState({});
  const [personalNoteQuotes, setPersonalNoteQuotes] = useState([]);
  const [deletingNoteQuoteId, setDeletingNoteQuoteId] = useState("");
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
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [profileEditSaving, setProfileEditSaving] = useState(false);
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
  const avatarSeed = getAvatarSeed(userInfo);
  const avatarTone = AVATAR_PALETTE[getPaletteIndex(avatarSeed)];
  const avatarInitial = getAvatarInitial(userInfo);

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
        if (PROFILE_PREVIEW_ENABLED) {
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
          return;
        }
        setPreviewMode(false);
        setPreviewNotice("");
        setErrorText(messageText);
        if (error instanceof UserApiError && error.status === 401) {
          navigate("/user/login", {
            replace: true,
            state: { from: location.pathname },
          });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      mounted = false;
    };
  }, [location.pathname, navigate]);

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

  const profileEditBackground = useMemo(
    () => normalizeCareerBackgroundForForm(careerBackground),
    [careerBackground],
  );

  const profileEditInferredKnowledge = useMemo(
    () => learningTracks.map((track) => track.title).filter(Boolean),
    [learningTracks],
  );

  const profileEditOptions = useMemo(
    () => buildProfileEditOptions(careerTaxonomy, profileEditBackground, profileEditInferredKnowledge),
    [careerTaxonomy, profileEditBackground, profileEditInferredKnowledge],
  );

  const profileEditInitialValues = useMemo(
    () => ({
      displayName: userInfo?.displayName || "Learner",
      knowledgeAreas: profileEditBackground.knowledgeAreas.length
        ? profileEditBackground.knowledgeAreas
        : profileEditInferredKnowledge,
      skills: profileEditBackground.skills,
      tools: profileEditBackground.tools,
      careerInterests: profileEditBackground.careerInterests,
      experienceLevels: profileEditBackground.experienceLevels.length
        ? profileEditBackground.experienceLevels
        : ["Entry"],
    }),
    [profileEditBackground, profileEditInferredKnowledge, userInfo],
  );

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

  const selectedCareerProfile = useMemo(() => {
    if (!selectedCareerRecommendation) return null;
    const recommendationJobId = getCareerJobId(selectedCareerRecommendation);
    if (recommendationJobId) {
      const byJobId = careerTaxonomy.find((item) => getCareerJobId(item) === recommendationJobId);
      if (byJobId) return byJobId;
    }
    const normalizedRole = normalizeText(selectedCareerRole);
    return (
      careerTaxonomy.find(
        (item) =>
          normalizeText(item?.title) === normalizedRole ||
          normalizeText(`${item?.title || ""} ${item?.experience_level || item?.experienceLevel || ""}`) ===
            normalizedRole,
      ) || null
    );
  }, [careerTaxonomy, selectedCareerRecommendation, selectedCareerRole]);

  const selectedRoleSubjectMatches = useMemo(() => {
    const normalizedRole = normalizeText(selectedCareerRole);
    const recommendationJobId = getCareerJobId(selectedCareerRecommendation);
    const profileTitle = selectedCareerProfile?.title || selectedCareerRole;
    const normalizedProfileTitle = normalizeText(profileTitle);
    if (!normalizedRole && !recommendationJobId && !normalizedProfileTitle) return [];
    return subjectJobMatches
      .filter((match) => {
        if (recommendationJobId && getCareerJobId(match) === recommendationJobId) return true;
        const matchTitle = normalizeText(getMatchJobTitle(match));
        return matchTitle === normalizedRole || matchTitle === normalizedProfileTitle;
      })
      .sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [selectedCareerProfile, selectedCareerRecommendation, selectedCareerRole, subjectJobMatches]);

  const selectedCareerSubjects = useMemo(() => {
    const apiSubjects = getCareerRelatedSubjects(selectedCareerRecommendation).map((subject) => ({
      title: subject.subject_title || subject.subjectTitle || subject.title || slugToSubjectTitle(subject.subject_slug || subject.slug),
      slug: subject.subject_slug || subject.subjectSlug || subject.slug || "",
      score: formatScore(getSubjectScore(subject)),
    }));
    const matchSubjects = selectedRoleSubjectMatches.map((match) => ({
      title: getMatchSubjectTitle(match),
      slug: getMatchSubjectSlug(match),
      score: formatScore((match.score || 0) * 100),
    }));
    const bySlug = new Map();
    [...apiSubjects, ...matchSubjects].forEach((subject) => {
      const key = subject.slug || subject.title;
      if (!key) return;
      const existing = bySlug.get(key);
      if (!existing || subject.score > existing.score) bySlug.set(key, subject);
    });
    return Array.from(bySlug.values()).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  }, [selectedCareerRecommendation, selectedRoleSubjectMatches]);

  const selectedCareerSkills = useMemo(() => {
    return uniqueValues([
      ...getCareerRelatedSkills(selectedCareerRecommendation),
      ...(selectedCareerProfile?.hard_skills || selectedCareerProfile?.hardSkills || []),
      ...(selectedCareerProfile?.tools || []),
    ]);
  }, [selectedCareerProfile, selectedCareerRecommendation]);

  const selectedCareerDescription = useMemo(
    () => getCareerDescription(selectedCareerRecommendation, selectedCareerProfile),
    [selectedCareerProfile, selectedCareerRecommendation],
  );
  const translatedSelectedCareerDescription = useTranslatedContent(selectedCareerDescription, {
    sourceType: "career_description",
    sourceId: getCareerJobId(selectedCareerRecommendation) || selectedCareerRole || "career-role",
    disabled: !selectedCareerDescription,
  });

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

  const resolvePersonalNoteQuoteId = (item) =>
    String(item?.quote_id || item?.annotation_id || item?.id || "").trim();

  const handleDeletePersonalNoteQuote = (item, event) => {
    event.preventDefault();
    event.stopPropagation();
    const quoteId = resolvePersonalNoteQuoteId(item);
    if (!quoteId || deletingNoteQuoteId) return;

    Modal.confirm({
      title: t("profile.learning.deleteSavedNoteConfirmTitle"),
      content: t("profile.learning.deleteSavedNoteConfirmBody"),
      okText: t("common.delete"),
      okButtonProps: { danger: true },
      cancelText: t("common.cancel"),
      onOk: async () => {
        setDeletingNoteQuoteId(quoteId);
        try {
          await deleteMyAnnotation(quoteId);
          setPersonalNoteQuotes((prev) =>
            prev.filter((entry) => resolvePersonalNoteQuoteId(entry) !== quoteId),
          );
          message.success(t("profile.learning.deleteSavedNoteSuccess"));
        } catch (error) {
          message.error(
            error instanceof Error
              ? error.message
              : t("profile.learning.deleteSavedNoteFailed"),
          );
        } finally {
          setDeletingNoteQuoteId("");
        }
      },
    });
  };

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

  const handleEditProfile = () => {
    setProfileEditOpen(true);
  };

  const handleProfileEditSubmit = async (values) => {
    if (previewMode) {
      message.info(t("profile.edit.previewDisabled"));
      return;
    }
    setProfileEditSaving(true);
    try {
      const [nextProfile, nextBackground] = await Promise.all([
        updateMyProfile({ displayName: values.displayName }),
        updateMyCareerBackground(values),
      ]);
      const recommendationsPayload = await getMyCareerRecommendations({
        limit: CAREER_RECOMMENDATION_LIMIT,
        minimumMatchScore: CAREER_MATCH_MIN_SCORE,
      });
      setUserInfo((current) => ({
        ...(current || {}),
        displayName: nextProfile?.display_name || nextProfile?.displayName || values.displayName,
        email: nextProfile?.email || current?.email || "",
      }));
      setProfileInfo(nextProfile || profileInfo);
      setCareerBackground(nextBackground || {});
      setCareerRecommendations(recommendationsPayload?.recommendations || []);
      setActiveDashboard("career");
      setProfileEditOpen(false);
      message.success(t("profile.edit.success"));
    } catch (error) {
      message.error(error instanceof Error ? error.message : t("profile.edit.error"));
    } finally {
      setProfileEditSaving(false);
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
      const recommendedSubject =
        nextRecommendedNote?.subject_slug ||
        nextRecommendedNote?.subjectSlug ||
        nextBackground?.recommended_subject_slug ||
        nextBackground?.recommendedSubjectSlug;
      if (recommendedSubject) {
        generateLearningPath({
          goal_type: "subject",
          goal_id: recommendedSubject,
          subject_slugs: [recommendedSubject],
          save_as_draft: true,
          commit: true,
        }).catch(() => {
          // The first-note recommendation should still work if path generation is unavailable.
        });
      }
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
      }, t),
    [t],
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
                {t("profile.state.goLogin")}
              </Button>
              <Button onClick={() => window.location.reload()}>{t("common.retry")}</Button>
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
        {t("profile.tabs.learning")}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeDashboard === "career"}
        className={`user-profile-page__folder-tab ${activeDashboard === "career" ? "is-active" : ""}`}
        onClick={() => setActiveDashboard("career")}
      >
        {t("profile.tabs.career")}
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
        open={profileEditOpen}
        title={null}
        footer={null}
        width={720}
        centered
        destroyOnClose
        onCancel={() => setProfileEditOpen(false)}
      >
        <Space direction="vertical" size={16} className="user-profile-page__edit-modal">
          <div>
            <Title level={3}>{t("profile.edit.title")}</Title>
            <Paragraph type="secondary">
              {t("profile.edit.description")}
            </Paragraph>
          </div>
          <Form
            key={`${userInfo?.id || "user"}-${profileEditOpen ? "open" : "closed"}`}
            layout="vertical"
            requiredMark={false}
            initialValues={profileEditInitialValues}
            onFinish={handleProfileEditSubmit}
          >
            <Form.Item
              label={t("profile.edit.displayName")}
              name="displayName"
              rules={[{ required: true, whitespace: true, message: t("profile.edit.displayNameRequired") }]}
            >
              <Input placeholder={t("profile.edit.displayNamePlaceholder")} disabled={profileEditSaving} />
            </Form.Item>
            <Form.Item label={t("profile.edit.knowledge")} name="knowledgeAreas">
              <Select
                mode="tags"
                placeholder={t("profile.edit.knowledgePlaceholder")}
                options={profileEditOptions.knowledge}
                disabled={profileEditSaving}
              />
            </Form.Item>
            <Form.Item label={t("profile.edit.skills")} name="skills">
              <Select
                mode="tags"
                placeholder={t("profile.edit.skillsPlaceholder")}
                options={profileEditOptions.skills}
                disabled={profileEditSaving}
              />
            </Form.Item>
            <Form.Item label={t("profile.edit.tools")} name="tools">
              <Select
                mode="tags"
                placeholder={t("profile.edit.toolsPlaceholder")}
                options={profileEditOptions.tools}
                disabled={profileEditSaving}
              />
            </Form.Item>
            <Form.Item label={t("profile.edit.careers")} name="careerInterests">
              <Select
                mode="tags"
                placeholder={t("profile.edit.careersPlaceholder")}
                options={profileEditOptions.careers}
                disabled={profileEditSaving}
              />
            </Form.Item>
            <Form.Item label={t("profile.edit.level")} name="experienceLevels">
              <Select
                mode="multiple"
                allowClear
                placeholder={t("profile.edit.levelPlaceholder")}
                options={CAREER_LEVEL_OPTIONS}
                disabled={profileEditSaving}
              />
            </Form.Item>
            <Space className="user-profile-page__edit-actions" wrap>
              <Button onClick={() => setProfileEditOpen(false)} disabled={profileEditSaving}>
                {t("common.cancel")}
              </Button>
              <Button type="primary" htmlType="submit" loading={profileEditSaving}>
                {t("profile.edit.save")}
              </Button>
            </Space>
          </Form>
        </Space>
      </Modal>
      <Modal
        open={tourPromptOpen}
        title={t("profile.tourPrompt.title")}
        onCancel={handleSkipProfileTour}
        footer={[
          <Button key="later" onClick={handleSkipProfileTour}>
            {t("profile.tourPrompt.later")}
          </Button>,
          <Button key="tour" type="default" onClick={handleStartProfileTour}>
            {t("profile.tourPrompt.start")}
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
            {t("profile.tourPrompt.openFirstNote")}
          </Button>,
        ]}
      >
        <Space direction="vertical" size={8}>
          <Paragraph>
            {t("profile.tourPrompt.firstNoteReady")}{" "}
            <Text strong>
              {recommendedFirstNote?.note_title ||
                recommendedFirstNote?.noteTitle ||
                "your first recommended note"}
            </Text>
            .
          </Paragraph>
          <Paragraph type="secondary">
            {t("profile.tourPrompt.body")}
          </Paragraph>
        </Space>
      </Modal>
      <div className="user-profile-page__container">
        <div>
          <Card className="user-profile-page__hero" ref={profileHeroRef}>
          <Space align="start" size={16}>
            <div
              className="user-profile-page__avatar"
              style={{ backgroundColor: avatarTone.background, color: avatarTone.color }}
              aria-label={`${userInfo?.displayName || "Learner"} avatar`}
            >
              <span>{avatarInitial}</span>
            </div>
            <div>
              {previewMode ? (
                <Alert
                  type="warning"
                  showIcon
                  style={{ marginBottom: 12 }}
                  message={t("profile.preview.message")}
                  description={
                    previewNotice ||
                    t("profile.preview.description")
                  }
                />
              ) : null}
              <Title level={3} className="user-profile-page__hero-title">
                {userInfo?.displayName || "Learner"}
              </Title>
              <Text type="secondary">{userInfo?.email || "-"}</Text>
              <Paragraph className="user-profile-page__hero-desc">
                {t("profile.hero.description")}
              </Paragraph>
              <Space wrap>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  disabled={previewMode}
                  onClick={handleEditProfile}
                >
                  {t("profile.actions.edit")}
                </Button>
                <Button icon={<BookOutlined />} onClick={() => navigate(continueLearningUrl)}>
                  {t("profile.actions.continue")}
                </Button>
                <Button icon={<LogoutOutlined />} onClick={handleLogout} disabled={previewMode}>
                  {t("profile.actions.logout")}
                </Button>
                <AppFeatureTour
                  guideKey="profile_page"
                  steps={profileGuideSteps}
                  startLabel={t("profile.actions.guide")}
                  iconOnly
                  buttonAriaLabel={t("profile.actions.openGuide")}
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
                  label: t("profile.learning.studyRecords"),
                  children: (
                    <Row gutter={[16, 16]}>
                      <Col xs={24} lg={12}>
                        <Card
                          type="inner"
                          title={t("profile.learning.progress")}
                          extra={<Button type="link">{t("profile.learning.viewAll")}</Button>}
                        >
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
                                  <Text type="secondary">{t("profile.learning.currentTopic")} {track.current}</Text>
                                </div>
                              ))}
                            </Space>
                          ) : (
                            <Empty description={t("profile.learning.noProgress")} />
                          )}
                        </Card>
                      </Col>
                      <Col xs={24} lg={12}>
                        <Card
                          type="inner"
                          title={t("profile.learning.achievements")}
                          extra={
                            <Button type="link" onClick={() => setAchievementsViewAllOpen(true)}>
                              {t("profile.learning.viewAll")}
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
                        <Card type="inner" title={t("profile.learning.history")} className="user-profile-page__timeline-card">
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
                                                <strong>{day.dateLabel}</strong> · {day.count} {t("profile.learning.notesCount")}
                                              </div>
                                              {day.count > 0 ? (
                                                <ul className="user-profile-page__contrib-tooltip-list">
                                                  {[...new Set(day.notes)].slice(0, 6).map((note) => (
                                                    <li key={`${day.key}-${note}`}>{note}</li>
                                                  ))}
                                                </ul>
                                              ) : (
                                                <div>{t("profile.learning.noStudyActivity")}</div>
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
                            <Empty description={t("profile.learning.noHistory")} />
                          ) : null}
                        </Card>
                      </Col>
                    </Row>
                  ),
                },
                {
                  key: "interactions",
                  label: t("profile.learning.interactionRecords"),
                  children: (
                    <div ref={profileRecordsRef}>
                      <Tabs
                        items={[
                          {
                            key: "conversations",
                            label: t("profile.learning.conversations"),
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
                                          {t("profile.learning.openConversation")}
                                        </Button>,
                                      ]}
                                    >
                                      <List.Item.Meta
                                        avatar={<Avatar icon={<CommentOutlined />} />}
                                        title={item.title}
                                        description={`${item.time || t("profile.learning.unknownTime")} · ${item.note}`}
                                      />
                                      <Paragraph>{item.summary}</Paragraph>
                                    </List.Item>
                                  )}
                                />
                              ) : (
                                <Empty description={t("profile.learning.noConversations")} />
                              )
                            ),
                          },
                          {
                            key: "notes",
                            label: t("profile.learning.savedNotes"),
                            children: (
                              personalNoteQuotes.length > 0 ? (
                                <List
                                  dataSource={personalNoteQuotes}
                                  renderItem={(item) => {
                                    const quoteId = resolvePersonalNoteQuoteId(item);
                                    return (
                                    <List.Item
                                      className="user-profile-page__quote-note"
                                      onClick={() => {
                                        const quoteUrl = `${item.note_url}${item.note_url.includes("?") ? "&" : "?"}quoteId=${encodeURIComponent(item.quote_id)}`;
                                        navigate(quoteUrl);
                                      }}
                                    >
                                      <div className="user-profile-page__quote-note-shell">
                                        <Tooltip title={t("profile.learning.deleteSavedNote")}>
                                          <button
                                            type="button"
                                            className="user-profile-page__quote-note-delete"
                                            aria-label={t("profile.learning.deleteSavedNote")}
                                            disabled={deletingNoteQuoteId === quoteId}
                                            onClick={(event) => handleDeletePersonalNoteQuote(item, event)}
                                          >
                                            <CloseOutlined />
                                          </button>
                                        </Tooltip>
                                        <div className="user-profile-page__quote-note-body">
                                        <Text strong className="user-profile-page__quote-title">
                                          {item.note_title || item.note_url}
                                        </Text>
                                        <Text type="secondary" className="user-profile-page__quote-meta">
                                          {item.created_at
                                            ? `${item.subject || "General"} · ${normalizeDate(item.created_at)}`
                                            : `${item.subject || "General"}`}
                                        </Text>
                                        {item.personal_note || item.personalNote ? (
                                          <Paragraph className="user-profile-page__personal-note-text">
                                            {item.personal_note || item.personalNote}
                                          </Paragraph>
                                        ) : null}
                                        <Paragraph className="user-profile-page__quote-text">
                                          {item.selected_text}
                                        </Paragraph>
                                        </div>
                                      </div>
                                    </List.Item>
                                    );
                                  }}
                                />
                              ) : (
                                <Empty description={t("profile.learning.noSavedNotes")} />
                              )
                            ),
                          },
                        ]}
                        tabBarExtraContent={
                          <Button type="link" onClick={() => setConversationWorkspaceOpen(true)}>
                            {t("profile.learning.openConversationWorkspace")}
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
            <Card type="inner" title={t("profile.career.background")} className="user-profile-page__section">
              <Space direction="vertical" className="user-profile-page__block" size={12}>
                <div>
                  <Text strong>{t("profile.career.knowledgeAreas")}</Text>
                  <div className="user-profile-page__tag-wall">
                    {accumulationDashboard.knowledge.length > 0 ? (
                      accumulationDashboard.knowledge.map((item) => (
                        <SemanticChip key={`knowledge-${item}`} variant={getKnowledgeAreaChipVariant(item)}>
                          {item}
                        </SemanticChip>
                      ))
                    ) : (
                      <Text type="secondary">{t("profile.career.noKnowledge")}</Text>
                    )}
                  </div>
                </div>
                <div>
                  <Text strong>{t("profile.career.skills")}</Text>
                  <div className="user-profile-page__tag-wall">
                    {accumulationDashboard.skills.length > 0 ? (
                      accumulationDashboard.skills.map((item) => (
                        <SemanticChip key={`skill-${item}`} variant={getSkillChipVariant(item)}>
                          {item}
                        </SemanticChip>
                      ))
                    ) : (
                      <Text type="secondary">{t("profile.career.noSkills")}</Text>
                    )}
                  </div>
                </div>
                <div>
                  <Text strong>{t("profile.career.tools")}</Text>
                  <div className="user-profile-page__tag-wall">
                    {accumulationDashboard.tools.length > 0 ? (
                      accumulationDashboard.tools.map((item) => (
                        <SemanticChip key={`tool-${item}`} variant={getToolChipVariant()}>
                          {item}
                        </SemanticChip>
                      ))
                    ) : (
                      <Text type="secondary">{t("profile.career.noTools")}</Text>
                    )}
                  </div>
                </div>
              </Space>
            </Card>
            <Card type="inner" title={t("profile.career.goal")} className="user-profile-page__section">
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
                  description={t("profile.career.noGoals")}
                />
              )}
            </Card>
            <Divider />
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={14}>
                <Card type="inner" title={t("profile.career.matches")}>
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
              <Col xs={24} lg={10}>
                <Card type="inner" title={t("profile.career.roleDetails")}>
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
                      <div className="user-profile-page__role-detail-grid">
                        <div className="user-profile-page__role-detail-main">
                          <div className="user-profile-page__role-related">
                            <Text strong>{t("profile.career.jobDescription")}</Text>
                            <Paragraph className="career-recommendation-card__reasoning">
                              {translatedSelectedCareerDescription.content ||
                                selectedCareerDescription ||
                                t("profile.career.descriptionFallback")}
                            </Paragraph>
                          </div>
                          <div className="user-profile-page__role-related">
                            <Text strong>{t("profile.career.relatedSubjects")}</Text>
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
                                <Text type="secondary">{t("profile.career.noSubjects")}</Text>
                              )}
                            </div>
                          </div>
                          <div className="user-profile-page__role-related">
                            <Text strong>{t("profile.career.relatedSkills")}</Text>
                            <div className="user-profile-page__tag-wall">
                              {selectedCareerSkills.length > 0 ? (
                                selectedCareerSkills.slice(0, 12).map((skill) => (
                                  <SemanticChip key={`role-skill-${skill}`} variant={getSkillChipVariant(skill)}>
                                    {skill}
                                  </SemanticChip>
                                ))
                              ) : (
                                <Text type="secondary">{t("profile.career.noRelatedSkills")}</Text>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="user-profile-page__career-gaps">
                          <Text strong>{t("profile.career.skillGap")}</Text>
                          <CareerSkillGapPanel
                            recommendations={visibleCareerRecommendations.filter(
                              (item) => item?.title === selectedCareerRole,
                            )}
                            relatedSubjects={selectedCareerSubjects}
                          />
                        </div>
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
                          {t("profile.career.openFullRole")}
                        </Button>
                        <Button
                          size="small"
                          type="link"
                          loading={careerGoalSaving}
                          disabled={previewMode || selectedCareerIsGoal}
                          onClick={handleAddCareerGoal}
                        >
                          {selectedCareerIsGoal ? t("profile.career.goalAdded") : t("profile.career.addGoal")}
                        </Button>
                      </Space>
                    </Space>
                  ) : (
                    <Empty description={t("profile.career.selectRole")} />
                  )}
                </Card>
              </Col>
            </Row>
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
