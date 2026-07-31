import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Empty, Input, Segmented, Skeleton, Space, Typography } from "antd";
import { HeartOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import CourseMetadata from "../../goals/components/CourseMetadata";
import SemanticChip from "../../../shared/ui/SemanticChip";
import useCurrentUserSummary from "../../profile/hooks/useCurrentUserSummary";
import { getDomainArchetypes } from "../../subjects/lib/domainArchetypes";
import { getSubjectDisplayTitle } from "../../subjects/lib/subjectOverviewUtils";
import { isNavigableSubjectSlug } from "../../navigation/lib/notesIndexUtils";
import { listCommunityCourses, listCourseLibrary } from "../../goals/api/learningPlatform";

import "./CourseCommunityPage.css";

const { Paragraph, Text } = Typography;

function collectOfficialPackages(items = []) {
  return items
    .filter((item) => item?.type === "folder")
    .map((item) => {
      const match = String(item.url || "").match(/^\/note\/([^/]+)$/);
      const domainSlug = match?.[1] || "";
      if (!domainSlug || !isNavigableSubjectSlug(domainSlug)) return null;
      const domainTitle = getSubjectDisplayTitle(item, {}, domainSlug);
      return {
        id: `official:${domainSlug}`,
        title: `${domainTitle} Foundations`,
        domain_slug: domainSlug,
        domain_title: domainTitle,
        primary_archetype: getDomainArchetypes(domainSlug)[0] || "conceptual",
        secondary_archetypes: getDomainArchetypes(domainSlug).slice(1),
        description: `A complete official course package for exploring ${domainTitle}.`,
        is_official: true,
      };
    })
    .filter(Boolean);
}

function CourseCard({ item, onOpen }) {
  const course = item.course || item;
  const official = Boolean(course.is_official);
  return (
    <button type="button" className="course-community__course-card" onClick={() => onOpen(course)}>
      <span className="course-community__card-title">
        {course.title}
        <SemanticChip variant={official ? "primary" : "sage"}>
          {official ? "Official" : "Community course"}
        </SemanticChip>
      </span>
      <CourseMetadata course={course} compact />
      <span className="course-community__card-description">{course.description}</span>
      <span className="course-community__card-footer">
        <span><UserOutlined /> {official ? "Notes System" : item.author?.display_name || "Course author"}</span>
        {!official ? <span><HeartOutlined /> {item.save_count || 0}</span> : null}
      </span>
    </button>
  );
}

export default function CourseCommunityPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUserSummary();
  const notesIndex = useSelector((state) => state.notesIndex.data || []);
  const requestedDomain = new URLSearchParams(location.search).get("domain") || "";
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [communityCourses, setCommunityCourses] = useState([]);
  const [library, setLibrary] = useState([]);
  const [query, setQuery] = useState("");
  const [source, setSource] = useState("All");
  const officialPackages = useMemo(() => collectOfficialPackages(notesIndex), [notesIndex]);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorText("");
    try {
      const courses = await listCommunityCourses({ domainSlug: requestedDomain });
      setCommunityCourses(Array.isArray(courses) ? courses : []);
      if (currentUser.isAuthenticated) {
        const saved = await listCourseLibrary();
        setLibrary(Array.isArray(saved) ? saved : []);
      } else {
        setLibrary([]);
      }
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not load course packages.");
    } finally {
      setLoading(false);
    }
  }, [currentUser.isAuthenticated, requestedDomain]);

  useEffect(() => { load(); }, [load]);

  const packages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const official = officialPackages
      .filter((course) => !requestedDomain || course.domain_slug === requestedDomain)
      .map((course) => ({ course }));
    const merged = source === "Official" ? official : source === "Community" ? communityCourses : [...official, ...communityCourses];
    if (!normalized) return merged;
    return merged.filter((item) => {
      const course = item.course || item;
      return [course.title, course.description, course.domain_title, course.domain_slug].join(" ").toLowerCase().includes(normalized);
    });
  }, [communityCourses, officialPackages, query, requestedDomain, source]);

  const openCourse = (course) => {
    navigate(course.is_official
      ? `/course-packages/official/${course.domain_slug}`
      : `/course-packages/${course.id}`);
  };

  return (
    <AppPageShell
      title="Course Community"
      subtitle="Browse complete course packages shaped by official and community perspectives."
      showSiteFooter
      contentWidth="wide"
      contentClassName="course-community"
    >
      <div className="app-page-shell__toolbar">
        <Input allowClear size="large" prefix={<SearchOutlined />} placeholder="Search course packages" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Segmented value={source} onChange={setSource} options={["All", "Official", "Community"]} aria-label="Course package source" />
      </div>
      {errorText ? <Alert type="error" showIcon title="Community unavailable" description={errorText} action={<Button onClick={load}>Retry</Button>} /> : null}
      {loading ? <Card><Skeleton active paragraph={{ rows: 8 }} /></Card> : null}
      {!loading && packages.length ? (
        <div className="course-community__grid">
          {packages.map((item) => <CourseCard key={(item.course || item).id} item={item} onOpen={openCourse} />)}
        </div>
      ) : null}
      {!loading && !packages.length ? <Empty description="No course packages match this view." /> : null}
      {currentUser.isAuthenticated && library.length ? (
        <Space orientation="vertical" size={8} className="course-community__saved-summary">
          <Text strong>Saved</Text>
          <Paragraph type="secondary">Your saved packages are available from My Learning.</Paragraph>
        </Space>
      ) : null}
    </AppPageShell>
  );
}
