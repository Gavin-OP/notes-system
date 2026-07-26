import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCurrentNoteMeta,
  setCurrentNoteMeta,
  setCurrentNoteOutline,
  setCurrentNoteContent,
} from "../../../../app/store/currentNoteSlice";
import { useParams, useLocation, useOutletContext, useNavigate } from "react-router-dom";
import {
  fetchSubjectNotesIndexFromGraph,
  restoreDefaultNotesIndex,
} from "../../../../app/store/notesIndexSlice";

import MarkdownRenderer from "./components/MarkdownRenderer";
import { findMeta, getFirstSubjectTopicUrl, isIndexNoteItem, isNavigableSubjectSlug } from "../../../navigation/lib/notesIndexUtils";
import { getOutline } from "../../lib/markdownUtils";
import {
  getNoteVersionContent,
  getNoteVersions,
  restoreNoteAnnotations,
} from "../../api/noteVersions";
import useTranslatedContent from "../../../../i18n/useTranslatedContent";
import "./NotePage.css";

function removeYamlFrontMatter(text) {
  // 匹配以 --- 开头和结尾的 YAML front matter
  return text.replace(/^---[\s\S]*?---\s*/, "");
}

function normalizeAnchorToken(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveNoteFilePath(meta, rawNoteUrl) {
  if (meta && meta.directory !== undefined && meta.name) {
    return meta.directory === "." ? `${meta.name}` : `${meta.directory}/${meta.name}`;
  }

  const normalizedUrl = String(rawNoteUrl || "")
    .split("#")[0]
    .replace(/^\/+/, "")
    .replace(/^note\//, "");
  if (!normalizedUrl) return "";

  if (normalizedUrl.endsWith("/index")) {
    return normalizedUrl.replace(/\/index$/, "/_index.md");
  }
  if (normalizedUrl.toLowerCase().endsWith(".md")) {
    return normalizedUrl;
  }
  return `${normalizedUrl}.md`;
}

function parseNoteSubjectAndTopic(notePath) {
  const cleanPath = String(notePath || "").split("?")[0].split("#")[0].replace(/^\/+/, "");
  const parts = cleanPath.split("/").filter(Boolean);
  if (parts.length < 2) return { subjectSlug: "", topicSlug: "" };
  return {
    subjectSlug: parts[0],
    topicSlug: parts[1].replace(/\.md$/i, ""),
  };
}

function NotePage() {
  // navigation
  const { "*": note_url } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const noteSlugTrimmed = typeof note_url === "string" ? note_url.trim() : "";
  const notePathWithoutHash = noteSlugTrimmed.split("#")[0].replace(/^\/+/, "");
  const showMicroCourseLink =
    notePathWithoutHash === "data-science/data-cleaning-preprocessing.md" ||
    notePathWithoutHash === "data-science/data-cleaning-preprocessing";

  // redux
  const dispatch = useDispatch();
  const notesIndex = useSelector((state) => state.notesIndex.data);
  const theme = useSelector((state) => state.preference.theme);
  const outletContext = useOutletContext() || {};
  const noteSearchParams = new URLSearchParams(location.search);
  const activeQuoteId = noteSearchParams.get("quoteId") || "";
  const searchQuery = noteSearchParams.get("search") || "";
  const searchMatchText = noteSearchParams.get("match") || "";
  const noteQuotes = useMemo(
    () => (Array.isArray(outletContext.noteQuotes) ? outletContext.noteQuotes : []),
    [outletContext.noteQuotes],
  );
  const onCreateQuoteFromSelection =
    typeof outletContext.onCreateQuoteFromSelection === "function"
      ? outletContext.onCreateQuoteFromSelection
      : null;
  const onAskWithSelectedText =
    typeof outletContext.onAskWithSelectedText === "function"
      ? outletContext.onAskWithSelectedText
      : null;
  const onGenerateQuizFromSelection =
    typeof outletContext.onGenerateQuizFromSelection === "function"
      ? outletContext.onGenerateQuizFromSelection
      : null;
  const immersiveMode = Boolean(outletContext.immersiveMode);
  const registerWorkspaceMeta =
    typeof outletContext.registerWorkspaceMeta === "function"
      ? outletContext.registerWorkspaceMeta
      : null;

  // state
  const [noteContent, setNoteContent] = useState("");
  const [noteLoadState, setNoteLoadState] = useState("idle");
  const [noteErrorText, setNoteErrorText] = useState("");
  const [noteReloadToken, setNoteReloadToken] = useState(0);
  const [noteVersions, setNoteVersions] = useState([]);
  const [selectedVersionId, setSelectedVersionId] = useState("current");
  const [versionApiAvailable, setVersionApiAvailable] = useState(false);
  const [restoreCandidates, setRestoreCandidates] = useState([]);
  const [restorePending, setRestorePending] = useState(false);
  const translatedNote = useTranslatedContent(noteContent, {
    sourceType: "markdown_note",
    sourceId: notePathWithoutHash || "note",
    contentVersion: selectedVersionId || "current",
  });
  const displayNoteContent = translatedNote.content || noteContent;

  const outline = useMemo(() => getOutline(displayNoteContent), [displayNoteContent]);
  const { subjectSlug, topicSlug } = useMemo(
    () => parseNoteSubjectAndTopic(notePathWithoutHash),
    [notePathWithoutHash],
  );
  const visibleNoteQuotes = useMemo(
    () => {
      const filtered = noteQuotes.filter((quote) => {
        const quoteVersion = quote.note_version_id || quote.noteVersionId || "current";
        return selectedVersionId === "current"
          ? quoteVersion === "current" || !quoteVersion
          : quoteVersion === selectedVersionId;
      });
      const restored = restoreCandidates.map((mapping) => ({
        quote_id: mapping.annotation_id || mapping.mapping_id,
        selected_text: mapping.matched_text,
        note_version_id: selectedVersionId,
        status: "restored_candidate",
      }));
      return [...filtered, ...restored];
    },
    [noteQuotes, restoreCandidates, selectedVersionId],
  );

  const handleRestoreAnnotations = useCallback(async () => {
    if (!subjectSlug || !topicSlug) return;
    setRestorePending(true);
    try {
      const payload = await restoreNoteAnnotations(subjectSlug, topicSlug, selectedVersionId);
      setRestoreCandidates(Array.isArray(payload?.mappings) ? payload.mappings : []);
    } catch {
      setRestoreCandidates([]);
    } finally {
      setRestorePending(false);
    }
  }, [subjectSlug, topicSlug, selectedVersionId]);

  const handleVersionChange = useCallback((versionId) => {
    setSelectedVersionId(versionId);
    setRestoreCandidates([]);
  }, []);

  useEffect(() => {
    if (!registerWorkspaceMeta) return undefined;
    registerWorkspaceMeta({
      showMindmap: isNavigableSubjectSlug(subjectSlug),
      mindmapSubjectSlug: subjectSlug,
      subjectSlug,
      topicSlug,
      versions: noteVersions,
      selectedVersionId,
      onVersionChange: handleVersionChange,
      onRestoreAnnotations: handleRestoreAnnotations,
      restorePending,
      restoreCandidateCount: restoreCandidates.length,
    });
    return () => registerWorkspaceMeta(null);
  }, [
    registerWorkspaceMeta,
    subjectSlug,
    topicSlug,
    noteVersions,
    selectedVersionId,
    handleVersionChange,
    handleRestoreAnnotations,
    restorePending,
    restoreCandidates.length,
  ]);

  const currentSubjectId = useMemo(() => {
    if (!noteSlugTrimmed) return null;
    const [pathPart] = noteSlugTrimmed.split("#");
    const parts = pathPart.split("/").filter(Boolean);
    return parts.length > 0 ? parts[0] : null;
  }, [noteSlugTrimmed]);

  useEffect(() => {
    if (noteSlugTrimmed) return;
    dispatch(clearCurrentNoteMeta());
    setNoteContent("");
    setNoteLoadState("idle");
    setNoteErrorText("");
    dispatch(setCurrentNoteOutline([]));
    dispatch(setCurrentNoteContent(""));
  }, [noteSlugTrimmed, dispatch]);

  useEffect(() => {
    if (noteSlugTrimmed) return;
    if (!Array.isArray(notesIndex) || notesIndex.length === 0) return;
    navigate("/note/disclaimer.md", { replace: true });
  }, [noteSlugTrimmed, notesIndex, navigate]);

  useEffect(() => {
    if (!notesIndex || !noteSlugTrimmed) return;
    const url = `/note/${noteSlugTrimmed.split("#")[0].replace(/^\/+/, "")}`;
    const meta = findMeta(notesIndex, url);
    if (!meta || !isIndexNoteItem(meta) || !subjectSlug) return;
    const firstTopicUrl = getFirstSubjectTopicUrl(notesIndex, subjectSlug);
    if (firstTopicUrl) {
      navigate(firstTopicUrl, { replace: true });
    }
  }, [notesIndex, noteSlugTrimmed, subjectSlug, navigate]);

  useEffect(() => {
    if (currentSubjectId) {
      dispatch(fetchSubjectNotesIndexFromGraph(currentSubjectId));
    } else {
      dispatch(restoreDefaultNotesIndex());
    }
  }, [currentSubjectId, dispatch]);

  useEffect(() => {
    if (notesIndex && noteSlugTrimmed) {
      let cancelled = false;
      setNoteContent("");
      setNoteLoadState("loading");
      setNoteErrorText("");
      const url = `/note/${noteSlugTrimmed}`;
      const meta = findMeta(notesIndex, url);
      dispatch(setCurrentNoteMeta(meta));

      async function fetchNote() {
        const filePath = resolveNoteFilePath(meta, noteSlugTrimmed);
        if (!filePath) {
          if (!cancelled) {
            setNoteContent("");
            setNoteLoadState("error");
            setNoteErrorText("We could not find the note file for this page.");
          }
          return;
        }

        try {
          if (versionApiAvailable && selectedVersionId !== "current" && subjectSlug && topicSlug) {
            const versionPayload = await getNoteVersionContent(subjectSlug, topicSlug, selectedVersionId);
            if (cancelled) return;
            setNoteContent(removeYamlFrontMatter(versionPayload?.content || ""));
            setNoteLoadState("ready");
            return;
          }
          const res = await fetch(
            `${import.meta.env.BASE_URL}notes/${filePath}`,
          );
          if (cancelled) return;
          if (res.ok) {
            const rawText = await res.text();
            setNoteContent(removeYamlFrontMatter(rawText));
            setNoteLoadState("ready");
          } else {
            setNoteContent("");
            setNoteLoadState("error");
            setNoteErrorText("This note is not available yet. You can retry or go back to the subject list.");
          }
        } catch (e) {
          if (cancelled) return;
          setNoteContent("");
          setNoteLoadState("error");
          setNoteErrorText("Network error while loading this note. Please retry.");
          console.log(e);
        }
      }
      fetchNote();
      return () => {
        cancelled = true;
      };
    }
    return undefined;
  }, [notesIndex, noteSlugTrimmed, dispatch, selectedVersionId, subjectSlug, topicSlug, versionApiAvailable, noteReloadToken]);

  useEffect(() => {
    let mounted = true;
    async function loadVersions() {
      setNoteVersions([]);
      setSelectedVersionId("current");
      setVersionApiAvailable(false);
      setRestoreCandidates([]);
      if (!subjectSlug || !topicSlug) return;
      try {
        const versions = await getNoteVersions(subjectSlug, topicSlug);
        if (!mounted) return;
        setNoteVersions(Array.isArray(versions) ? versions : []);
        setVersionApiAvailable(true);
      } catch {
        if (!mounted) return;
        setNoteVersions([]);
        setVersionApiAvailable(false);
      }
    }
    loadVersions();
    return () => {
      mounted = false;
    };
  }, [subjectSlug, topicSlug]);

  useEffect(() => {
    dispatch(setCurrentNoteOutline(outline));
  }, [displayNoteContent, outline, dispatch]);

  useEffect(() => {
    dispatch(setCurrentNoteContent(displayNoteContent));
  }, [displayNoteContent, dispatch]);

  useEffect(() => {
    if (!displayNoteContent) return;

    const resolveAnchorElement = () => {
      const rawHash = location.hash?.replace(/^#/, "");
      if (!rawHash) {
        return null;
      }

      const decodedHash = decodeURIComponent(rawHash);
      const candidateIds = [decodedHash];
      if (decodedHash.startsWith("concept-")) {
        candidateIds.push(decodedHash.replace(/^concept-/, ""));
      }
      const normalizedTokens = candidateIds
        .map((candidate) => normalizeAnchorToken(candidate))
        .filter(Boolean);
      const escapedCandidates = candidateIds.map((candidate) =>
        typeof CSS !== "undefined" && typeof CSS.escape === "function"
          ? CSS.escape(candidate)
          : candidate.replace(/["\\]/g, "\\$&")
      );

      const anchorElement =
        candidateIds
          .map((candidate) => document.getElementById(candidate))
          .find(Boolean) ??
        escapedCandidates
          .map((escaped) => document.querySelector(`[id="${escaped}"]`))
          .find(Boolean);

      if (anchorElement) {
        return anchorElement;
      }

      {
        const headingNodes = Array.from(
          document.querySelectorAll(".markdown-body h1[id], .markdown-body h2[id], .markdown-body h3[id], .markdown-body h4[id], .markdown-body h5[id], .markdown-body h6[id]")
        );
        return headingNodes.find((heading) => {
          const headingId = normalizeAnchorToken(heading.id);
          const headingText = normalizeAnchorToken(heading.textContent);
          return normalizedTokens.some(
            (token) =>
              headingId === token ||
              headingId.startsWith(`${token}-`) ||
              headingId.includes(`-${token}-`) ||
              headingText === token ||
              headingText.startsWith(`${token}-`)
          );
        });
      }
    };

    const rawHash = location.hash?.replace(/^#/, "");
    if (!rawHash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return undefined;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const attemptScroll = () => {
      attempts += 1;
      const anchorElement = resolveAnchorElement();
      if (anchorElement) {
        anchorElement.scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }
      if (attempts >= maxAttempts) {
        // Fallback prevents blank viewport when hash target is missing.
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        return;
      }
      setTimeout(attemptScroll, 80);
    };

    const timer = setTimeout(attemptScroll, 0);
    return () => clearTimeout(timer);
  }, [displayNoteContent, location.hash, location.pathname]);

  return (
    <>
      <div className={`note-page ${immersiveMode ? "note-page--immersive" : ""}`}>
        {noteLoadState === "loading" ? (
          <div className="note-page__state" role="status" aria-live="polite">
            <div className="note-page__skeleton note-page__skeleton-title" />
            <div className="note-page__skeleton note-page__skeleton-line" />
            <div className="note-page__skeleton note-page__skeleton-line is-short" />
            <div className="note-page__skeleton note-page__skeleton-block" />
          </div>
        ) : null}
        {noteLoadState === "error" ? (
          <div className="note-page__state note-page__error" role="alert">
            <h2>Could not load this note</h2>
            <p>{noteErrorText || "Something went wrong while loading the note."}</p>
            <div className="note-page__state-actions">
              <button type="button" onClick={() => setNoteReloadToken((value) => value + 1)}>
                Retry
              </button>
              <button type="button" onClick={() => navigate("/subjects")}>
                Browse subjects
              </button>
            </div>
          </div>
        ) : null}
        {noteLoadState === "ready" && noteContent ? (
          <>
            <MarkdownRenderer
              content={displayNoteContent}
              theme={theme}
              noteQuotes={visibleNoteQuotes}
              activeQuoteId={activeQuoteId}
              searchQuery={searchQuery}
              searchMatchText={searchMatchText}
              onCreateQuoteFromSelection={onCreateQuoteFromSelection}
              onAskWithSelectedText={onAskWithSelectedText}
              onGenerateQuizFromSelection={onGenerateQuizFromSelection}
              immersiveMode={immersiveMode}
            />
            {showMicroCourseLink ? (
              <div className="note-page__complete-footer">
                <button
                  type="button"
                  className="note-page__micro-course-btn"
                  onClick={() => navigate("/micro-course/data-cleaning-preprocessing")}
                >
                  Open interactive micro-course
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </>
  );
}

export default NotePage;
