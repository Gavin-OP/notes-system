import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  List,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";
import { ArrowLeftOutlined, BookOutlined } from "@ant-design/icons";

import { getCareerJobDetail } from "../common/api/careers";

import "./CareerJobDetailPage.css";

const { Paragraph, Text, Title } = Typography;

function normalizeProfile(profile = {}) {
  return {
    jobId: profile.job_id || profile.jobId || "",
    title: profile.title || "Career role",
    description: profile.description || "",
    responsibilities: profile.responsibilities || [],
    hardSkills: profile.hard_skills || profile.hardSkills || [],
    softSkills: profile.soft_skills || profile.softSkills || [],
    tools: profile.tools || [],
    experienceLevel: profile.experience_level || profile.experienceLevel || "unspecified",
    degreeRequirements: profile.degree_requirements || profile.degreeRequirements || [],
    sourceCompanies: profile.source_companies || profile.sourceCompanies || [],
  };
}

function normalizeRelatedSubjects(items = []) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => ({
    subjectId: item.subject_id || item.subjectId || "",
    subjectSlug: item.subject_slug || item.subjectSlug || "",
    subjectTitle: item.subject_title || item.subjectTitle || item.subjectSlug || "Subject",
    score: Number(item.score ?? 0),
    matchedTerms: item.matched_terms || item.matchedTerms || [],
  }));
}

function CareerJobDetailPage() {
  const navigate = useNavigate();
  const { jobId = "" } = useParams();
  const decodedJobId = decodeURIComponent(jobId);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [profile, setProfile] = useState(null);
  const [relatedSubjects, setRelatedSubjects] = useState([]);

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

  const degreeLabels = useMemo(() => {
    return (profile?.degreeRequirements || []).map((item, index) => {
      const level = item.level || "unspecified";
      const fields = item.fields || [];
      return {
        id: `${level}-${index}`,
        label: fields.length ? `${level}: ${fields.join(", ")}` : level,
      };
    });
  }, [profile]);

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
                <Tag color="blue">{profile.experienceLevel}</Tag>
                {profile.sourceCompanies.slice(0, 3).map((company) => (
                  <Tag key={company}>{company}</Tag>
                ))}
              </Space>
              <Paragraph className="career-job-detail-page__description">{profile.description}</Paragraph>
            </Space>
          </Card>
        </Space>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <Card title="Responsibilities" className="career-job-detail-page__section">
              {profile.responsibilities.length > 0 ? (
                <List
                  dataSource={profile.responsibilities}
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
                          <Tag key={`hard-${skill}`} color="purple">
                            {skill}
                          </Tag>
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
                          <Tag key={`soft-${skill}`} color="cyan">
                            {skill}
                          </Tag>
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
                          <Tag key={`tool-${tool}`} color="geekblue">
                            {tool}
                          </Tag>
                        ))
                      ) : (
                        <Text type="secondary">None listed</Text>
                      )}
                    </div>
                  </div>
                </Space>
              </Card>

              <Card title="Degree Requirements" className="career-job-detail-page__section">
                {degreeLabels.length ? (
                  <Space wrap>
                    {degreeLabels.map((item) => (
                      <Tag key={item.id}>{item.label}</Tag>
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
                            <Tag key={`${subject.subjectSlug}-${term}`}>{term}</Tag>
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
