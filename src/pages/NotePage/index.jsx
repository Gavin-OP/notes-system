import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCurrentNoteMeta,
  setCurrentNoteMeta,
  setCurrentNoteOutline,
  setCurrentNoteContent,
} from "../../redux/currentNoteSlice";
import { useParams, useLocation, useOutletContext, useNavigate } from "react-router-dom";
import {
  fetchSubjectNotesIndexFromGraph,
  restoreDefaultNotesIndex,
} from "../../redux/notesIndexSlice";

import MarkdownRenderer from "./components/MarkdownRenderer";
import { findMeta, getFirstSubjectTopicUrl, getSubjectOverviewUrl, isIndexNoteItem, isNavigableSubjectSlug, isSubjectOverviewPath } from "../../utils/notesIndexUtils";
import SubjectOverviewContent from "../SubjectOverview/SubjectOverviewContent";
import { getOutline } from "../../utils/markdownUtils";
import {
  getNoteVersionContent,
  getNoteVersions,
  restoreNoteAnnotations,
} from "../../common/api/noteVersions";
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
  const registerWorkspaceMeta =
    typeof outletContext.registerWorkspaceMeta === "function"
      ? outletContext.registerWorkspaceMeta
      : null;

  // state
  const [noteContent, setNoteContent] = useState("");
  const [noteVersions, setNoteVersions] = useState([]);
  const [selectedVersionId, setSelectedVersionId] = useState("current");
  const [versionApiAvailable, setVersionApiAvailable] = useState(false);
  const [restoreCandidates, setRestoreCandidates] = useState([]);
  const [restorePending, setRestorePending] = useState(false);

  const outline = useMemo(() => getOutline(noteContent), [noteContent]);
  const isOverview = isSubjectOverviewPath(notePathWithoutHash);
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
    if (isOverview) {
      registerWorkspaceMeta({
        showMindmap: isNavigableSubjectSlug(subjectSlug),
        mindmapSubjectSlug: subjectSlug,
        versions: [],
        selectedVersionId: "current",
        onVersionChange: () => {},
        onRestoreAnnotations: () => {},
        restorePending: false,
        restoreCandidateCount: 0,
      });
      return () => registerWorkspaceMeta(null);
    }
    registerWorkspaceMeta({
      showMindmap: isNavigableSubjectSlug(subjectSlug),
      mindmapSubjectSlug: subjectSlug,
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
    isOverview,
    subjectSlug,
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
    dispatch(setCurrentNoteOutline([]));
    dispatch(setCurrentNoteContent(""));
  }, [noteSlugTrimmed, dispatch]);

  useEffect(() => {
    if (noteSlugTrimmed) return;
    if (!Array.isArray(notesIndex) || notesIndex.length === 0) return;
    navigate("/note/disclaimer.md", { replace: true });
  }, [noteSlugTrimmed, notesIndex, navigate]);

  useEffect(() => {
    if (!notesIndex || !noteSlugTrimmed || isOverview) return;
    const url = `/note/${noteSlugTrimmed.split("#")[0].replace(/^\/+/, "")}`;
    const meta = findMeta(notesIndex, url);
    if (!meta || !isIndexNoteItem(meta) || !subjectSlug) return;
    const firstTopicUrl = getFirstSubjectTopicUrl(notesIndex, subjectSlug);
    if (firstTopicUrl) {
      navigate(firstTopicUrl, { replace: true });
    }
  }, [notesIndex, noteSlugTrimmed, isOverview, subjectSlug, navigate]);

  useEffect(() => {
    if (currentSubjectId) {
      dispatch(fetchSubjectNotesIndexFromGraph(currentSubjectId));
    } else {
      dispatch(restoreDefaultNotesIndex());
    }
  }, [currentSubjectId, dispatch]);

  useEffect(() => {
    if (!isOverview || !subjectSlug) return;
    dispatch(
      setCurrentNoteMeta({
        url: getSubjectOverviewUrl(subjectSlug),
        title: "Overview",
        directory: subjectSlug,
        name: "overview",
      }),
    );
    dispatch(setCurrentNoteOutline([]));
    dispatch(setCurrentNoteContent(""));
    setNoteContent("");
  }, [isOverview, subjectSlug, dispatch]);

  useEffect(() => {
    if (isOverview) return;
    if (notesIndex && noteSlugTrimmed) {
      setNoteContent("");
      const url = `/note/${noteSlugTrimmed}`;
      const meta = findMeta(notesIndex, url);
      dispatch(setCurrentNoteMeta(meta));

      async function fetchNote() {
        const filePath = resolveNoteFilePath(meta, noteSlugTrimmed);
        if (!filePath) {
          setNoteContent("");
          return;
        }

        try {
          if (versionApiAvailable && selectedVersionId !== "current" && subjectSlug && topicSlug) {
            const versionPayload = await getNoteVersionContent(subjectSlug, topicSlug, selectedVersionId);
            setNoteContent(removeYamlFrontMatter(versionPayload?.content || ""));
            return;
          }
          const res = await fetch(
            `${import.meta.env.BASE_URL}notes/${filePath}`,
          );
          if (res.ok) {
            const rawText = await res.text();
            setNoteContent(removeYamlFrontMatter(rawText));
          } else {
            setNoteContent("Note file not found.");
          }
        } catch (e) {
          setNoteContent("Error loading note content.");
          console.log(e);
        }
      }
      fetchNote();
    }
  }, [isOverview, notesIndex, noteSlugTrimmed, dispatch, selectedVersionId, subjectSlug, topicSlug, versionApiAvailable]);

  useEffect(() => {
    if (isOverview) return;
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
  }, [isOverview, subjectSlug, topicSlug]);

  useEffect(() => {
    if (isOverview) return;
    dispatch(setCurrentNoteOutline(outline));
  }, [isOverview, noteContent, outline, dispatch]);

  useEffect(() => {
    if (isOverview) return;
    dispatch(setCurrentNoteContent(noteContent));
  }, [isOverview, noteContent, dispatch]);

  useEffect(() => {
    if (isOverview || !noteContent) return;

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
  }, [isOverview, noteContent, location.hash, location.pathname]);

  if (isOverview && subjectSlug) {
    return (
      <div className="note-page">
        <SubjectOverviewContent subjectId={subjectSlug} />
      </div>
    );
  }

  return (
    <>
      <div className="note-page">
        {noteContent && (
          <>
            <MarkdownRenderer
              content={noteContent}
              theme={theme}
              noteQuotes={visibleNoteQuotes}
              activeQuoteId={activeQuoteId}
              searchQuery={searchQuery}
              searchMatchText={searchMatchText}
              onCreateQuoteFromSelection={onCreateQuoteFromSelection}
              onAskWithSelectedText={onAskWithSelectedText}
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
        )}
      </div>
    </>
  );
}

export default NotePage;
