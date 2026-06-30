import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  List,
  message,
  Row,
  Space,
  Spin,
  Typography,
} from "antd";
import { ArrowLeftOutlined, BookOutlined, NodeIndexOutlined } from "@ant-design/icons";

import { generateLearningPath } from "../common/api/assistant";
import { getCareerJobDetail } from "../common/api/careers";
import SemanticChip from "../common/components/SemanticChip";
import {
  formatCareerRoleLabel,
  formatExperienceLevel,
  getExperienceLevelTagColor,
  normalizeDegreeRequirements,
} from "../common/utils/careerDisplayUtils";
import {
  getKnowledgeAreaChipVariant,
  getSkillChipVariant,
  getSoftSkillChipVariant,
  getToolChipVariant,
} from "../common/utils/semanticChipUtils";
import useTranslatedContent from "../i18n/useTranslatedContent";

import "./CareerJobDetailPage.css";

const { Paragraph, Text, Title } = Typography;

function normalizeProfile(profile = {}) {
  const title = profile.title || "Career role";
  const rawExperienceLevel = profile.experience_level || profile.experienceLevel || "unspecified";
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
    degreeRequirements: profile.degree_requirements || profile.degreeRequirements || [],
  };
}

function normalizeRelatedSubjects(items = []) {
  if (!Array.isArray(items)) return [];
  const bySlug = new Map();
  for (const item of items) {
    const subjectSlug = item.subject_slug || item.subjectSlug || "";
    const normalized = {
      subjectId: item.subject_id || item.subjectId || "",
      subjectSlug,
      subjectTitle: item.subject_title || item.subjectTitle || subjectSlug || "Subject",
      score: Number(item.score ?? 0),
      matchedTerms: item.matched_terms || item.matchedTerms || [],
    };
    const existing = bySlug.get(subjectSlug);
    if (!existing || normalized.score > existing.score) {
      bySlug.set(subjectSlug, normalized);
    }
  }
  return [...bySlug.values()].sort(
    (a, b) => b.score - a.score || a.subjectTitle.localeCompare(b.subjectTitle),
  );
}

