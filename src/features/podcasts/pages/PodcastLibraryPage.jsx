import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Empty,
  Progress,
  Skeleton,
  Space,
  Typography,
} from "antd";
import {
  AudioOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import SemanticChip from "../../../shared/ui/SemanticChip";
import { listPodcasts } from "../api/podcasts";
import { formatPodcastDuration, podcastProgress } from "../lib/podcastUtils";

import "./PodcastPages.css";

const { Paragraph, Text, Title } = Typography;

function EpisodeCard({ episode, onOpen }) {
  const progress = podcastProgress(episode);
  return (
    <Card className="podcast-library__episode">
      <div className="podcast-library__episode-top">
        <SemanticChip variant="primary">{episode.domain_title}</SemanticChip>
        <SemanticChip variant="sage">Official</SemanticChip>
      </div>
      <Title level={3}>{episode.title}</Title>
      <Paragraph type="secondary">{episode.description}</Paragraph>
      <Space wrap className="podcast-library__meta">
        <span><FileTextOutlined /> Course version {episode.course_version_number}</span>
        <span><ClockCircleOutlined /> {formatPodcastDuration(episode.duration_ms)}</span>
        <span>{episode.spoken_outline.length} chapters</span>
      </Space>
      <Progress percent={progress} size="small" aria-label={`Listening progress ${progress}%`} />
      <Button type="primary" onClick={() => onOpen(episode.id)}>
        {episode.playback?.position_ms ? "Continue listening" : "Listen now"}
      </Button>
    </Card>
  );
}

export default function PodcastLibraryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [episodes, setEpisodes] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorText("");
    try {
      const payload = await listPodcasts();
      setEpisodes(Array.isArray(payload) ? payload : []);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not load official podcasts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <AppPageShell
      title="Official Podcasts"
      subtitle="Curated audio learning from Notes System. Listen, follow the chapters, and return to the source notes at any time."
      backLabel="Back to Home"
      onBack={() => navigate("/")}
      showSiteFooter
      contentWidth="wide"
      contentClassName="podcast-library"
    >
      <section className="podcast-library__hero">
        <div>
          <Text className="podcast-library__eyebrow">Official audio learning</Text>
          <Title level={1}>Listen without losing the structure.</Title>
          <Paragraph>
            Notes System creates and verifies every published episode. Podcasts connect multiple
            notes into a guided explanation; personal and community-authored notes are not converted
            into podcasts at this stage.
          </Paragraph>
        </div>
        <div className="podcast-library__principle">
          <SafetyCertificateOutlined />
          <div>
            <Text strong>Curated and source-linked</Text>
            <Text type="secondary">
              Every chapter is tied to a fixed official course version and links back to its notes.
            </Text>
          </div>
        </div>
      </section>

      {errorText ? (
        <Alert
          type="error"
          showIcon
          title="Official podcasts unavailable"
          description={errorText}
          action={<Button onClick={load}>Retry</Button>}
        />
      ) : null}
      {loading ? <Card><Skeleton active paragraph={{ rows: 8 }} /></Card> : null}
      {!loading && !episodes.length ? (
        <Empty
          image={<AudioOutlined className="podcast-library__empty-icon" />}
          description="The first official podcast series is being prepared."
        >
          <Button onClick={() => navigate("/subjects")}>Explore notes while you wait</Button>
        </Empty>
      ) : null}
      {!loading && episodes.length ? (
        <section aria-labelledby="podcast-library-heading">
          <Title id="podcast-library-heading" level={2}>Published episodes</Title>
          <div className="podcast-library__grid">
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                onOpen={(episodeId) => navigate(`/podcasts/${episodeId}`)}
              />
            ))}
          </div>
        </section>
      ) : null}
    </AppPageShell>
  );
}
