import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Card, Col, Empty, Input, Row, Space, Spin, Typography } from "antd";
import { ApartmentOutlined, ArrowRightOutlined, SearchOutlined, ShopOutlined } from "@ant-design/icons";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import SemanticChip from "../../../shared/ui/SemanticChip";
import { loadGraphData } from "../../mindmap/components/utils/graphLoader";
import { isNavigableSubjectSlug } from "../../navigation/lib/notesIndexUtils";
import { getSubjectDisplayTitle } from "../lib/subjectOverviewUtils";
import { getDomainArchetypes } from "../lib/domainArchetypes";
import useTranslation from "../../../i18n/useTranslation";

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
  const { t } = useTranslation();
  const rawNotesIndex = useSelector((state) => state.notesIndex.data);
  const notesIndex = useMemo(() => rawNotesIndex || [], [rawNotesIndex]);
  const notesIndexStatus = useSelector((state) => state.notesIndex.status);
  const [query, setQuery] = useState("");
  const [graphMetaBySubject, setGraphMetaBySubject] = useState({});

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
              "Explore the notes and concepts connected to this knowledge domain.",
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
      title="Knowledge Database"
      subtitle="Explore knowledge by domain, concept, or note."
      showSiteFooter
    >
      <div className="app-page-shell__toolbar">
        <Input allowClear size="large" prefix={<SearchOutlined />} placeholder="Search knowledge domains" value={query} onChange={(event) => setQuery(event.target.value)} />
        <Button icon={<ShopOutlined />} onClick={() => navigate("/courses/community")}>Browse course packages</Button>
      </div>
              {loading ? <div className="app-page-shell__state"><Spin /></div> : null}
              {!loading && filteredSubjects.length === 0 ? <Empty description="No knowledge domains match your search." /> : null}
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
                <Space orientation="vertical" size={10} className="app-catalog-card__body">
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
                    iconPlacement="end"
                    className="app-catalog-card__cta-btn"
                    tabIndex={-1}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {t("subject.database.openOverview", "Explore domain")}
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
              </Row> : null}
      <Card size="small" className="app-page-shell__secondary-entry">
        <Space wrap>
          <div>
            <Text strong>Explore another way</Text>
            <Paragraph type="secondary">See how knowledge connects to roles and working life.</Paragraph>
          </div>
          <Button type="link" icon={<ArrowRightOutlined />} iconPlacement="end" onClick={() => navigate("/careers")}>Explore careers</Button>
        </Space>
      </Card>
    </AppPageShell>
  );
}

export default SubjectDatabasePage;
