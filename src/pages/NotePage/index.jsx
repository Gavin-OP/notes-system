import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentNoteMeta,
  setCurrentNoteOutline,
} from "../../redux/currentNoteSlice";
import { useParams, useNavigate } from "react-router-dom";

import MarkdownRenderer from "./components/MarkdownRenderer";
import { findMeta } from "../../utils/notesIndexUtils";
import { getOutline } from "../../utils/markdownUtils";

function removeYamlFrontMatter(text) {
  // 匹配以 --- 开头和结尾的 YAML front matter
  return text.replace(/^---[\s\S]*?---\s*/, "");
}

function NotePage() {
  // navigation
  const { "*": note_url } = useParams();
  const navigate = useNavigate();

  // redux
  const dispatch = useDispatch();
  const notesIndex = useSelector((state) => state.notesIndex.data);
  const theme = useSelector((state) => state.preference.theme);

  // state
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [noteContent, setNoteContent] = useState("");

  const outline = useMemo(() => getOutline(noteContent), [noteContent]);

  useEffect(() => {
    if (notesIndex && note_url) {
      setNoteContent("");
      const url = `/note/${note_url}`;
      const meta = findMeta(notesIndex, url);
      setSelectedMeta(meta);
      dispatch(setCurrentNoteMeta(meta));

      async function fetchNote() {
        if (meta && meta.directory !== undefined && meta.name) {
          let filePath =
            meta.directory === "."
              ? `${meta.name}`
              : `${meta.directory}/${meta.name}`;

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
        } else {
          setNoteContent("");
        }
      }
      fetchNote();
    }
  }, [notesIndex, note_url, dispatch]);

  useEffect(() => {
    dispatch(setCurrentNoteOutline(outline));
  }, [noteContent, outline, dispatch]);

  console.log("Note Meta Information:", selectedMeta);

  return (
    <>
      <div>
        {noteContent && (
          <MarkdownRenderer content={noteContent} theme={theme} />
        )}
      </div>
    </>
  );
}

export default NotePage;
