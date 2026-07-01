import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input, List, Space, Spin, Typography } from "antd";
import { ArrowRightOutlined, BookOutlined, SearchOutlined } from "@ant-design/icons";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import { getCareerTaxonomy } from "../../../features/careers/api/careers";
import { buildSearchResultUrl, searchNotes } from "../../../features/search/api/search";
import SemanticChip from "../../../shared/ui/SemanticChip";
import { buildMenuItems, getDefaultLearningEntryUrl, isNavigableSubjectSlug } from "../../../features/navigation/lib/notesIndexUtils";
import { getSubjectDisplayTitle } from "../../../features/subjects/lib/subjectOverviewUtils";
import useTranslation from "../../../i18n/useTranslation";

import "./HomePage.css";

const { Text } = Typography;

function flattenMenuItems(items = [], trail = [], list = []) {
  items.forEach((item) => {
    const nextTrail = item.label ? [...trail, item.label] : trail;
    if (item.children?.length) {
      flattenMenuItems(item.children, nextTrail, list);
      return;
    }
    if (item.key && item.label) {
      list.push({
        type: "note",
        key: item.key,
        title: item.label,
        meta: trail.join(" / "),
        url: item.key,
        searchText: [item.label, trail.join(" "), item.key].join(" ").toLowerCase(),
      });
    }
  });
  return list;
}

function collectSubjects(items = []) {
  return items
    .filter((item) => item?.type === "folder")
    .map((item) => {
      const match = String(item.url || "").match(/^\/note\/([^/]+)$/);
      const subjectId = match?.[1] || "";
      if (!subjectId || !isNavigableSubjectSlug(subjectId)) return null;
      const title = getSubjectDisplayTitle(item, {}, subjectId);
      return {
        type: "subject",
        key: subjectId,
        title,
        meta: "Subject",
        url: `/subject/${subjectId}`,
        searchText: [title, subjectId, "subject course discipline"].join(" ").toLowerCase(),
      };
    })
    .filter(Boolean);
}

function renderHighlights(parts, fallbackText) {
  if (!Array.isArray(parts) || parts.length === 0) return fallbackText;
  return parts.map((part, index) =>
    part?.match ? (
      <mark key={`${part.text}-${index}`} className="home-page__mark">
        {part.text}
      </mark>
    ) : (
      <span key={`${part?.text || ""}-${index}`}>{part?.text || ""}</span>
    ),
  );
}

