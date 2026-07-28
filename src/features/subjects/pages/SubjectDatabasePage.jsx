import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Card, Col, Empty, Input, Row, Space, Spin, Tabs, Typography } from "antd";
import { ApartmentOutlined, ArrowRightOutlined, SearchOutlined } from "@ant-design/icons";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import SemanticChip from "../../../shared/ui/SemanticChip";
import { loadGraphData } from "../../mindmap/components/utils/graphLoader";
import { isNavigableSubjectSlug } from "../../navigation/lib/notesIndexUtils";
import { getSubjectDisplayTitle } from "../lib/subjectOverviewUtils";
import { getDomainArchetypes } from "../lib/domainArchetypes";
import useTranslation from "../../../i18n/useTranslation";
import { getCareerTaxonomy } from "../../careers/api/careers";

const { Paragraph, Text } = Typography;

function countNotes(item) {
  if (!item) return 0;
  if (item.type === "file") return 1;
  if (!Array.isArray(item.children)) return 0;
  return item.children.reduce((sum, child) => sum + countNotes(child), 0);
}

function collectSubjectFolders(items = []) {
  if (!Array.isArray(items)) return [];
  return items
    .filter((item) => item?.type === "folder")
    .map((item) => {
      const match = String(item.url || "").match(/^\/note\/([^/]+)$/);
      const subjectId = match?.[1] || "";
      if (!subjectId || !isNavigableSubjectSlug(subjectId)) return null;
      return {
        subjectId,
        folder: item,
        noteCount: countNotes(item),
      };
    })
    .filter(Boolean);
}

function SubjectDatabasePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const rawNotesIndex = useSelector((state) => state.notesIndex.data);
  const notesIndex = useMemo(() => rawNotesIndex || [], [rawNotesIndex]);
  const notesIndexStatus = useSelector((state) => state.notesIndex.status);
  const [query, setQuery] = useState("");
  const [graphMetaBySubject, setGraphMetaBySubject] = useState({});
  const [careers, setCareers] = useState([]);
  const [careersLoading, setCareersLoading] = useState(true);
  const requestedView = new URLSearchParams(location.search).get("view");
  const activeView = ["subjects", "careers", "packages"].includes(requestedView) ? requestedView : "subjects";

  const subjects = useMemo(() => collectSubjectFolders(notesIndex), [notesIndex]);

  useEffect(() => {
    let cancelled = false;
    async function loadSubjectMeta() {
      const entries = await Promise.all(
        subjects.map(async (subject) => {
          const graph = await loadGraphData(subject.subjectId);
          return [subject.subjectId, graph?.meta || null];
        }),
      );
      if (!cancelled) {
        setGraphMetaBySubject(Object.fromEntries(entries.filter(([, meta]) => meta)));
      }
    }
    if (subjects.length) loadSubjectMeta();
    return () => {
      cancelled = true;
    };
  }, [subjects]);

  useEffect(() => {
    let mounted = true;
    getCareerTaxonomy()
      .then((payload) => mounted && setCareers(Array.isArray(payload?.profiles) ? payload.profiles : []))
      .catch(() => mounted && setCareers([]))
      .finally(() => mounted && setCareersLoading(false));
    return () => { mounted = false; };
  }, []);

  const subjectCards = useMemo(
    () =>
      subjects
        .map((subject) => {
          const graphMeta = graphMetaBySubject[subject.subjectId] || {};
          const title = getSubjectDisplayTitle(subject.folder, graphMeta, subject.subjectId);
          const conceptCount = Number(graphMeta.nodeCount || graphMeta.conceptCount || 0);
          const summary =
            graphMeta.description ||
            graphMeta.summary ||
            t(
              "subject.database.cardFallback",
              "Open the overview to see the structure, concepts, and starting point for this subject.",
            );
          return {
            ...subject,
            title,
            summary,
            conceptCount,
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title)),
    [graphMetaBySubject, subjects, t],
  );

  const filteredSubjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return subjectCards;
    return subjectCards.filter((subject) =>
      [subject.title, subject.subjectId, subject.summary]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query, subjectCards]);

  const loading = notesIndexStatus === "loading" || notesIndexStatus === "idle";

  return (
    <AppPageShell
      backLabel={t("common.backToHome", "Back to Home")}
      onBack={() => navigate("/")}
      title="Explore Our Database"
      showSiteFooter
    >
      <Tabs
        activeKey={activeView}
        onChange={(key) => navigate(`/database?view=${key}`, { replace: true })}
        items={[
          {
            key: "subjects",
            label: "Subject Database",
            children: <>
              <div className="app-page-shell__toolbar"><Input allowClear size="large" prefix={<SearchOutlined />} placeholder="Search subjects" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
              {loading ? <div className="app-page-shell__state"><Spin /></div> : null}
              {!loading && filteredSubjects.length === 0 ? <Empty description="No subjects match your search." /> : null}
              {!loading && filteredSubjects.length > 0 ? <Row gutter={[16, 16]}>
          {filteredSubjects.map((subject) => (
            <Col key={subject.subjectId} xs={24} md={12} xl={8}>
              <Card
                hoverable
                className="app-catalog-card"
                role="link"
                tabIndex={0}
                onClick={() => navigate(`/subject/${subject.subjectId}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(`/subject/${subject.subjectId}`);
                  }
                }}
              >
                <Space direction="vertical" size={10} className="app-catalog-card__body">
                  <div className="app-catalog-card__head">
                    <Text strong className="app-catalog-card__title">
                      {subject.title}
                    </Text>
                    <ApartmentOutlined className="app-catalog-card__icon" />
                  </div>
                  <Paragraph
                    type="secondary"
                    ellipsis={{ rows: 3 }}
                    className="app-catalog-card__description"
                  >
                    {subject.summary}
                  </Paragraph>
                  <Space wrap size={[6, 6]}>
                    {getDomainArchetypes(subject.subjectId).map((archetype, index) => (
                      <SemanticChip key={archetype} variant={index === 0 ? "teal" : "slate"}>
                        {archetype}
                      </SemanticChip>
                    ))}
                    <SemanticChip variant="primary">
                      {subject.noteCount} {t("subject.database.notes", "notes")}
                    </SemanticChip>
                    {subject.conceptCount > 0 ? (
                      <SemanticChip variant="wisdom">
                        {subject.conceptCount} {t("subject.database.concepts", "concepts")}
                      </SemanticChip>
                    ) : null}
                  </Space>
                  <Button
                    type="text"
                    icon={<ArrowRightOutlined />}
                    iconPosition="end"
                    className="app-catalog-card__cta-btn"
                    tabIndex={-1}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {t("subject.database.openOverview", "Open overview")}
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
              </Row> : null}
            </>,
          },
          {
            key: "careers",
            label: "Career Database",
            children: careersLoading ? <div className="app-page-shell__state"><Spin /></div> : careers.length ? (
              <Row gutter={[16, 16]}>{careers.map((career) => (
                <Col key={career.job_id || career.jobId || career.title} xs={24} md={12} xl={8}>
                  <Card hoverable className="app-catalog-card" onClick={() => navigate(`/careers/${encodeURIComponent(career.job_id || career.jobId)}`)}>
                    <Space direction="vertical" size={10} className="app-catalog-card__body">
                      <Text strong className="app-catalog-card__title">{career.title}</Text>
                      <Paragraph type="secondary" ellipsis={{ rows: 3 }}>{career.description}</Paragraph>
                      <Button type="text" icon={<ArrowRightOutlined />} iconPosition="end" tabIndex={-1}>Open role</Button>
                    </Space>
                  </Card>
                </Col>
              ))}</Row>
            ) : <Empty description="No careers are available yet." />,
          },
          {
            key: "packages",
            label: "Course Package Database",
            children: loading ? <div className="app-page-shell__state"><Spin /></div> : (
              <Row gutter={[16, 16]}>{subjectCards.map((subject) => (
                <Col key={subject.subjectId} xs={24} md={12} xl={8}>
                  <Card hoverable className="app-catalog-card" onClick={() => navigate(`/course-packages/official/${subject.subjectId}`)}>
                    <Space direction="vertical" size={10} className="app-catalog-card__body">
                      <div className="app-catalog-card__head"><Text strong className="app-catalog-card__title">{subject.title} Foundations</Text><SemanticChip variant="primary">Official</SemanticChip></div>
                      <Space wrap size={[6, 6]}><SemanticChip variant="primary">Domain · {subject.title}</SemanticChip>{getDomainArchetypes(subject.subjectId).map((item) => <SemanticChip key={item} variant="teal">Learning · {item}</SemanticChip>)}</Space>
                      <Button type="text" icon={<ArrowRightOutlined />} iconPosition="end" tabIndex={-1}>View package</Button>
                    </Space>
                  </Card>
                </Col>
              ))}</Row>
            ),
          },
        ]}
      />
    </AppPageShell>
  );
}

export default SubjectDatabasePage;
