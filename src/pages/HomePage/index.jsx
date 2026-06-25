import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="card">
      <button onClick={() => navigate("/note")}>go to note system</button>
    </div>
  );
}
export default HomePage;
