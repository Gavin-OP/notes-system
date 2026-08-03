import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  Layout,
  Breadcrumb,
  Button,
  theme,
  Modal,
  Checkbox,
  message,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

import LearningNavigationPanel from "../../navigation/components/LearningNavigationPanel";
import LearningPathControls from "../../navigation/components/LearningPathControls";
import PilotPathSetupModal from "../../navigation/components/PilotPathSetupModal";
import { sortPathNodesCanonically } from "../../navigation/lib/learningPathUtils";
import {
  buildDefaultPilotDraft,
  buildInterviewProfileContext,
  buildPersonalizedPilotDraft,
} from "../../navigation/lib/pilotPath";
import BottomOutlineProgress from "../components/BottomOutlineProgress";
import NoteWorkspaceBar from "../components/NoteWorkspaceBar";
import OutlineSider from "../../navigation/components/OutlineSider";
import FloatingOutlineButton from "../components/FloatingOutlineButton";
import AssistantWorkspace from "../../assistant/components/AssistantWorkspace";
import { useGlobalAssistant } from "../../assistant/components/GlobalAssistantContext";
import { PENDING_NOTES_TOUR_KEY } from "../../profile/components/guide/AppFeatureTour";
import {
  createNoteGuideSteps,
  prepareNoteTourStep,
} from "../../profile/components/guide/productTours";

import { buildMenuItems, isSubjectOverviewPath } from "../../navigation/lib/notesIndexUtils";
import {
  requestAssistantQuiz,
  requestAssistantQuizEvaluate,
  commitLearningPath,
  generateLearningPath,
  getCanonicalCurriculumGraph,
  getLearningPath,
  saveLearningPathDraft,
} from "../../assistant/api/assistant";
import { completeMyNote, createMyNoteQuote, getMyNoteQuotes, getMyProfile, uncompleteMyNote, updateMyGuideState, UserApiError } from "../../profile/api/user";
import useTranslatedContent from "../../../i18n/useTranslatedContent";
import useTranslation from "../../../i18n/useTranslation";
import { listPodcasts } from "../../podcasts/api/podcasts";

import LearningPageMetaBar from "../../../shared/layouts/LearningPageMetaBar";
import { FULL_PRODUCT_ENABLED, PILOT_SUBJECT_SLUG } from "../../../config/productMode";
import "./NoteLayout.css";
import "../components/LearningSupportPanel.css";

const { Sider, Content } = Layout;

const LEARNING_SIDER_MIN_WIDTH = 350;
const LEARNING_SIDER_MAX_WIDTH = 960;
const LEARNING_SIDER_NEARBY_MIN_WIDTH = 520;

const LEARNING_SUPPORT_TABS = [
  { id: "outline", labelKey: "learningSupport.tabs.outline" },
  { id: "notes", labelKey: "learningSupport.tabs.notes", tool: "notes" },
  { id: "quiz", labelKey: "learningSupport.tabs.quiz", tool: "quiz" },
];

function flattenMenuLeafItems(items, list = []) {
  items.forEach((item) => {
    if (Array.isArray(item.children) && item.children.length > 0) {
      flattenMenuLeafItems(item.children, list);
    } else if (typeof item.key === "string") {
      list.push({
        path: item.key,
        label: typeof item.label === "string" ? item.label : item.key.split("/").pop() || item.key,
      });
    }
  });
  return list;
}

