import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

function NotePage() {
  const { note_url } = useParams();
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.notesIndex);
  const navigate = useNavigate();

  const handleGotoTest = () => {
    navigate("/note/test");
  };

  const handleGotoAbc = () => {
    navigate("/note/abc");
  };

  return (
    <div className="card">
      <button>current page is: {note_url}</button>
      <br></br>
      <br></br>
      <button onClick={handleGotoTest}>Go to /note/test</button>
      <br></br>
      <br></br>
      <button onClick={handleGotoAbc}>Go to /note/abc</button>
      <br></br>
      <br></br>
      <div>
        <div>Status: {status}</div>
        {error && <div>Error: {error}</div>}
        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
}

export default NotePage;
