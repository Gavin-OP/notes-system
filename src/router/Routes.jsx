import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";

import NoteLayout from "../common/layouts/NoteLayout";
import NotePage from "../pages/NotePage";
import HomePage from "../pages/HomePage";
import SubjectEntry from "../pages/NotePage/SubjectEntry";
import SubjectMindmap from "../pages/NotePage/SubjectEntry/SubjectMindmap";
import SubjectLearningPath from "../pages/NotePage/SubjectEntry/SubjectLearningPath";
import UserLoginPage from "../pages/UserLoginPage";
import UserProfilePage from "../pages/UserProfilePage";
import MicroCourseDemoPage from "../pages/MicroCourseDemoPage";
import DataCleaningMicroCoursePage from "../pages/DataCleaningMicroCoursePage";
import SearchResultsPage from "../pages/SearchResultsPage";
import { AdminAuthRoot } from "../admin/auth/AdminAuthProvider";
import AdminRouteGuard from "../admin/auth/AdminRouteGuard";
import AdminLayout from "../admin/layout/AdminLayout";
import AdminLoginPage from "../admin/pages/AdminLoginPage";
import AdminDashboardPage from "../admin/pages/AdminDashboardPage";
import AdminContentPage from "../admin/pages/AdminContentPage";
import AdminSubjectDetailPage from "../admin/pages/AdminSubjectDetailPage";
import AdminSystemStatusPage from "../admin/pages/AdminSystemStatusPage";
import { isLocalhost } from "../utils/analyticsUtils";
import "../admin/styles/admin.css";

// page view tracking
function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    if (!isLocalhost()) {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
      });
    }
  }, [location]);
}

// routes
function RoutesWithTracking() {
  usePageTracking();
  return (
    <Routes>
      {/* Legacy redirects for old URLs */}
      <Route path="data-science/mindmap" element={<Navigate to="../subject/data-science/mindmap" replace />} />
      <Route path="python/mindmap" element={<Navigate to="../subject/python/mindmap" replace />} />
      <Route path="python/learning-path" element={<Navigate to="../subject/python/learning-path" replace />} />

      {/* Subject-specific routes (mindmap, learning-path) */}
      {/* Dynamic routing: /subject/:subjectId/mindmap */}
      <Route path="subject/:subjectId" element={<SubjectEntry />}>
        <Route path="mindmap" element={<SubjectMindmap />} />
        <Route path="learning-path" element={<SubjectLearningPath />} />
      </Route>

      {/* Note content routes */}
      <Route path="note/*" element={<NoteLayout />}>
        <Route path="*" element={<NotePage />} />
      </Route>

      {/* Admin routes */}
      <Route path="admin" element={<AdminAuthRoot />}>
        <Route path="login" element={<AdminLoginPage />} />
        <Route element={<AdminRouteGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="content" element={<AdminContentPage />} />
            <Route path="content/:subjectSlug" element={<AdminSubjectDetailPage />} />
            <Route path="system" element={<AdminSystemStatusPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* User routes (UI only) */}
      <Route path="user/login" element={<UserLoginPage />} />
      <Route path="user/profile" element={<UserProfilePage />} />
      <Route path="user" element={<Navigate to="/user/login" replace />} />

      {/* Search */}
      <Route path="search" element={<SearchResultsPage />} />

      {/* MVP micro-course demo */}
      <Route path="micro-course/data-science-intro" element={<MicroCourseDemoPage />} />
      <Route path="micro-course/data-cleaning-preprocessing" element={<DataCleaningMicroCoursePage />} />

      {/* Home and fallback */}
      <Route path="home" element={<HomePage />} />
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
}

export default function AppRoutes() {
  const configuredBase = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "");
  const runtimeBasename =
    typeof window !== "undefined" &&
    configuredBase &&
    configuredBase !== "/" &&
    window.location.pathname.startsWith(configuredBase)
      ? configuredBase
      : "";

  return (
    <BrowserRouter basename={runtimeBasename}>
      <RoutesWithTracking />
    </BrowserRouter>
  );
}
