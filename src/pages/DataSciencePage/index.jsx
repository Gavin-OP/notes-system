import { Outlet } from "react-router-dom";
import "./DataSciencePage.css";

const DataSciencePage = () => {
  return (
    <div className="data-science-page">
      <Outlet />
    </div>
  );
};

export default DataSciencePage;

