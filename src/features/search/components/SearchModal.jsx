import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Empty, Input, List, Modal, Space, Spin, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import { buildSearchResultUrl, searchNotes } from "../api/search";
import SemanticChip from "../../../shared/ui/SemanticChip";

import "./SearchModal.css";

const { Text } = Typography;

function renderHighlights(parts, fallbackText) {
  if (!Array.isArray(parts) || parts.length === 0) {
    return fallbackText;
  }
  return parts.map((part, index) =>
    part?.match ? (
      <mark key={`${part.text}-${index}`} className="search-modal__mark">
        {part.text}
      </mark>
    ) : (
      <span key={`${part?.text || ""}-${index}`}>{part?.text || ""}</span>
    ),
  );
}

function matchTypeLabel(type) {
  if (type === "title") return "Title";
  if (type === "heading") return "Heading";
  return "Body";
}

function SearchModal({ open, onClose, localOptions = [] }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cacheRef = useRef(new Map());

  const localMatches = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (normalized.length < 2) return [];
    return localOptions
      .filter((option) => String(option.searchText || option.value || "").toLowerCase().includes(normalized))
      .slice(0, 5);
  }, [localOptions, query]);

  const results = Array.isArray(payload?.results) ? payload.results : [];
  const bestResult = results[0];

  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 3) {
      setPayload(null);
      setLoading(false);
      setError("");
      return;
    }

    const cacheKey = query.trim().toLowerCase();
    if (cacheRef.current.has(cacheKey)) {
      setPayload(cacheRef.current.get(cacheKey));
      setLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const nextPayload = await searchNotes({ query, limit: 8, offset: 0 });
        if (controller.signal.aborted) return;
        cacheRef.current.set(cacheKey, nextPayload);
        setPayload(nextPayload);
      } catch (searchError) {
        if (controller.signal.aborted) return;
        setPayload(null);
        setError(searchError instanceof Error ? searchError.message : "Search failed.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, query]);

  const closeAndNavigate = (url) => {
    if (!url) return;
    setQuery("");
    setPayload(null);
    onClose?.();
    navigate(url);
  };

  const handleOpenBest = () => {
    if (bestResult) {
      closeAndNavigate(buildSearchResultUrl(bestResult, query));
      return;
    }
    const local = localMatches[0];
    if (local?.value) closeAndNavigate(local.value);
  };

  const handleViewAll = () => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    onClose?.();
    navigate(`/search?q=${encodeURIComponent(cleanQuery)}`);
  };

  return (
    <Modal
      title="Search notes"
      open={open}
      onCancel={onClose}
      footer={null}
      width={760}
      destroyOnClose={false}
      className="search-modal"
    >
      <Input
        size="large"
        autoFocus
        value={query}
        prefix={<SearchOutlined />}
        placeholder="Search titles, headings, and note content..."
        onChange={(event) => setQuery(event.target.value)}
        onPressEnter={handleOpenBest}
        allowClear
      />

      <div className="search-modal__body">
        {query.trim().length < 2 ? (
          <Empty description="Type at least 2 characters to search notes." />
        ) : null}

        {localMatches.length > 0 ? (
          <div className="search-modal__section">
            <Text type="secondary">Quick matches</Text>
            <List
              size="small"
              dataSource={localMatches}
              renderItem={(item) => (
                <List.Item className="search-modal__item" onClick={() => closeAndNavigate(item.value)}>
                  {item.label}
                </List.Item>
              )}
            />
          </div>
        ) : null}

        {query.trim().length >= 3 ? (
          <div className="search-modal__section">
            <Space className="search-modal__section-title">
              <Text type="secondary">Full-text results</Text>
              {loading ? <Spin size="small" /> : null}
            </Space>
            {error ? <Text type="danger">{error}</Text> : null}
            {!loading && !error && results.length === 0 ? (
              <Empty description="No matching notes found." />
            ) : null}
            <List
              dataSource={results}
              renderItem={(result) => (
                <List.Item
                  className="search-modal__result"
                  onClick={() => closeAndNavigate(buildSearchResultUrl(result, query))}
                >
                  <div className="search-modal__result-main">
                    <Space size="small" wrap>
                      <Text strong>{result.note_title}</Text>
                      <SemanticChip variant="primary">{matchTypeLabel(result.match_type)}</SemanticChip>
                    </Space>
                    <Text type="secondary" className="search-modal__path">
                      {[result.subject_title, result.section_title].filter(Boolean).join(" / ")}
                    </Text>
                    <div className="search-modal__snippet">
                      {renderHighlights(result.highlights, result.snippet)}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        ) : null}
      </div>

      <div className="search-modal__footer">
        <Button onClick={onClose}>Close</Button>
        <Button type="primary" onClick={handleViewAll} disabled={!query.trim()}>
          View all results
        </Button>
      </div>
    </Modal>
  );
}

export default SearchModal;
