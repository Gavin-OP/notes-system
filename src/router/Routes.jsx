import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import ReactGA from "react-ga4";

import GlobalAssistantProvider from "../common/components/assistant/GlobalAssistantProvider";
import HomePage from "../pages/HomePage";
import { isLocalhost } from "../utils/analyticsUtils";
import "../admin/styles/admin.css";

const NoteLayout = lazy(() => import("../common/layouts/NoteLayout"));
const NotePage = lazy(() => import("../pages/NotePage"));
const SubjectEntry = lazy(() => import("../pages/NotePage/SubjectEntry"));
const SubjectMindmap = lazy(() => import("../pages/NotePage/SubjectEntry/SubjectMindmap"));
const SubjectOverviewPage = lazy(() => import("../pages/SubjectOverview/SubjectOverviewPage"));
const SubjectDatabasePage = lazy(() => import("../pages/SubjectDatabasePage"));
const DisclaimerPage = lazy(() => import("../pages/DisclaimerPage"));
const UserLoginPage = lazy(() => import("../pages/UserLoginPage"));
const UserProfilePage = lazy(() => import("../pages/UserProfilePage"));
const ExploreCareersPage = lazy(() => import("../pages/ExploreCareersPage"));
const CareerJobDetailPage = lazy(() => import("../pages/CareerJobDetailPage"));
const MicroCourseDemoPage = lazy(() => import("../pages/MicroCourseDemoPage"));
const DataCleaningMicroCoursePage = lazy(() => import("../pages/DataCleaningMicroCoursePage"));
const SearchResultsPage = lazy(() => import("../pages/SearchResultsPage"));
const AdminAuthRoot = lazy(() =>
  import("../admin/auth/AdminAuthProvider").then((module) => ({ default: module.AdminAuthRoot })),
);
const AdminRouteGuard = lazy(() => import("../admin/auth/AdminRouteGuard"));
const AdminLayout = lazy(() => import("../admin/layout/AdminLayout"));
const AdminLoginPage = lazy(() => import("../admin/pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("../admin/pages/AdminDashboardPage"));
const AdminContentPage = lazy(() => import("../admin/pages/AdminContentPage"));
const AdminSubjectDetailPage = lazy(() => import("../admin/pages/AdminSubjectDetailPage"));
const AdminSystemStatusPage = lazy(() => import("../admin/pages/AdminSystemStatusPage"));

function RouteLoading() {
  return (
    <div className="route-loading" role="status">
      Loading...
    </div>
  );
}

function LegacySubjectOverviewRedirect() {
  const { subjectId = "" } = useParams();
  return <Navigate to={`/subject/${subjectId}`} replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

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
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route index element={<HomePage />} />

        {/* Legacy redirects for old URLs */}
        <Route path="data-science/mindmap" element={<Navigate to="../subject/data-science/mindmap" replace />} />
        <Route path="python/mindmap" element={<Navigate to="../subject/python/mindmap" replace />} />

        {/* Subject-specific routes (mindmap) */}
        {/* Dynamic routing: /subject/:subjectId/mindmap */}
        <Route path="subject/:subjectId" element={<SubjectEntry />}>
          <Route index element={<SubjectOverviewPage />} />
          <Route path="mindmap" element={<SubjectMindmap />} />
        </Route>

        {/* Note content routes */}
        <Route path="note/:subjectId/overview" element={<LegacySubjectOverviewRedirect />} />
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

        {/* Careers */}
        <Route path="careers" element={<ExploreCareersPage />} />
        <Route path="careers/:jobId" element={<CareerJobDetailPage />} />

        {/* Databases and policy pages */}
        <Route path="subjects" element={<SubjectDatabasePage />} />
        <Route path="disclaimer" element={<DisclaimerPage />} />

        {/* Search */}
        <Route path="search" element={<SearchResultsPage />} />

        {/* MVP micro-course demo */}
        <Route path="micro-course/data-science-intro" element={<MicroCourseDemoPage />} />
        <Route path="micro-course/data-cleaning-preprocessing" element={<DataCleaningMicroCoursePage />} />

        {/* Home and fallback */}
        <Route path="home" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Suspense>
    </>
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
      <GlobalAssistantProvider>
        <RoutesWithTracking />
      </GlobalAssistantProvider>
    </BrowserRouter>
  );
}
