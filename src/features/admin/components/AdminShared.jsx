import { Alert, Card, Empty, Skeleton, Space, Tag, Typography } from "antd";

const { Paragraph, Text, Title } = Typography;

export function AdminPageHeader({ eyebrow = "Notes System", title, description, extra }) {
  return (
    <div className="admin-page-header">
      <div>
        <Text className="admin-page-header__eyebrow">{eyebrow}</Text>
        <Title level={2} className="admin-page-header__title">
          {title}
        </Title>
        {description ? (
          <Paragraph className="admin-page-header__description">{description}</Paragraph>
        ) : null}
      </div>
      {extra ? <div>{extra}</div> : null}
    </div>
  );
}

export function AdminPageState({ title, description, error = false, fullscreen = false }) {
  return (
    <div
      className={`admin-page-state${fullscreen ? " admin-page-state--fullscreen" : ""}`}
    >
      <Alert
        type={error ? "error" : "info"}
        message={title}
        description={description}
        showIcon
      />
    </div>
  );
}

export function AdminPageSkeleton({ rows = 3 }) {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card>
        <Skeleton active paragraph={{ rows }} />
      </Card>
    </Space>
  );
}

export function AdminEmptyState({ description = "No data available." }) {
  return (
    <Card>
      <Empty description={description} />
    </Card>
  );
}

export function AdminStatusTag({ ok, children }) {
  return (
    <Tag color={ok ? "success" : "error"} className="admin-status-tag">
      {children}
    </Tag>
  );
}
