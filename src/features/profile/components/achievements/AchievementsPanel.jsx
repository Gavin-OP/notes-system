import { useMemo } from "react";
import { Col, Row } from "antd";

import AchievementsViewAllModal from "./AchievementsViewAllModal";
import TrophyBadge from "./TrophyBadge";
import {
  buildAchievementCatalog,
  buildBestStreakTrophy,
  mergeAchievementCatalog,
} from "./achievementCatalog";

import "./AchievementsPanel.css";

function normalizeDate(rawValue) {
  if (!rawValue) return "";
  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function normalizeAchievements(profile = {}) {
  const rawAchievements = profile.achievements || profile.Achievements || [];
  if (!Array.isArray(rawAchievements)) return [];
  return rawAchievements
    .filter((item) => {
      const id = item.achievement_id || item.achievementId || "";
      const category = item.category || "";
      return id !== "streak_max" && category !== "streak";
    })
    .map((item, index) => ({
      id: item.achievement_id || item.achievementId || `achievement-${index + 1}`,
      category: item.category || "general",
      title: item.title || "Achievement unlocked",
      description: "",
      iconKey: item.icon_key || item.iconKey || "trophy",
      value: item.value ?? null,
      earnedAt: normalizeDate(item.earned_at || item.earnedAt),
      isUnlocked: item.is_unlocked ?? item.isUnlocked ?? true,
    }));
}

function AchievementsPanel({
  achievements = [],
  overview = {},
  subjects = [],
  viewAllOpen = false,
  onViewAllClose,
}) {

  const bestStreakTrophy = useMemo(() => buildBestStreakTrophy(overview), [overview]);
  const allTrophies = useMemo(() => {
    const catalog = buildAchievementCatalog(subjects);
    return mergeAchievementCatalog(catalog, achievements, overview);
  }, [achievements, overview, subjects]);

  const unlockedRegularTrophies = useMemo(
    () =>
      allTrophies.filter(
        (item) =>
          item.isUnlocked &&
          item.id !== "overview-best-streak" &&
          item.id !== "streak_max" &&
          item.category !== "streak",
      ),
    [allTrophies],
  );

  return (
    <div className="achievements-panel">
      <div className="achievements-panel__best-streak">
        <TrophyBadge title={bestStreakTrophy.title} value={bestStreakTrophy.value} />
      </div>

      {unlockedRegularTrophies.length > 0 ? (
        <Row gutter={[12, 12]} align="stretch">
          {unlockedRegularTrophies.map((item) => (
            <Col key={item.id} xs={12} sm={8} md={6}>
              <TrophyBadge title={item.title} value={item.value} locked={!item.isUnlocked} />
            </Col>
          ))}
        </Row>
      ) : null}

      <AchievementsViewAllModal
        open={viewAllOpen}
        onClose={onViewAllClose}
        trophies={allTrophies}
      />
    </div>
  );
}

export default AchievementsPanel;
