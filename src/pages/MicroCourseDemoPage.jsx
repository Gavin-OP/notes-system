import { useEffect, useMemo, useState } from "react";
import { Alert, Button, Card, Progress, Space, Spin, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import { getDataScienceIntroMicroCourse } from "../common/api/microCourses";

import "./MicroCourseDemoPage.css";

const { Paragraph, Text, Title } = Typography;

function MicroCourseDemoPage() {
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStep, setSelectedStep] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadCourse() {
      setLoading(true);
      setErrorText("");
      try {
        const payload = await getDataScienceIntroMicroCourse();
        if (mounted) setCourse(payload);
      } catch (error) {
        if (mounted) {
          setErrorText(error instanceof Error ? error.message : "Failed to load the micro-course demo.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCourse();
    return () => {
      mounted = false;
    };
  }, []);

  const slides = course?.slides || [];
  const currentSlide = slides[currentIndex];
  const progressPercent = slides.length > 0 ? Math.round(((currentIndex + 1) / slides.length) * 100) : 0;

  const selectedQuizOption = useMemo(() => {
    if (!currentSlide?.quiz || !selectedOptionId) return null;
    return currentSlide.quiz.options.find((option) => option.id === selectedOptionId) || null;
  }, [currentSlide, selectedOptionId]);

  function goToSlide(nextIndex) {
    setCurrentIndex(nextIndex);
    setSelectedStep(0);
    setSelectedOptionId("");
  }

  function renderInteractiveArea(slide) {
    if (!slide) return null;

    if (slide.kind === "cycle") {
      return (
        <div className="micro-course__cycle" aria-label="CRISP-DM lifecycle">
          {slide.animation_steps.map((step, index) => (
            <button
              className={`micro-course__cycle-step ${selectedStep === index ? "is-active" : ""}`}
              key={step}
              onClick={() => setSelectedStep(index)}
              type="button"
            >
              <span>{index + 1}</span>
              {step}
            </button>
          ))}
        </div>
      );
    }

    if (slide.kind === "comparison") {
      return (
        <div className="micro-course__compare-grid">
          {slide.compare_items.map((item) => (
            <Card className="micro-course__compare-card" key={item.label} bordered={false}>
              <Tag color="blue">{item.label}</Tag>
              <Paragraph>{item.description}</Paragraph>
            </Card>
          ))}
        </div>
      );
    }

    if (slide.kind === "quiz" && slide.quiz) {
      const isCorrect = selectedOptionId === slide.quiz.correct_option_id;
      return (
        <div className="micro-course__quiz">
          <Text strong>{slide.quiz.question}</Text>
          <div className="micro-course__quiz-options">
            {slide.quiz.options.map((option) => (
              <button
                className={`micro-course__quiz-option ${selectedOptionId === option.id ? "is-selected" : ""}`}
                key={option.id}
                onClick={() => setSelectedOptionId(option.id)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
          {selectedQuizOption ? (
            <Alert
              message={isCorrect ? "Nice, that is the preparation phase." : "Good try. Re-check the lifecycle."}
              description={selectedQuizOption.feedback}
              showIcon
              type={isCorrect ? "success" : "info"}
            />
          ) : null}
        </div>
      );
    }

    if (slide.animation_steps.length > 0) {
      return (
        <div className="micro-course__step-list">
          {slide.animation_steps.map((step, index) => (
            <button
              className={`micro-course__step-card ${selectedStep === index ? "is-active" : ""}`}
              key={step}
              onClick={() => setSelectedStep(index)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {step}
            </button>
          ))}
        </div>
      );
    }

    return slide.prompt ? <Alert message={slide.prompt} type="info" /> : null;
  }

  if (loading) {
    return (
      <div className="micro-course micro-course--centered">
        <Spin size="large" />
      </div>
    );
  }

  if (errorText) {
    return (
      <div className="micro-course micro-course--centered">
        <Alert
          action={
            <Button onClick={() => navigate("/home")} type="primary">
              Back home
            </Button>
          }
          description="Make sure the backend is running and VITE_API_BASE_URL points to it."
          message={errorText}
          showIcon
          type="error"
        />
      </div>
    );
  }

  return (
    <main className="micro-course">
      <section className="micro-course__shell">
        <div className="micro-course__hero">
          <Space direction="vertical" size={10}>
            <Tag color="purple">AI micro-course MVP</Tag>
            <Title>{course.title}</Title>
            <Paragraph>{course.subtitle}</Paragraph>
            <Text type="secondary">
              Source note: {course.source_note} · About {course.estimated_minutes} minutes
            </Text>
          </Space>
          <Button onClick={() => navigate("/note/data_science/introduction-to-data-science")} type="default">
            Open original note
          </Button>
        </div>

        <Card className="micro-course__objectives" bordered={false}>
          {course.learning_objectives.map((objective) => (
            <Tag color="geekblue" key={objective}>
              {objective}
            </Tag>
          ))}
        </Card>

        <Card className="micro-course__stage" bordered={false}>
          <div className="micro-course__progress-row">
            <Text strong>
              Slide {currentIndex + 1} of {slides.length}
            </Text>
            <Progress percent={progressPercent} showInfo={false} />
          </div>

          <div className="micro-course__slide">
            <Tag color="cyan">{currentSlide.eyebrow}</Tag>
            <Title level={2}>{currentSlide.title}</Title>
            <Paragraph>{currentSlide.body}</Paragraph>
            {renderInteractiveArea(currentSlide)}
          </div>

          <div className="micro-course__controls">
            <Button disabled={currentIndex === 0} onClick={() => goToSlide(currentIndex - 1)}>
              Previous
            </Button>
            <div className="micro-course__dots" aria-label="Slide navigation">
              {slides.map((slide, index) => (
                <button
                  aria-label={`Go to ${slide.title}`}
                  className={`micro-course__dot ${currentIndex === index ? "is-active" : ""}`}
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  type="button"
                />
              ))}
            </div>
            <Button
              disabled={currentIndex === slides.length - 1}
              onClick={() => goToSlide(currentIndex + 1)}
              type="primary"
            >
              Next
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}

export default MicroCourseDemoPage;
