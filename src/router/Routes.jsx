import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";

import NoteLayout from "../common/layouts/NoteLayout";
import NotePage from "../pages/NotePage";
import HomePage from "../pages/HomePage";
import DataSciencePage from "../pages/DataSciencePage";
import MindmapView from "../pages/DataSciencePage/components/MindmapView";

// page view tracking
function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname + location.search,
    });
  }, [location]);
}

// routes
function RoutesWithTracking() {
  usePageTracking();
  return (
    <Routes>
      <Route path="note/*" element={<NoteLayout />}>
        <Route path="*" element={<NotePage />} />
      </Route>
      <Route path="data-science" element={<DataSciencePage />}>
        <Route path="mindmap" element={<MindmapView />} />
      </Route>
      <Route path="home" element={<HomePage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/notes-system">
      <RoutesWithTracking />
    </BrowserRouter>
  );
}
