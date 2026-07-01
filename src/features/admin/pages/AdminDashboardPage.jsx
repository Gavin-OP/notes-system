import { useCallback } from "react";
import { Card, Col, Row, Space, Statistic, Typography } from "antd";
import {
  ApartmentOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  PartitionOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { getAdminOverview } from "../api";
import { AdminPageHeader, AdminPageSkeleton, AdminPageState, AdminStatusTag } from "../components/AdminShared";
import useAdminResource from "../hooks/useAdminResource";
import { formatAdminDate, formatBooleanStatus } from "../utils/formatters";

const metricItems = [
  { key: "subjects", title: "Subjects", icon: <DatabaseOutlined /> },
  { key: "notes", title: "Notes", icon: <FileTextOutlined /> },
  { key: "concepts", title: "Concepts", icon: <ApartmentOutlined /> },
  { key: "graph", title: "Graphs", icon: <PartitionOutlined /> },
  { key: "rag", title: "RAG", icon: <SearchOutlined /> },
  { key: "system", title: "System", icon: <SafetyCertificateOutlined /> },
];

export default function AdminDashboardPage() {
  const loader = useCallback(() => getAdminOverview(), []);
  const { loading, error, data } = useAdminResource(loader);

  if (loading) return <AdminPageSkeleton rows={4} />;
  if (error || !data) {
    return <AdminPageState title="Failed to load dashboard" description={error || "No data returned."} error />;
  }

  const metricValues = {
    subjects: data.content.subjects_count,
    notes: data.content.notes_count,
    concepts: data.content.concepts_count,
    graph: data.graph.graph_count,
    rag: data.rag.snapshot_count,
    system: data.system.health_status,
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }} className="admin-page">
      <AdminPageHeader
        eyebrow="Admin Overview"
        title="Dashboard"
        description="Review content volume, graph generation, RAG snapshots, and core system health in one place."
      />

      <Row gutter={[16, 16]}>
        {metricItems.map((item) => (
          <Col xs={24} sm={12} xl={8} key={item.key}>
            <Card className="admin-surface-card admin-stat-card">
              <Statistic
                title={
                  <Space>
                    {item.icon}
                    <span>{item.title}</span>
                  </Space>
                }
                value={metricValues[item.key]}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Content Overview" className="admin-surface-card">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <AdminDetail label="Missing JSON notes" value={String(data.content.missing_note_json_count)} />
              <AdminDetail label="Missing Markdown notes" value={String(data.content.missing_note_md_count)} />
              <AdminDetail label="Indexed subjects" value={String(data.rag.indexed_subject_count)} />
              <AdminDetail
                label="Latest snapshot"
                value={formatAdminDate(data.rag.latest_snapshot_updated_at)}
              />
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="System Overview" className="admin-surface-card">
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <AdminStatus label="Health status" ok={data.system.health_status === "healthy"}>
                {data.system.health_status}
              </AdminStatus>
              <AdminStatus label="Database connection" ok={data.system.database_connected}>
                {formatBooleanStatus(data.system.database_connected)}
              </AdminStatus>
              <AdminStatus label="Admin UI build" ok={data.system.admin_ui_built}>
                {formatBooleanStatus(data.system.admin_ui_built)}
              </AdminStatus>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

function AdminDetail({ label, value }) {
  return (
    <div className="admin-detail-row">
      <Typography.Text type="secondary">{label}</Typography.Text>
      <Typography.Text>{value}</Typography.Text>
    </div>
  );
}

function AdminStatus({ label, ok, children }) {
  return (
    <div className="admin-detail-row">
      <Typography.Text type="secondary">{label}</Typography.Text>
      <AdminStatusTag ok={ok}>{children}</AdminStatusTag>
    </div>
  );
}
