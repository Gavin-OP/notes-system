import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Empty, Input, List, Select, Space, Spin, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { buildSearchResultUrl, searchNotes } from "../common/api/search";

import "./SearchResultsPage.css";

const { Text, Title } = Typography;
const PAGE_SIZE = 10;

function renderHighlights(parts, fallbackText) {
  if (!Array.isArray(parts) || parts.length === 0) return fallbackText;
  return parts.map((part, index) =>
    part?.match ? (
      <mark key={`${part.text}-${index}`} className="search-results-page__mark">
        {part.text}
      </mark>
    ) : (
      <span key={`${part?.text || ""}-${index}`}>{part?.text || ""}</span>
    ),
  );
}

function collectSubjects(results) {
  const map = new Map();
  results.forEach((result) => {
    if (result?.subject_slug) {
      map.set(result.subject_slug, result.subject_title || result.subject_slug);
    }
  });
  return [...map.entries()].map(([value, label]) => ({ value, label }));
}

function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialSubject = searchParams.get("subject") || "";
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [payload, setPayload] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const query = searchParams.get("q") || "";
  const subject = searchParams.get("subject") || "";
  const subjectOptions = useMemo(() => collectSubjects(results), [results]);
  const hasMore = results.length < (payload?.total || 0);

  useEffect(() => {
    setQueryInput(query);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setPayload(null);
      setResults([]);
      setError("");
      return;
    }

    let mounted = true;
    async function runSearch() {
      setLoading(true);
      setError("");
      try {
        const nextPayload = await searchNotes({ query, subject, limit: PAGE_SIZE, offset: 0 });
        if (!mounted) return;
        setPayload(nextPayload);
        setResults(Array.isArray(nextPayload?.results) ? nextPayload.results : []);
      } catch (searchError) {
        if (!mounted) return;
        setPayload(null);
        setResults([]);
        setError(searchError instanceof Error ? searchError.message : "Search failed.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    runSearch();
    return () => {
      mounted = false;
    };
  }, [query, subject]);

  const submitSearch = () => {
    const next = new URLSearchParams();
    if (queryInput.trim()) next.set("q", queryInput.trim());
    if (subject) next.set("subject", subject);
    setSearchParams(next);
  };

  const updateSubject = (nextSubject) => {
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    if (nextSubject) next.set("subject", nextSubject);
    setSearchParams(next);
  };

  const loadMore = async () => {
    if (!query || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPayload = await searchNotes({
        query,
        subject,
        limit: PAGE_SIZE,
        offset: results.length,
      });
      setPayload(nextPayload);
      setResults((prev) => [...prev, ...(Array.isArray(nextPayload?.results) ? nextPayload.results : [])]);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Search failed.");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="search-results-page">
      <div className="search-results-page__header">
        <Button onClick={() => navigate(-1)}>Back</Button>
        <Title level={2}>Search notes</Title>
        <Text type="secondary">Search titles, headings, and full note content.</Text>
      </div>

      <div className="search-results-page__controls">
        <Input
          size="large"
          value={queryInput}
          prefix={<SearchOutlined />}
          placeholder="Search note content..."
          onChange={(event) => setQueryInput(event.target.value)}
          onPressEnter={submitSearch}
          allowClear
        />
        <Select
          allowClear
          placeholder="All subjects"
          value={subject || undefined}
          options={subjectOptions}
          onChange={(value) => updateSubject(value || "")}
          className="search-results-page__subject-select"
        />
        <Button type="primary" size="large" onClick={submitSearch}>
          Search
        </Button>
      </div>

      <div className="search-results-page__summary">
        {loading ? <Spin size="small" /> : null}
        {query ? (
          <Text type="secondary">
            {payload ? `${payload.total} results for "${query}"` : `Search results for "${query}"`}
          </Text>
        ) : (
          <Text type="secondary">Enter a query to search all notes.</Text>
        )}
      </div>

      {error ? <Text type="danger">{error}</Text> : null}
      {!loading && query && results.length === 0 && !error ? (
        <Empty description="No matching notes found." />
      ) : null}

      <List
        className="search-results-page__list"
        dataSource={results}
        renderItem={(result) => (
          <List.Item
            className="search-results-page__result"
            onClick={() => navigate(buildSearchResultUrl(result, query))}
          >
            <div className="search-results-page__result-main">
              <Space size="small" wrap>
                <Text strong>{result.note_title}</Text>
                <span className={`search-results-page__badge search-results-page__badge--${result.match_type}`}>
                  {result.match_type}
                </span>
              </Space>
              <Text type="secondary" className="search-results-page__path">
                {[result.subject_title, result.section_title].filter(Boolean).join(" / ")}
              </Text>
              <div className="search-results-page__snippet">
                {renderHighlights(result.highlights, result.snippet)}
              </div>
            </div>
          </List.Item>
        )}
      />

      {hasMore ? (
        <div className="search-results-page__load-more">
          <Button onClick={loadMore} loading={loadingMore}>
            Load more
          </Button>
        </div>
      ) : null}
    </main>
  );
}

export default SearchResultsPage;
