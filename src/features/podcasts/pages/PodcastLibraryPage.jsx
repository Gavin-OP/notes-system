import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Progress,
  Select,
  Skeleton,
  Space,
  Typography,
} from "antd";
import {
  AudioOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import SemanticChip from "../../../shared/ui/SemanticChip";
import {
  listCommunityCourses,
  listCourses,
} from "../../goals/api/learningPlatform";
import { createPodcast, listPodcasts } from "../api/podcasts";
import {
  dedupePodcastCourses,
  formatPodcastDuration,
  podcastProgress,
} from "../lib/podcastUtils";

import "./PodcastPages.css";

const { Paragraph, Text, Title } = Typography;

function EpisodeCard({ episode, onOpen }) {
  const progress = podcastProgress(episode);
  return (
    <Card className="podcast-library__episode">
      <div className="podcast-library__episode-top">
        <SemanticChip variant="primary">{episode.domain_title}</SemanticChip>
        <SemanticChip
          variant={episode.status === "ready" ? "sage" : episode.status === "failed" ? "amber" : "slate"}
        >
          {episode.status}
        </SemanticChip>
      </div>
      <Title level={3}>{episode.title}</Title>
      <Paragraph type="secondary">{episode.description}</Paragraph>
      <Space wrap className="podcast-library__meta">
        <span><FileTextOutlined /> Version {episode.course_version_number}</span>
        <span><ClockCircleOutlined /> {formatPodcastDuration(episode.duration_ms)}</span>
        <span>{episode.spoken_outline.length} chapters</span>
      </Space>
      <Progress
        percent={progress}
        size="small"
        aria-label={`Listening progress ${progress}%`}
      />
      <Button type="primary" onClick={() => onOpen(episode.id)}>
        {episode.playback?.position_ms ? "Continue listening" : "Open episode"}
      </Button>
    </Card>
  );
}

export default function PodcastLibraryPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [episodes, setEpisodes] = useState([]);
  const [courses, setCourses] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorText("");
    try {
      const [episodePayload, authoredPayload, communityPayload] = await Promise.all([
        listPodcasts(),
        listCourses({ mine: true }),
        listCommunityCourses(),
      ]);
      const nextCourses = dedupePodcastCourses(
        Array.isArray(authoredPayload) ? authoredPayload : [],
        Array.isArray(communityPayload) ? communityPayload : [],
      ).filter((course) => course.current_version_id);
      setEpisodes(Array.isArray(episodePayload) ? episodePayload : []);
      setCourses(nextCourses);
      const requestedCourse = searchParams.get("course");
      if (requestedCourse && nextCourses.some((course) => course.id === requestedCourse)) {
        form.setFieldsValue({
          course_id: requestedCourse,
          detail_level: "focused",
          language: "en",
        });
        setCreateOpen(true);
      }
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not load your podcasts.");
    } finally {
      setLoading(false);
    }
  }, [form, searchParams]);

  useEffect(() => {
    load();
  }, [load]);

  const courseOptions = useMemo(
    () => courses.map((course) => ({
      value: course.id,
      label: `${course.title} · ${course.domain_title}`,
    })),
    [courses],
  );

  const openCreate = () => {
    form.setFieldsValue({
      course_id: courses[0]?.id,
      title: "",
      detail_level: "focused",
      language: "en",
    });
    setCreateOpen(true);
  };

  const submitCreate = async (values) => {
    setCreating(true);
    try {
      const episode = await createPodcast({
        course_id: values.course_id,
        title: values.title?.trim() || null,
        detail_level: values.detail_level,
        language: values.language,
      });
      setCreateOpen(false);
      setSearchParams({});
      message.success("Podcast script and source verification created.");
      navigate(`/podcasts/${episode.id}`);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not create this podcast.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppPageShell
      title="Learning Podcasts"
      subtitle="Turn a fixed course version into a verified, source-linked audio learning experience."
      backLabel="Back to profile"
      onBack={() => navigate("/user/profile")}
      showSiteFooter
      contentWidth="wide"
      contentClassName="podcast-library"
    >
      <section className="podcast-library__hero">
        <div>
          <Text className="podcast-library__eyebrow">Phase 5 · Audio learning</Text>
          <Title level={1}>Listen without losing the structure.</Title>
          <Paragraph>
            Every episode is tied to one immutable course version. Review the script,
            chapters, and source-note coverage before rendering audio.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            disabled={!courses.length}
            onClick={openCreate}
          >
            Create a podcast
          </Button>
        </div>
        <div className="podcast-library__principle">
          <SafetyCertificateOutlined />
          <div>
            <Text strong>Verified before voice generation</Text>
            <Text type="secondary">
              The canonical layer stays unchanged and each chapter links back to its source notes.
            </Text>
          </div>
        </div>
      </section>

      {errorText ? (
        <Alert
          type="error"
          showIcon
          title="Podcast library unavailable"
          description={errorText}
          action={<Button onClick={load}>Retry</Button>}
        />
      ) : null}

      {loading ? <Card><Skeleton active paragraph={{ rows: 8 }} /></Card> : null}
      {!loading && !episodes.length ? (
        <Empty
          image={<AudioOutlined className="podcast-library__empty-icon" />}
          description="No podcast episodes yet."
        >
          <Button type="primary" disabled={!courses.length} onClick={openCreate}>
            Create your first episode
          </Button>
        </Empty>
      ) : null}
      {!loading && episodes.length ? (
        <section aria-labelledby="podcast-library-heading">
          <Title id="podcast-library-heading" level={2}>Your podcast library</Title>
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

      <Modal
        open={createOpen}
        title="Create a verified podcast script"
        footer={null}
        onCancel={() => {
          setCreateOpen(false);
          setSearchParams({});
        }}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{ detail_level: "focused", language: "en" }}
          onFinish={submitCreate}
        >
          <Form.Item
            label="Course version"
            name="course_id"
            rules={[{ required: true, message: "Choose a course to narrate." }]}
            extra="The current immutable course version becomes the podcast source."
          >
            <Select
              showSearch
              optionFilterProp="label"
              options={courseOptions}
              placeholder="Choose a course"
            />
          </Form.Item>
          <Form.Item
            label="Episode title"
            name="title"
            extra="Optional. A clear audio-edition title is generated when left blank."
          >
            <Input maxLength={255} />
          </Form.Item>
          <Form.Item label="Narration detail" name="detail_level">
            <Select
              options={[
                {
                  value: "focused",
                  label: "Focused — key explanations and connections",
                },
                {
                  value: "full",
                  label: "Full — more detail from each source note",
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Script language" name="language">
            <Select options={[{ value: "en", label: "English" }]} />
          </Form.Item>
          <Alert
            type="info"
            showIcon
            title="This step does not generate audio"
            description="You will review source coverage and the complete transcript before starting TTS."
          />
          <Button
            type="primary"
            htmlType="submit"
            loading={creating}
            icon={<FileTextOutlined />}
            block
          >
            Generate script and verify sources
          </Button>
        </Form>
      </Modal>
    </AppPageShell>
  );
}
