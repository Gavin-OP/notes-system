import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Input,
  List,
  Modal,
  Radio,
  Space,
  Spin,
  Typography,
} from "antd";
import {
  ArrowLeftOutlined,
  BookOutlined,
  BulbOutlined,
  FormOutlined,
} from "@ant-design/icons";

import { requestAssistantQuizEvaluate } from "../../assistant/api/assistant";
import {
  generateConceptQuiz,
  loadConceptReviewContent,
} from "../lib/conceptReviewUtils";
import { normalizeQuizEvaluation } from "../lib/quizUtils";

import "./ConceptReviewModal.css";

const { Paragraph, Text, Title } = Typography;

const STEPS = {
  ACTION: "action",
  REVIEW_CHOOSE: "review-choose",
  QUICK: "quick",
  QUIZ: "quiz",
};

function ConceptReviewModal({ open, concept, onClose, onGoToNotes }) {
  const [step, setStep] = useState(STEPS.ACTION);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewBullets, setReviewBullets] = useState([]);
  const [reviewDescription, setReviewDescription] = useState("");
  const [noteContentCache, setNoteContentCache] = useState("");
  const [sectionCache, setSectionCache] = useState("");

  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizEvaluations, setQuizEvaluations] = useState({});
  const [quizEvaluationPendingMap, setQuizEvaluationPendingMap] = useState({});

  const hasNoteLink = Boolean(concept?.noteUrl);

  useEffect(() => {
    if (!open) {
      setStep(STEPS.ACTION);
      setReviewLoading(false);
      setReviewError("");
      setReviewBullets([]);
      setReviewDescription("");
      setNoteContentCache("");
      setSectionCache("");
      setQuizLoading(false);
      setQuizError("");
      setQuizQuestions([]);
      setQuizAnswers({});
      setQuizEvaluations({});
      setQuizEvaluationPendingMap({});
    }
  }, [open, concept?.id]);

  const modalTitle = useMemo(() => {
    if (step === STEPS.QUICK) return `Quick Review · ${concept?.label || "Concept"}`;
    if (step === STEPS.QUIZ) return `Quiz · ${concept?.label || "Concept"}`;
    if (step === STEPS.REVIEW_CHOOSE) return `Review · ${concept?.label || "Concept"}`;
    return concept?.label || "Concept";
  }, [concept?.label, step]);

  const modalWidth = step === STEPS.ACTION || step === STEPS.REVIEW_CHOOSE ? 520 : 760;

  const handleBack = () => {
    if (step === STEPS.QUICK || step === STEPS.QUIZ) {
      setStep(STEPS.REVIEW_CHOOSE);
      return;
    }
    if (step === STEPS.REVIEW_CHOOSE) {
      setStep(STEPS.ACTION);
    }
  };

  const loadQuickReview = async (forceRefresh = false) => {
    if (!concept) return;
    setStep(STEPS.QUICK);
    setReviewLoading(true);
    setReviewError("");
    setReviewBullets([]);
    setReviewDescription("");
    try {
      const payload = await loadConceptReviewContent(concept, { forceRefresh });
      setReviewBullets(payload.bullets);
      setReviewDescription(payload.description);
      setNoteContentCache(payload.noteContent);
      setSectionCache(payload.section);
    } catch (error) {
      setReviewError(error instanceof Error ? error.message : "Failed to load review content.");
    } finally {
      setReviewLoading(false);
    }
  };

  const loadQuiz = async (contentOverride = null) => {
    if (!concept) return;
    setStep(STEPS.QUIZ);
    setQuizLoading(true);
    setQuizError("");
    setQuizQuestions([]);
    setQuizAnswers({});
    setQuizEvaluations({});
    setQuizEvaluationPendingMap({});

    try {
      let noteContent = contentOverride?.noteContent ?? noteContentCache;
      let sectionText = contentOverride?.section ?? sectionCache;

      if (!noteContent && concept.noteUrl) {
        const payload = await loadConceptReviewContent(concept);
        noteContent = payload.noteContent;
        sectionText = payload.section;
        setNoteContentCache(noteContent);
        setSectionCache(sectionText);
      }

      const questions = await generateConceptQuiz(concept, noteContent, sectionText);
      if (questions.length === 0) {
        throw new Error("Quiz API returned no questions.");
      }
      setQuizQuestions(questions);
    } catch (error) {
      setQuizError(error instanceof Error ? error.message : "Failed to generate quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizEvaluateQuestion = async (question) => {
    const answer = quizAnswers[question.id];
    if (!answer || !String(answer).trim()) return;

    setQuizEvaluationPendingMap((prev) => ({ ...prev, [question.id]: true }));
    try {
      const response = await requestAssistantQuizEvaluate({
        currentNote: {
          title: concept?.noteTitle || concept?.label || "Concept",
          url: concept?.noteUrl || "",
          content: sectionCache || noteContentCache.slice(0, 12000),
        },
        references: [],
        question: question.rawQuestion ?? question,
        userAnswer: answer,
      });
      setQuizEvaluations((prev) => ({
        ...prev,
        [question.id]: normalizeQuizEvaluation(response),
      }));
    } catch (error) {
      setQuizError(error instanceof Error ? error.message : "Quiz evaluation failed.");
    } finally {
      setQuizEvaluationPendingMap((prev) => ({ ...prev, [question.id]: false }));
    }
  };

  const renderActionStep = () => (
    <div className="concept-review-modal__actions">
      <Paragraph type="secondary" className="concept-review-modal__intro">
        Choose how you want to continue with this concept.
      </Paragraph>

      <button
        type="button"
        className="concept-review-modal__choice concept-review-modal__choice--primary"
        disabled={!hasNoteLink}
        onClick={() => onGoToNotes?.(concept)}
      >
        <BookOutlined className="concept-review-modal__choice-icon" />
        <span className="concept-review-modal__choice-label">Go to Notes</span>
        <Text type="secondary" className="concept-review-modal__choice-hint">
          Open the source note and jump to this concept.
        </Text>
      </button>

      <button
        type="button"
        className="concept-review-modal__choice"
        disabled={!hasNoteLink}
        onClick={() => setStep(STEPS.REVIEW_CHOOSE)}
      >
        <BulbOutlined className="concept-review-modal__choice-icon" />
        <span className="concept-review-modal__choice-label">Review</span>
        <Text type="secondary" className="concept-review-modal__choice-hint">
          Quick recap or self-test quiz for this concept.
        </Text>
      </button>

      {!hasNoteLink ? (
        <Alert type="info" showIcon message="This concept has no linked note yet." />
      ) : null}
    </div>
  );

  const renderReviewChooseStep = () => (
    <div className="concept-review-modal__actions">
      <Paragraph type="secondary" className="concept-review-modal__intro">
        Pick a review mode for <Text strong>{concept?.label}</Text>.
      </Paragraph>

      <button type="button" className="concept-review-modal__choice" onClick={loadQuickReview}>
        <FormOutlined className="concept-review-modal__choice-icon" />
        <span className="concept-review-modal__choice-label">Quick Review</span>
        <Text type="secondary" className="concept-review-modal__choice-hint">
          Bullet points and a short description to refresh the concept.
        </Text>
      </button>

      <button type="button" className="concept-review-modal__choice" onClick={() => loadQuiz()}>
        <BulbOutlined className="concept-review-modal__choice-icon" />
        <span className="concept-review-modal__choice-label">Quiz</span>
        <Text type="secondary" className="concept-review-modal__choice-hint">
          Answer questions to test your understanding.
        </Text>
      </button>
    </div>
  );

  const renderQuickReviewStep = () => {
    const displayBullets = reviewBullets.filter(
      (item) => String(item || "").trim() !== String(reviewDescription || "").trim(),
    );

    return (
    <div className="concept-review-modal__review">
      {reviewLoading ? (
        <div className="concept-review-modal__loading">
          <Spin tip="Generating concept review..." />
        </div>
      ) : null}

      {!reviewLoading && reviewError ? (
        <Space direction="vertical" size={12} className="concept-review-modal__review-actions">
          <Alert type="warning" showIcon message={reviewError} />
          <Button type="primary" loading={reviewLoading} onClick={() => loadQuickReview(true)}>
            Try again
          </Button>
        </Space>
      ) : null}

      {!reviewLoading && !reviewError ? (
        <>
          {reviewDescription ? (
            <Paragraph className="concept-review-modal__description">{reviewDescription}</Paragraph>
          ) : null}
          {displayBullets.length > 0 ? (
            <List
              size="small"
              dataSource={displayBullets}
              renderItem={(item) => <List.Item className="concept-review-modal__bullet">{item}</List.Item>}
            />
          ) : null}
          <Button loading={reviewLoading} onClick={() => loadQuickReview(true)}>
            Regenerate review
          </Button>
        </>
      ) : null}
    </div>
    );
  };

  const renderQuizStep = () => (
    <div className="concept-review-modal__quiz">
      {quizError ? <Alert type="error" showIcon message={quizError} /> : null}

      {quizLoading ? (
        <div className="concept-review-modal__loading">
          <Spin tip="Generating quiz..." />
        </div>
      ) : null}

      {!quizLoading && quizQuestions.length > 0 ? (
        <div className="concept-review-modal__quiz-list">
          {quizQuestions.map((question, index) => (
            <div key={question.id} className="concept-review-modal__quiz-card">
              <Text strong>{`Q${index + 1}. ${question.text}`}</Text>
              {question.type === "mcq" ? (
                <div className="concept-review-modal__quiz-answer">
                  <Radio.Group
                    value={quizAnswers[question.id]}
                    onChange={(event) =>
                      setQuizAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))
                    }
                  >
                    <Space direction="vertical">
                      {(question.options || []).map((option, optionIndex) => {
                        const optionText =
                          typeof option === "string"
                            ? option
                            : option?.text || option?.label || option?.content || String(option);
                        const optionValue =
                          typeof option === "string"
                            ? option
                            : option?.key || option?.value || option?.id || optionText;
                        return (
                          <Radio key={`${question.id}-${optionIndex}`} value={optionValue}>
                            {String.fromCharCode(65 + optionIndex)}. {optionText}
                          </Radio>
                        );
                      })}
                    </Space>
                  </Radio.Group>
                </div>
              ) : (
                <div className="concept-review-modal__quiz-answer">
                  <Input.TextArea
                    rows={3}
                    value={quizAnswers[question.id] || ""}
                    placeholder="Write your answer..."
                    onChange={(event) =>
                      setQuizAnswers((prev) => ({ ...prev, [question.id]: event.target.value }))
                    }
                  />
                </div>
              )}

              <Button
                size="small"
                type="primary"
                loading={Boolean(quizEvaluationPendingMap[question.id])}
                onClick={() => handleQuizEvaluateQuestion(question)}
              >
                Check answer
              </Button>

              {quizEvaluations[question.id] ? (
                <div className="concept-review-modal__quiz-eval">
                  <Text strong>{quizEvaluations[question.id].is_correct ? "Correct" : "Needs work"}</Text>
                  {quizEvaluations[question.id].feedback ? (
                    <Text type="secondary">{quizEvaluations[question.id].feedback}</Text>
                  ) : null}
                  {quizEvaluations[question.id].suggested_answer ? (
                    <Text>Suggested: {quizEvaluations[question.id].suggested_answer}</Text>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {!quizLoading && quizQuestions.length > 0 ? (
        <Button onClick={() => loadQuiz()} loading={quizLoading}>
          Regenerate quiz
        </Button>
      ) : null}
    </div>
  );

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={modalWidth}
      className="concept-review-modal"
      destroyOnClose
      title={
        <div className="concept-review-modal__title-row">
          {step !== STEPS.ACTION ? (
            <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack} />
          ) : null}
          <Title level={4} className="concept-review-modal__title">
            {modalTitle}
          </Title>
        </div>
      }
    >
      {step === STEPS.ACTION ? renderActionStep() : null}
      {step === STEPS.REVIEW_CHOOSE ? renderReviewChooseStep() : null}
      {step === STEPS.QUICK ? renderQuickReviewStep() : null}
      {step === STEPS.QUIZ ? renderQuizStep() : null}
    </Modal>
  );
}

export default ConceptReviewModal;
