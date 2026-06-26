import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

import {
  Layout,
  Menu,
  Breadcrumb,
  Button,
  theme,
  Row,
  Col,
  Modal,
  Checkbox,
  Space,
  message,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ReadOutlined,
  AppstoreOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

import NoteWorkspaceBar from "../components/NoteWorkspaceBar";
import OutlineSider from "../components/OutlineSider";
import FloatingOutlineButton from "../components/FloatingOutlineButton";
import AssistantWorkspace from "../components/assistant/AssistantWorkspace";
import { PENDING_NOTES_TOUR_KEY } from "../components/guide/AppFeatureTour";
import {
  createNoteGuideSteps,
  prepareNoteTourStep,
} from "../components/guide/productTours";

import { buildMenuItems, injectSubjectOverviewMenuItems, isSubjectOverviewPath } from "../../utils/notesIndexUtils";
import { setTheme, setLanguage } from "../../redux/preferenceSlice";
import {
  requestAssistantQa,
  requestAssistantQuiz,
  requestAssistantQuizEvaluate,
} from "../api/assistant";
import { completeMyNote, createMyNoteQuote, getMyNoteQuotes, getMyProfile, uncompleteMyNote, updateMyGuideState } from "../api/user";

import "./NoteLayout.css";

const { Header, Sider, Content } = Layout;

// convert icon type to icon
const getIcon = (iconType) => {
  switch (iconType) {
    case "index":
      return <ReadOutlined />;
    case "info":
      return <InfoCircleOutlined />;
    case "folder":
      return <FolderOutlined />;
    case "file":
      return <FileTextOutlined />;
    case "overview":
      return <AppstoreOutlined />;
    default:
      return null;
  }
};

// add icons to menu items recursively
const addIconsToMenuItems = (items) => {
  return items.map((item) => ({
    ...item,
    icon: getIcon(item.iconType),
    children: item.children ? addIconsToMenuItems(item.children) : undefined,
  }));
};

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

function decorateMenuItemsWithProgress(items, options, inSubjectFolder = false) {
  const { currentNoteUrl, completedNoteUrls } = options;
  const eligibleFileItems = inSubjectFolder
    ? items.filter((item) => item.iconType === "file")
    : [];

  return items.map((item) => {
    const isFolder = item.iconType === "folder";
    const isFile = item.iconType === "file";
    const nextInSubjectFolder = inSubjectFolder || isFolder;
    const nextChildren = item.children
      ? decorateMenuItemsWithProgress(item.children, options, nextInSubjectFolder)
      : undefined;

    if (inSubjectFolder && item.iconType === "overview") {
      const normalizedKey = normalizeMenuKey(item.key);
      const isCurrent = normalizedKey === currentNoteUrl;
      return {
        ...item,
        children: nextChildren,
        label: (
          <div
            className={`note-layout__menu-overview-label ${isCurrent ? "note-layout__menu-overview-label--current" : ""}`}
          >
            <span className="note-layout__menu-overview-text">{item.label}</span>
          </div>
        ),
      };
    }

    if (inSubjectFolder && isFile) {
      const normalizedKey = normalizeMenuKey(item.key);
      const status = completedNoteUrls.has(normalizedKey)
        ? "done"
        : normalizedKey === currentNoteUrl
          ? "current"
          : "todo";

      const noteIndex = eligibleFileItems.findIndex(
        (candidate) => normalizeMenuKey(candidate.key) === normalizedKey,
      );
      const prevItem = noteIndex > 0 ? eligibleFileItems[noteIndex - 1] : null;
      const nextItem =
        noteIndex >= 0 && noteIndex < eligibleFileItems.length - 1
          ? eligibleFileItems[noteIndex + 1]
          : null;
      const prevStatus = prevItem
        ? completedNoteUrls.has(normalizeMenuKey(prevItem.key))
            ? "done"
            : normalizeMenuKey(prevItem.key) === currentNoteUrl
              ? "current"
              : "todo"
        : null;
      const nextStatus = nextItem
        ? completedNoteUrls.has(normalizeMenuKey(nextItem.key))
            ? "done"
            : normalizeMenuKey(nextItem.key) === currentNoteUrl
              ? "current"
              : "todo"
        : null;
      const topLineColor =
        prevStatus && prevStatus !== "todo" && status !== "todo"
          ? "var(--ns-color-primary)"
          : "var(--ns-color-border)";
      const bottomLineColor =
        nextStatus && status === "done" && nextStatus !== "todo"
          ? "var(--ns-color-primary)"
          : "var(--ns-color-border)";
      const isFirst = noteIndex === 0;
      const isLast = noteIndex === eligibleFileItems.length - 1;

      return {
        ...item,
        icon: undefined,
        children: nextChildren,
        label: (
          <div className={`note-layout__menu-note-label note-layout__menu-note-label--${status}`}>
            <span
              className={`note-layout__menu-note-marker-wrap ${isFirst ? "is-first" : ""} ${isLast ? "is-last" : ""}`}
              style={{
                "--line-top-color": topLineColor,
                "--line-bottom-color": bottomLineColor,
              }}
            >
              <span className="note-layout__menu-note-marker" />
            </span>
            <span className="note-layout__menu-note-text">{item.label}</span>
          </div>
        ),
      };
    }

    return {
      ...item,
      children: nextChildren,
    };
  });
}

function resolveQaAnswerText(payload) {
  if (!payload) return "";
  if (typeof payload === "string") return payload;
  if (typeof payload.answer_markdown === "string") return payload.answer_markdown;
  if (typeof payload.markdown === "string") return payload.markdown;
  if (typeof payload.answer === "string") return payload.answer;
  if (typeof payload.response === "string") return payload.response;
  if (typeof payload.message === "string") return payload.message;
  if (typeof payload.content === "string") return payload.content;
  if (typeof payload.text === "string") return payload.text;
  if (payload.data && typeof payload.data === "object") return resolveQaAnswerText(payload.data);
  return JSON.stringify(payload);
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
  const dispatch = useDispatch();

  // redux state
  const themeValue = useSelector((state) => state.preference.theme);
  const language = useSelector((state) => state.preference.language);
  const isMobile = useSelector((state) => state.preference.isMobile);
  const rawNotesIndex = useSelector((state) => state.notesIndex.data);
  const notesIndex = useMemo(() => rawNotesIndex || [], [rawNotesIndex]);
  const currentMeta = useSelector((state) => state.currentNote.meta);
  const outline = useSelector((state) => state.currentNote.outline);
  const currentNoteContent = useSelector((state) => state.currentNote.content);

  // local state
  const [collapsed, setCollapsed] = useState(isMobile);
  const [showMenu, setShowMenu] = useState(true);
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const [assistantMode, setAssistantMode] = useState("dock");
  const [assistantDockTab, setAssistantDockTab] = useState("outline");
  const [assistantTool, setAssistantTool] = useState("qa");
  const [assistantCollapsed, setAssistantCollapsed] = useState(false);
  const [assistantDockWidth, setAssistantDockWidth] = useState(420);
  const [assistantModalOpen, setAssistantModalOpen] = useState(false);
  const [referencePickerOpen, setReferencePickerOpen] = useState(false);
  const [selectedReferencePaths, setSelectedReferencePaths] = useState([]);
  const [qaInput, setQaInput] = useState("");
  const [qaMessages, setQaMessages] = useState([]);
  const [qaImageFiles, setQaImageFiles] = useState([]);
  const [qaAttachmentFiles, setQaAttachmentFiles] = useState([]);
  const [qaPending, setQaPending] = useState(false);
  const [qaError, setQaError] = useState("");
  const [scratchHtml, setScratchHtml] = useState("");
  const [scratchSavedHint, setScratchSavedHint] = useState("");
  const [quizObjective, setQuizObjective] = useState("check");
  const [quizDifficulty, setQuizDifficulty] = useState("medium");
  const [quizQuestionTypes, setQuizQuestionTypes] = useState(["mcq"]);
  const [quizInstruction, setQuizInstruction] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizEvaluations, setQuizEvaluations] = useState({});
  const [quizEvaluationPendingMap, setQuizEvaluationPendingMap] = useState({});
  const [quizPending, setQuizPending] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [completedNoteUrls, setCompletedNoteUrls] = useState(new Set());
  const [noteQuotes, setNoteQuotes] = useState([]);
  const [completeNotePending, setCompleteNotePending] = useState(false);
  const [notesTourStartToken, setNotesTourStartToken] = useState(0);
  const [workspaceMeta, setWorkspaceMeta] = useState(null);
  const [narrationState, setNarrationState] = useState("idle");
  const [narrationAudioUrls, setNarrationAudioUrls] = useState([]);
  const [currentNarrationChunkIndex, setCurrentNarrationChunkIndex] = useState(0);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  const narrationAudioRef = useRef(null);
  const narrationAudioUrlsRef = useRef([]);
  const narrationChunkIndexRef = useRef(0);
  const noteAreaRef = useRef(null);
  const directoryAreaRef = useRef(null);
  const outlineTabRef = useRef(null);
  const assistantAreaRef = useRef(null);
  const narrationGuideRef = useRef(null);
  const workspaceBarRef = useRef(null);
  const exploreGuideRef = useRef(null);
  const resizeStateRef = useRef({
    active: false,
    startX: 0,
    startWidth: 420,
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
    () => injectSubjectOverviewMenuItems(buildMenuItems(notesIndex)),
    [notesIndex],
  );
  const iconMenuItems = useMemo(() => addIconsToMenuItems(plainMenuItems), [plainMenuItems]);
  const searchItems = useMemo(() => flattenSearchItems(plainMenuItems), [plainMenuItems]);
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
    const labels = findBreadcrumbLabels(plainMenuItems, currentMeta.url) || [];
    return labels.map((label, idx) => ({
      title: label,
      key: `${idx}-${label}`,
    }));
  }, [currentMeta?.url, plainMenuItems]);

  // event handlers
  const handleThemeChange = (checked) =>
    dispatch(setTheme(checked ? "dark" : "light"));
  const handleLanguageChange = (value) => dispatch(setLanguage(value));
  const handleNoteSelect = (path) => navigate(path);

  const handleOpenProfile = () => navigate("/user/profile");

  const handleExploreMindmap = () => {
    const slug = workspaceMeta?.mindmapSubjectSlug;
    if (slug) navigate(`/subject/${slug}/mindmap`);
  };

  const handleToggleAssistant = () => {
    if (isMobile) {
      setAssistantModalOpen(true);
      return;
    }
    setAssistantMode("dock");
    if (assistantCollapsed) {
      setAssistantCollapsed(false);
      setAssistantDockTab("qa");
      setAssistantTool("qa");
    } else {
      setAssistantCollapsed(true);
    }
  };

  const assistantPanelActive =
    isMobile ? assistantModalOpen : assistantMode === "dock" && !assistantCollapsed;

  const registerWorkspaceMeta = useCallback((meta) => {
    setWorkspaceMeta(meta);
  }, []);

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

  const menuLeafItems = useMemo(() => flattenMenuLeafItems(plainMenuItems), [plainMenuItems]);
  const selectedReferenceItems = useMemo(() => {
    const selected = new Set(selectedReferencePaths);
    return menuLeafItems.filter((item) => selected.has(item.path));
  }, [menuLeafItems, selectedReferencePaths]);

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

  const handleCreateQuoteFromSelection = async (selection) => {
    const selectedText = String(selection?.selectedText || "").trim();
    if (!selectedText || !currentNoteUrlNormalized) return null;
    try {
      const quote = await createMyNoteQuote({
        noteUrl: currentNoteUrlNormalized,
        noteTitle: noteName,
        subject: currentMeta?.subjectName || "",
        selectedText,
        contextBefore: selection?.contextBefore || "",
        contextAfter: selection?.contextAfter || "",
        noteVersionId: "current",
      });
      setNoteQuotes((prev) => [...prev, quote]);
      setScratchHtml((prev) => {
        const safeSelectedText = escapeHtml(selectedText);
        const safeNoteName = escapeHtml(noteName);
        const quoteHtml = [
          `<blockquote class="personal-note-quote" data-quote-id="${quote.quote_id}">`,
          `<p>${safeSelectedText}</p>`,
          `<footer>From ${safeNoteName}</footer>`,
          "</blockquote>",
        ].join("");
        return prev ? `${prev}${quoteHtml}` : quoteHtml;
      });
      setAssistantDockTab("notes");
      setAssistantTool("notes");
      setAssistantCollapsed(false);
      message.success("Added selected text to your notes.");
      return quote;
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Failed to save selected text.";
      message.error(errorText);
      return null;
    }
  };

  const handleAskWithSelectedText = (selection) => {
    const selectedText = String(selection?.selectedText || "").trim();
    if (!selectedText) return;
    setQaInput(`Explain this selected passage from ${noteName}:\n\n"${selectedText}"`);
    setAssistantDockTab("qa");
    setAssistantTool("qa");
    setAssistantCollapsed(false);
  };

  const menuItems = useMemo(
    () =>
      decorateMenuItemsWithProgress(iconMenuItems, {
        currentNoteUrl: currentNoteUrlNormalized,
        completedNoteUrls,
      }),
    [completedNoteUrls, currentNoteUrlNormalized, iconMenuItems],
  );

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
    const onMouseMove = (event) => {
      if (!resizeStateRef.current.active) return;
      const delta = event.clientX - resizeStateRef.current.startX;
      const nextWidth = Math.min(700, Math.max(320, resizeStateRef.current.startWidth - delta));
      setAssistantDockWidth(nextWidth);
    };
    const onMouseUp = () => {
      resizeStateRef.current.active = false;
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

  const assistantContextPayload = useMemo(
    () => ({
      currentNote: {
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
    [currentMeta?.url, currentNoteContent, noteName, selectedReferenceItems],
  );

  const handleSendQa = async () => {
    const trimmedQuestion = qaInput.trim();
    if (!trimmedQuestion || qaPending) return;

    setQaError("");
    const userMessage = {
      id: `qa-user-${Date.now()}`,
      role: "user",
      text: trimmedQuestion,
    };
    const nextMessages = [...qaMessages, userMessage];
    setQaMessages(nextMessages);
    setQaInput("");
    setQaPending(true);

    try {
      const payload = {
        question: trimmedQuestion,
        history: nextMessages.slice(-12).map((item) => ({ role: item.role, content: item.text })),
        ...assistantContextPayload,
      };
      const response = await requestAssistantQa(payload, {
        images: qaImageFiles,
        attachments: qaAttachmentFiles,
      });
      const answerText = resolveQaAnswerText(response) || "No response content.";
      setQaMessages((prev) => [
        ...prev,
        {
          id: `qa-assistant-${Date.now()}`,
          role: "assistant",
          text: answerText,
        },
      ]);
      setQaImageFiles([]);
      setQaAttachmentFiles([]);
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Q&A request failed.";
      setQaError(errorText);
      message.error(errorText);
    } finally {
      setQaPending(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!quizObjective || !quizDifficulty || quizPending || quizQuestionTypes.length === 0) return;
    setQuizError("");
    setQuizPending(true);
    try {
      const payload = {
        objective: quizObjective,
        difficulty: quizDifficulty,
        questionTypes: quizQuestionTypes,
        customInstruction: quizInstruction || "",
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

  const removeSelectedQaFile = (list, fileName) => list.filter((file) => file.name !== fileName);

  const renderAssistantWorkspace = (hideToolTabs = false) => (
    <AssistantWorkspace
      noteName={noteName}
      activeTool={assistantTool}
      onToolChange={setAssistantTool}
      qaInput={qaInput}
      onQaInputChange={setQaInput}
      qaMessages={qaMessages}
      onSendQa={handleSendQa}
      onOpenReferencePicker={() => setReferencePickerOpen(true)}
      onPickImages={(files) => setQaImageFiles((prev) => [...prev, ...files])}
      onPickAttachments={(files) => setQaAttachmentFiles((prev) => [...prev, ...files])}
      qaReferenceCount={selectedReferenceItems.length}
      qaImageCount={qaImageFiles.length}
      qaAttachmentCount={qaAttachmentFiles.length}
      qaReferenceNames={selectedReferenceItems.map((item) => item.label)}
      qaImageNames={qaImageFiles.map((file) => file.name)}
      qaAttachmentNames={qaAttachmentFiles.map((file) => file.name)}
      onRemoveQaReference={(name) =>
        setSelectedReferencePaths((prev) =>
          prev.filter((path) => selectedReferenceItems.find((item) => item.path === path)?.label !== name),
        )
      }
      onRemoveQaImage={(name) => setQaImageFiles((prev) => removeSelectedQaFile(prev, name))}
      onRemoveQaAttachment={(name) =>
        setQaAttachmentFiles((prev) => removeSelectedQaFile(prev, name))
      }
      qaPending={qaPending}
      qaError={qaError}
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
      }),
    [],
  );

  return (
    <Layout
      className="note-layout"
      style={{
        "--header-bg": colorBgContainer,
        "--sider-bg": colorBgContainer,
        "--content-bg": colorBgContainer,
        "--content-radius": borderRadiusLG,
      }}
    >
      {isMobile ? (
        <Header
          className={`note-layout__header ${isMobile ? "note-layout__header--mobile" : ""}`}
        >
          <Row align="middle" className="note-layout__header-row">
            <Col>
              <Button
                type="text"
                className={`note-layout__menu-button ${isMobile ? "note-layout__menu-button--mobile" : ""}`}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => {
                  if (!collapsed) setShowMenu(false);
                  else setShowMenu(true);
                  setCollapsed(!collapsed);
                }}
              />
            </Col>
            <Col flex="auto" />
          </Row>
        </Header>
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
          width={isMobile ? "100%" : 350}
          collapsedWidth={0}
          className={`note-layout__sider ${isMobile ? "note-layout__sider--mobile" : ""}`}
          collapsible
          collapsed={collapsed}
          trigger={null}
        >
          {showMenu && (
            <div className="note-layout__sider-menu-shell" ref={directoryAreaRef}>
              {!isMobile ? (
                <div className="note-layout__sider-header">
                  <span className="note-layout__sider-title">Notes</span>
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
              ) : null}
              <Menu
                mode="inline"
                className={`note-layout__menu ${isMobile ? "note-layout__menu--mobile" : ""}`}
                items={menuItems}
                onClick={({ key }) => {
                  handleNoteSelect(key);
                  // auto-close menu on mobile after selection
                  if (isMobile) {
                    setCollapsed(true);
                  }
                }}
              />
            </div>
          )}
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
                theme={themeValue}
                language={language}
                onThemeChange={handleThemeChange}
                onLanguageChange={handleLanguageChange}
                searchOptions={searchOptions}
                narrationState={narrationState}
                isNarrationPlaying={isNarrationPlaying}
                onToggleNarration={handleToggleNarration}
                workspaceBarRef={workspaceBarRef}
                exploreGuideRef={exploreGuideRef}
                notesGuideSteps={noteGuideSteps}
                notesTourStartToken={notesTourStartToken}
                onNotesTourStepChange={handleNoteTourStepChange}
                onOpenProfile={handleOpenProfile}
                onToggleAssistant={handleToggleAssistant}
                assistantActive={assistantPanelActive}
                isCurrentNoteCompleted={isCurrentNoteCompleted}
                completePending={completeNotePending}
                onToggleCompletion={isOverviewPage ? undefined : handleToggleCurrentNoteCompletion}
                workspaceMeta={workspaceMeta}
                onExploreMindmap={handleExploreMindmap}
                isMobile={isMobile}
              />
              <Outlet
                context={{
                  isCurrentNoteCompleted,
                  completeCurrentNotePending: completeNotePending,
                  onToggleCurrentNoteCompletion: handleToggleCurrentNoteCompletion,
                  noteQuotes,
                  onCreateQuoteFromSelection: handleCreateQuoteFromSelection,
                  onAskWithSelectedText: handleAskWithSelectedText,
                  registerWorkspaceMeta,
                }}
              />
            </Content>
            {!isMobile && assistantMode === "dock" ? (
              <>
                {assistantCollapsed ? (
                  <button
                    type="button"
                    className="note-layout__assistant-collapsed-trigger"
                    onClick={() => setAssistantCollapsed(false)}
                    aria-label="Expand assistant panel"
                    title="Expand assistant panel"
                  >
                    <LeftOutlined />
                  </button>
                ) : (
                  <>
                    <div
                      className="note-layout__assistant-resizer"
                      onMouseDown={startDockResize}
                      role="separator"
                      aria-label="Resize assistant panel"
                    />
                    <aside
                      className="note-layout__assistant-dock"
                      style={{ width: `${assistantDockWidth}px` }}
                    >
                      <div className="note-layout__assistant-dock-header">
                        <Button
                          size="small"
                          type="text"
                          className="note-layout__assistant-collapse-btn"
                          icon={<RightOutlined />}
                          onClick={() => setAssistantCollapsed(true)}
                          aria-label="Collapse assistant panel"
                          title="Collapse assistant panel"
                        />
                        <Space size={6} wrap>
                          <Button
                            size="small"
                            type={assistantDockTab === "outline" ? "primary" : "default"}
                            onClick={() => setAssistantDockTab("outline")}
                            ref={outlineTabRef}
                          >
                            Outline
                          </Button>
                          <Button
                            size="small"
                            type={assistantDockTab === "qa" ? "primary" : "default"}
                            onClick={() => {
                              setAssistantDockTab("qa");
                              setAssistantTool("qa");
                            }}
                          >
                            Q&A
                          </Button>
                          <Button
                            size="small"
                            type={assistantDockTab === "notes" ? "primary" : "default"}
                            onClick={() => {
                              setAssistantDockTab("notes");
                              setAssistantTool("notes");
                            }}
                          >
                            Notes
                          </Button>
                          <Button
                            size="small"
                            type={assistantDockTab === "quiz" ? "primary" : "default"}
                            onClick={() => {
                              setAssistantDockTab("quiz");
                              setAssistantTool("quiz");
                            }}
                          >
                            Quiz
                          </Button>
                        </Space>
                      </div>
                      <div className="note-layout__assistant-dock-body" ref={assistantAreaRef}>
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
        title="Assistant"
        open={assistantModalOpen}
        onCancel={() => setAssistantModalOpen(false)}
        footer={null}
        width={920}
        className="note-layout__assistant-modal"
      >
        {renderAssistantWorkspace(false)}
      </Modal>
    </Layout>
  );
};

export default NoteLayout;
