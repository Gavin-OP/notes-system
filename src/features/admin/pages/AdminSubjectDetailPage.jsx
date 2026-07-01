import { useCallback } from "react";
import { Card, Descriptions, Space, Table, Typography } from "antd";
import { Link, useParams } from "react-router-dom";

import { getAdminSubjectDetail } from "../api";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPageSkeleton,
  AdminPageState,
  AdminStatusTag,
} from "../components/AdminShared";
import useAdminResource from "../hooks/useAdminResource";
import { formatAdminDate, formatArtifactSummary } from "../utils/formatters";

export default function AdminSubjectDetailPage() {
  const { subjectSlug = "" } = useParams();
  const loader = useCallback(() => getAdminSubjectDetail(subjectSlug), [subjectSlug]);
  const { loading, error, data } = useAdminResource(loader);

  if (loading) return <AdminPageSkeleton rows={6} />;
  if (error || !data) {
    return <AdminPageState title="Failed to load subject detail" description={error || "No data returned."} error />;
  }

  const noteColumns = [
    {
      title: "Note",
      dataIndex: "title",
      key: "title",
      render: (_, note) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>
            {note.topic_order}. {note.title}
          </Typography.Text>
          <Typography.Text type="secondary">{note.note_slug}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "JSON",
      key: "content_json",
      render: (_, note) => (
        <AdminStatusTag ok={note.content_json.exists}>
          {formatArtifactSummary(note.content_json)}
        </AdminStatusTag>
      ),
    },
    {
      title: "Markdown",
      key: "content_md",
      render: (_, note) => (
        <AdminStatusTag ok={note.content_md.exists}>
          {formatArtifactSummary(note.content_md)}
        </AdminStatusTag>
      ),
    },
    {
      title: "Generated",
      key: "generated_at",
      render: (_, note) => formatAdminDate(note.generated_at),
    },
    {
      title: "Difficulty",
      key: "difficulty",
      render: (_, note) => note.difficulty || "-",
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }} className="admin-page">
      <AdminPageHeader
        title={data.subject.title}
        eyebrow="Subject Detail"
        description={`Subject slug: ${data.subject.subject_slug}`}
        extra={<Link to="/admin/content">Back to content</Link>}
      />

      <Card title="Subject Overview" className="admin-surface-card">
        <Descriptions column={{ xs: 1, md: 2, xl: 3 }} bordered>
          <Descriptions.Item label="Stable ID">{data.subject.stable_id}</Descriptions.Item>
          <Descriptions.Item label="Notes">{data.subject.note_count}</Descriptions.Item>
          <Descriptions.Item label="Concepts">{data.subject.concept_count}</Descriptions.Item>
          <Descriptions.Item label="Latest note update">
            {formatAdminDate(data.subject.latest_note_updated_at)}
          </Descriptions.Item>
          <Descriptions.Item label="Missing JSON">
            {data.subject.missing_note_json_count}
          </Descriptions.Item>
          <Descriptions.Item label="Missing Markdown">
            {data.subject.missing_note_md_count}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Artifact Status" className="admin-surface-card">
        <Descriptions column={{ xs: 1, md: 2 }} bordered>
          <Descriptions.Item label="Outline">
            <AdminStatusTag ok={data.subject.outline.exists}>
              {formatArtifactSummary(data.subject.outline)}
            </AdminStatusTag>
          </Descriptions.Item>
          <Descriptions.Item label="Concept Library">
            <AdminStatusTag ok={data.subject.concept_library.exists}>
              {formatArtifactSummary(data.subject.concept_library)}
            </AdminStatusTag>
          </Descriptions.Item>
          <Descriptions.Item label="Graph">
            <AdminStatusTag ok={data.subject.graph.exists}>
              {data.subject.graph.exists
                ? `${data.subject.graph.node_count ?? "-"} nodes / ${data.subject.graph.edge_count ?? "-"} edges`
                : "Missing"}
            </AdminStatusTag>
          </Descriptions.Item>
          <Descriptions.Item label="Latest RAG Snapshot">
            <AdminStatusTag ok={data.subject.rag.latest_snapshot.exists}>
              {formatArtifactSummary(data.subject.rag.latest_snapshot)}
            </AdminStatusTag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {data.notes.length === 0 ? (
        <AdminEmptyState description="No notes are available for this subject yet." />
      ) : (
        <Card title="Notes" className="admin-surface-card">
          <Table
            rowKey="note_slug"
            columns={noteColumns}
            dataSource={data.notes}
            pagination={false}
            scroll={{ x: 960 }}
          />
        </Card>
      )}
    </Space>
  );
}
