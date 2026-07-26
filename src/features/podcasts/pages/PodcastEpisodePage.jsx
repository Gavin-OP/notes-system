import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Collapse,
  Empty,
  Progress,
  Skeleton,
  Space,
  Tabs,
  Timeline,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  LinkOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import SemanticChip from "../../../shared/ui/SemanticChip";
import {
  getPodcast,
  podcastAudioUrl,
  updatePodcastPlayback,
} from "../api/podcasts";
import { formatPodcastDuration } from "../lib/podcastUtils";

import "./PodcastPages.css";

const { Paragraph, Text, Title } = Typography;

function chapterForPosition(chapters, positionMs) {
  return chapters.find((chapter) => (
    positionMs >= chapter.start_ms && positionMs < chapter.end_ms
  )) || chapters[0] || null;
}

export default function PodcastEpisodePage() {
  const { episodeId = "" } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const lastSyncRef = useRef(0);
  const resumeAppliedRef = useRef("");
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [episode, setEpisode] = useState(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [positionMs, setPositionMs] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorText("");
    try {
      const payload = await getPodcast(episodeId);
      setEpisode(payload);
      const restoredPosition = Number(payload.playback?.position_ms || 0);
      setPositionMs(restoredPosition);
      const restoredChapter = chapterForPosition(payload.spoken_outline, restoredPosition);
      const segmentIndex = payload.audio_segments.findIndex(
        (segment) => segment.chapter_id === restoredChapter?.id,
      );
      setCurrentSegmentIndex(Math.max(0, segmentIndex));
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not load this podcast.");
    } finally {
      setLoading(false);
    }
  }, [episodeId]);

  useEffect(() => {
    load();
  }, [load]);

  const currentSegment = episode?.audio_segments?.[currentSegmentIndex] || null;
  const currentChapter = useMemo(
    () => episode?.spoken_outline?.find(
      (chapter) => chapter.id === currentSegment?.chapter_id,
    ) || episode?.spoken_outline?.[0] || null,
    [currentSegment, episode],
  );

  const persistProgress = useCallback(async (nextPosition, completed = false) => {
    try {
      await updatePodcastPlayback(episodeId, {
        position_ms: Math.max(0, Math.round(nextPosition)),
        completed,
      });
    } catch {
      // Playback remains uninterrupted; the next time update retries persistence.
    }
  }, [episodeId]);

  const handleTimeUpdate = () => {
    if (!audioRef.current || !currentChapter) return;
    const nextPosition = currentChapter.start_ms + audioRef.current.currentTime * 1_000;
    setPositionMs(nextPosition);
    const now = Date.now();
    if (now - lastSyncRef.current >= 5_000) {
      lastSyncRef.current = now;
      persistProgress(nextPosition);
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current || !currentChapter || !episode) return;
    const resumeKey = `${episode.id}:${currentChapter.id}`;
    if (resumeAppliedRef.current === resumeKey) return;
    resumeAppliedRef.current = resumeKey;
    if (
      episode.playback?.position_ms >= currentChapter.start_ms
      && episode.playback?.position_ms < currentChapter.end_ms
    ) {
      audioRef.current.currentTime = Math.max(
        0,
        (episode.playback.position_ms - currentChapter.start_ms) / 1_000,
      );
    }
  };

  const selectChapter = (chapter) => {
    const segmentIndex = episode.audio_segments.findIndex(
      (segment) => segment.chapter_id === chapter.id,
    );
    if (segmentIndex < 0) return;
    resumeAppliedRef.current = "";
    setCurrentSegmentIndex(segmentIndex);
    setPositionMs(chapter.start_ms);
    persistProgress(chapter.start_ms);
  };

  const handleEnded = () => {
    if (!episode) return;
    if (currentSegmentIndex < episode.audio_segments.length - 1) {
      const nextIndex = currentSegmentIndex + 1;
      const nextChapter = episode.spoken_outline.find(
        (chapter) => chapter.id === episode.audio_segments[nextIndex].chapter_id,
      );
      resumeAppliedRef.current = "";
      setCurrentSegmentIndex(nextIndex);
      setPositionMs(nextChapter?.start_ms || positionMs);
      persistProgress(nextChapter?.start_ms || positionMs);
      return;
    }
    setPositionMs(episode.duration_ms);
    persistProgress(episode.duration_ms, true);
    setEpisode((current) => ({
      ...current,
      playback: {
        ...current.playback,
        position_ms: current.duration_ms,
        completed: true,
      },
    }));
  };

  const progressPercent = episode?.duration_ms
    ? Math.min(100, Math.round((positionMs / episode.duration_ms) * 100))
    : 0;

  return (
    <AppPageShell
      title={episode?.title || "Podcast Episode"}
      subtitle="An official, source-linked audio edition from Notes System."
      backLabel={location.state?.returnTo ? "Back to note" : "Back to learning"}
      onBack={() => navigate(location.state?.returnTo || "/user/profile?section=learning")}
      showSiteFooter
      contentWidth="wide"
      contentClassName="podcast-episode"
    >
      {errorText ? (
        <Alert
          type="error"
          showIcon
          title="Podcast unavailable"
          description={errorText}
          action={<Button icon={<ReloadOutlined />} onClick={load}>Retry</Button>}
        />
      ) : null}
      {loading ? <Card><Skeleton active paragraph={{ rows: 12 }} /></Card> : null}

      {!loading && episode ? (
        <>
          <section className="podcast-episode__hero">
            <div>
              <Space wrap>
                <SemanticChip variant="primary">{episode.domain_title}</SemanticChip>
                <SemanticChip variant={episode.status === "ready" ? "sage" : "slate"}>
                  {episode.status}
                </SemanticChip>
                <SemanticChip variant="slate">
                  Course version {episode.course_version_number}
                </SemanticChip>
              </Space>
              <Title level={1}>{episode.title}</Title>
              <Paragraph>{episode.description}</Paragraph>
              <Space wrap>
                <span><ClockCircleOutlined /> {formatPodcastDuration(episode.duration_ms)}</span>
                <span><FileTextOutlined /> {episode.spoken_outline.length} chapters</span>
                <span><SafetyCertificateOutlined /> {episode.verification.coverage_percent}% source coverage</span>
              </Space>
            </div>
            <div className="podcast-episode__verification">
              <Progress
                type="circle"
                percent={episode.verification.coverage_percent}
                size={112}
              />
              <Text strong>Source verification</Text>
              <Text type="secondary">
                {episode.verification.covered_lesson_count} of {episode.verification.source_lesson_count} notes
              </Text>
            </div>
          </section>

          <Card className="podcast-episode__player" aria-label="Podcast player">
            <div className="podcast-episode__now-playing">
              <div className="podcast-episode__audio-icon"><SoundOutlined /></div>
              <div>
                <Text type="secondary">Now playing</Text>
                <Title level={3}>{currentChapter?.title || "Audio not rendered yet"}</Title>
              </div>
            </div>

            {episode.status === "ready" && currentSegment ? (
              <audio
                ref={audioRef}
                key={currentSegment.id}
                className="podcast-episode__audio"
                controls
                preload="metadata"
                crossOrigin="use-credentials"
                src={podcastAudioUrl(currentSegment.audio_url)}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onPause={() => persistProgress(positionMs)}
                onEnded={handleEnded}
              >
                Your browser does not support the audio element.
              </audio>
            ) : (
              <Empty
                image={<PlayCircleOutlined className="podcast-episode__empty-icon" />}
                description="This official episode is not available for playback yet."
              />
            )}
            <div className="podcast-episode__overall-progress">
              <Text>{formatPodcastDuration(positionMs)}</Text>
              <Progress
                percent={progressPercent}
                showInfo={false}
                aria-label={`Overall episode progress ${progressPercent}%`}
              />
              <Text>{formatPodcastDuration(episode.duration_ms)}</Text>
            </div>
          </Card>

          <Tabs
            size="large"
            items={[
              {
                key: "chapters",
                label: "Chapters",
                children: (
                  <div className="podcast-episode__content-grid">
                    <Card title="Episode chapters">
                      <Timeline
                        items={episode.spoken_outline.map((chapter, index) => ({
                          color: chapter.id === currentChapter?.id ? "blue" : "gray",
                          children: (
                            <button
                              type="button"
                              className="podcast-episode__chapter-button"
                              disabled={episode.status !== "ready"}
                              onClick={() => selectChapter(chapter)}
                            >
                              <span>{String(index + 1).padStart(2, "0")}</span>
                              <span>
                                <strong>{chapter.title}</strong>
                                <small>
                                  {formatPodcastDuration(chapter.start_ms)} · {chapter.source_notes.length} source notes
                                </small>
                              </span>
                            </button>
                          ),
                        }))}
                      />
                    </Card>
                    <Card title="Verification checks">
                      <ul className="podcast-episode__check-list">
                        {episode.verification.checks.map((check) => (
                          <li key={check}><CheckCircleOutlined /> {check}</li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                ),
              },
              {
                key: "transcript",
                label: "Transcript & sources",
                children: (
                  <Collapse
                    defaultActiveKey={episode.spoken_outline[0]?.id ? [episode.spoken_outline[0].id] : []}
                    items={episode.spoken_outline.map((chapter, index) => ({
                      key: chapter.id,
                      label: `${index + 1}. ${chapter.title}`,
                      children: (
                        <article className="podcast-episode__transcript">
                          <Paragraph>{chapter.script}</Paragraph>
                          <Text strong>Source notes</Text>
                          <div className="podcast-episode__source-links">
                            {chapter.source_notes.map((source) => (
                              <Link
                                key={source.lesson_id}
                                to={`/courses/community/${episode.course_id}?module=${encodeURIComponent(source.module_id)}#${encodeURIComponent(source.lesson_id)}`}
                              >
                                <LinkOutlined /> {source.lesson_title}
                              </Link>
                            ))}
                          </div>
                        </article>
                      ),
                    }))}
                  />
                ),
              },
            ]}
          />
        </>
      ) : null}

    </AppPageShell>
  );
}
