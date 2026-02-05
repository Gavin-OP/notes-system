import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";

import NoteLayout from "../common/layouts/NoteLayout";
import NotePage from "../pages/NotePage";
import HomePage from "../pages/HomePage";
import SubjectEntry from "../pages/NotePage/SubjectEntry";
import SubjectMindmap from "../pages/NotePage/SubjectEntry/SubjectMindmap";

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
      {/* Subject-specific routes (mindmap, learning-path) */}
      {/* Dynamic routing: /subject/:subjectId/mindmap */}
      <Route path="subject/:subjectId" element={<SubjectEntry />}>
        <Route path="mindmap" element={<SubjectMindmap />} />
        {/* Future: <Route path="learning-path" element={<SubjectLearningPath />} /> */}
      </Route>

      {/* Note content routes */}
      <Route path="note/*" element={<NoteLayout />}>
        <Route path="*" element={<NotePage />} />
      </Route>

      {/* Home and fallback */}
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
