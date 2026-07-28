import { useEffect, useState } from "react";
import { App, Alert, Button, Card, Result, Skeleton, Steps, Tag, Typography } from "antd";
import {
  BranchesOutlined,
  CloudUploadOutlined,
  FileDoneOutlined,
  HistoryOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

import AppPageShell from "../../../shared/layouts/AppPageShell";
import {
  createAnalysisRun,
  decideConceptSuggestions,
  finalizeOutlineProposal,
  listAnalysisRuns,
  listCourseStudioDomains,
  listProposalAuditEvents,
  reviseOutlineProposal,
  updateOutlineProposal,
  uploadSourceAsset,
} from "../api/courseStudio";
import AnalysisSetupStep from "../components/AnalysisSetupStep";
import ProposalReview from "../components/ProposalReview";
import SourceUploadStep from "../components/SourceUploadStep";

import "./CourseStudioPage.css";

const { Paragraph, Text, Title } = Typography;

function CourseStudioPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = App.useApp();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState(null);
  const [sourceAsset, setSourceAsset] = useState(null);
  const [analysisRun, setAnalysisRun] = useState(null);
  const [domains, setDomains] = useState([]);
  const [recentRuns, setRecentRuns] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [revisionFeedback, setRevisionFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deciding, setDeciding] = useState(false);
  const [revising, setRevising] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([listCourseStudioDomains(), listAnalysisRuns()])
      .then(([domainPayload, runPayload]) => {
        if (!mounted) return;
        const runs = Array.isArray(runPayload) ? runPayload : [];
        setDomains(Array.isArray(domainPayload) ? domainPayload : []);
        setRecentRuns(runs);
        const requestedRunId = new URLSearchParams(location.search).get("run");
        const requestedRun = runs.find((run) => run.id === requestedRunId && run.outline_proposal);
        if (requestedRun) {
          setAnalysisRun(requestedRun);
          setStep(4);
          listProposalAuditEvents(requestedRun.outline_proposal.id)
            .then((events) => mounted && setAuditEvents(Array.isArray(events) ? events : []))
            .catch(() => {});
        }
      })
      .catch((error) => {
        if (mounted) setErrorText(error instanceof Error ? error.message : "Could not load Course Studio.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [location.search]);

  const replaceProposal = (proposal) => {
    setAnalysisRun((current) => (
      current ? { ...current, outline_proposal: proposal } : current
    ));
    setRecentRuns((current) => current.map((run) => (
      run.id === analysisRun?.id ? { ...run, outline_proposal: proposal } : run
    )));
  };

  const refreshAuditEvents = async (proposalId) => {
    if (!proposalId) return;
    try {
      const events = await listProposalAuditEvents(proposalId);
      setAuditEvents(Array.isArray(events) ? events : []);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not load proposal activity.");
    }
  };

  const handleFileChange = (nextFile, error = "") => {
    setFile(nextFile);
    if (error) message.error(error);
  };

  const handleUpload = async (values) => {
    if (!file) return;
    setUploading(true);
    setErrorText("");
    try {
      const uploaded = await uploadSourceAsset({
        file,
        consentProcessing: values.consentProcessing,
        consentCommunityPublish: values.consentCommunityPublish,
        consentModelImprovement: values.consentModelImprovement,
      });
      setSourceAsset(uploaded);
      setStep(1);
      message.success("Source parsed and stored privately.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not upload this source.");
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async (values) => {
    if (!sourceAsset?.id) return;
    setAnalyzing(true);
    setErrorText("");
    try {
      const run = await createAnalysisRun({
        source_asset_id: sourceAsset.id,
        domain_slug: values.domain_slug,
        proposed_title: values.proposed_title.trim(),
        primary_archetype: values.primary_archetype,
        secondary_archetypes: (values.secondary_archetypes || [])
          .filter((item) => item !== values.primary_archetype),
        user_prompt: values.user_prompt?.trim() || "",
      });
      setAnalysisRun(run);
      setRecentRuns((current) => [run, ...current.filter((item) => item.id !== run.id)]);
      setRevisionFeedback(null);
      setCreatedCourse(null);
      setStep(4);
      await refreshAuditEvents(run.outline_proposal?.id);
      message.success("Outline proposal created.");
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not analyze this source.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetStudio = () => {
    setStep(0);
    setFile(null);
    setSourceAsset(null);
    setAnalysisRun(null);
    setAuditEvents([]);
    setCreatedCourse(null);
    setRevisionFeedback(null);
    setErrorText("");
  };

  const openRecentRun = (run) => {
    if (!run?.outline_proposal) return;
    setAnalysisRun(run);
    setCreatedCourse(null);
    setRevisionFeedback(null);
    setStep(4);
    setErrorText("");
    refreshAuditEvents(run.outline_proposal.id);
  };

  const handleSaveProposal = async (payload) => {
    const proposalId = analysisRun?.outline_proposal?.id;
    if (!proposalId) return false;
    setSaving(true);
    setErrorText("");
    try {
      const updated = await updateOutlineProposal(proposalId, payload);
      replaceProposal(updated);
      setRevisionFeedback(null);
      await refreshAuditEvents(proposalId);
      message.success("Proposal saved and concept suggestions refreshed.");
      return true;
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not save this proposal.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleDecide = async (decisions) => {
    const proposalId = analysisRun?.outline_proposal?.id;
    if (!proposalId || !decisions.length) return false;
    setDeciding(true);
    setErrorText("");
    try {
      const updated = await decideConceptSuggestions(proposalId, decisions);
      replaceProposal(updated);
      await refreshAuditEvents(proposalId);
      message.success(`${decisions.length} concept ${decisions.length === 1 ? "decision" : "decisions"} saved.`);
      return true;
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not save concept decisions.");
      return false;
    } finally {
      setDeciding(false);
    }
  };

  const handleRevise = async (instruction) => {
    const proposalId = analysisRun?.outline_proposal?.id;
    if (!proposalId) return false;
    setRevising(true);
    setErrorText("");
    try {
      const response = await reviseOutlineProposal(proposalId, instruction);
      replaceProposal(response.proposal);
      setRevisionFeedback(response);
      await refreshAuditEvents(proposalId);
      message.success(response.applied_changes?.length ? "Proposal revised." : "Revision request reviewed.");
      return true;
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not revise this proposal.");
      return false;
    } finally {
      setRevising(false);
    }
  };

  const handleFinalize = async (payload) => {
    const proposalId = analysisRun?.outline_proposal?.id;
    if (!proposalId) return false;
    setFinalizing(true);
    setErrorText("");
    try {
      const response = await finalizeOutlineProposal(proposalId, payload);
      replaceProposal(response.proposal);
      setCreatedCourse(response);
      await refreshAuditEvents(proposalId);
      setStep(5);
      message.success("Draft course and immutable version 1 created.");
      return true;
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Could not create the course.");
      return false;
    } finally {
      setFinalizing(false);
    }
  };

  return (
    <AppPageShell
      title="Course Studio"
      subtitle="Turn human notes into a structured course proposal connected to stable canonical knowledge."
      backLabel="Back to My Courses"
      onBack={() => navigate("/user/profile?section=courses")}
      showSiteFooter
      contentWidth="wide"
      contentClassName="course-studio"
    >
      <div className="course-studio__intro">
        <div>
          <Text className="course-studio__eyebrow">Course Studio</Text>
          <Title level={2}>Your notes, organized into a course perspective.</Title>
          <Paragraph>
            Source material stays private by default. You choose the Domain and Learning Archetype;
            learners choose their Goal when they build a path.
          </Paragraph>
        </div>
        <div className="course-studio__boundary">
          <BranchesOutlined />
          <div>
            <Text strong>Stable core, flexible courses</Text>
            <Text type="secondary">Proposals can reference canonical concepts, never rewrite them.</Text>
          </div>
        </div>
      </div>

      <Card className="course-studio__progress-card">
        <Steps
          current={step}
          responsive
          onChange={(next) => {
            const available = next === 0 || (next === 1 && sourceAsset) || (next === 4 && analysisRun?.outline_proposal) || (next === 5 && createdCourse);
            if (available) setStep(next);
          }}
          items={[
            { title: "Ingest", description: "Your source", icon: <CloudUploadOutlined /> },
            { title: "Classify", description: "Your decision", icon: <BranchesOutlined /> },
            { title: "Organize", description: <Tag>Auto</Tag> },
            { title: "Connect", description: <Tag>Auto</Tag> },
            { title: "Review", description: "Your decision", icon: <FileDoneOutlined /> },
            { title: "Version", description: "Saved course", icon: <RocketOutlined /> },
          ]}
        />
        <div className="course-studio__stage-status" aria-live="polite">
          <Text strong>
            {step === 0 && "Now: upload the source you want to structure."}
            {step === 1 && "Done: your source is stored privately. Now: confirm its learning direction."}
            {step === 4 && "Done: the course was organized and connected. Now: review the proposal."}
            {step === 5 && "Done: an immutable course version has been saved."}
          </Text>
          <span className="course-studio__save-state">
            <Text type="secondary">
              {saving || deciding || revising || finalizing ? "Saving…" : analysisRun?.outline_proposal ? "Saved" : "Changes are saved after each completed stage."}
            </Text>
            {analysisRun?.outline_proposal ? (
              <Button onClick={() => navigate("/user/profile?section=courses")}>Save & exit</Button>
            ) : null}
          </span>
        </div>
      </Card>

      {errorText ? (
        <Alert
          type="error"
          showIcon
          closable
          title="Course Studio could not continue"
          description={errorText}
          onClose={() => setErrorText("")}
        />
      ) : null}

      {loading ? (
        <Card><Skeleton active paragraph={{ rows: 8 }} /></Card>
      ) : null}
      {!loading && step === 0 ? (
        <SourceUploadStep
          file={file}
          uploading={uploading}
          onFileChange={handleFileChange}
          onSubmit={handleUpload}
        />
      ) : null}
      {!loading && step === 1 ? (
        <AnalysisSetupStep
          sourceAsset={sourceAsset}
          domains={domains}
          analyzing={analyzing}
          onBack={() => setStep(0)}
          onSubmit={handleAnalyze}
        />
      ) : null}
      {!loading && step === 4 && analysisRun?.outline_proposal ? (
        <ProposalReview
          proposal={analysisRun.outline_proposal}
          usage={analysisRun.usage_metadata}
          auditEvents={auditEvents}
          saving={saving}
          deciding={deciding}
          revising={revising}
          finalizing={finalizing}
          revisionFeedback={revisionFeedback}
          onSaveProposal={handleSaveProposal}
          onDecide={handleDecide}
          onRevise={handleRevise}
          onFinalize={handleFinalize}
          onStartAnother={resetStudio}
          onOpenCourses={() => navigate("/user/profile", { state: { dashboard: "courses" } })}
        />
      ) : null}
      {!loading && step === 5 && createdCourse ? (
        <Card className="course-studio__created-card">
          <Result
            status="success"
            title="Your draft course is ready"
            subTitle={`${createdCourse.course.title} now has immutable version ${createdCourse.version.version_number}. You can continue managing it from My Courses.`}
            extra={[
              <Button key="another" onClick={resetStudio}>Analyze another source</Button>,
              <Button
                key="courses"
                type="primary"
                onClick={() => navigate("/user/profile", { state: { dashboard: "courses" } })}
              >
                View My Courses
              </Button>,
            ]}
          />
        </Card>
      ) : null}

      {!loading && step === 0 && recentRuns.length ? (
        <section className="course-studio__recent" aria-labelledby="course-studio-recent-title">
          <div>
            <HistoryOutlined />
            <div>
              <Title level={4} id="course-studio-recent-title">Recent proposals</Title>
              <Text type="secondary">Reopen a saved draft analysis.</Text>
            </div>
          </div>
          <div className="course-studio__recent-grid">
            {recentRuns.slice(0, 3).map((run) => (
              <button type="button" key={run.id} onClick={() => openRecentRun(run)}>
                <Text strong>{run.outline_proposal?.proposed_title || "Analysis draft"}</Text>
                <Text type="secondary">
                  {run.input_snapshot?.domain_title || run.input_snapshot?.domain_slug || "Domain"} · {run.status}
                </Text>
                <span className="course-studio__recent-link">Open proposal</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}
    </AppPageShell>
  );
}

export default CourseStudioPage;
