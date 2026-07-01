import { useCallback } from "react";
import { Card, Descriptions, List, Space, Typography } from "antd";

import { getAdminSystemStatus } from "../api";
import {
  AdminPageHeader,
  AdminPageSkeleton,
  AdminPageState,
  AdminStatusTag,
} from "../components/AdminShared";
import useAdminResource from "../hooks/useAdminResource";
import { formatAdminDate } from "../utils/formatters";

export default function AdminSystemStatusPage() {
  const loader = useCallback(() => getAdminSystemStatus(), []);
  const { loading, error, data } = useAdminResource(loader);

  if (loading) return <AdminPageSkeleton rows={5} />;
  if (error || !data) {
    return <AdminPageState title="Failed to load system status" description={error || "No data returned."} error />;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }} className="admin-page">
      <AdminPageHeader
        eyebrow="Admin System"
        title="System Status"
        description="Inspect service health, database checks, key directories, and admin UI readiness."
      />

      <Card title="Core Status" className="admin-surface-card">
        <Descriptions column={{ xs: 1, md: 3 }} bordered>
          <Descriptions.Item label="Health">
            <AdminStatusTag ok={data.health.ok}>{data.health.label}</AdminStatusTag>
            {data.health.detail ? <div>{data.health.detail}</div> : null}
          </Descriptions.Item>
          <Descriptions.Item label="Database">
            <AdminStatusTag ok={data.database.ok}>{data.database.label}</AdminStatusTag>
            {data.database.detail ? <div>{data.database.detail}</div> : null}
          </Descriptions.Item>
          <Descriptions.Item label="Admin UI">
            <AdminStatusTag ok={data.admin_ui.ok}>{data.admin_ui.label}</AdminStatusTag>
            {data.admin_ui.detail ? <div>{data.admin_ui.detail}</div> : null}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Environment" className="admin-surface-card">
        <Descriptions column={{ xs: 1, md: 2 }} bordered>
          <Descriptions.Item label="App Name">{data.environment.app_name}</Descriptions.Item>
          <Descriptions.Item label="Environment">{data.environment.app_env}</Descriptions.Item>
          <Descriptions.Item label="API Prefix">{data.environment.api_prefix}</Descriptions.Item>
          <Descriptions.Item label="Repo Root">{data.environment.repo_root}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Graphs and RAG" className="admin-surface-card">
        <Descriptions column={{ xs: 1, md: 2 }} bordered>
          <Descriptions.Item label="Graph files">{data.graph.graph_count}</Descriptions.Item>
          <Descriptions.Item label="Latest graph update">
            {formatAdminDate(data.graph.latest_graph_updated_at)}
          </Descriptions.Item>
          <Descriptions.Item label="RAG snapshots">{data.rag.snapshot_count}</Descriptions.Item>
          <Descriptions.Item label="Indexed subjects">
            {data.rag.indexed_subject_count}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Key Directories" className="admin-surface-card">
        <List
          dataSource={data.directories}
          renderItem={(directory) => (
            <List.Item>
              <Space
                direction="vertical"
                size={2}
                style={{ width: "100%", justifyContent: "space-between" }}
              >
                <Space style={{ width: "100%", justifyContent: "space-between" }}>
                  <Typography.Text strong>{directory.name}</Typography.Text>
                  <AdminStatusTag ok={directory.exists}>
                    {directory.exists ? "Available" : "Missing"}
                  </AdminStatusTag>
                </Space>
                <Typography.Text type="secondary">{directory.path}</Typography.Text>
                <Typography.Text type="secondary">
                  Updated: {formatAdminDate(directory.updated_at)}
                </Typography.Text>
              </Space>
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}