function typeVariant(type) {
  if (type === "subject") return "primary";
  if (type === "career") return "wisdom";
  return "slate";
}

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const rawNotesIndex = useSelector((state) => state.notesIndex.data);
  const notesIndex = useMemo(() => rawNotesIndex || [], [rawNotesIndex]);
  const [query, setQuery] = useState("");
  const [careers, setCareers] = useState([]);
  const [notePayload, setNotePayload] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchCacheRef = useRef(new Map());

  useEffect(() => {
    let mounted = true;
    async function loadCareers() {
      try {
        const payload = await getCareerTaxonomy();
        if (!mounted) return;
        const profiles = Array.isArray(payload?.profiles) ? payload.profiles : [];
        setCareers(
          profiles.map((profile) => ({
            type: "career",
            key: profile.job_id || profile.jobId || profile.title,
            title: profile.title || "Career role",
            meta: "Career",
            url: `/careers/${encodeURIComponent(profile.job_id || profile.jobId || profile.title || "")}`,
            searchText: [
              profile.title,
              profile.description,
              ...(profile.hard_skills || profile.hardSkills || []),
              ...(profile.tools || []),
              "career role job",
            ].join(" ").toLowerCase(),
          })),
        );
      } catch {
        setCareers([]);
      }
    }
    loadCareers();
    return () => {
      mounted = false;
    };
  }, []);

  const localSearchItems = useMemo(() => {
    const subjects = collectSubjects(notesIndex);
    const notes = flattenMenuItems(buildMenuItems(notesIndex));
    return [...subjects, ...careers, ...notes];
  }, [careers, notesIndex]);

  const learningEntryUrl = useMemo(
    () => getDefaultLearningEntryUrl(notesIndex),
    [notesIndex],
  );

  const localMatches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (normalized.length < 2) return [];
    return localSearchItems
      .filter((item) => item.searchText.includes(normalized))
      .slice(0, 8);
  }, [localSearchItems, query]);

  useEffect(() => {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 3) {
      setNotePayload(null);
      setSearchLoading(false);
      return;
    }
    const cacheKey = cleanQuery.toLowerCase();
    if (searchCacheRef.current.has(cacheKey)) {
      setNotePayload(searchCacheRef.current.get(cacheKey));
      setSearchLoading(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      try {
        const payload = await searchNotes({ query: cleanQuery, limit: 6, offset: 0 });
        if (controller.signal.aborted) return;
        searchCacheRef.current.set(cacheKey, payload);
        setNotePayload(payload);
      } catch {
        if (!controller.signal.aborted) setNotePayload(null);
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 220);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query]);

  const noteResults = Array.isArray(notePayload?.results) ? notePayload.results : [];
  const hasResults = query.trim().length >= 2 && (localMatches.length > 0 || noteResults.length > 0 || searchLoading);

  const openItem = (url) => {
    if (url) navigate(url);
  };

  const submitSearch = () => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    if (localMatches[0]?.url) {
      navigate(localMatches[0].url);
      return;
    }
    if (noteResults[0]) {
      navigate(buildSearchResultUrl(noteResults[0], cleanQuery));
      return;
    }
    navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <AppPageShell
      surface="hero"
      contentWidth="full"
      mainClassName="app-page-shell__main--hero"
      contentClassName="home-page__hero"
      showSiteFooter
    >
      <section className="home-page__hero-inner" aria-label={t("home.searchLabel", "Search everything")}>
        <div className="home-page__hero-copy">
          <Text className="home-page__eyebrow">
            {t("home.eyebrow", "Structured learning for life after school")}
          </Text>
          <h1 className="home-page__headline">
            {t("home.headline", "Build a path through any discipline.")}
          </h1>
          <p className="home-page__subhead">
            {t(
              "home.subhead",
              "A personal learning guide that turns goals into structured knowledge trees, then helps you study, record, test, and adjust your path as you grow.",
            )}
          </p>
        </div>

        <div className="home-page__search-shell">
          <Input
            size="large"
            className="home-page__search-input"
            prefix={<SearchOutlined />}
            value={query}
            placeholder={t("home.searchPlaceholder", "Search courses, notes, careers...")}
            onChange={(event) => setQuery(event.target.value)}
            onPressEnter={submitSearch}
            allowClear
            autoFocus
          />
          {hasResults ? (
            <div className="home-page__results">
              {localMatches.length > 0 ? (
                <List
                  size="small"
                  dataSource={localMatches}
                  renderItem={(item) => (
                    <List.Item className="home-page__result" onClick={() => openItem(item.url)}>
                      <div className="home-page__result-main">
                        <Space size={8} wrap>
                          <Text strong>{item.title}</Text>
                          <SemanticChip variant={typeVariant(item.type)}>
                            {item.meta}
                          </SemanticChip>
                        </Space>
                        {item.type === "note" ? (
                          <Text type="secondary" className="home-page__result-meta">
                            {item.url}
                          </Text>
                        ) : null}
                      </div>
                    </List.Item>
                  )}
                />
              ) : null}
              {searchLoading ? (
                <div className="home-page__loading-row">
                  <Spin size="small" />
                  <Text type="secondary">{t("common.loading", "Loading...")}</Text>
                </div>
              ) : null}
              {noteResults.length > 0 ? (
                <List
                  size="small"
                  dataSource={noteResults}
                  renderItem={(result) => (
                    <List.Item
                      className="home-page__result"
                      onClick={() => openItem(buildSearchResultUrl(result, query))}
                    >
                      <div className="home-page__result-main">
                        <Space size={8} wrap>
                          <Text strong>{result.note_title}</Text>
                          <SemanticChip variant="slate">{result.match_type || "note"}</SemanticChip>
                        </Space>
                        <Text type="secondary" className="home-page__result-meta">
                          {[result.subject_title, result.section_title].filter(Boolean).join(" / ")}
                        </Text>
                        <div className="home-page__snippet">
                          {renderHighlights(result.highlights, result.snippet)}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              ) : null}
              <button
                type="button"
                className="home-page__view-all"
                onClick={() => navigate(`/search?q=${encodeURIComponent(query.trim())}`)}
              >
                {t("home.viewAllResults", "View all results")}
              </button>
            </div>
          ) : null}

          <button
            type="button"
            className="home-page__enter-learning"
            onClick={() => navigate(learningEntryUrl)}
          >
            <span className="home-page__enter-learning-icon" aria-hidden="true">
              <BookOutlined />
            </span>
            <span className="home-page__enter-learning-copy">
              <span className="home-page__enter-learning-label">
                {t("home.enterLearning", "Enter learning workspace")}
              </span>
              <span className="home-page__enter-learning-hint">
                {t("home.enterLearningHint", "Pick up where structured notes and paths live")}
              </span>
            </span>
            <ArrowRightOutlined className="home-page__enter-learning-arrow" aria-hidden="true" />
          </button>
        </div>
      </section>
    </AppPageShell>
  );
}

export default HomePage;
