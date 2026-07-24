import { request } from "../../goals/api/learningPlatform";

export function listCourseStudioDomains() {
  return request("/api/v1/course-studio/domains");
}

export function uploadSourceAsset({
  file,
  consentProcessing,
  consentCommunityPublish,
  consentModelImprovement,
}) {
  const body = new FormData();
  body.append("file", file);
  body.append("consent_processing", String(Boolean(consentProcessing)));
  body.append("consent_community_publish", String(Boolean(consentCommunityPublish)));
  body.append("consent_model_improvement", String(Boolean(consentModelImprovement)));
  return request("/api/v1/course-studio/source-assets", { method: "POST", body });
}

export function createAnalysisRun(payload) {
  return request("/api/v1/course-studio/analysis-runs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listAnalysisRuns() {
  return request("/api/v1/course-studio/analysis-runs");
}

export function updateOutlineProposal(proposalId, payload) {
  return request(`/api/v1/course-studio/outline-proposals/${encodeURIComponent(proposalId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function decideConceptSuggestions(proposalId, decisions) {
  return request(
    `/api/v1/course-studio/outline-proposals/${encodeURIComponent(proposalId)}/concept-decisions`,
    {
      method: "POST",
      body: JSON.stringify({ decisions }),
    },
  );
}

export function reviseOutlineProposal(proposalId, instruction) {
  return request(`/api/v1/course-studio/outline-proposals/${encodeURIComponent(proposalId)}/revisions`, {
    method: "POST",
    body: JSON.stringify({ instruction }),
  });
}

export function finalizeOutlineProposal(proposalId, payload) {
  return request(`/api/v1/course-studio/outline-proposals/${encodeURIComponent(proposalId)}/finalize`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listProposalAuditEvents(proposalId) {
  return request(
    `/api/v1/course-studio/outline-proposals/${encodeURIComponent(proposalId)}/audit-events`,
  );
}
