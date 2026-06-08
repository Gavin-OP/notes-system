import { useState, useEffect, useMemo } from "react";
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
import { findMeta } from "../../utils/notesIndexUtils";
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
  const isCurrentNoteCompleted = Boolean(outletContext.isCurrentNoteCompleted);
  const completeCurrentNotePending = Boolean(outletContext.completeCurrentNotePending);
  const noteSearchParams = new URLSearchParams(location.search);
  const activeQuoteId = noteSearchParams.get("quoteId") || "";
  const searchQuery = noteSearchParams.get("search") || "";
  const searchMatchText = noteSearchParams.get("match") || "";
  const noteQuotes = Array.isArray(outletContext.noteQuotes) ? outletContext.noteQuotes : [];
  const onToggleCurrentNoteCompletion =
    typeof outletContext.onToggleCurrentNoteCompletion === "function"
      ? outletContext.onToggleCurrentNoteCompletion
      : null;
  const onCreateQuoteFromSelection =
    typeof outletContext.onCreateQuoteFromSelection === "function"
      ? outletContext.onCreateQuoteFromSelection
      : null;
  const onAskWithSelectedText =
    typeof outletContext.onAskWithSelectedText === "function"
      ? outletContext.onAskWithSelectedText
      : null;

  // state
  const [noteContent, setNoteContent] = useState("");
  const [noteVersions, setNoteVersions] = useState([]);
  const [selectedVersionId, setSelectedVersionId] = useState("current");
  const [versionApiAvailable, setVersionApiAvailable] = useState(false);
  const [restoreCandidates, setRestoreCandidates] = useState([]);
  const [restorePending, setRestorePending] = useState(false);

  const outline = useMemo(() => getOutline(noteContent), [noteContent]);
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

  const handleRestoreAnnotations = async () => {
    if (!subjectSlug || !topicSlug || restorePending) return;
    setRestorePending(true);
    try {
      const payload = await restoreNoteAnnotations(subjectSlug, topicSlug, selectedVersionId);
      setRestoreCandidates(Array.isArray(payload?.mappings) ? payload.mappings : []);
    } catch {
      setRestoreCandidates([]);
    } finally {
      setRestorePending(false);
    }
  };

  const versionHeaderAddon =
    noteVersions.length > 0 ? (
      <div className="note-page__version-tools">
        <span className="note-page__version-label">Note version</span>
        <label className="note-page__version-select-wrap">
          <span className="note-page__version-select-label">View</span>
          <select
            className="note-page__version-select"
            value={selectedVersionId}
            onChange={(event) => {
              setSelectedVersionId(event.target.value);
              setRestoreCandidates([]);
            }}
          >
            {noteVersions.map((version) => (
              <option key={version.version_id} value={version.version_id}>
                {version.is_current ? "Current" : version.version_id}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="note-page__restore-btn"
          onClick={handleRestoreAnnotations}
          disabled={restorePending}
        >
          {restorePending ? "Restoring..." : "Restore previous highlights"}
        </button>
        {restoreCandidates.length > 0 ? (
          <span className="note-page__restore-status">
            {restoreCandidates.length} candidates ready to review
          </span>
        ) : null}
      </div>
    ) : null;

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
    if (currentSubjectId) {
      dispatch(fetchSubjectNotesIndexFromGraph(currentSubjectId));
    } else {
      dispatch(restoreDefaultNotesIndex());
    }
  }, [currentSubjectId, dispatch]);

  useEffect(() => {
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
  }, [notesIndex, noteSlugTrimmed, dispatch, selectedVersionId, subjectSlug, topicSlug, versionApiAvailable]);

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
  }, [noteContent, outline, dispatch]);

  useEffect(() => {
    dispatch(setCurrentNoteContent(noteContent));
  }, [noteContent, dispatch]);

  useEffect(() => {
    if (!noteContent) return;

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
  }, [noteContent, location.hash, location.pathname]);

  return (
    <>
      <div className="note-page">
        {noteContent && (
          <>
            <MarkdownRenderer
              content={noteContent}
              theme={theme}
              isCompleted={isCurrentNoteCompleted}
              completionPending={completeCurrentNotePending}
              onMarkComplete={onToggleCurrentNoteCompletion}
              noteQuotes={visibleNoteQuotes}
              activeQuoteId={activeQuoteId}
              searchQuery={searchQuery}
              searchMatchText={searchMatchText}
              onCreateQuoteFromSelection={onCreateQuoteFromSelection}
              onAskWithSelectedText={onAskWithSelectedText}
              headerAddon={versionHeaderAddon}
            />
            <div className="note-page__complete-footer">
              {showMicroCourseLink ? (
                <button
                  type="button"
                  className="note-page__micro-course-btn"
                  onClick={() => navigate("/micro-course/data-cleaning-preprocessing")}
                >
                  Open interactive micro-course
                </button>
              ) : null}
              <button
                type="button"
                className={`note-page__complete-btn ${isCurrentNoteCompleted ? "is-completed" : ""}`}
                onClick={() => onToggleCurrentNoteCompletion?.()}
                disabled={completeCurrentNotePending || !onToggleCurrentNoteCompletion}
              >
                {completeCurrentNotePending
                  ? "Updating..."
                  : isCurrentNoteCompleted
                    ? "Completed"
                    : "Mark as completed"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default NotePage;
