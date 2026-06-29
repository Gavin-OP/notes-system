import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Dropdown, Input, List, Space, Spin, Typography } from "antd";
import {
  ApartmentOutlined,
  GlobalOutlined,
  MoonOutlined,
  NodeIndexOutlined,
  SearchOutlined,
  SunOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { getCareerTaxonomy } from "../../common/api/careers";
import { buildSearchResultUrl, searchNotes } from "../../common/api/search";
import SemanticChip from "../../common/components/SemanticChip";
import { setLanguage, setTheme } from "../../redux/preferenceSlice";
import { buildMenuItems, isNavigableSubjectSlug } from "../../utils/notesIndexUtils";
import { getSubjectDisplayTitle } from "../../utils/subjectOverviewUtils";
import useTranslation from "../../i18n/useTranslation";

import "./HomePage.css";

const { Text } = Typography;

const POPULAR_SEARCHES = ["Data Science", "Data Analyst", "Python", "Statistics"];

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
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rawNotesIndex = useSelector((state) => state.notesIndex.data);
  const notesIndex = useMemo(() => rawNotesIndex || [], [rawNotesIndex]);
  const theme = useSelector((state) => state.preference.theme);
  const language = useSelector((state) => state.preference.language);
  const [query, setQuery] = useState("");
  const [careers, setCareers] = useState([]);
  const [notePayload, setNotePayload] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchCacheRef = useRef(new Map());
  const languageItems = [
    {
      key: "en",
      label: t("language.english"),
      onClick: () => dispatch(setLanguage("en")),
    },
    {
      key: "cn",
      label: t("language.chinese"),
      onClick: () => dispatch(setLanguage("cn")),
    },
  ];

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
    <main className="home-page">
      <header className="home-page__topbar">
        <button type="button" className="home-page__brand" onClick={() => navigate("/")}>
          <span className="home-page__logo-placeholder">NS</span>
          <span className="home-page__brand-name">{t("home.brand", "Notes System")}</span>
        </button>
        <Space size={8} className="home-page__tools">
          <Button
            shape="circle"
            icon={theme === "dark" ? <SunOutlined /> : <MoonOutlined />}
            onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
            aria-label={t("note.toolbar.darkMode", "Dark mode")}
          />
          <Dropdown
            menu={{ items: languageItems, selectable: true, selectedKeys: [language] }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button className="home-page__language-button" icon={<GlobalOutlined />}>
              {language === "cn" ? t("language.chinese") : t("language.english")}
            </Button>
          </Dropdown>
          <Button
            shape="circle"
            icon={<UserOutlined />}
            onClick={() => navigate("/user/profile")}
            aria-label={t("note.toolbar.profile", "Profile")}
          />
        </Space>
      </header>

      <section className="home-page__hero" aria-label={t("home.searchLabel", "Search everything")}>
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
        </div>

        <div className="home-page__popular-searches" aria-label={t("home.popularSearches", "Popular searches")}>
          <span>{t("home.popularSearches", "Popular searches")}:</span>
          {POPULAR_SEARCHES.map((item) => (
            <button key={item} type="button" onClick={() => setQuery(item)}>
              {item}
            </button>
          ))}
        </div>

        <div className="home-page__guide-strip" aria-label={t("home.guideStripLabel", "Learning guide features")}>
          <div className="home-page__guide-item">
            <NodeIndexOutlined />
            <span>{t("home.guide.path", "Map prerequisites into a path")}</span>
          </div>
          <div className="home-page__guide-item">
            <SearchOutlined />
            <span>{t("home.guide.search", "Search across notes, subjects, and careers")}</span>
          </div>
          <div className="home-page__guide-item">
            <ApartmentOutlined />
            <span>{t("home.guide.databases", "Browse discipline and career databases")}</span>
          </div>
        </div>
      </section>

      <footer className="home-page__footer">
        <button type="button" onClick={() => navigate("/disclaimer")}>
          {t("home.footer.disclaimer", "Disclaimer")}
        </button>
        <button type="button" onClick={() => navigate("/careers")}>
          {t("home.footer.careers", "Career Database")}
        </button>
        <button type="button" onClick={() => navigate("/subjects")}>
          {t("home.footer.subjects", "Subject Database")}
        </button>
        <a href="mailto:hello@notes-system.local">{t("home.footer.contact", "Contact us")}</a>
      </footer>
    </main>
  );
}

export default HomePage;
