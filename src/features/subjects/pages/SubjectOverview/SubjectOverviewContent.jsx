import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Empty, Spin, Typography } from "antd";
import { ApartmentOutlined, BookOutlined } from "@ant-design/icons";

import SemanticChip from "../../../../shared/ui/SemanticChip";
import { loadGraphData } from "../../../mindmap/components/utils/graphLoader";
import {
  buildConceptPreviewByCategory,
  buildConceptPreviewFromSyllabus,
  buildDefaultSyllabus,
  findSubjectFolderInIndex,
  getSubjectDisplayTitle,
  loadSubjectSyllabus,
} from "../../lib/subjectOverviewUtils";
import { normalizeNoteRoute } from "../../../navigation/lib/notesIndexUtils";
import useTranslation from "../../../../i18n/useTranslation";
import { getDomainArchetypes } from "../../lib/domainArchetypes";

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

  const subjectFolder = useMemo(
    () => findSubjectFolderInIndex(notesIndex, subjectId),
    [notesIndex, subjectId],
  );

  const graphMeta = useMemo(() => graphData?.meta || {}, [graphData]);
  const subjectTitle = getSubjectDisplayTitle(subjectFolder, graphMeta, subjectId);
  const subjectNotes = useMemo(() => collectSubjectNotes(subjectFolder), [subjectFolder]);

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

  const conceptCountLabel =
    language === "cn"
      ? `${conceptPreview.totalConcepts} 个概念`
      : `${conceptPreview.totalConcepts} concepts`;

  const pageLoading = notesIndexLoading || graphLoading || syllabusLoading;

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
              <div className="subject-overview__archetypes" aria-label="Learning archetypes">
                {getDomainArchetypes(subjectId).map((archetype, index) => (
                  <SemanticChip key={archetype} variant={index === 0 ? "teal" : "slate"}>
                    {archetype}
                  </SemanticChip>
                ))}
              </div>
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
                onClick={() => navigate(`/course-packages/official/${subjectId}`)}
              >
                View official package
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

          <section id="subject-courses" className="subject-overview__courses" aria-labelledby="subject-courses-heading">
            <div className="subject-overview__section-head">
              <div>
                <Title level={4} id="subject-courses-heading" className="subject-overview__section-title">
                  Official Course Package
                </Title>
                <Text type="secondary">A complete learning perspective created by Notes System.</Text>
              </div>
              <Button type="link" onClick={() => navigate(`/courses/community?domain=${encodeURIComponent(subjectId)}`)}>
                Other perspectives
              </Button>
            </div>
            <div className="subject-overview__course-card">
              <div>
                <div className="subject-overview__course-title-row">
                  <Title level={5}>{subjectTitle} Foundations</Title>
                  <SemanticChip variant="primary">Official</SemanticChip>
                </div>
                <Text type="secondary">
                  {subjectNotes.length} notes · recommended order · concept map included
                </Text>
              </div>
              <Button
                type="primary"
                onClick={() => navigate(`/course-packages/official/${subjectId}`)}
              >
                View package
              </Button>
            </div>
          </section>

          <div className="subject-overview__layout">
            <section
              className="subject-overview__concepts"
              aria-labelledby="subject-concepts-heading"
            >
              <div className="subject-overview__section-head">
                <Title level={4} id="subject-concepts-heading" className="subject-overview__section-title">
                  {t("subjectOverview.concepts", "Concept Overview")}
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
