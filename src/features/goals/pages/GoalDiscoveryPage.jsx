import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Typography } from "antd";
import {
  AimOutlined,
  CompassOutlined,
  ExperimentOutlined,
  FlagOutlined,
  HighlightOutlined,
  ProjectOutlined,
  RocketOutlined,
  TrophyOutlined,
} from "@ant-design/icons";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import SemanticChip from "../../../shared/ui/SemanticChip";
import LearningPlatformWorkspace from "../components/LearningPlatformWorkspace";
import { GOAL_TYPE_CONFIG } from "../lib/goalMetadata";

import "./GoalDiscoveryPage.css";

const { Paragraph, Text } = Typography;

const GOAL_ICONS = {
  career: RocketOutlined,
  certification: TrophyOutlined,
  project: ProjectOutlined,
  adventure: CompassOutlined,
  creative: HighlightOutlined,
  performance: FlagOutlined,
  mastery: AimOutlined,
  exploration: ExperimentOutlined,
};

function GoalDiscoveryPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState("");

  return (
    <AppPageShell
      backLabel="Back to Home"
      onBack={() => navigate("/")}
      title="Goal Discovery"
      subtitle="Start with what you want to achieve. Then choose the course perspective that fits you and generate a learning path around both."
      showSiteFooter
      contentClassName="goal-discovery-page"
    >
      <section aria-labelledby="goal-types-title" className="goal-discovery-page__types">
        <div className="goal-discovery-page__section-head">
          <div>
            <Text className="goal-workspace__eyebrow">Why are you learning?</Text>
            <h2 id="goal-types-title">Choose a direction, not a label</h2>
          </div>
          <Paragraph type="secondary">
            Python can be a career goal or a personal project. Guitar can be creative, social, or professional.
          </Paragraph>
        </div>
        <Row gutter={[16, 16]}>
          {GOAL_TYPE_CONFIG.map((item) => {
            const Icon = GOAL_ICONS[item.type] || AimOutlined;
            const selected = item.type === selectedType;
            return (
              <Col key={item.type} xs={24} sm={12} lg={6}>
                <Card
                  role="button"
                  tabIndex={0}
                  className={`goal-discovery-page__type-card ${selected ? "is-selected" : ""}`}
                  onClick={() => setSelectedType(selected ? "" : item.type)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedType(selected ? "" : item.type);
                    }
                  }}
                  aria-pressed={selected}
                >
                  <span className="goal-discovery-page__type-icon" aria-hidden="true"><Icon /></span>
                  <div className="goal-discovery-page__type-title-row">
                    <strong>{item.label}</strong>
                    <SemanticChip variant={item.variant}>{item.type}</SemanticChip>
                  </div>
                  <Paragraph>{item.description}</Paragraph>
                  <Text type="secondary">Example · {item.example}</Text>
                </Card>
              </Col>
            );
          })}
        </Row>
      </section>

      <section aria-labelledby="path-builder-title" className="goal-discovery-page__builder">
        <div className="goal-discovery-page__builder-heading">
          <Text className="goal-workspace__eyebrow">Build your route</Text>
          <h2 id="path-builder-title">Connect a Goal with a Course</h2>
        </div>
        <LearningPlatformWorkspace mode="builder" preferredGoalType={selectedType} />
      </section>
    </AppPageShell>
  );
}

export default GoalDiscoveryPage;
