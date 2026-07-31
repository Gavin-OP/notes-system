import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Alert, App, Button, Card, Empty, Spin, Typography } from "antd";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import SemanticChip from "../../../shared/ui/SemanticChip";
import { generateGoalCourseLearningPath, getCommunityCourse } from "../../goals/api/learningPlatform";
import { getDomainArchetypes } from "../../subjects/lib/domainArchetypes";
import useCurrentUserSummary from "../../profile/hooks/useCurrentUserSummary";
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
  const { message } = App.useApp();
  const currentUser = useCurrentUserSummary();
  const { domainSlug = "", courseId = "" } = useParams();
  const notesIndex = useSelector((state) => state.notesIndex.data || []);
  const [course, setCourse] = useState(null);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(courseId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return undefined;
    let mounted = true;
    getCommunityCourse(courseId)
      .then((payload) => {
        if (!mounted) return;
        setCourse(payload?.course || null);
        setCurrentVersion(payload?.current_version || null);
        setAuthorName(payload?.author?.display_name || "Course author");
      })
      .catch((nextError) => mounted && setError(nextError instanceof Error ? nextError.message : "Could not load this course package."))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [courseId]);

  const slug = domainSlug || course?.domain_slug || "";
  const officialNotes = useMemo(() => collectNotes(notesIndex, slug), [notesIndex, slug]);
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
  const author = courseId ? authorName : "Notes System";

  const saveAsLearningSet = async () => {
    const destination = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (!currentUser.isAuthenticated) {
      navigate("/user/login", { state: { from: destination } });
      return;
    }
    setSaving(true);
    try {
      await generateGoalCourseLearningPath({
        learning_set_name: title,
        goal_type: "interest",
        goal_title: `Explore ${title}`,
        selected_course_ids: courseId ? [courseId] : [],
        selected_course_version_ids: courseId && currentVersion?.id ? [currentVersion.id] : [],
        subject_slugs: slug ? [slug] : [],
        max_nodes: 48,
        save_as_draft: true,
        commit: true,
      });
      message.success("Learning Set saved.");
      navigate("/user/profile?section=learning");
    } catch (saveError) {
      message.error(saveError instanceof Error ? saveError.message : "Could not save this Learning Set.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppPageShell backLabel="Back to Course Community" onBack={() => navigate("/courses/community")} title={title} contentClassName="course-package-page" showSiteFooter>
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
          <Card
            title="Recommended order"
            className="course-package-page__section"
            extra={
              <Button
                type="primary"
                loading={saving}
                onClick={saveAsLearningSet}
              >
                {currentUser.isAuthenticated ? "Save as Learning Set" : "Sign in to save"}
              </Button>
            }
          >
            {notes.length ? <ol className="course-package-page__path">{notes.map((note, index) => (
              <li key={`${note.url}-${index}`}><span>{index + 1}</span>{note.url ? <button type="button" onClick={() => navigate(note.url)}>{note.title}</button> : <Title level={5}>{note.title}</Title>}</li>
            ))}</ol> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notes are available yet." />}
          </Card>
        </>
      ) : null}
    </AppPageShell>
  );
}

export default CoursePackageDetailPage;