function CareerJobDetailPage() {
  const navigate = useNavigate();
  const { jobId = "" } = useParams();
  const decodedJobId = decodeURIComponent(jobId);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [profile, setProfile] = useState(null);
  const [relatedSubjects, setRelatedSubjects] = useState([]);
  const [pathPending, setPathPending] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadDetail() {
      if (!decodedJobId) {
        setErrorText("Missing career role id.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setErrorText("");
      try {
        const payload = await getCareerJobDetail(decodedJobId);
        if (!mounted) return;
        setProfile(normalizeProfile(payload?.profile));
        setRelatedSubjects(normalizeRelatedSubjects(payload?.related_subjects || payload?.relatedSubjects));
      } catch (error) {
        if (!mounted) return;
        setErrorText(error instanceof Error ? error.message : "Failed to load career details.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadDetail();
    return () => {
      mounted = false;
    };
  }, [decodedJobId]);

  const degreeRequirements = useMemo(
    () => normalizeDegreeRequirements(profile?.degreeRequirements || []),
    [profile],
  );
  const translatedDescription = useTranslatedContent(profile?.description || "", {
    sourceType: "career_description",
    sourceId: profile?.jobId || decodedJobId || "career-role",
    disabled: !profile?.description,
  });
  const responsibilitiesPayload = useMemo(
    () => JSON.stringify(profile?.responsibilities || []),
    [profile?.responsibilities],
  );
  const translatedResponsibilitiesPayload = useTranslatedContent(responsibilitiesPayload, {
    sourceType: "career_responsibilities",
    sourceId: `${profile?.jobId || decodedJobId || "career-role"}:responsibilities`,
    disabled: !profile?.responsibilities?.length,
  });
  const displayResponsibilities = useMemo(() => {
    if (!profile?.responsibilities?.length) return [];
    try {
      const parsed = JSON.parse(translatedResponsibilitiesPayload.content || "[]");
      return Array.isArray(parsed) && parsed.length ? parsed : profile.responsibilities;
    } catch {
      return profile.responsibilities;
    }
  }, [profile?.responsibilities, translatedResponsibilitiesPayload.content]);

  const handleGenerateCareerPath = async () => {
    if (!profile?.jobId || pathPending) return;
    setPathPending(true);
    try {
      const response = await generateLearningPath({
        goal_type: "career",
        goal_id: profile.jobId,
        goal_title: profile.roleLabel || profile.title,
        subject_slugs: relatedSubjects.map((subject) => subject.subjectSlug).filter(Boolean),
        save_as_draft: true,
        commit: true,
      });
      message.success("Career learning path created.");
      const firstNode = response?.draft?.nodes?.[0] || response?.path?.draft?.nodes?.[0];
      navigate(firstNode?.note_url || firstNode?.noteUrl || "/");
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Could not create career learning path.";
      message.error(errorText);
    } finally {
      setPathPending(false);
    }
  };

  if (loading) {
    return (
      <div className="career-job-detail-page career-job-detail-page--state">
        <Spin tip="Loading role details..." />
      </div>
    );
  }

  if (errorText || !profile) {
    return (
      <div className="career-job-detail-page career-job-detail-page--state">
        <Card className="career-job-detail-page__state-card">
          <Space direction="vertical" size={12}>
            <Alert type="error" showIcon message={errorText || "Career role not found."} />
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/careers")}>
              Back to careers
            </Button>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="career-job-detail-page">
      <div className="career-job-detail-page__container">
        <Space direction="vertical" size={16} className="career-job-detail-page__header">
          <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate("/careers")}>
            Back to Explore Careers
          </Button>
          <Card className="career-job-detail-page__hero">
            <Space direction="vertical" size={8}>
              <Title level={2} className="career-job-detail-page__title">
                {profile.title}
              </Title>
              <Space wrap>
                <SemanticChip variant={profile.experienceLevelColor}>
                  {profile.experienceLevel}
                </SemanticChip>
              </Space>
              <Paragraph className="career-job-detail-page__description">
                {translatedDescription.content || profile.description}
              </Paragraph>
              <Button
                type="primary"
                icon={<NodeIndexOutlined />}
                loading={pathPending}
                onClick={handleGenerateCareerPath}
              >
                Create career learning path
              </Button>
            </Space>
          </Card>
        </Space>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Card title="Responsibilities" className="career-job-detail-page__section">
              {displayResponsibilities.length > 0 ? (
                <List
                  dataSource={displayResponsibilities}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              ) : (
                <Empty description="No responsibilities available yet." />
              )}
            </Card>
          </Col>
          <Col xs={24} lg={10}>
            <Space direction="vertical" size={16} className="career-job-detail-page__stack">
              <Card title="Skills & Tools" className="career-job-detail-page__section">
                <Space direction="vertical" size={12} className="career-job-detail-page__tag-group">
                  <div>
                    <Text strong>Hard skills</Text>
                    <div className="career-job-detail-page__tag-wall">
                      {profile.hardSkills.length ? (
                        profile.hardSkills.map((skill) => (
                          <SemanticChip key={`hard-${skill}`} variant={getSkillChipVariant(skill)}>
                            {skill}
                          </SemanticChip>
                        ))
                      ) : (
                        <Text type="secondary">None listed</Text>
                      )}
                    </div>
                  </div>
                  <div>
                    <Text strong>Soft skills</Text>
                    <div className="career-job-detail-page__tag-wall">
                      {profile.softSkills.length ? (
                        profile.softSkills.map((skill) => (
                          <SemanticChip key={`soft-${skill}`} variant={getSoftSkillChipVariant()}>
                            {skill}
                          </SemanticChip>
                        ))
                      ) : (
                        <Text type="secondary">None listed</Text>
                      )}
                    </div>
                  </div>
                  <div>
                    <Text strong>Tools</Text>
                    <div className="career-job-detail-page__tag-wall">
                      {profile.tools.length ? (
                        profile.tools.map((tool) => (
                          <SemanticChip key={`tool-${tool}`} variant={getToolChipVariant()}>
                            {tool}
                          </SemanticChip>
                        ))
                      ) : (
                        <Text type="secondary">None listed</Text>
                      )}
                    </div>
                  </div>
                </Space>
              </Card>

              <Card title="Degree Requirements" className="career-job-detail-page__section">
                {degreeRequirements.length ? (
                  <Space direction="vertical" size={12} className="career-job-detail-page__degree-list">
                    {degreeRequirements.map((item) => (
                      <div key={item.level} className="career-job-detail-page__degree-row">
                        <Text strong className="career-job-detail-page__degree-level">
                          {item.level}
                        </Text>
                        {item.fields.length ? (
                          <div className="career-job-detail-page__tag-wall">
                            {item.fields.map((field) => (
                              <SemanticChip
                                key={`${item.level}-${field}`}
                                variant={getKnowledgeAreaChipVariant(field)}
                              >
                                {field}
                              </SemanticChip>
                            ))}
                          </div>
                        ) : (
                          <Text type="secondary">No specific fields listed.</Text>
                        )}
                      </div>
                    ))}
                  </Space>
                ) : (
                  <Empty description="No degree requirements listed." image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </Card>
            </Space>
          </Col>
        </Row>

        <Card title="Related Subjects" className="career-job-detail-page__section">
          {relatedSubjects.length ? (
            <Row gutter={[12, 12]}>
              {relatedSubjects.map((subject) => (
                <Col key={subject.subjectId || subject.subjectSlug} xs={24} md={12} xl={8}>
                  <Card size="small" className="career-job-detail-page__subject-card">
                    <Space direction="vertical" size={8}>
                      <Text strong>{subject.subjectTitle}</Text>
                      <Text type="secondary">
                        Match score {Math.round(subject.score * 100)}%
                      </Text>
                      {subject.matchedTerms.length ? (
                        <Space wrap size={[4, 4]}>
                          {subject.matchedTerms.slice(0, 4).map((term) => (
                            <SemanticChip
                              key={`${subject.subjectSlug}-${term}`}
                              variant={getKnowledgeAreaChipVariant(term)}
                            >
                              {term}
                            </SemanticChip>
                          ))}
                        </Space>
                      ) : null}
                      <Button
                        icon={<BookOutlined />}
                        onClick={() => navigate(`/subject/${subject.subjectSlug}/mindmap`)}
                      >
                        Open subject
                      </Button>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Empty description="No related subjects linked yet." />
          )}
        </Card>
      </div>
    </div>
  );
}

export default CareerJobDetailPage;
