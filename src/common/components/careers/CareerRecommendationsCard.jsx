import { Alert, Empty, List, Space, Tag, Typography } from "antd";
import { AimOutlined } from "@ant-design/icons";

const { Text } = Typography;

function formatScore(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.round(numeric) : 0;
}

function CareerRecommendationsCard({
  recommendations = [],
  loading = false,
  errorText = "",
  selectedTitle = "",
  minimumScore = 20,
  onSelect,
}) {
  if (errorText) {
    return <Alert type="warning" showIcon message="Career recommendations unavailable" description={errorText} />;
  }

  return (
    <List
      className="career-recommendations-list"
      loading={loading}
      dataSource={recommendations}
      header={
        recommendations.length ? (
          <Text type="secondary">
            Showing {recommendations.length} roles with at least {minimumScore}% match.
          </Text>
        ) : null
      }
      locale={{ emptyText: <Empty description="No career matches yet." /> }}
      renderItem={(item) => {
        const matchScore = formatScore(item.match_score ?? item.matchScore);
        return (
          <List.Item
            className={`career-recommendation-card ${selectedTitle === item.title ? "is-active" : ""}`}
            onClick={() => onSelect?.(item.title)}
          >
            <Space className="career-recommendation-card__body">
              <div className="career-recommendation-card__header">
                <Space>
                  <AimOutlined />
                  <Text strong>{item.title}</Text>
                </Space>
                <Tag color={matchScore >= 70 ? "green" : matchScore >= 45 ? "blue" : "orange"}>
                  {matchScore}% match
                </Tag>
              </div>
            </Space>
          </List.Item>
        );
      }}
    />
  );
}

export default CareerRecommendationsCard;
