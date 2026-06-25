import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Empty, Input, Row, Space, Spin, Tag, Typography } from "antd";
import { SearchOutlined, UpOutlined } from "@ant-design/icons";

import { getCareerTaxonomy } from "../common/api/careers";
import {
  formatCareerRoleLabel,
  formatExperienceLevel,
  getExperienceLevelTagColor,
} from "../common/utils/careerDisplayUtils";

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

  return (
    <div className="explore-careers-page">
      <div className="explore-careers-page__container">
        <button
          type="button"
          className="explore-careers-page__back-profile"
          onClick={() => navigate("/user/profile", { state: { dashboard: "career" } })}
        >
          <UpOutlined className="explore-careers-page__back-profile-arrow" aria-hidden="true" />
          <span className="explore-careers-page__back-profile-label">Back to Profile</span>
        </button>

        <Space direction="vertical" size={16} className="explore-careers-page__header">
          <div>
            <Title level={2} className="explore-careers-page__title">
              Explore Careers
            </Title>
            <Paragraph type="secondary" className="explore-careers-page__subtitle">
              Browse every role in our career library. Open a role to see responsibilities, skills, and related subjects.
            </Paragraph>
          </div>
          <Input
            allowClear
            size="large"
            prefix={<SearchOutlined />}
            placeholder="Search by title, skill, or tool"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Space>

        {loading ? (
          <div className="explore-careers-page__state">
            <Spin tip="Loading careers..." />
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
                        <Tag color={profile.experienceLevelColor}>{profile.experienceLevel}</Tag>
                      </div>
                      <Paragraph
                        type="secondary"
                        ellipsis={{ rows: 3 }}
                        className="explore-careers-page__card-description"
                      >
                        {profile.description || "Open this role to view the generated career summary."}
                      </Paragraph>
                      <Space wrap size={[6, 6]}>
                        {profile.hardSkills.slice(0, 4).map((skill) => (
                          <Tag key={`${profile.jobId}-${skill}`}>{skill}</Tag>
                        ))}
                        {profile.tools.slice(0, 2).map((tool) => (
                          <Tag key={`${profile.jobId}-tool-${tool}`} color="geekblue">
                            {tool}
                          </Tag>
                        ))}
                      </Space>
                      <Button type="primary" ghost block>
                        View role details
                      </Button>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="No careers matched your search." />
          )
        ) : null}
      </div>
    </div>
  );
}

export default ExploreCareersPage;
