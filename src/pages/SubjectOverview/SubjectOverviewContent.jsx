import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Empty, Spin, Typography } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";

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

import "./SubjectOverviewPage.css";

const { Paragraph, Text, Title } = Typography;

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
  const notesIndex = useSelector((state) => state.notesIndex.data) || [];
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

  const graphMeta = graphData?.meta || {};
  const subjectTitle = getSubjectDisplayTitle(subjectFolder, graphMeta, subjectId);

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
          <Spin tip="Loading subject overview..." />
        </div>
      ) : (
        <>
          <header className="subject-overview__header">
            <Title level={2} className="subject-overview__title">
              {subjectTitle}
            </Title>
            {resolvedSyllabus?.summary ? (
              <Paragraph className="subject-overview__summary" type="secondary">
                {resolvedSyllabus.summary}
              </Paragraph>
            ) : null}
          </header>

          <div className="subject-overview__layout">
            <section
              className="subject-overview__syllabus"
              aria-labelledby="subject-syllabus-heading"
            >
              <Title level={4} id="subject-syllabus-heading" className="subject-overview__section-title">
                About this subject
              </Title>

              {hasSyllabusContent ? (
                <div className="subject-overview__syllabus-body">
                  <SyllabusBlock label="What you'll master">
                    {hasOutcomes ? (
                      <ul className="subject-overview__list">
                        {resolvedSyllabus.outcomes.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </SyllabusBlock>

                  <SyllabusBlock label="Level you'll reach">
                    {hasLevel ? (
                      <Paragraph className="subject-overview__prose">{resolvedSyllabus.level}</Paragraph>
                    ) : null}
                  </SyllabusBlock>

                  <SyllabusBlock label="Prerequisites">
                    {hasPrerequisites ? (
                      <ul className="subject-overview__list">
                        {resolvedSyllabus.prerequisites.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </SyllabusBlock>

                  <SyllabusBlock label="Why learn this">
                    {hasWhyLearn ? (
                      <Paragraph className="subject-overview__prose">{resolvedSyllabus.whyLearn}</Paragraph>
                    ) : null}
                  </SyllabusBlock>

                  <SyllabusBlock label="Who it's for">
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
                  Syllabus details for this subject are being prepared.
                </Paragraph>
              )}
            </section>

            <section
              className="subject-overview__concepts"
              aria-labelledby="subject-concepts-heading"
            >
              <div className="subject-overview__section-head">
                <Title level={4} id="subject-concepts-heading" className="subject-overview__section-title">
                  Concepts in this subject
                </Title>
                {conceptPreview.totalConcepts > 0 ? (
                  <Text type="secondary">{conceptPreview.totalConcepts} concepts</Text>
                ) : null}
              </div>

              {conceptPreview.groups.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Concept preview is not available yet."
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
                    Open concept map
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
