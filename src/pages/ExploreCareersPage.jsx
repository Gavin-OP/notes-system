import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Empty, Input, Row, Space, Spin, Typography } from "antd";
import { SearchOutlined, UpOutlined } from "@ant-design/icons";

import { getCareerTaxonomy } from "../common/api/careers";
import SemanticChip from "../common/components/SemanticChip";
import {
  formatCareerRoleLabel,
  formatExperienceLevel,
  getExperienceLevelTagColor,
} from "../common/utils/careerDisplayUtils";
import { getSkillChipVariant, getToolChipVariant } from "../common/utils/semanticChipUtils";
import useTranslation from "../i18n/useTranslation";

import "./ExploreCareersPage.css";

const { Paragraph, Text, Title } = Typography;

function normalizeProfiles(payload) {
  const profiles = payload?.profiles || [];
  if (!Array.isArray(profiles)) return [];
  return profiles.map((profile) => {
    const rawExperienceLevel = profile.experience_level || profile.experienceLevel || "unspecified";
    const title = profile.title || "Untitled role";
    return {
      jobId: profile.job_id || profile.jobId || "",
      title,
      roleLabel: formatCareerRoleLabel(title, rawExperienceLevel),
      description: profile.description || "",
      responsibilities: profile.responsibilities || [],
      hardSkills: profile.hard_skills || profile.hardSkills || [],
      softSkills: profile.soft_skills || profile.softSkills || [],
      tools: profile.tools || [],
      rawExperienceLevel,
      experienceLevel: formatExperienceLevel(rawExperienceLevel),
      experienceLevelColor: getExperienceLevelTagColor(rawExperienceLevel),
    };
  });
}

function ExploreCareersPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadCareers() {
      setLoading(true);
      setErrorText("");
      try {
        const payload = await getCareerTaxonomy();
        if (!mounted) return;
        setProfiles(normalizeProfiles(payload));
      } catch (error) {
        if (!mounted) return;
        setErrorText(error instanceof Error ? error.message : "Failed to load careers.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCareers();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return profiles;
    return profiles.filter((profile) => {
      const haystack = [
        profile.title,
        profile.roleLabel,
        profile.description,
        profile.experienceLevel,
        ...profile.hardSkills,
        ...profile.tools,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [profiles, query]);

  return (
    <div className="explore-careers-page">
      <div className="explore-careers-page__container">
        <button
          type="button"
          className="ns-career-nav-link explore-careers-page__back-profile"
          onClick={() => navigate("/user/profile", { state: { dashboard: "career" } })}
        >
          <UpOutlined className="ns-career-nav-link__icon" aria-hidden="true" />
          <span className="ns-career-nav-link__label">{t("career.explore.backProfile")}</span>
        </button>

        <Space direction="vertical" size={16} className="explore-careers-page__header">
          <div>
            <Title level={2} className="explore-careers-page__title">
              {t("career.explore.title")}
            </Title>
            <Paragraph type="secondary" className="explore-careers-page__subtitle">
              {t("career.explore.subtitle")}
            </Paragraph>
          </div>
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder={t("career.explore.searchPlaceholder")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Space>

        {loading ? (
          <div className="explore-careers-page__state">
            <Spin tip={t("career.explore.loading")} />
          </div>
        ) : null}

        {!loading && errorText ? (
          <Alert type="error" showIcon message={errorText} />
        ) : null}

        {!loading && !errorText ? (
          filteredProfiles.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredProfiles.map((profile) => (
                <Col key={profile.jobId || profile.title} xs={24} md={12} xl={8}>
                  <Card
                    hoverable
                    className="explore-careers-page__card"
                    onClick={() => navigate(`/careers/${encodeURIComponent(profile.jobId)}`)}
                  >
                    <Space direction="vertical" size={10} className="explore-careers-page__card-body">
                      <div className="explore-careers-page__card-head">
                        <Text strong className="explore-careers-page__card-title">
                          {profile.title}
                        </Text>
                        <SemanticChip variant={profile.experienceLevelColor}>
                          {profile.experienceLevel}
                        </SemanticChip>
                      </div>
                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 3 }}
                        className="explore-careers-page__card-description"
                      >
                        {profile.description || t("career.explore.descriptionFallback")}
                      </Paragraph>
                      <Space wrap size={[6, 6]}>
                        {profile.hardSkills.slice(0, 4).map((skill) => (
                          <SemanticChip key={`${profile.jobId}-${skill}`} variant={getSkillChipVariant(skill)}>
                            {skill}
                          </SemanticChip>
                        ))}
                        {profile.tools.slice(0, 2).map((tool) => (
                          <SemanticChip key={`${profile.jobId}-tool-${tool}`} variant={getToolChipVariant()}>
                            {tool}
                          </SemanticChip>
                        ))}
                      </Space>
                      <Button type="primary" ghost block>
                        {t("profile.career.openFullRole")}
                      </Button>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description={t("career.explore.empty")} />
          )
        ) : null}
      </div>
    </div>
  );
}

export default ExploreCareersPage;
