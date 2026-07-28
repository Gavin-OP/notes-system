import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, Card, Empty, List, Spin, Typography } from "antd";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import SemanticChip from "../../../shared/ui/SemanticChip";
import { getCourse, listCourseVersions } from "../../goals/api/learningPlatform";
import { getDomainArchetypes } from "../../subjects/lib/domainArchetypes";
import "./CoursePackageDetailPage.css";

const { Text, Title } = Typography;
const humanize = (value = "") => String(value).replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

function collectNotes(items, domainSlug) {
  const notes = [];
  const visit = (item) => {
    if (!item) return;
    if (item.type === "file" && String(item.url || "").startsWith(`/note/${domainSlug}/`)) {
      notes.push({ title: item.title || item.name || humanize(item.url.split("/").pop()), url: item.url });
    }
    (item.children || []).forEach(visit);
  };
  (items || []).forEach(visit);
  return notes;
}

function CoursePackageDetailPage() {
  const navigate = useNavigate();
  const { domainSlug = "", courseId = "" } = useParams();
  const notesIndex = useSelector((state) => state.notesIndex.data || []);
  const [course, setCourse] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(Boolean(courseId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return undefined;
    let mounted = true;
    Promise.all([getCourse(courseId), listCourseVersions(courseId)])
      .then(([nextCourse, nextVersions]) => {
        if (!mounted) return;
        setCourse(nextCourse);
        setVersions(Array.isArray(nextVersions) ? nextVersions : []);
      })
      .catch((nextError) => mounted && setError(nextError instanceof Error ? nextError.message : "Could not load this course package."))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [courseId]);

  const slug = domainSlug || course?.domain_slug || "";
  const officialNotes = useMemo(() => collectNotes(notesIndex, slug), [notesIndex, slug]);
  const currentVersion = versions.find((version) => version.id === course?.current_version_id) || versions[0];
  const communityNotes = useMemo(() => {
    const modules = currentVersion?.outline_json?.modules || currentVersion?.outline?.modules || [];
    return modules.flatMap((module) => (module.lessons || module.notes || []).map((note) => ({
      title: note.title || note.name || "Untitled note",
      url: note.note_url || note.url || "",
    })));
  }, [currentVersion]);
  const notes = courseId ? communityNotes : officialNotes;
  const title = course?.title || `${humanize(slug)} Foundations`;
  const archetypes = courseId
    ? [course?.primary_archetype, ...(course?.secondary_archetypes || [])].filter(Boolean).map(humanize)
    : getDomainArchetypes(slug);
  const source = courseId ? (course?.status === "published" ? "Community course" : "Private course") : "Official";
  const author = courseId ? (course?.author_name || course?.author_display_name || "Course author") : "Notes System";

  return (
    <AppPageShell backLabel="Back to Database" onBack={() => navigate("/database?view=packages")} title={title} contentClassName="course-package-page" showSiteFooter>
      {loading ? <div className="app-page-shell__state"><Spin /></div> : null}
      {!loading && error ? <Alert type="error" showIcon message={error} /> : null}
      {!loading && !error ? (
        <>
          <Card className="course-package-page__identity">
            <div className="course-package-page__chips">
              <SemanticChip variant="primary">Domain · {course?.domain_title || humanize(slug)}</SemanticChip>
              {archetypes.map((item) => <SemanticChip key={item} variant="teal">Learning · {item}</SemanticChip>)}
              <SemanticChip variant={source === "Official" ? "primary" : source === "Private course" ? "slate" : "sage"}>{source}</SemanticChip>
            </div>
            <div><Text type="secondary">Author</Text><Text strong>{author}</Text></div>
          </Card>
          <Card title="Included Courses" className="course-package-page__section">
            {notes.length ? <List dataSource={notes} renderItem={(note) => <List.Item>{note.title}</List.Item>} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No course notes are available yet." />}
          </Card>
          <Card title="Recommended Learning Path" className="course-package-page__section">
            {notes.length ? <ol className="course-package-page__path">{notes.map((note, index) => (
              <li key={`${note.url}-${index}`}><span>{index + 1}</span>{note.url ? <button type="button" onClick={() => navigate(note.url)}>{note.title}</button> : <Title level={5}>{note.title}</Title>}</li>
            ))}</ol> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No learning path is available yet." />}
          </Card>
        </>
      ) : null}
    </AppPageShell>
  );
}

export default CoursePackageDetailPage;
