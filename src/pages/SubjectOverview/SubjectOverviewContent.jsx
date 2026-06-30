import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Empty, Progress, Spin, Typography } from "antd";
import { ApartmentOutlined, BookOutlined } from "@ant-design/icons";

import SemanticChip from "../../common/components/SemanticChip";
import { loadGraphData } from "../../common/components/mindmap/utils/graphLoader";
import {
  buildConceptPreviewByCategory,
  buildConceptPreviewFromSyllabus,
  buildDefaultSyllabus,
  findSubjectFolderInIndex,
  getSubjectDisplayTitle,
  loadSubjectSyllabus,
} from "../../utils/subjectOverviewUtils";
import { getMyProfile } from "../../common/api/user";
import { getFirstSubjectTopicUrl, normalizeNoteRoute } from "../../utils/notesIndexUtils";
import useTranslation from "../../i18n/useTranslation";

import "./SubjectOverviewPage.css";

const { Paragraph, Text, Title } = Typography;

function collectSubjectNotes(node) {
  const notes = [];
  const visit = (item) => {
    if (!item) return;
    if (item.type === "file" && item.url) {
      notes.push({
        title: item.title || item.name || item.url.split("/").pop()?.replace(/\.md$/i, "") || "Untitled",
        url: normalizeNoteRoute(item.url),
      });
    }
    if (Array.isArray(item.children)) item.children.forEach(visit);
  };
  if (Array.isArray(node?.children)) node.children.forEach(visit);
  return notes.filter((note) => note.url && !note.url.includes("/disclaimer"));
}

function SyllabusBlock({ label, children }) {
  if (!children) return null;
  return (
    <div className="subject-overview__syllabus-block">
      <Text className="subject-overview__panel-label">{label}</Text>
      {children}
    </div>
  );
}

