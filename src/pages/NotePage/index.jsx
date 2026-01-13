import { useParams } from "react-router-dom";

function NotePage() {
  const { note_url } = useParams();
  console.log("note_url:", note_url);

  return (
    <div className="card">
      <button onClick={() => dispatch(setCurrentPage("test"))}>
        current page is: {note_url}
      </button>
    </div>
  );
}

export default NotePage;
