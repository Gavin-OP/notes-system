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
              setNoteContent(await res.text());
            } else {
              setNoteContent("Note file not found.");
            }
          } catch (e) {
            setNoteContent("Error loading note content.");
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

  return (
    <>
      <div>
        <h2>Note Meta Information</h2>
        <div>
          {notesIndex && <pre>{JSON.stringify(selectedMeta, null, 2)}</pre>}
        </div>
        <br></br>
        <h2>Note Content</h2>
        <div>
          {noteContent && (
            <MarkdownRenderer content={noteContent} theme={theme} />
          )}
        </div>
      </div>
    </>
  );
}

export default NotePage;
