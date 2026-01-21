import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentNoteMeta } from "../../redux/currentNoteSlice";
import { useParams, useNavigate } from "react-router-dom";

import { findMeta } from "../../utils/notesIndexUtils";

function NotePage() {
  // navigation
  const { "*": note_url } = useParams();
  const navigate = useNavigate();

  // redux
  const dispatch = useDispatch();
  const notesIndex = useSelector((state) => state.notesIndex.data);

  // state
  const [selectedMeta, setSelectedMeta] = useState(null);
  const [noteContent, setNoteContent] = useState("");

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

  // url handler
  const handleGoto = (url) => navigate(url);

  return (
    <>
      <div className="card">
        <h2>Note Meta Information</h2>
        <div>
          {notesIndex && <pre>{JSON.stringify(selectedMeta, null, 2)}</pre>}
        </div>
        <br></br>
        <h2>Note Content</h2>
        <div>{noteContent && <pre>{noteContent}</pre>}</div>
      </div>
    </>
  );
}

export default NotePage;
