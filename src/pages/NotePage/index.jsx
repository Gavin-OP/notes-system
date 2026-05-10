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

function NotePage() {
  // navigation
  const { "*": note_url } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const noteSlugTrimmed = typeof note_url === "string" ? note_url.trim() : "";

  // redux
  const dispatch = useDispatch();
  const notesIndex = useSelector((state) => state.notesIndex.data);
  const theme = useSelector((state) => state.preference.theme);
  const outletContext = useOutletContext() || {};
  const isCurrentNoteCompleted = Boolean(outletContext.isCurrentNoteCompleted);
  const completeCurrentNotePending = Boolean(outletContext.completeCurrentNotePending);
  const onToggleCurrentNoteCompletion =
    typeof outletContext.onToggleCurrentNoteCompletion === "function"
      ? outletContext.onToggleCurrentNoteCompletion
      : null;

  // state
  const [noteContent, setNoteContent] = useState("");

  const outline = useMemo(() => getOutline(noteContent), [noteContent]);

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
  }, [notesIndex, noteSlugTrimmed, dispatch]);

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
            />
          </>
        )}
      </div>
    </>
  );
}

export default NotePage;
