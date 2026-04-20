export function formatAdminDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatArtifactSummary(artifact) {
  if (!artifact?.exists) return "Missing";
  return `Available · ${formatAdminDate(artifact.updated_at)}`;
}

export function formatBooleanStatus(value) {
  return value ? "Healthy" : "Issue";
}
