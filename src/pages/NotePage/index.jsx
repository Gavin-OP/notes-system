import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { setTheme, setLanguage } from "../../redux/preferenceSlice";

import { findMeta } from "../../utils/notesIndexUtils";
import NoteHeader from "./components/NoteHeader";

function NotePage() {
  // navigation
  const { "*": note_url } = useParams();
  const navigate = useNavigate();

  // redux
  const dispatch = useDispatch();
  const notesIndex = useSelector((state) => state.notesIndex.data);
  const theme = useSelector((state) => state.preference.theme);
  const language = useSelector((state) => state.preference.language);

  // state
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    if (notesIndex && note_url) {
      const url = `/note/${note_url}`;
      const meta = findMeta(notesIndex, url);
      setSelectedMeta(meta);

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
  }, [notesIndex, note_url]);

  // url handler
  const handleGoto = (url) => navigate(url);

  return (
    <>
      <NoteHeader
        theme={theme}
        language={language}
        onThemeChange={(checked) =>
          dispatch(setTheme(checked ? "dark" : "light"))
        }
        onLanguageChange={(value) => dispatch(setLanguage(value))}
        onSearch={(value) => {}}
      />
      <div className="card">
        <button onClick={() => handleGoto("/note/disclaimer.md")}>
          Go to /note/disclaimer.md
        </button>
        <br></br>
        <br></br>
        <button onClick={() => handleGoto("/note/test/code-block-test.md")}>
          Go to /note/test/code-block-test.md
        </button>
        <br></br>
        <br></br>
        <div>
          {notesIndex && <pre>{JSON.stringify(selectedMeta, null, 2)}</pre>}
        </div>
        <br></br>
        <br></br>
        <div>{noteContent && <pre>{noteContent}</pre>}</div>
      </div>
    </>
  );
}

export default NotePage;
