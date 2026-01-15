import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

function findMeta(data, key) {
  if (!data) return null;
  for (const item of data) {
    if (item.url === key) return item;
    if (item.children) {
      const found = findMeta(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

function NotePage() {
  const { "*": note_url } = useParams();
  const { data, status, error } = useSelector((state) => state.notesIndex);
  const navigate = useNavigate();
  const [selectedMeta, setSelectedMeta] = useState(null);

  useEffect(() => {
    if (data && note_url) {
      const url = `/note/${note_url}`;
      setSelectedMeta(findMeta(data, url));
    }
  }, [data, note_url]);

  const handleGoto = (url) => navigate(url);

  return (
    <div className="card">
      <button>current page is: {note_url}</button>
      <br></br>
      <br></br>
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
      <div>{data && <pre>{JSON.stringify(selectedMeta, null, 2)}</pre>}</div>
    </div>
  );
}

export default NotePage;
