import { Typography } from "antd";
import { TrophyOutlined } from "@ant-design/icons";

import "./TrophyBadge.css";

const { Text } = Typography;

function formatBadgeValue(value) {
  if (value == null || value === "") return "";
  if (typeof value === "number") return String(value);
  const text = String(value).trim();
  if (text.length <= 18) return text;
  return `${text.slice(0, 16)}…`;
}

function TrophyBadge({
  title,
  description = "",
  value,
  earnedAt = "",
  locked = false,
  showMeta = false,
  staticBadge = false,
}) {
  const badgeValue = formatBadgeValue(value);

  return (
    <article
      className={`trophy-badge ${locked ? "trophy-badge--locked" : ""} ${
        staticBadge ? "trophy-badge--static" : ""
      }`}
    >
      <div className="trophy-badge__icon-shell" aria-hidden="true">
        <TrophyOutlined className="trophy-badge__icon" />
        {badgeValue ? <span className="trophy-badge__value">{badgeValue}</span> : null}
      </div>
      <div className="trophy-badge__copy">
        <Text strong className="trophy-badge__title">
          {title}
        </Text>
        {showMeta && description ? (
          <Text type="secondary" className="trophy-badge__description">
            {description}
          </Text>
        ) : null}
        {showMeta && earnedAt ? (
          <Text type="secondary" className="trophy-badge__date">
            {earnedAt}
          </Text>
        ) : null}
      </div>
    </article>
  );
}

export default TrophyBadge;
