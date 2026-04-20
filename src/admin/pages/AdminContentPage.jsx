import { useCallback, useMemo } from "react";
import { Card, Space, Table, Typography } from "antd";
import { Link } from "react-router-dom";

import { getAdminSubjects } from "../api";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminPageSkeleton,
  AdminPageState,
  AdminStatusTag,
} from "../components/AdminShared";
import useAdminResource from "../hooks/useAdminResource";
import { formatAdminDate, formatArtifactSummary } from "../utils/formatters";

export default function AdminContentPage() {
  const loader = useCallback(() => getAdminSubjects(), []);
  const { loading, error, data } = useAdminResource(loader);

  const columns = useMemo(
    () => [
      {
        title: "Subject",
        dataIndex: "title",
        key: "title",
        render: (_, subject) => (
          <Space direction="vertical" size={0}>
            <Typography.Text strong>{subject.title}</Typography.Text>
            <Typography.Text type="secondary">{subject.subject_slug}</Typography.Text>
          </Space>
        ),
      },
      {
        title: "Notes",
        dataIndex: "note_count",
        key: "note_count",
      },
      {
        title: "Concepts",
        dataIndex: "concept_count",
        key: "concept_count",
      },
      {
        title: "Outline",
        key: "outline",
        render: (_, subject) => (
          <AdminStatusTag ok={subject.outline.exists}>
            {formatArtifactSummary(subject.outline)}
          </AdminStatusTag>
        ),
      },
      {
        title: "Graph",
        key: "graph",
        render: (_, subject) => (
          <Space direction="vertical" size={0}>
            <AdminStatusTag ok={subject.graph.exists}>
              {subject.graph.exists
                ? `${subject.graph.node_count ?? "-"} nodes / ${subject.graph.edge_count ?? "-"} edges`
                : "Missing"}
            </AdminStatusTag>
            <Typography.Text type="secondary">
              {formatAdminDate(subject.graph.updated_at)}
            </Typography.Text>
          </Space>
        ),
      },
      {
        title: "RAG",
        key: "rag",
        render: (_, subject) => (
          <Typography.Text>
            {subject.rag.snapshot_count} snapshots / {subject.rag.index_paths.length} indexes
          </Typography.Text>
        ),
      },
      {
        title: "Action",
        key: "actions",
        align: "right",
        render: (_, subject) => <Link to={`/admin/content/${subject.subject_slug}`}>View details</Link>,
      },
    ],
    [],
  );

  if (loading) return <AdminPageSkeleton rows={5} />;
  if (error || !data) {
    return <AdminPageState title="Failed to load content" description={error || "No data returned."} error />;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }} className="admin-page">
      <AdminPageHeader
        eyebrow="Admin Content"
        title="Content"
        description="Browse subject-level coverage for outlines, notes, graphs, and RAG assets."
      />
      {data.subjects.length === 0 ? (
        <AdminEmptyState description="No subject data is available yet." />
      ) : (
        <Card className="admin-surface-card">
          <Table
            rowKey="subject_slug"
            columns={columns}
            dataSource={data.subjects}
            pagination={false}
            scroll={{ x: 960 }}
          />
        </Card>
      )}
    </Space>
  );
}
