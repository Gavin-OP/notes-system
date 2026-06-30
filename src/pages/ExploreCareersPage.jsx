import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Empty, Input, Row, Space, Spin, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import AppPageShell from "../common/layouts/AppPageShell";
import { getCareerTaxonomy } from "../common/api/careers";
import SemanticChip from "../common/components/SemanticChip";
import {
  formatCareerRoleLabel,
  formatExperienceLevel,
  getExperienceLevelTagColor,
} from "../common/utils/careerDisplayUtils";
import { getSkillChipVariant, getToolChipVariant } from "../common/utils/semanticChipUtils";
import useTranslatedContent from "../i18n/useTranslatedContent";
import useTranslation from "../i18n/useTranslation";

const { Paragraph, Text } = Typography;

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

  const careerDescriptionPayload = useMemo(
    () =>
      JSON.stringify(
        profiles.map((profile) => ({
          jobId: profile.jobId || profile.title,
          description: profile.description || "",
        })),
      ),
    [profiles],
  );
  const translatedCareerDescriptionPayload = useTranslatedContent(careerDescriptionPayload, {
    sourceType: "career_description_list",
    sourceId: "career-taxonomy-descriptions",
    disabled: profiles.length === 0,
  });
  const translatedDescriptionsByJobId = useMemo(() => {
    try {
      const parsed = JSON.parse(translatedCareerDescriptionPayload.content || "[]");
      if (!Array.isArray(parsed)) return new Map();
      return new Map(
        parsed
          .map((item) => [item?.jobId, item?.description])
          .filter(([jobId, description]) => jobId && description),
      );
    } catch {
      return new Map();
    }
  }, [translatedCareerDescriptionPayload.content]);

  return (
    <AppPageShell
      backLabel={t("common.backToHome", "Back to Home")}
      onBack={() => navigate("/")}
      title={t("career.explore.title")}
      subtitle={t("career.explore.subtitle")}
      showSiteFooter
    >
      <div className="app-page-shell__toolbar">
        <Input
          allowClear
          size="large"
          prefix={<SearchOutlined />}
          placeholder={t("career.explore.searchPlaceholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {loading ? (
        <div className="app-page-shell__state">
          <Spin tip={t("career.explore.loading")} />
        </div>
      ) : null}

      {!loading && errorText ? <Alert type="error" showIcon message={errorText} /> : null}

      {!loading && !errorText ? (
        filteredProfiles.length > 0 ? (
          <Row gutter={[16, 16]}>
            {filteredProfiles.map((profile) => (
              <Col key={profile.jobId || profile.title} xs={24} md={12} xl={8}>
                <Card
                  hoverable
                  className="app-catalog-card"
                  onClick={() => navigate(`/careers/${encodeURIComponent(profile.jobId)}`)}
                >
                  <Space direction="vertical" size={10} className="app-catalog-card__body">
                    <div className="app-catalog-card__head">
                      <Text strong className="app-catalog-card__title">
                        {profile.title}
                      </Text>
                      <SemanticChip variant={profile.experienceLevelColor}>
                        {profile.experienceLevel}
                      </SemanticChip>
                    </div>
                    <Paragraph
                      type="secondary"
                      ellipsis={{ rows: 3 }}
                      className="app-catalog-card__description"
                    >
                      {translatedDescriptionsByJobId.get(profile.jobId || profile.title) ||
                        profile.description ||
                        t("career.explore.descriptionFallback")}
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
                    <Button
                      type="primary"
                      ghost
                      block
                      className="app-catalog-card__cta-btn"
                      tabIndex={-1}
                      onClick={(event) => event.stopPropagation()}
                    >
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
    </AppPageShell>
  );
}

export default ExploreCareersPage;
