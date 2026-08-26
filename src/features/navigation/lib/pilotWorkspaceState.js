const PILOT_WORKSPACE_VIEW_KEY = "notes-system:fall-recruiting:workspace-view";
const VALID_VIEWS = new Set(["reading", "path"]);

function getSessionStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function resolvePilotCurrentNoteUrl(metaUrl, pathname) {
  const preferred = String(metaUrl || "").trim();
  if (preferred) return preferred;
  const route = String(pathname || "").trim();
  return route.startsWith("/note/") ? route : "";
}

export function loadPilotWorkspaceView(storage = getSessionStorage()) {
  if (!storage) return "reading";
  try {
    const saved = storage.getItem(PILOT_WORKSPACE_VIEW_KEY);
    return VALID_VIEWS.has(saved) ? saved : "reading";
  } catch {
    return "reading";
  }
}

export function savePilotWorkspaceView(view, storage = getSessionStorage()) {
  if (!storage || !VALID_VIEWS.has(view)) return false;
  try {
    storage.setItem(PILOT_WORKSPACE_VIEW_KEY, view);
    return true;
  } catch {
    return false;
  }
}

export const PILOT_WORKSPACE_VIEW_STORAGE_KEY = PILOT_WORKSPACE_VIEW_KEY;