function SubjectOverviewContent({ subjectId }) {
  const navigate = useNavigate();
  const { language, t } = useTranslation();
  const rawNotesIndex = useSelector((state) => state.notesIndex.data);
  const notesIndex = useMemo(
    () => (Array.isArray(rawNotesIndex) ? rawNotesIndex : []),
    [rawNotesIndex],
  );
  const notesIndexLoading = useSelector((state) => state.notesIndex.status === "loading");

  const [graphData, setGraphData] = useState(null);
  const [graphLoading, setGraphLoading] = useState(true);
  const [syllabus, setSyllabus] = useState(null);
  const [syllabusLoading, setSyllabusLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadGraph() {
      if (!subjectId) return;
      setGraphLoading(true);
      const data = await loadGraphData(subjectId);
      if (!mounted) return;
      setGraphData(data);
      setGraphLoading(false);
    }
    loadGraph();
    return () => {
      mounted = false;
    };
  }, [subjectId]);

  useEffect(() => {
    let mounted = true;
    async function loadSyllabus() {
      if (!subjectId) return;
      setSyllabusLoading(true);
      const data = await loadSubjectSyllabus(subjectId);
      if (!mounted) return;
      setSyllabus(data);
      setSyllabusLoading(false);
    }
    loadSyllabus();
    return () => {
      mounted = false;
    };
  }, [subjectId]);

  useEffect(() => {
    let mounted = true;
    getMyProfile()
      .then((data) => {
        if (mounted) setProfile(data || null);
      })
      .catch(() => {
        if (mounted) setProfile(null);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const subjectFolder = useMemo(
    () => findSubjectFolderInIndex(notesIndex, subjectId),
    [notesIndex, subjectId],
  );

  const graphMeta = useMemo(() => graphData?.meta || {}, [graphData]);
  const subjectTitle = getSubjectDisplayTitle(subjectFolder, graphMeta, subjectId);
  const subjectNotes = useMemo(() => collectSubjectNotes(subjectFolder), [subjectFolder]);
  const completedNoteUrls = useMemo(() => {
    const rawValues = [
      ...(profile?.course_progress?.completed_note_urls || []),
      ...(profile?.courseProgress?.completedNoteUrls || []),
      ...(profile?.completed_note_urls || []),
      ...(profile?.completedNoteUrls || []),
    ];
    return new Set(rawValues.map((value) => normalizeNoteRoute(value)).filter(Boolean));
  }, [profile]);
  const completedCount = subjectNotes.filter((note) => completedNoteUrls.has(note.url)).length;
  const progressPercent = subjectNotes.length > 0 ? Math.round((completedCount / subjectNotes.length) * 100) : 0;
  const firstTopicUrl = getFirstSubjectTopicUrl(notesIndex, subjectId);
  const recommendedEntry =
    subjectNotes.find((note) => !completedNoteUrls.has(note.url)) ||
    subjectNotes.find((note) => note.url === normalizeNoteRoute(firstTopicUrl)) ||
    subjectNotes[0] ||
    null;

  const resolvedSyllabus = useMemo(() => {
    if (syllabus) return syllabus;
    if (!graphLoading && !syllabusLoading) return buildDefaultSyllabus(subjectId, graphMeta);
    return null;
  }, [syllabus, graphLoading, syllabusLoading, subjectId, graphMeta]);

  const conceptPreview = useMemo(() => {
    const fromSyllabus = buildConceptPreviewFromSyllabus(resolvedSyllabus);
    if (fromSyllabus.groups.length > 0) {
      return fromSyllabus;
    }
    return buildConceptPreviewByCategory(graphData);
  }, [graphData, resolvedSyllabus]);

  const notesCompletedLabel =
    language === "cn"
      ? `已完成 ${completedCount} / ${subjectNotes.length || 0} 篇笔记`
      : `${completedCount} of ${subjectNotes.length || 0} notes completed`;
  const moduleCountLabel =
    language === "cn"
      ? `${conceptPreview.groups.length || subjectNotes.length || 0} 个模块`
      : `${conceptPreview.groups.length || subjectNotes.length || 0} modules`;
  const mappedConceptsLabel =
    language === "cn"
      ? `${conceptPreview.totalConcepts || 0} 个已映射概念`
      : `${conceptPreview.totalConcepts || 0} mapped concepts across this discipline.`;
  const conceptCountLabel =
    language === "cn"
      ? `${conceptPreview.totalConcepts} 个概念`
      : `${conceptPreview.totalConcepts} concepts`;

  const pageLoading = notesIndexLoading || graphLoading || syllabusLoading;

  const hasOutcomes = Array.isArray(resolvedSyllabus?.outcomes) && resolvedSyllabus.outcomes.length > 0;
  const hasPrerequisites =
    Array.isArray(resolvedSyllabus?.prerequisites) && resolvedSyllabus.prerequisites.length > 0;
  const hasAudience =
    Array.isArray(resolvedSyllabus?.whoItsFor) && resolvedSyllabus.whoItsFor.length > 0;
  const hasLevel = Boolean(String(resolvedSyllabus?.level || "").trim());
  const hasWhyLearn = Boolean(String(resolvedSyllabus?.whyLearn || "").trim());
  const hasSyllabusContent =
    hasOutcomes || hasPrerequisites || hasAudience || hasLevel || hasWhyLearn;

  return (
    <div className="subject-overview">
      {pageLoading ? (
        <div className="subject-overview__loading">
          <Spin tip={t("subjectOverview.loading", "Loading subject overview...")} />
        </div>
      ) : (
        <>
          <header className="subject-overview__header">
            <div>
              <Title level={2} className="subject-overview__title">
                {subjectTitle}
              </Title>
              {resolvedSyllabus?.summary ? (
                <Paragraph className="subject-overview__summary" type="secondary">
                  {resolvedSyllabus.summary}
                </Paragraph>
              ) : null}
            </div>
            <div className="subject-overview__hero-actions">
              <Button
                type="primary"
                icon={<BookOutlined />}
                disabled={!recommendedEntry}
                onClick={() => recommendedEntry && navigate(recommendedEntry.url)}
              >
                {completedCount > 0
                  ? t("common.continue", "Continue")
                  : t("subjectOverview.startLearning", "Start learning")}
              </Button>
              <Button
                type="default"
                icon={<ApartmentOutlined />}
                onClick={() => navigate(`/subject/${subjectId}/mindmap`)}
              >
                {t("subjectOverview.conceptMap", "Concept map")}
              </Button>
            </div>
          </header>

          <section className="subject-overview__snapshot" aria-label="Subject progress and entry point">
            <div className="subject-overview__metric">
              <Text className="subject-overview__panel-label">
                {t("subjectOverview.progress", "Progress")}
              </Text>
              <Progress percent={progressPercent} size="small" showInfo={false} />
              <Text type="secondary">
                {notesCompletedLabel}
              </Text>
            </div>
            <div className="subject-overview__metric">
              <Text className="subject-overview__panel-label">
                {t("subjectOverview.recommendedEntry", "Recommended entry")}
              </Text>
              <Text strong>
                {recommendedEntry?.title ||
                  t("subjectOverview.entryComingSoon", "Entry note coming soon")}
              </Text>
              <Text type="secondary">
                {recommendedEntry
                  ? t("subjectOverview.entryReason", "A stable starting point for this subject.")
                  : t("subjectOverview.preparing", "This subject is still being prepared.")}
              </Text>
            </div>
            <div className="subject-overview__metric">
              <Text className="subject-overview__panel-label">
                {t("subjectOverview.fieldStructure", "Field structure")}
              </Text>
              <Text strong>
                {moduleCountLabel}
              </Text>
              <Text type="secondary">{mappedConceptsLabel}</Text>
            </div>
          </section>

          <div className="subject-overview__layout">
            <section
              className="subject-overview__syllabus"
              aria-labelledby="subject-syllabus-heading"
            >
              <Title level={4} id="subject-syllabus-heading" className="subject-overview__section-title">
                {t("subjectOverview.about", "About this subject")}
              </Title>

              {hasSyllabusContent ? (
                <div className="subject-overview__syllabus-body">
                  <SyllabusBlock label={t("subjectOverview.master", "What you'll master")}>
                    {hasOutcomes ? (
                      <ul className="subject-overview__list">
                        {resolvedSyllabus.outcomes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </SyllabusBlock>

                  <SyllabusBlock label={t("subjectOverview.level", "Level you'll reach")}>
                    {hasLevel ? (
                      <Paragraph className="subject-overview__prose">{resolvedSyllabus.level}</Paragraph>
                    ) : null}
                  </SyllabusBlock>

                  <SyllabusBlock label={t("subjectOverview.prerequisites", "Prerequisites")}>
                    {hasPrerequisites ? (
                      <ul className="subject-overview__list">
                        {resolvedSyllabus.prerequisites.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </SyllabusBlock>

                  <SyllabusBlock label={t("subjectOverview.whyLearn", "Why learn this")}>
                    {hasWhyLearn ? (
                      <Paragraph className="subject-overview__prose">{resolvedSyllabus.whyLearn}</Paragraph>
                    ) : null}
                  </SyllabusBlock>

                  <SyllabusBlock label={t("subjectOverview.audience", "Who it's for")}>
                    {hasAudience ? (
                      <ul className="subject-overview__list">
                        {resolvedSyllabus.whoItsFor.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </SyllabusBlock>
                </div>
              ) : (
                <Paragraph type="secondary" className="subject-overview__prose">
                  {t(
                    "subjectOverview.syllabusPreparing",
                    "Syllabus details for this subject are being prepared.",
                  )}
                </Paragraph>
              )}
            </section>

            <section
              className="subject-overview__concepts"
              aria-labelledby="subject-concepts-heading"
            >
              <div className="subject-overview__section-head">
                <Title level={4} id="subject-concepts-heading" className="subject-overview__section-title">
                  {t("subjectOverview.concepts", "Concepts in this subject")}
                </Title>
                {conceptPreview.totalConcepts > 0 ? (
                  <Text type="secondary">
                    {conceptCountLabel}
                  </Text>
                ) : null}
              </div>

              {conceptPreview.groups.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t(
                    "subjectOverview.conceptPreviewEmpty",
                    "Concept preview is not available yet.",
                  )}
                />
              ) : (
                <div className="subject-overview__concept-groups">
                  {conceptPreview.groups.map((group) => (
                    <div key={group.id} className="subject-overview__concept-group">
                      <Text strong className="subject-overview__concept-group-title">
                        {group.title}
                        {group.totalInCategory > group.concepts.length
                          ? ` · ${group.totalInCategory}`
                          : ""}
                      </Text>
                      <div className="subject-overview__concept-chips">
                        {group.concepts.map((concept) => {
                          const chipVariant =
                            concept.importance === "high"
                              ? "primary"
                              : concept.importance === "low"
                                ? "slate"
                                : "wisdom";
                          if (concept.href) {
                            return (
                              <button
                                key={concept.id}
                                type="button"
                                className="subject-overview__concept-chip-btn"
                                onClick={() => navigate(concept.href)}
                                style={
                                  group.color
                                    ? {
                                        "--concept-chip-border": group.color,
                                        "--concept-chip-bg": `color-mix(in srgb, ${group.color} 12%, transparent)`,
                                      }
                                    : undefined
                                }
                              >
                                <SemanticChip variant={chipVariant}>{concept.label}</SemanticChip>
                              </button>
                            );
                          }
                          return (
                            <SemanticChip key={concept.id} variant={chipVariant}>
                              {concept.label}
                            </SemanticChip>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {conceptPreview.totalConcepts > 0 ? (
                <div className="subject-overview__concept-footer">
                  <Button
                    type="default"
                    icon={<ApartmentOutlined />}
                    onClick={() => navigate(`/subject/${subjectId}/mindmap`)}
                  >
                    {t("subjectOverview.openConceptMap", "Open concept map")}
                  </Button>
                </div>
              ) : null}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default SubjectOverviewContent;
