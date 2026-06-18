import { Modal, Typography } from "antd";

import TrophyBadge from "./TrophyBadge";

import "./AchievementsViewAllModal.css";

const { Text } = Typography;

function AchievementsViewAllModal({ open, onClose, trophies = [] }) {
  const unlockedCount = trophies.filter((item) => item.isUnlocked).length;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={920}
      title="All Trophies"
      className="achievements-view-all-modal"
      destroyOnClose
      centered
    >
      <Text type="secondary" className="achievements-view-all-modal__summary">
        {unlockedCount} of {trophies.length} trophies unlocked
      </Text>
      <div className="achievements-view-all-modal__grid">
        {trophies.map((item) => (
          <div key={item.id} className="achievements-view-all-modal__cell">
            <TrophyBadge
              title={item.title}
              value={item.value}
              locked={!item.isUnlocked}
              staticBadge
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default AchievementsViewAllModal;
