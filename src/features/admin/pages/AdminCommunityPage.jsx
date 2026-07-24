import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  App,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Progress,
  Skeleton,
  Space,
  Tabs,
  Typography,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ForkOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

import {
  decideCanonicalSuggestion,
  decidePublicationReview,
  getCanonicalSuggestionQueue,
  getPublicationReviewQueue,
} from "../api";

const { Paragraph, Text, Title } = Typography;

export default function AdminCommunityPage() {
  const { message } = App.useApp();
  const [decisionForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [decisionTarget, setDecisionTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErrorText("");
    try {
      const [reviewPayload, suggestionPayload] = await Promise.all([
        getPublicationReviewQueue(),
        getCanonicalSuggestionQueue(),
      ]);
      setReviews(Array.isArray(reviewPayload) ? reviewPayload : []);
      setSuggestions(Array.isArray(suggestionPayload) ? suggestionPayload : []);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not load the moderation queue.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openDecision = (kind, item, decision) => {
    setDecisionTarget({ kind, item, decision });
    decisionForm.setFieldsValue({ reviewer_note: "" });
  };

  const submitDecision = async (values) => {
    if (!decisionTarget) return;
    setBusy(true);
    try {
      const payload = {
        decision: decisionTarget.decision,
        reviewer_note: values.reviewer_note || "",
      };
      if (decisionTarget.kind === "publication") {
        await decidePublicationReview(decisionTarget.item.review.id, payload);
        setReviews((current) => current.filter(
          (item) => item.review.id !== decisionTarget.item.review.id,
        ));
      } else {
        await decideCanonicalSuggestion(decisionTarget.item.id, payload);
        setSuggestions((current) => current.filter((item) => item.id !== decisionTarget.item.id));
      }
      setDecisionTarget(null);
      message.success("Moderation decision recorded.");
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Could not record this decision.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <Text className="admin-page__eyebrow">Community governance</Text>
          <Title level={2}>Moderation queue</Title>
          <Paragraph type="secondary">
            Review public course submissions and canonical change suggestions as independent actions.
          </Paragraph>
        </div>
      </div>

      <Alert
        type="info"
        showIcon
        title="Approval boundaries"
        description="Course approval publishes the reviewed immutable version. Canonical suggestion approval records the decision only and never edits canonical content automatically."
      />

      {errorText ? <Alert type="error" showIcon title="Queue unavailable" description={errorText} /> : null}
      {loading ? <Card><Skeleton active paragraph={{ rows: 10 }} /></Card> : (
        <Tabs
          items={[
            {
              key: "courses",
              label: <span><ForkOutlined /> Course publication ({reviews.length})</span>,
              children: reviews.length ? (
                <div className="admin-community__queue">
                  {reviews.map((item) => (
                    <Card
                      key={item.review.id}
                      title={item.course.title}
                      extra={<Text type="secondary">Version {item.version.version_number}</Text>}
                    >
                      <div className="admin-community__review-grid">
                        <div>
                          <Text strong>{item.author.display_name}</Text>
                          <Paragraph type="secondary">@{item.author.handle} · {item.course.domain_title}</Paragraph>
                          <Paragraph>{item.course.description}</Paragraph>
                          <Paragraph type="secondary">
                            {item.review.submission_note || "No author note was provided."}
                          </Paragraph>
                        </div>
                        <div className="admin-community__score">
                          <Progress type="circle" percent={item.quality.score} size={96} />
                          <Text>Quality score</Text>
                        </div>
                      </div>
                      <Space wrap>
                        {item.quality.indicators.map((indicator) => (
                          <span key={indicator} className="admin-community__indicator">
                            <CheckOutlined /> {indicator}
                          </span>
                        ))}
                      </Space>
                      <div className="admin-community__actions">
                        <Button
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => openDecision("publication", item, "rejected")}
                        >
                          Reject
                        </Button>
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={() => openDecision("publication", item, "approved")}
                        >
                          Approve and publish
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : <Empty description="No pending course publication reviews." />,
            },
            {
              key: "canonical",
              label: <span><SafetyCertificateOutlined /> Canonical suggestions ({suggestions.length})</span>,
              children: suggestions.length ? (
                <div className="admin-community__queue">
                  {suggestions.map((item) => (
                    <Card
                      key={item.id}
                      title={item.title}
                      extra={<Text type="secondary">{item.suggestion_type}</Text>}
                    >
                      <Paragraph><Text strong>Concept:</Text> {item.canonical_concept_id}</Paragraph>
                      <Paragraph><Text strong>Rationale:</Text> {item.rationale}</Paragraph>
                      <Paragraph><Text strong>Proposed change:</Text> {item.proposed_change}</Paragraph>
                      <div className="admin-community__actions">
                        <Button
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => openDecision("canonical", item, "rejected")}
                        >
                          Reject
                        </Button>
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          onClick={() => openDecision("canonical", item, "approved")}
                        >
                          Approve suggestion
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : <Empty description="No pending canonical change suggestions." />,
            },
          ]}
        />
      )}

      <Modal
        open={Boolean(decisionTarget)}
        title={`${decisionTarget?.decision === "approved" ? "Approve" : "Reject"} ${
          decisionTarget?.kind === "publication" ? "course publication" : "canonical suggestion"
        }`}
        footer={null}
        onCancel={() => setDecisionTarget(null)}
      >
        <Form form={decisionForm} layout="vertical" onFinish={submitDecision}>
          <Form.Item
            label="Reviewer note"
            name="reviewer_note"
            extra="Give the author a concise, actionable explanation."
            rules={decisionTarget?.decision === "rejected" ? [{ required: true, whitespace: true }] : []}
          >
            <Input.TextArea rows={4} maxLength={5_000} />
          </Form.Item>
          <Button
            type="primary"
            danger={decisionTarget?.decision === "rejected"}
            htmlType="submit"
            loading={busy}
            block
          >
            Confirm decision
          </Button>
        </Form>
      </Modal>
    </div>
  );
}