function flattenSearchItems(items, trail = [], list = []) {
  items.forEach((item) => {
    const label = typeof item.label === "string" ? item.label : item.key?.split("/").pop() || "";
    const nextTrail = label ? [...trail, label] : trail;
    if (Array.isArray(item.children) && item.children.length > 0) {
      flattenSearchItems(item.children, nextTrail, list);
      return;
    }
    if (typeof item.key === "string") {
      list.push({
        path: item.key,
        title: label || item.key,
        breadcrumb: nextTrail.slice(0, -1).join(" / "),
      });
    }
  });
  return list;
}

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePodcastSource(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeMenuKey(key) {
  return String(key || "").replace(/\/+$/, "");
}

function pathToLearningNodeId(path) {
  const match = normalizeMenuKey(path).match(/^\/note\/([^/]+)\/([^/]+)\.md$/);
  if (!match) return `custom:${String(path || "").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  return `${match[1]}.${match[2]}`;
}

function pathToSubject(path) {
  const match = normalizeMenuKey(path).match(/^\/note\/([^/]+)\//);
  return match?.[1] || "";
}

function buildLearningPathEdges(nodes) {
  return nodes.slice(1).map((node, index) => {
    const previous = nodes[index];
    const relation = node?.metadata?.path_relation === "branch"
      ? "branches_to"
      : node?.metadata?.path_relation === "converge"
        ? "converges_to"
        : "precedes";
    return {
      edge_id: `path-edge:${previous.node_id}:${node.node_id}`,
      source: previous.node_id,
      target: node.node_id,
      relation,
      metadata: {},
    };
  });
}

function normalizeCompletedNoteUrlsFromProfile(profilePayload) {
  const profile = profilePayload && typeof profilePayload === "object" ? profilePayload : {};
  const completedFromUrls = Array.isArray(profile.completed_note_urls)
    ? profile.completed_note_urls
    : Array.isArray(profile.completedNoteUrls)
      ? profile.completedNoteUrls
      : [];
  const completedFromObjects = Array.isArray(profile.completed_notes)
    ? profile.completed_notes.map((item) => item?.note_url)
    : Array.isArray(profile.completedNotes)
      ? profile.completedNotes.map((item) => item?.noteUrl)
      : [];
  return [...completedFromUrls, ...completedFromObjects]
    .map((item) => normalizeMenuKey(item || ""))
    .filter(Boolean);
}

function buildPilotLearningPathDraft() {
  return buildDefaultPilotDraft({
    path_id: "primary",
    learning_set_name: "秋招准备 Path",
    learning_set_note: "从定位、简历和岗位搜索，到沟通、面试与 Offer 复盘。",
    goal_type: "custom",
    goal_title: "准备下一轮校园招聘",
  });
}

function isPilotLearningPathDraft(draft) {
  if (!draft || typeof draft !== "object") return false;
  if (draft?.metadata?.pilot_official_path || draft?.metadata?.pilot_path_schema_version) {
    return true;
  }
  const nodes = Array.isArray(draft.nodes) ? draft.nodes : [];
  return nodes.some((node) => {
    const subject = String(node?.subject || node?.metadata?.subject || "");
    const noteUrl = String(node?.note_url || node?.noteUrl || "");
    return subject === PILOT_SUBJECT_SLUG || noteUrl.includes(`/note/${PILOT_SUBJECT_SLUG}/`);
  });
}

function normalizeLearningPathForProductMode(draft) {
  if (FULL_PRODUCT_ENABLED) return draft || null;
  if (!isPilotLearningPathDraft(draft)) return buildPilotLearningPathDraft();
  const personalization = draft?.metadata?.personalization || {};
  return personalization.setup_complete
    ? buildPersonalizedPilotDraft(draft, personalization)
    : buildDefaultPilotDraft(draft);
}

function collectMenuLabelPayload(items, list = []) {
  items.forEach((item) => {
    if (item?.key && typeof item.label === "string") {
      list.push({ key: item.key, label: item.label });
    }
    if (Array.isArray(item?.children)) {
      collectMenuLabelPayload(item.children, list);
    }
  });
  return list;
}

function parseTranslatedMenuLabelMap(content) {
  try {
    const parsed = JSON.parse(content || "[]");
    if (!Array.isArray(parsed)) return new Map();
    return new Map(
      parsed
        .map((item) => [item?.key, item?.label])
        .filter(([key, label]) => key && typeof label === "string" && label.trim()),
    );
  } catch {
    return new Map();
  }
}

function applyTranslatedMenuLabels(items, labelMap, t) {
  return items.map((item) => {
    const mappedLabel = labelMap.get(item.key);
    const fallbackLabel = item.label === "Overview" ? t("note.sidebar.overview") : item.label;
    return {
      ...item,
      label: mappedLabel || fallbackLabel,
      children: item.children ? applyTranslatedMenuLabels(item.children, labelMap, t) : undefined,
    };
  });
}

function findBreadcrumbLabels(items, targetKey, trail = []) {
  const normalizedTarget = normalizeMenuKey(targetKey);
  for (const item of items) {
    const currentTrail = [...trail, String(item.label || "")];
    if (normalizeMenuKey(item.key) === normalizedTarget) {
      return currentTrail;
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      const found = findBreadcrumbLabels(item.children, targetKey, currentTrail);
      if (found) return found;
    }
  }
  return null;
}

function resolveQuizQuestions(payload) {
  const candidate =
    payload?.questions ||
    payload?.quiz ||
    payload?.items ||
    payload?.data?.questions ||
    payload?.data?.items ||
    [];

  if (!Array.isArray(candidate)) return [];
  return candidate.map((item, idx) => {
    if (typeof item === "string") {
      return {
        id: `quiz-${idx + 1}`,
        type: "short_answer",
        text: item,
        options: [],
        rawQuestion: item,
      };
    }
    const type = item?.question_type || item?.type || "short_answer";
    return {
      id: item?.id || `quiz-${idx + 1}`,
      type,
      text: item?.text || item?.question || item?.prompt || "",
      options: Array.isArray(item?.options) ? item.options : [],
      rawQuestion: item,
    };
  });
}

function normalizeQuizEvaluation(payload) {
  const source = payload?.data && typeof payload.data === "object" ? payload.data : payload;
  return {
    is_correct: Boolean(source?.is_correct),
    score: typeof source?.score === "number" ? source.score : source?.score ?? null,
    feedback: source?.feedback || "",
    suggested_answer: source?.suggested_answer || "",
  };
}

const NoteLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const location = useLocation();
  const learningPathId = useMemo(() => {
    const selected = String(location.state?.learningPathId || "").trim();
    if (selected) {
      window.sessionStorage.setItem("notes-system.active-learning-set", selected);
      return selected;
    }
    return window.sessionStorage.getItem("notes-system.active-learning-set") || "primary";
  }, [location.state?.learningPathId]);
  const { t } = useTranslation();
  const { openAssistant } = useGlobalAssistant();

  // redux state
  const isMobile = useSelector((state) => state.preference.isMobile);
  const rawNotesIndex = useSelector((state) => state.notesIndex.data);
  const notesIndex = useMemo(() => {
    const allNotes = Array.isArray(rawNotesIndex) ? rawNotesIndex : [];
    if (FULL_PRODUCT_ENABLED) return allNotes;
    return allNotes.filter((item) => (
      item?.slug === PILOT_SUBJECT_SLUG || item?.directory === PILOT_SUBJECT_SLUG
    ));
  }, [rawNotesIndex]);
  const currentMeta = useSelector((state) => state.currentNote.meta);
  const outline = useSelector((state) => state.currentNote.outline);
  const currentNoteContent = useSelector((state) => state.currentNote.content);

  // local state
  const [collapsed, setCollapsed] = useState(isMobile);
  const [showMenu, setShowMenu] = useState(true);
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const [assistantMode, setAssistantMode] = useState("dock");
  const [assistantDockTab, setAssistantDockTab] = useState("outline");
  const [assistantTool, setAssistantTool] = useState("notes");
  const [assistantCollapsed, setAssistantCollapsed] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState(false);
  const [assistantDockWidth, setAssistantDockWidth] = useState(350);
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [referencePickerOpen, setReferencePickerOpen] = useState(false);
  const [selectedReferencePaths, setSelectedReferencePaths] = useState([]);
  const [scratchHtml, setScratchHtml] = useState("");
  const [scratchSavedHint, setScratchSavedHint] = useState("");
  const [quizObjective, setQuizObjective] = useState("mock_interview");
  const [quizDifficulty, setQuizDifficulty] = useState("medium");
  const [quizQuestionTypes, setQuizQuestionTypes] = useState(["short_answer"]);
  const [quizInstruction, setQuizInstruction] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizEvaluations, setQuizEvaluations] = useState({});
  const [quizEvaluationPendingMap, setQuizEvaluationPendingMap] = useState({});
  const [quizPending, setQuizPending] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [completedNoteUrls, setCompletedNoteUrls] = useState(new Set());
  const [learningPathDraft, setLearningPathDraft] = useState(null);
  const [learningPathPending, setLearningPathPending] = useState(false);
  const [pilotPathSetupOpen, setPilotPathSetupOpen] = useState(false);
  const [pathEditMode, setPathEditMode] = useState(false);
  const [learningSiderWidth, setLearningSiderWidth] = useState(350);
  const [canonicalGraph, setCanonicalGraph] = useState(null);
  const [noteQuotes, setNoteQuotes] = useState([]);
  const [completeNotePending, setCompleteNotePending] = useState(false);
  const [notesTourStartToken, setNotesTourStartToken] = useState(0);
  const [workspaceMeta, setWorkspaceMeta] = useState(null);
  const [narrationState, setNarrationState] = useState("idle");
  const [narrationAudioUrls, setNarrationAudioUrls] = useState([]);
  const [currentNarrationChunkIndex, setCurrentNarrationChunkIndex] = useState(0);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  const [officialPodcasts, setOfficialPodcasts] = useState([]);
  const narrationAudioRef = useRef(null);
  const narrationAudioUrlsRef = useRef([]);
  const narrationChunkIndexRef = useRef(0);
  const noteAreaRef = useRef(null);
  const directoryAreaRef = useRef(null);
  const outlineTabRef = useRef(null);
  const assistantAreaRef = useRef(null);
  const workspaceBarRef = useRef(null);
  const metaTopBarRef = useRef(null);
  const exploreGuideRef = useRef(null);
  const resizeStateRef = useRef({
    active: false,
    startX: 0,
    startWidth: 420,
  });
  const leftSiderResizeRef = useRef({
    active: false,
    startX: 0,
    startWidth: LEARNING_SIDER_MIN_WIDTH,
  });

  // track previous isMobile value
  const prevIsMobileRef = useRef(isMobile);

  // auto collapse menu when switching from desktop to mobile
  useEffect(() => {
    if (isMobile && !prevIsMobileRef.current) {
      // just switched to mobile, collapse the menu
      setCollapsed(true);
    }
    prevIsMobileRef.current = isMobile;
  }, [isMobile]);

  useEffect(() => {
    let cancelled = false;
    let pendingNotesTour = false;
    try {
      pendingNotesTour = window.sessionStorage.getItem(PENDING_NOTES_TOUR_KEY) === "1";
      if (pendingNotesTour) {
        window.sessionStorage.removeItem(PENDING_NOTES_TOUR_KEY);
      }
    } catch {
      return;
    }
    if (!pendingNotesTour) return;

    async function startPendingNotesTour() {
      try {
        await updateMyGuideState({
          guideKey: "notes_page",
          seen: true,
          completed: false,
          currentStep: 0,
        });
      } catch {
        // The question-mark button can still start the local tour if this fails.
      }
      if (!cancelled) {
        window.requestAnimationFrame(() => {
          window.setTimeout(() => {
            if (!cancelled) {
              setNotesTourStartToken((value) => value + 1);
            }
          }, 400);
        });
      }
    }

    startPendingNotesTour();
    return () => {
      cancelled = true;
    };
  }, []);

  // Scroll listener for floating button (mobile only)
  useEffect(() => {
    if (!isMobile) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // hide button when scrolling down, show when scrolling up
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setShowFloatingButton(false);
          } else {
            setShowFloatingButton(true);
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  // menu contents & icons
  const plainMenuItems = useMemo(
    () => buildMenuItems(notesIndex),
    [notesIndex],
  );
  const menuLabelPayload = useMemo(
    () => JSON.stringify(collectMenuLabelPayload(plainMenuItems)),
    [plainMenuItems],
  );
  const translatedMenuLabelPayload = useTranslatedContent(menuLabelPayload, {
    sourceType: "menu_label_list",
    sourceId: "notes-sidebar-menu",
    disabled: !plainMenuItems.length,
  });
  const translatedMenuLabelMap = useMemo(
    () => parseTranslatedMenuLabelMap(translatedMenuLabelPayload.content),
    [translatedMenuLabelPayload.content],
  );
  const localizedPlainMenuItems = useMemo(
    () => applyTranslatedMenuLabels(plainMenuItems, translatedMenuLabelMap, t),
    [plainMenuItems, translatedMenuLabelMap, t],
  );
  const searchItems = useMemo(() => flattenSearchItems(localizedPlainMenuItems), [localizedPlainMenuItems]);
  const searchOptions = useMemo(
    () =>
      searchItems.map((item) => {
        const searchText = normalizeSearchText(`${item.title} ${item.breadcrumb} ${item.path}`);
        return {
          value: item.path,
          label: (
            <div className="note-layout__search-option">
              <span className="note-layout__search-option-title">{item.title}</span>
              <span className="note-layout__search-option-meta">
                {[item.breadcrumb, item.path].filter(Boolean).join(" · ")}
              </span>
            </div>
          ),
          searchText,
        };
      }),
    [searchItems],
  );

  // breadcrumb (reuse menu labels so display is consistent)
  const breadcrumbItems = useMemo(() => {
    if (!currentMeta?.url) return [];
    const labels = findBreadcrumbLabels(localizedPlainMenuItems, currentMeta.url) || [];
    return labels.map((label, idx) => ({
      title: label,
      key: `${idx}-${label}`,
    }));
  }, [currentMeta?.url, localizedPlainMenuItems]);

  // event handlers
  const handleNoteSelect = (path) => navigate(path);

  const handleExploreMindmap = () => {
    const slug = workspaceMeta?.mindmapSubjectSlug;
    if (slug) navigate(`/subject/${slug}/mindmap`);
  };

  const registerWorkspaceMeta = useCallback((meta) => {
    setWorkspaceMeta(meta);
  }, []);

  const promptSignInToSave = useCallback((actionLabel = "save this") => {
    Modal.confirm({
      title: "Sign in to save your learning",
      content: `You can keep reading as a guest. Sign in when you want to ${actionLabel}, sync progress, and return to this note later.`,
      okText: "Sign in",
      cancelText: "Keep browsing",
      onOk: () => {
        navigate("/user/login", {
          state: { from: `${location.pathname}${location.search}${location.hash}` },
        });
      },
    });
  }, [location.hash, location.pathname, location.search, navigate]);

  const noteName = useMemo(() => {
    const h1Match = String(currentNoteContent || "").match(/^#\s+(.+)$/m);
    if (h1Match?.[1]) return h1Match[1].trim();
    const rawTitle = currentMeta?.title || currentMeta?.name || "";
    if (rawTitle) {
      return String(rawTitle)
        .replace(/\.md$/i, "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
    return "Current note";
  }, [currentMeta, currentNoteContent]);
  const currentNoteUrlNormalized = useMemo(
    () => normalizeMenuKey(currentMeta?.url || ""),
    [currentMeta?.url],
  );
  const isOverviewPage = isSubjectOverviewPath(currentNoteUrlNormalized);
  const isCurrentNoteCompleted = !isOverviewPage && currentNoteUrlNormalized
    ? completedNoteUrls.has(currentNoteUrlNormalized)
    : false;
  const officialPodcast = useMemo(() => {
    if (isOverviewPage) return null;
    const noteTitle = normalizePodcastSource(noteName);
    const topicSlug = normalizePodcastSource(workspaceMeta?.topicSlug);
    if (!noteTitle && !topicSlug) return null;
    return officialPodcasts.find((episode) => (
      (episode.spoken_outline || []).some((chapter) => (
        (chapter.source_notes || []).some((source) => {
          const lessonTitle = normalizePodcastSource(source.lesson_title);
          const lessonId = normalizePodcastSource(source.lesson_id);
          return Boolean(
            (noteTitle && lessonTitle === noteTitle)
            || (topicSlug && (lessonId === topicSlug || lessonTitle === topicSlug)),
          );
        })
      ))
    )) || null;
  }, [isOverviewPage, noteName, officialPodcasts, workspaceMeta?.topicSlug]);

  const menuLeafItems = useMemo(() => flattenMenuLeafItems(plainMenuItems), [plainMenuItems]);
  const selectedReferenceItems = useMemo(() => {
    const selected = new Set(selectedReferencePaths);
    return menuLeafItems.filter((item) => selected.has(item.path));
  }, [menuLeafItems, selectedReferencePaths]);

  useEffect(() => {
    if (!FULL_PRODUCT_ENABLED) {
      setOfficialPodcasts([]);
      return undefined;
    }
    let mounted = true;
    listPodcasts()
      .then((episodes) => {
        if (mounted) setOfficialPodcasts(Array.isArray(episodes) ? episodes : []);
      })
      .catch(() => {
        if (mounted) setOfficialPodcasts([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadCompletedNotes() {
      try {
        const profilePayload = await getMyProfile();
        if (!mounted) return;
        setCompletedNoteUrls(new Set(normalizeCompletedNoteUrlsFromProfile(profilePayload)));
      } catch {
        if (!mounted) return;
        setCompletedNoteUrls(new Set());
      }
    }
    loadCompletedNotes();
    return () => {
      mounted = false;
    };
  }, []);

  const loadLearningPath = useCallback(async () => {
    try {
      const payload = await getLearningPath(learningPathId);
      setLearningPathDraft(normalizeLearningPathForProductMode(payload?.draft));
    } catch {
      setLearningPathDraft(normalizeLearningPathForProductMode(null));
    }
  }, [learningPathId]);

  useEffect(() => {
    let mounted = true;
    async function run() {
      try {
        const payload = await getLearningPath(learningPathId);
        if (!mounted) return;
        setLearningPathDraft(normalizeLearningPathForProductMode(payload?.draft));
      } catch {
        if (!mounted) return;
        setLearningPathDraft(normalizeLearningPathForProductMode(null));
      }
    }
    run();
    const onPathUpdated = () => {
      if (mounted) loadLearningPath();
    };
    window.addEventListener("learning-path-updated", onPathUpdated);
    return () => {
      mounted = false;
      window.removeEventListener("learning-path-updated", onPathUpdated);
    };
  }, [learningPathId, loadLearningPath]);

  useEffect(() => {
    let mounted = true;
    async function loadCanonicalGraph() {
      try {
        const payload = await getCanonicalCurriculumGraph();
        if (mounted) setCanonicalGraph(payload || null);
      } catch {
        if (mounted) setCanonicalGraph(null);
      }
    }
    loadCanonicalGraph();
    return () => {
      mounted = false;
    };
  }, []);

  const persistLearningPathDraft = useCallback(async (nextDraft, successMessage, commitMessage) => {
    setLearningPathDraft(nextDraft);
    try {
      const response = await saveLearningPathDraft(nextDraft);
      setLearningPathDraft(normalizeLearningPathForProductMode(response?.draft || nextDraft));
      await commitLearningPath({
        path_id: nextDraft.path_id || learningPathId,
        message: commitMessage || successMessage || "Updated learning path",
      });
      if (successMessage) message.success(successMessage);
      return true;
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Could not update learning path.";
      message.error(errorText);
      loadLearningPath();
      return false;
    }
  }, [learningPathId, loadLearningPath]);

  const handleSavePilotPathProfile = useCallback(async (profile) => {
    if (!learningPathDraft || learningPathPending) return;
    setLearningPathPending(true);
    try {
      const nextDraft = buildPersonalizedPilotDraft(learningPathDraft, profile);
      const saved = await persistLearningPathDraft(
        nextDraft,
        "你的秋招 Path 与 Timeline 已更新。",
        "Personalized fall recruiting path",
      );
      if (saved) setPilotPathSetupOpen(false);
    } finally {
      setLearningPathPending(false);
    }
  }, [learningPathDraft, learningPathPending, persistLearningPathDraft]);

  const applyPathNodeOrder = useCallback(
    (nodes, orderMode = "custom") => {
      const normalizedMode = orderMode === "canonical" ? "canonical" : "custom";
      const orderedNodes =
        normalizedMode === "canonical" ? sortPathNodesCanonically(nodes, canonicalGraph) : nodes;
      return {
        nodes: orderedNodes,
        edges: buildLearningPathEdges(orderedNodes),
        metadata: {
          ...(learningPathDraft?.metadata || {}),
          order_mode: normalizedMode,
        },
      };
    },
    [canonicalGraph, learningPathDraft?.metadata],
  );

  const handleStartPathBuilder = useCallback(async () => {
    if (learningPathPending) return;
    setLearningPathPending(true);
    try {
      const emptyDraft = {
        path_id: "default",
        goal_type: "custom",
        goal_id: "",
        goal_title: "",
        nodes: [],
        edges: [],
      };
      await persistLearningPathDraft(
        emptyDraft,
        t("learningPath.started", "Path builder ready. Add courses from the library."),
        "Started empty learning path",
      );
      setPathEditMode(true);
      setCollapsed(false);
      setShowMenu(true);
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Could not start path builder.";
      message.error(errorText);
    } finally {
      setLearningPathPending(false);
    }
  }, [learningPathPending, persistLearningPathDraft, t]);

  const mergeGeneratedNodesIntoDraft = useCallback(
    async (incomingNodes, successMessage, commitMessage) => {
      if (!learningPathDraft || !Array.isArray(incomingNodes) || incomingNodes.length === 0) {
        message.info(t("learningPath.noCoursesToAdd", "No new courses to add."));
        return;
      }
      const existing = new Set(
        (learningPathDraft.nodes || []).map((node) => normalizeMenuKey(node.note_url || node.noteUrl || "")),
      );
      const newNodes = incomingNodes.filter((node) => {
        const noteUrl = normalizeMenuKey(node.note_url || node.noteUrl || "");
        return noteUrl && !existing.has(noteUrl);
      });
      if (newNodes.length === 0) {
        message.info(t("learningPath.alreadyInPath", "These courses are already in your path."));
        return;
      }
      const mergedNodes = [...(learningPathDraft.nodes || []), ...newNodes];
      const orderMode =
        String(learningPathDraft?.metadata?.order_mode || learningPathDraft?.metadata?.orderMode || "")
          .trim()
          .toLowerCase() === "custom"
          ? "custom"
          : "canonical";
      const nextDraft = {
        ...learningPathDraft,
        ...applyPathNodeOrder(mergedNodes, orderMode),
      };
      await persistLearningPathDraft(nextDraft, successMessage, commitMessage);
    },
    [applyPathNodeOrder, learningPathDraft, persistLearningPathDraft, t],
  );

  const handleAddCareerToPath = useCallback(
    async (profile) => {
      if (!learningPathDraft || learningPathPending) return;
      const jobId = profile?.job_id || profile?.jobId;
      if (!jobId) return;
      setLearningPathPending(true);
      try {
        const response = await generateLearningPath({
          goal_type: "career",
          goal_id: jobId,
          goal_title: profile?.title || "",
          save_as_draft: false,
          commit: false,
        });
        const generatedNodes = response?.draft?.nodes || [];
        if (!generatedNodes.length) {
          message.info(t("learningPath.noCareerCourses", "No courses found for this career."));
          return;
        }
        await mergeGeneratedNodesIntoDraft(
          generatedNodes.map((node) => ({
            ...node,
            metadata: {
              ...(node.metadata || {}),
              source: "career_goal",
              career_job_id: jobId,
              career_title: profile?.title || "",
              pending_canonical_sort: true,
            },
          })),
          t("learningPath.careerAdded", "Career path added to your learning path."),
          "Added career path to learning path",
        );
      } catch (error) {
        const errorText = error instanceof Error ? error.message : "Could not add career path.";
        message.error(errorText);
      } finally {
        setLearningPathPending(false);
      }
    },
    [learningPathDraft, learningPathPending, mergeGeneratedNodesIntoDraft, t],
  );

  const handleAddPathNode = useCallback(async (candidate) => {
    if (!learningPathDraft) return;
    const existing = new Set((learningPathDraft.nodes || []).map((node) => normalizeMenuKey(node.note_url || node.noteUrl || "")));
    let candidates = [];
    if (candidate?.type === "subject" && Array.isArray(candidate.steps)) {
      candidates = candidate.steps;
    } else if (candidate?.key) {
      candidates = [candidate];
    }
    if (candidates.length === 0) return;
    const newCandidates = candidates
      .map((item) => ({ ...item, key: normalizeMenuKey(item.key) }))
      .filter((item) => item.key && !existing.has(item.key));
    if (newCandidates.length === 0) {
      const duplicateMessage =
        candidate?.type === "subject"
          ? "This subject is already in the path."
          : "This course is already in the path.";
      message.info(duplicateMessage);
      return;
    }
    const mergedNodes = [
      ...(learningPathDraft.nodes || []),
      ...newCandidates.map((item) => {
        const noteUrl = normalizeMenuKey(item.key);
        return {
          node_id: pathToLearningNodeId(noteUrl),
          title: item.title || noteUrl,
          subject: pathToSubject(noteUrl),
          note_url: noteUrl,
          status: "planned",
          metadata: {
            source: candidate?.type === "subject" ? "manual_subject_drag" : "manual_edit",
            subject_title: item.module || candidate?.title || pathToSubject(noteUrl),
            path_relation: "linear",
            pending_canonical_sort: true,
          },
        };
      }),
    ];
    const orderMode =
      String(learningPathDraft?.metadata?.order_mode || learningPathDraft?.metadata?.orderMode || "")
        .trim()
        .toLowerCase() === "custom"
        ? "custom"
        : "canonical";
    const nextDraft = {
      ...learningPathDraft,
      ...applyPathNodeOrder(mergedNodes, orderMode),
    };
    await persistLearningPathDraft(
      nextDraft,
      newCandidates.length > 1 ? `${newCandidates.length} courses added to path.` : "Course added to path.",
      candidate?.type === "subject"
        ? "Added subject to learning path"
        : "Added learning path node",
    );
  }, [applyPathNodeOrder, learningPathDraft, persistLearningPathDraft]);

  const handleReorderPathNodes = useCallback(async (orderedNoteUrls) => {
    if (!learningPathDraft?.nodes?.length || !Array.isArray(orderedNoteUrls)) return;
    const rank = new Map(orderedNoteUrls.map((url, index) => [normalizeMenuKey(url), index]));
    const nextNodes = [...learningPathDraft.nodes].sort((a, b) => {
      const aRank = rank.get(normalizeMenuKey(a.note_url || a.noteUrl || ""));
      const bRank = rank.get(normalizeMenuKey(b.note_url || b.noteUrl || ""));
      return (aRank ?? Number.MAX_SAFE_INTEGER) - (bRank ?? Number.MAX_SAFE_INTEGER);
    });
    const nextDraft = {
      ...learningPathDraft,
      ...applyPathNodeOrder(nextNodes, "custom"),
    };
    await persistLearningPathDraft(nextDraft, t("learningPath.reordered", "Path reordered."), "Reordered learning path nodes");
  }, [applyPathNodeOrder, learningPathDraft, persistLearningPathDraft, t]);

  const handleRestoreRecommendedOrder = useCallback(async () => {
    if (!learningPathDraft?.nodes?.length || learningPathPending) return;
    const nextDraft = {
      ...learningPathDraft,
      ...applyPathNodeOrder(learningPathDraft.nodes, "canonical"),
    };
    await persistLearningPathDraft(
      nextDraft,
      t("learningPath.restoredRecommended", "Restored recommended order."),
      "Restored recommended learning path order",
    );
  }, [applyPathNodeOrder, learningPathDraft, learningPathPending, persistLearningPathDraft, t]);

  const handleRemovePathNode = useCallback(async (noteUrl) => {
    if (!learningPathDraft?.nodes?.length || !noteUrl) return;
    const nextNodes = learningPathDraft.nodes.filter(
      (node) => normalizeMenuKey(node.note_url || node.noteUrl || "") !== normalizeMenuKey(noteUrl),
    );
    const nextDraft = {
      ...learningPathDraft,
      nodes: nextNodes,
      edges: buildLearningPathEdges(nextNodes),
    };
    await persistLearningPathDraft(nextDraft, "Path node removed.", "Removed learning path node");
  }, [learningPathDraft, persistLearningPathDraft]);

  const hasPersonalizedPath = useMemo(() => {
    const nodes = Array.isArray(learningPathDraft?.nodes) ? learningPathDraft.nodes : [];
    return nodes.some((node) => node?.note_url || node?.noteUrl);
  }, [learningPathDraft]);

  const hasEditableDraft = learningPathDraft != null;

  const handlePathPrimaryAction = useCallback(() => {
    if (hasPersonalizedPath || (hasEditableDraft && pathEditMode)) {
      setPathEditMode((prev) => !prev);
      return;
    }
    handleStartPathBuilder();
  }, [hasPersonalizedPath, hasEditableDraft, pathEditMode, handleStartPathBuilder]);

  const handleClearPath = useCallback(async () => {
    if (!learningPathDraft?.nodes?.length || learningPathPending) return;
    Modal.confirm({
      title: t("learningPath.clearConfirmTitle", "Clear learning path?"),
      content: t(
        "learningPath.clearConfirmBody",
        "This removes every node from your current path. You can rebuild it anytime.",
      ),
      okText: t("learningPath.clearPath", "Clear path"),
      okButtonProps: { danger: true },
      cancelText: t("common.cancel", "Cancel"),
      onOk: async () => {
        setLearningPathPending(true);
        try {
          const nextDraft = {
            ...learningPathDraft,
            nodes: [],
            edges: [],
          };
          await persistLearningPathDraft(
            nextDraft,
            t("learningPath.cleared", "Learning path cleared."),
            "Cleared learning path",
          );
          setPathEditMode(false);
        } finally {
          setLearningPathPending(false);
        }
      },
    });
  }, [learningPathDraft, learningPathPending, persistLearningPathDraft, t]);

  useEffect(() => {
    let mounted = true;
    async function loadNoteQuotes() {
      if (!currentNoteUrlNormalized || isSubjectOverviewPath(currentNoteUrlNormalized)) {
        setNoteQuotes([]);
        return;
      }
      try {
        const quotes = await getMyNoteQuotes(currentNoteUrlNormalized);
        if (!mounted) return;
        setNoteQuotes(Array.isArray(quotes) ? quotes : []);
      } catch {
        if (!mounted) return;
        setNoteQuotes([]);
      }
    }
    loadNoteQuotes();
    return () => {
      mounted = false;
    };
  }, [currentNoteUrlNormalized]);

  const handleToggleCurrentNoteCompletion = async () => {
    const currentUrl = currentNoteUrlNormalized;
    if (!currentUrl || completeNotePending) return;
    const currentlyCompleted = completedNoteUrls.has(currentUrl);

    setCompleteNotePending(true);
    try {
      if (currentlyCompleted) {
        await uncompleteMyNote({ noteUrl: currentUrl });
        setCompletedNoteUrls((prev) => {
          const next = new Set(prev);
          next.delete(currentUrl);
          return next;
        });
        message.success("Removed completion mark for this note.");
      } else {
        await completeMyNote({
          noteId: currentMeta?.id || "",
          packageId: currentMeta?.packageId || "",
          noteUrl: currentUrl,
          noteTitle: noteName,
          subject: currentMeta?.subjectName || "",
        });
        setCompletedNoteUrls((prev) => {
          const next = new Set(prev);
          next.add(currentUrl);
          return next;
        });
        message.success("Marked this note as completed.");
      }
    } catch (error) {
      if (error instanceof UserApiError && error.status === 401) {
        promptSignInToSave(currentlyCompleted ? "update completion marks" : "mark notes as complete");
        return;
      }
      const errorText = error instanceof Error
        ? error.message
        : currentlyCompleted
          ? "Failed to remove completion mark."
          : "Failed to mark note as completed.";
      message.error(errorText);
    } finally {
      setCompleteNotePending(false);
    }
  };

  const handleEnoughForNow = () => {
    message.success("Your place is saved. Continue whenever you are ready.");
    navigate(FULL_PRODUCT_ENABLED ? "/user/profile?section=learning" : "/");
  };

  const handleCreateQuoteFromSelection = async (selection) => {
    const selectedText = String(selection?.selectedText || "").trim();
    if (!selectedText || !currentNoteUrlNormalized) return null;
    try {
      const quote = await createMyNoteQuote({
        noteUrl: currentNoteUrlNormalized,
        noteTitle: noteName,
        subject: currentMeta?.subjectName || "",
        selectedText,
        personalNote: selection?.personalNote || "",
        contextBefore: selection?.contextBefore || "",
        contextAfter: selection?.contextAfter || "",
        noteVersionId: "current",
      });
      setNoteQuotes((prev) => [...prev, quote]);
      setScratchHtml((prev) => {
        const safeSelectedText = escapeHtml(selectedText);
        const safeNoteName = escapeHtml(noteName);
        const quoteHtml = [
          `<blockquote class="personal-note-quote" contenteditable="false" data-quote-id="${quote.quote_id}">`,
          `<p>${safeSelectedText}</p>`,
          `<footer>From ${safeNoteName}</footer>`,
          "</blockquote>",
          selection?.personalNote
            ? `<p>${escapeHtml(selection.personalNote)}</p>`
            : "",
          '<p data-note-cursor-anchor="true"><br></p>',
        ].join("");
        return prev ? `${prev}${quoteHtml}` : quoteHtml;
      });
      setAssistantDockTab("notes");
      setAssistantTool("notes");
      setAssistantCollapsed(false);
      message.success("Added selected text to your notes.");
      return quote;
    } catch (error) {
      if (error instanceof UserApiError && error.status === 401) {
        promptSignInToSave("save highlights and personal notes");
        return null;
      }
      const errorText = error instanceof Error ? error.message : "Failed to save selected text.";
      message.error(errorText);
      return null;
    }
  };

  const handleAskWithSelectedText = (selection) => {
    const selectedText = String(selection?.selectedText || "").trim();
    if (!selectedText) return;
    openAssistant({
      prompt: `Explain this selected passage from ${noteName}:\n\n"${selectedText}"`,
    });
  };

  const handleGenerateQuizFromSelection = (selection) => {
    const selectedText = String(selection?.selectedText || "").trim();
    if (!selectedText) return;
    setQuizInstruction(`Use this selected passage from ${noteName} to conduct a focused mock interview:\n\n"${selectedText}"`);
    setAssistantTool("quiz");
    setAssistantDockTab("quiz");
    if (immersiveMode || isMobile) {
      setAssistantModalOpen(true);
    } else {
      setAssistantCollapsed(false);
    }
  };

  useEffect(() => {
    narrationAudioUrlsRef.current = narrationAudioUrls;
  }, [narrationAudioUrls]);

  useEffect(() => {
    narrationChunkIndexRef.current = currentNarrationChunkIndex;
  }, [currentNarrationChunkIndex]);

  useEffect(() => {
    const audio = narrationAudioRef.current;
    if (!audio) return undefined;
    const onPlay = () => setIsNarrationPlaying(true);
    const onPause = () => setIsNarrationPlaying(false);
    const onEnded = async () => {
      const urls = narrationAudioUrlsRef.current;
      const idx = narrationChunkIndexRef.current;
      const hasNext = idx + 1 < urls.length;
      if (!hasNext) {
        setIsNarrationPlaying(false);
        return;
      }
      const nextIdx = idx + 1;
      setCurrentNarrationChunkIndex(nextIdx);
      requestAnimationFrame(() => {
        const player = narrationAudioRef.current;
        if (!player) return;
        player.play().catch((error) => {
          console.error("Narration next chunk playback failed:", error);
          setNarrationState("error");
        });
      });
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    async function resolveNarration() {
      const noteKey =
        currentMeta && currentMeta.name
          ? currentMeta.directory === "."
            ? currentMeta.name
            : `${currentMeta.directory}/${currentMeta.name}`
          : "";

      const audio = narrationAudioRef.current;
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      setIsNarrationPlaying(false);
      setNarrationAudioUrls([]);
      setCurrentNarrationChunkIndex(0);

      if (!noteKey) {
        setNarrationState("idle");
        return;
      }
      setNarrationState("loading");
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}audio/narration-index.json`, {
          cache: "no-store",
        });
        if (!res.ok) {
          setNarrationState("no_audio");
          return;
        }
        const indexData = await res.json();
        const hit = indexData?.by_note_key?.[noteKey];
        const relPaths = Array.isArray(hit?.audio_rel_paths)
          ? hit.audio_rel_paths
          : hit?.audio_rel_path
            ? [hit.audio_rel_path]
            : [];
        if (relPaths.length === 0) {
          setNarrationState("no_audio");
          return;
        }
        setNarrationAudioUrls(
          relPaths.map((relPath) => {
            const cleanRelPath = String(relPath).replace(/^\/+/, "");
            return `${import.meta.env.BASE_URL}${cleanRelPath}`;
          }),
        );
        setCurrentNarrationChunkIndex(0);
        setNarrationState("ready");
      } catch (error) {
        console.error("Failed to load narration index:", error);
        setNarrationState("error");
      }
    }
    resolveNarration();
  }, [currentMeta]);

  const handleToggleNarration = async () => {
    if (narrationState !== "ready" || !narrationAudioRef.current) return;
    const audio = narrationAudioRef.current;
    try {
      if (audio.paused) {
        if (currentNarrationChunkIndex >= narrationAudioUrls.length) {
          setCurrentNarrationChunkIndex(0);
        }
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      console.error("Narration playback failed:", error);
      setNarrationState("error");
    }
  };

  useEffect(() => {
    if (assistantMode !== "typeless") return undefined;
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setAssistantModalOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [assistantMode]);

  useEffect(() => {
    if (pathEditMode && !isMobile) {
      setLearningSiderWidth((width) => Math.max(width, 720));
    }
  }, [pathEditMode, isMobile]);

  useEffect(() => {
    const onMouseMove = (event) => {
      if (resizeStateRef.current.active) {
        const delta = event.clientX - resizeStateRef.current.startX;
        const nextWidth = Math.min(700, Math.max(320, resizeStateRef.current.startWidth - delta));
        setAssistantDockWidth(nextWidth);
      }
      if (leftSiderResizeRef.current.active) {
        const delta = event.clientX - leftSiderResizeRef.current.startX;
        const nextWidth = Math.min(
          LEARNING_SIDER_MAX_WIDTH,
          Math.max(LEARNING_SIDER_MIN_WIDTH, leftSiderResizeRef.current.startWidth + delta),
        );
        setLearningSiderWidth(nextWidth);
      }
    };
    const onMouseUp = () => {
      resizeStateRef.current.active = false;
      leftSiderResizeRef.current.active = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const startDockResize = (event) => {
    resizeStateRef.current = {
      active: true,
      startX: event.clientX,
      startWidth: assistantDockWidth,
    };
  };

  const startLeftSiderResize = (event) => {
    leftSiderResizeRef.current = {
      active: true,
      startX: event.clientX,
      startWidth: learningSiderWidth,
    };
  };

  const assistantContextPayload = useMemo(
    () => ({
      currentNote: {
        note_id: currentMeta?.id || "",
        package_id: currentMeta?.packageId || "",
        domain_slug: currentMeta?.domainSlug || "",
        title: noteName,
        url: currentMeta?.url || "",
        content: currentNoteContent || "",
      },
      references: selectedReferenceItems.map((item) => ({
        url: item.path,
        title: item.label,
        content: item.path === currentMeta?.url ? currentNoteContent || "" : undefined,
      })),
    }),
    [currentMeta?.domainSlug, currentMeta?.id, currentMeta?.packageId, currentMeta?.url, currentNoteContent, noteName, selectedReferenceItems],
  );

  const pilotInterviewContext = useMemo(
    () => buildInterviewProfileContext(learningPathDraft?.metadata?.personalization || {}),
    [learningPathDraft?.metadata?.personalization],
  );

  const handleGenerateQuiz = async () => {
    if (!quizObjective || !quizDifficulty || quizPending || quizQuestionTypes.length === 0) return;
    setQuizError("");
    setQuizPending(true);
    try {
      const payload = {
        objective: quizObjective,
        difficulty: quizDifficulty,
        questionTypes: quizQuestionTypes,
        customInstruction: [pilotInterviewContext, quizInstruction].filter(Boolean).join("\n"),
        questionCount: 3,
        studyMode: "interview",
        ...assistantContextPayload,
      };
      const response = await requestAssistantQuiz(payload);
      const normalizedQuestions = resolveQuizQuestions(response);
      if (normalizedQuestions.length === 0) {
        throw new Error("Quiz API returned no questions.");
      }
      setQuizQuestions(normalizedQuestions);
      setQuizAnswers({});
      setQuizEvaluations({});
      setQuizEvaluationPendingMap({});
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Quiz request failed.";
      setQuizError(errorText);
      message.error(errorText);
    } finally {
      setQuizPending(false);
    }
  };

  const handleQuizAnswerChange = (questionId, value) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleQuizEvaluateQuestion = async (question) => {
    const answer = quizAnswers[question.id];
    if (!answer || !String(answer).trim()) {
      message.warning("Please provide an answer before evaluation.");
      return;
    }

    setQuizEvaluationPendingMap((prev) => ({ ...prev, [question.id]: true }));
    try {
      const payload = {
        ...assistantContextPayload,
        question: question.rawQuestion ?? question,
        userAnswer: answer,
      };
      const response = await requestAssistantQuizEvaluate(payload);
      setQuizEvaluations((prev) => ({
        ...prev,
        [question.id]: normalizeQuizEvaluation(response),
      }));
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Quiz evaluation failed.";
      message.error(errorText);
    } finally {
      setQuizEvaluationPendingMap((prev) => ({ ...prev, [question.id]: false }));
    }
  };

  const handleScratchSave = () => {
    setScratchSavedHint("Saved locally just now.");
    window.setTimeout(() => setScratchSavedHint(""), 1500);
  };

  const renderAssistantWorkspace = (hideToolTabs = false) => (
    <AssistantWorkspace
      noteName={noteName}
      activeTool={assistantTool}
      onToolChange={setAssistantTool}
      onOpenReferencePicker={() => setReferencePickerOpen(true)}
      qaReferenceCount={selectedReferenceItems.length}
      qaReferenceNames={selectedReferenceItems.map((item) => item.label)}
      onRemoveQaReference={(name) =>
        setSelectedReferencePaths((prev) =>
          prev.filter((path) => selectedReferenceItems.find((item) => item.path === path)?.label !== name),
        )
      }
      scratchText={scratchHtml}
      onScratchHtmlChange={setScratchHtml}
      onScratchSave={handleScratchSave}
      scratchSavedHint={scratchSavedHint}
      quizPrompt={quizInstruction}
      onQuizPromptChange={setQuizInstruction}
      quizGoal={quizObjective}
      quizLevel={quizDifficulty}
      quizQuestionTypes={quizQuestionTypes}
      quizQuestions={quizQuestions}
      quizAnswers={quizAnswers}
      quizEvaluations={quizEvaluations}
      quizEvaluationPendingMap={quizEvaluationPendingMap}
      onQuizGoalChange={setQuizObjective}
      onQuizLevelChange={setQuizDifficulty}
      onQuizQuestionTypesChange={setQuizQuestionTypes}
      onQuizAnswerChange={handleQuizAnswerChange}
      onQuizGenerate={handleGenerateQuiz}
      onQuizEvaluateQuestion={handleQuizEvaluateQuestion}
      quizPending={quizPending}
      quizError={quizError}
      hideToolTabs={hideToolTabs}
    />
  );

  const handleNoteTourStepChange = useCallback(
    (stepIndex) =>
      prepareNoteTourStep(stepIndex, {
        setCollapsed,
        setShowMenu,
        setAssistantCollapsed,
        setAssistantMode,
        setAssistantDockTab,
        setAssistantTool,
        setAssistantModalOpen,
        isMobile,
      }),
    [isMobile],
  );

  const noteGuideSteps = useMemo(
    () =>
      createNoteGuideSteps({
        directoryAreaRef,
        noteAreaRef,
        exploreGuideRef,
        assistantAreaRef,
        workspaceBarRef,
      }, t),
    [t],
  );

  return (
    <Layout
      className={`note-layout ${immersiveMode ? "note-layout--immersive" : ""} ${
        collapsed ? "note-layout--sider-collapsed" : ""
      }`}
      style={{
        "--header-bg": colorBgContainer,
        "--sider-bg": colorBgContainer,
        "--content-bg": colorBgContainer,
        "--content-radius": borderRadiusLG,
        "--note-meta-topbar-height": immersiveMode ? "0px" : "64px",
      }}
    >
      {!immersiveMode ? (
        <LearningPageMetaBar
          startSlot={
            isMobile ? (
              <Button
                type="text"
                className="note-layout__menu-button note-layout__menu-button--mobile"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => {
                  if (!collapsed) setShowMenu(false);
                  else setShowMenu(true);
                  setCollapsed(!collapsed);
                }}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              />
            ) : null
          }
          searchOptions={searchOptions}
          notesGuideSteps={noteGuideSteps}
          notesTourStartToken={notesTourStartToken}
          onNotesTourStepChange={handleNoteTourStepChange}
          topBarRef={metaTopBarRef}
        />
      ) : null}

      <Layout className="note-layout__main">
        {/* backdrop overlay for mobile menu */}
        {isMobile && !collapsed && (
          <div
            className="note-layout__backdrop"
            onClick={() => setCollapsed(true)}
          />
        )}

        {/* menu */}
        <Sider
          width={isMobile ? "100%" : learningSiderWidth}
          collapsedWidth={0}
          className={`note-layout__sider ${isMobile ? "note-layout__sider--mobile" : ""} ${
            pathEditMode ? "note-layout__sider--path-editing" : ""
          } ${learningSiderWidth >= LEARNING_SIDER_NEARBY_MIN_WIDTH ? "note-layout__sider--wide" : ""}`}
          collapsible
          collapsed={collapsed}
          trigger={null}
        >
          {showMenu && (
            <div className="note-layout__sider-menu-shell" ref={directoryAreaRef}>
              {!isMobile ? (
                <div className="note-layout__sider-header">
                  <span className="note-layout__sider-title">{t("learningPath.title")}</span>
                  <div className="note-layout__sider-header-actions">
                    <LearningPathControls
                      hasPersonalizedPath={hasPersonalizedPath}
                      hasEditableDraft={hasEditableDraft}
                      pathEditMode={pathEditMode}
                      learningPathPending={learningPathPending}
                      onPrimaryAction={handlePathPrimaryAction}
                      onClearPath={FULL_PRODUCT_ENABLED ? handleClearPath : undefined}
                    />
                    <button
                      type="button"
                      className="note-layout__sider-collapse-btn"
                      onClick={() => {
                        setShowMenu(false);
                        setCollapsed(true);
                      }}
                      aria-label="Collapse sidebar"
                      title="Collapse sidebar"
                    >
                      <MenuFoldOutlined />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="note-layout__sider-mobile-controls">
                  <LearningPathControls
                    hasPersonalizedPath={hasPersonalizedPath}
                    hasEditableDraft={hasEditableDraft}
                    pathEditMode={pathEditMode}
                    learningPathPending={learningPathPending}
                    onPrimaryAction={handlePathPrimaryAction}
                    onClearPath={FULL_PRODUCT_ENABLED ? handleClearPath : undefined}
                  />
                </div>
              )}
              <LearningNavigationPanel
                items={localizedPlainMenuItems}
                currentNoteUrl={`${currentNoteUrlNormalized}${location.hash || ""}`}
                completedNoteUrls={completedNoteUrls}
                learningPathDraft={learningPathDraft}
                learningPathPending={learningPathPending}
                onAddPathNode={handleAddPathNode}
                onAddCareerToPath={handleAddCareerToPath}
                onReorderPathNodes={handleReorderPathNodes}
                onRemovePathNode={handleRemovePathNode}
                onRestoreRecommendedOrder={handleRestoreRecommendedOrder}
                onStartPathBuilder={handleStartPathBuilder}
                pathEditMode={pathEditMode}
                canonicalGraph={canonicalGraph}
                isMobile={isMobile}
                showNearbyPanel={!isMobile && learningSiderWidth >= LEARNING_SIDER_NEARBY_MIN_WIDTH}
                pilotMode={!FULL_PRODUCT_ENABLED}
                onConfigurePath={() => setPilotPathSetupOpen(true)}
                onSelect={(path) => {
                  handleNoteSelect(path);
                  if (isMobile) setCollapsed(true);
                }}
              />
            </div>
          )}
          {!isMobile && !collapsed ? (
            <div
              className="note-layout__sider-resizer"
              onMouseDown={startLeftSiderResize}
              role="separator"
              aria-orientation="vertical"
              aria-label={t("learningPath.resizeSidebar", "Resize learning path sidebar")}
            />
          ) : null}
        </Sider>
        {!isMobile && collapsed ? (
          <button
            type="button"
            className="note-layout__left-sider-collapsed-trigger"
            onClick={() => {
              setShowMenu(true);
              setCollapsed(false);
            }}
            aria-label="Expand sidebar"
            title="Expand sidebar"
          >
            <MenuUnfoldOutlined />
          </button>
        ) : null}

        <Layout
          className={`note-layout__content-wrapper ${isMobile ? "note-layout__content-wrapper--mobile" : ""}`}
        >
          <div
            className={`note-layout__content-shell ${!isMobile && assistantMode === "dock" ? "note-layout__content-shell--with-assistant" : ""}`}
          >
            <Content
              className={`note-layout__content ${isMobile ? "note-layout__content--mobile" : ""}`}
              ref={noteAreaRef}
            >
              <Breadcrumb
                items={breadcrumbItems}
                className={`note-layout__breadcrumb ${isMobile ? "note-layout__breadcrumb--mobile" : ""}`}
              />
              <NoteWorkspaceBar
                narrationState={narrationState}
                isNarrationPlaying={isNarrationPlaying}
                onToggleNarration={handleToggleNarration}
                officialPodcast={officialPodcast}
                onOpenPodcast={() => navigate(`/podcasts/${officialPodcast.id}`, {
                  state: { returnTo: `${location.pathname}${location.search}${location.hash}` },
                })}
                workspaceBarRef={workspaceBarRef}
                exploreGuideRef={exploreGuideRef}
                immersiveMode={immersiveMode}
                onToggleImmersiveMode={() => setImmersiveMode((value) => !value)}
                isCurrentNoteCompleted={isCurrentNoteCompleted}
                completePending={completeNotePending}
                onToggleCompletion={isOverviewPage ? undefined : handleToggleCurrentNoteCompletion}
                onEnoughForNow={isOverviewPage ? undefined : handleEnoughForNow}
                workspaceMeta={workspaceMeta}
                onExploreMindmap={handleExploreMindmap}
                isMobile={isMobile}
                showAudioTools={FULL_PRODUCT_ENABLED}
              />
              <Outlet
                context={{
                  isCurrentNoteCompleted,
                  completeCurrentNotePending: completeNotePending,
                  onToggleCurrentNoteCompletion: handleToggleCurrentNoteCompletion,
                  noteQuotes,
                  onCreateQuoteFromSelection: handleCreateQuoteFromSelection,
                  onAskWithSelectedText: handleAskWithSelectedText,
                  onGenerateQuizFromSelection: handleGenerateQuizFromSelection,
                  immersiveMode,
                  registerWorkspaceMeta,
                }}
              />
            </Content>
            {!isMobile && !immersiveMode && assistantMode === "dock" ? (
              <>
                {assistantCollapsed ? (
                  <button
                    type="button"
                    className="learning-support-panel__expand-trigger"
                    onClick={() => setAssistantCollapsed(false)}
                    aria-label="Expand learning support panel"
                    title="Expand learning support panel"
                  >
                    <LeftOutlined />
                  </button>
                ) : (
                  <>
                    <div
                      className="learning-support-panel__resizer"
                      onMouseDown={startDockResize}
                      role="separator"
                      aria-label="Resize learning support panel"
                    />
                    <aside
                      className="learning-support-panel note-layout__assistant-dock"
                      style={{ width: `${assistantDockWidth}px` }}
                      aria-label="Learning support"
                    >
                      <header className="learning-support-panel__header">
                        <button
                          type="button"
                          className="learning-support-panel__collapse"
                          onClick={() => setAssistantCollapsed(true)}
                          aria-label="Collapse learning support panel"
                          title="Collapse panel"
                        >
                          <RightOutlined aria-hidden="true" />
                        </button>
                        <nav
                          className="learning-support-panel__tabs"
                          role="tablist"
                          aria-label="Learning support views"
                        >
                          {LEARNING_SUPPORT_TABS.map((tab) => {
                            const isActive = assistantDockTab === tab.id;
                            return (
                              <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                className={`learning-support-panel__tab ${isActive ? "is-active" : ""}`}
                                ref={tab.id === "outline" ? outlineTabRef : undefined}
                                onClick={() => {
                                  setAssistantDockTab(tab.id);
                                  if (tab.tool) setAssistantTool(tab.tool);
                                }}
                              >
                                {t(tab.labelKey)}
                              </button>
                            );
                          })}
                        </nav>
                      </header>
                      <div
                        className={`learning-support-panel__body ${
                          assistantDockTab === "outline" ? "learning-support-panel__body--outline" : ""
                        }`}
                        ref={assistantAreaRef}
                      >
                        {assistantDockTab === "outline" ? (
                          <OutlineSider outline={outline} collapsed={false} hideHeader />
                        ) : (
                          renderAssistantWorkspace(true)
                        )}
                      </div>
                    </aside>
                  </>
                )}
              </>
            ) : null}
          </div>
        </Layout>
      </Layout>

      {/* floating outline button for mobile */}
      {isMobile && (
        <FloatingOutlineButton outline={outline} visible={showFloatingButton} />
      )}
      {immersiveMode && !isOverviewPage ? (
        <BottomOutlineProgress outline={outline} />
      ) : null}
      <audio
        ref={narrationAudioRef}
        src={narrationAudioUrls[currentNarrationChunkIndex] ?? ""}
        preload="none"
      />
      <Modal
        title="Reference notes"
        open={referencePickerOpen}
        onOk={() => setReferencePickerOpen(false)}
        onCancel={() => setReferencePickerOpen(false)}
        okText="Done"
      >
        <Checkbox.Group
          value={selectedReferencePaths}
          onChange={(values) => setSelectedReferencePaths(values)}
          style={{ width: "100%" }}
        >
          <div className="note-layout__reference-list">
            {menuLeafItems.map((item) => (
              <Checkbox key={item.path} value={item.path}>
                {item.label}
              </Checkbox>
            ))}
          </div>
        </Checkbox.Group>
      </Modal>
      <Modal
        title={assistantTool === "quiz" ? "Quiz" : "Study tools"}
        open={assistantModalOpen}
        onCancel={() => setAssistantModalOpen(false)}
        footer={null}
        width={920}
        className="note-layout__assistant-modal"
      >
        {renderAssistantWorkspace(true)}
      </Modal>
      {!FULL_PRODUCT_ENABLED ? (
        <PilotPathSetupModal
          open={pilotPathSetupOpen}
          initialProfile={learningPathDraft?.metadata?.personalization || {}}
          pending={learningPathPending}
          onCancel={() => setPilotPathSetupOpen(false)}
          onSubmit={handleSavePilotPathProfile}
        />
      ) : null}
    </Layout>
  );
};

export default NoteLayout;
