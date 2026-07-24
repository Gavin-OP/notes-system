import { BrowserRouter, Routes, Route, useLocation, Navigate, useParams, Outlet } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import ReactGA from "react-ga4";

import GlobalAssistantProvider from "../../features/assistant/components/GlobalAssistantProvider";
import HomePage from "../pages/HomePage";
import { isLocalhost } from "../../shared/lib/analyticsUtils";
import { getCurrentUser, UserApiError } from "../../features/profile/api/user";
import "../../features/admin/styles/admin.css";

const NoteLayout = lazy(() => import("../../features/notes/layouts/NoteLayout"));
const NotePage = lazy(() => import("../../features/notes/pages/NotePage"));
const SubjectEntry = lazy(() => import("../../features/notes/pages/NotePage/SubjectEntry"));
const SubjectMindmap = lazy(() => import("../../features/notes/pages/NotePage/SubjectEntry/SubjectMindmap"));
const SubjectOverviewPage = lazy(() => import("../../features/subjects/pages/SubjectOverview/SubjectOverviewPage"));
const SubjectDatabasePage = lazy(() => import("../../features/subjects/pages/SubjectDatabasePage"));
const DisclaimerPage = lazy(() => import("../../shared/pages/DisclaimerPage"));
const NotFoundPage = lazy(() => import("../../shared/pages/NotFoundPage"));
const UserLoginPage = lazy(() => import("../../features/profile/pages/UserLoginPage"));
const UserProfilePage = lazy(() => import("../../features/profile/pages/UserProfilePage"));
const ExploreCareersPage = lazy(() => import("../../features/careers/pages/ExploreCareersPage"));
const CareerJobDetailPage = lazy(() => import("../../features/careers/pages/CareerJobDetailPage"));
const GoalDiscoveryPage = lazy(() => import("../../features/goals/pages/GoalDiscoveryPage"));
const MicroCourseDemoPage = lazy(() => import("../../features/notes/pages/MicroCourseDemoPage"));
const DataCleaningMicroCoursePage = lazy(() => import("../../features/notes/pages/DataCleaningMicroCoursePage"));
const SearchResultsPage = lazy(() => import("../../features/search/pages/SearchResultsPage"));
const AdminAuthRoot = lazy(() =>
  import("../../features/admin/auth/AdminAuthProvider").then((module) => ({ default: module.AdminAuthRoot })),
);
const AdminRouteGuard = lazy(() => import("../../features/admin/auth/AdminRouteGuard"));
const AdminLayout = lazy(() => import("../../features/admin/layout/AdminLayout"));
const AdminLoginPage = lazy(() => import("../../features/admin/pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("../../features/admin/pages/AdminDashboardPage"));
const AdminContentPage = lazy(() => import("../../features/admin/pages/AdminContentPage"));
const AdminSubjectDetailPage = lazy(() => import("../../features/admin/pages/AdminSubjectDetailPage"));
const AdminSystemStatusPage = lazy(() => import("../../features/admin/pages/AdminSystemStatusPage"));

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

function UserRouteGuard() {
  const location = useLocation();
  const currentLocationKey = `${location.pathname}${location.search}${location.hash}`;
  const [sessionCheck, setSessionCheck] = useState({
    locationKey: "",
    status: "checking",
    errorText: "",
  });

  useEffect(() => {
    let mounted = true;
    getCurrentUser()
      .then(() => {
        if (mounted) {
          setSessionCheck({
            locationKey: currentLocationKey,
            status: "authenticated",
            errorText: "",
          });
        }
      })
      .catch((error) => {
        if (!mounted) return;
        if (error instanceof UserApiError && error.status === 401) {
          setSessionCheck({
            locationKey: currentLocationKey,
            status: "anonymous",
            errorText: "",
          });
          return;
        }
        setSessionCheck({
          locationKey: currentLocationKey,
          status: "error",
          errorText: error instanceof Error ? error.message : "Could not check your session.",
        });
      });
    return () => {
      mounted = false;
    };
  }, [currentLocationKey]);

  if (sessionCheck.locationKey !== currentLocationKey || sessionCheck.status === "checking") {
    return <RouteLoading />;
  }
  if (sessionCheck.status === "anonymous") {
    return (
      <Navigate
        to="/user/login"
        replace
        state={{ from: currentLocationKey }}
      />
    );
  }
  if (sessionCheck.status === "error") {
    return (
      <div className="route-loading" role="alert">
        {sessionCheck.errorText}
      </div>
    );
  }
  return <Outlet />;
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
        <Route element={<UserRouteGuard />}>
          <Route path="user/profile" element={<UserProfilePage />} />
          <Route path="goals" element={<GoalDiscoveryPage />} />
        </Route>
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
        <Route path="*" element={<NotFoundPage />} />
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
