import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Input, List, Space, Spin, Typography } from "antd";
import { ArrowRightOutlined, BookOutlined, SearchOutlined } from "@ant-design/icons";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import { buildSearchResultUrl, searchNotes } from "../../../features/search/api/search";
import SemanticChip from "../../../shared/ui/SemanticChip";
import {
  buildMenuItems,
  getDefaultLearningEntryUrl,
  isConcreteNoteRoute,
  isNavigableSubjectSlug,
  normalizeNoteRoute,
} from "../../../features/navigation/lib/notesIndexUtils";
import { getSubjectDisplayTitle } from "../../../features/subjects/lib/subjectOverviewUtils";
import useCurrentUserSummary from "../../../features/profile/hooks/useCurrentUserSummary";
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
        meta: "Knowledge Domain",
        url: `/subject/${subjectId}`,
        searchText: [title, subjectId, "knowledge domain field"].join(" ").toLowerCase(),
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
  return "slate";
}

function resolveProfileLearningUrl(profile, fallbackUrl) {
  const candidates = [
    profile?.currentNoteUrl,
    profile?.current_note_url,
    profile?.currentLessonUrl,
    profile?.current_lesson_url,
    profile?.lastNoteUrl,
    profile?.last_note_url,
    profile?.lastLearningUrl,
    profile?.last_learning_url,
    profile?.career_background?.recommended_note_url,
    profile?.careerBackground?.recommendedNoteUrl,
    ...(Array.isArray(profile?.learning_tracks)
      ? profile.learning_tracks.map((track) => track?.continue_path || track?.continuePath || track?.note_url || track?.noteUrl)
      : []),
    ...(Array.isArray(profile?.learningTracks)
      ? profile.learningTracks.map((track) => track?.continuePath || track?.continue_path || track?.noteUrl || track?.note_url)
      : []),
  ];

  for (const candidate of candidates) {
    if (!isConcreteNoteRoute(candidate)) continue;
    const normalized = normalizeNoteRoute(candidate);
    if (normalized) return normalized.split("#")[0];
  }
  return fallbackUrl;
}

function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentUser = useCurrentUserSummary();
  const rawNotesIndex = useSelector((state) => state.notesIndex.data);
  const notesIndex = useMemo(() => rawNotesIndex || [], [rawNotesIndex]);
  const [query, setQuery] = useState("");
  const [notePayload, setNotePayload] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchCacheRef = useRef(new Map());

  const localSearchItems = useMemo(() => {
    const subjects = collectSubjects(notesIndex);
    const notes = flattenMenuItems(buildMenuItems(notesIndex));
    return [...subjects, ...notes];
  }, [notesIndex]);

  const learningEntryUrl = useMemo(
    () => getDefaultLearningEntryUrl(notesIndex),
    [notesIndex],
  );
  const continueLearningUrl = useMemo(
    () => resolveProfileLearningUrl(currentUser.profile, learningEntryUrl),
    [currentUser.profile, learningEntryUrl],
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
    if (cleanQuery.length < 2) {
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
  const showNoResults = query.trim().length >= 2 && !searchLoading && localMatches.length === 0 && noteResults.length === 0;

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
        <div className="home-page__hero-scene">
          <aside className="home-page__map-preview" aria-label={t("home.mapPreview", "Education map preview")}>
            <img
              className="home-page__map-image"
              src={`${import.meta.env.BASE_URL}images/education-map-home.png`}
              alt={t(
                "home.mapImageAlt",
                "Abstract education map showing learning routes from a starting point through core concepts, prerequisites, practice, application, and a goal.",
              )}
            />
          </aside>

          <div className="home-page__hero-copy">
            <Text className="home-page__eyebrow">
              {t("home.eyebrow", "Knowledge shaped by many perspectives")}
            </Text>
            <h1 className="home-page__headline">
              {t("home.headline", "Explore knowledge. Build your path. Share your perspective.")}
            </h1>
            <p className="home-page__subhead">
              {t(
                "home.subhead",
                "Notes System connects knowledge domains, course perspectives, and personal learning paths—so anyone can learn and contribute how they understand.",
              )}
            </p>

            <div className="home-page__search-shell">
              <Input
                size="large"
                className="home-page__search-input"
                prefix={<SearchOutlined />}
                value={query}
                placeholder={t("home.searchPlaceholder", "Search knowledge domains and notes...")}
                onChange={(event) => setQuery(event.target.value)}
                onPressEnter={submitSearch}
                allowClear
                autoFocus
              />
              {hasResults || showNoResults ? (
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
                  {showNoResults ? (
                    <div className="home-page__no-results">
                      <Text strong>{t("home.noQuickResults", "No quick matches yet")}</Text>
                      <Text type="secondary">
                        {t("home.noQuickResultsHint", "Open full search to scan every note section.")}
                      </Text>
                    </div>
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
            </div>

            <div className="home-page__primary-actions">
              <button
                type="button"
                className="home-page__enter-learning"
                onClick={() => navigate("/database")}
              >
                <BookOutlined aria-hidden="true" />
                <span>Explore the Knowledge Database</span>
                <ArrowRightOutlined className="home-page__enter-learning-arrow" aria-hidden="true" />
              </button>
              {currentUser.isAuthenticated ? (
                <button
                  type="button"
                  className="home-page__secondary-learning"
                  onClick={() => navigate(continueLearningUrl)}
                >
                  {t("home.continueLearning", "Continue learning")}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </AppPageShell>
  );
}

export default HomePage;
