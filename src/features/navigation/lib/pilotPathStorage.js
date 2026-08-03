import { PILOT_START_PATH, PILOT_SUBJECT_SLUG } from "../../../config/productMode";

const PILOT_STORAGE_VERSION = 1;
const PILOT_PATH_STORAGE_KEY = "notes-system:fall-recruiting:path";
const PILOT_LAST_NOTE_STORAGE_KEY = "notes-system:fall-recruiting:last-note";

function getStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function isPilotNotePath(value) {
  const path = String(value || "").trim();
  return path.startsWith(`/note/${PILOT_SUBJECT_SLUG}/`) && path.includes(".md");
}

export function loadPilotPathDraft() {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const payload = JSON.parse(storage.getItem(PILOT_PATH_STORAGE_KEY) || "null");
    if (!payload || payload.version !== PILOT_STORAGE_VERSION) return null;
    return payload.draft && typeof payload.draft === "object" ? payload.draft : null;
  } catch {
    return null;
  }
}

export function savePilotPathDraft(draft) {
  const storage = getStorage();
  if (!storage || !draft || typeof draft !== "object") return false;
  try {
    storage.setItem(PILOT_PATH_STORAGE_KEY, JSON.stringify({
      version: PILOT_STORAGE_VERSION,
      saved_at: new Date().toISOString(),
      draft,
    }));
    return true;
  } catch {
    return false;
  }
}

export function clearPilotPathDraft() {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(PILOT_PATH_STORAGE_KEY);
  } catch {
    // Local persistence is optional when browser storage is unavailable.
  }
}

export function loadPilotLastNotePath() {
  const storage = getStorage();
  if (!storage) return PILOT_START_PATH;
  try {
    const savedPath = storage.getItem(PILOT_LAST_NOTE_STORAGE_KEY);
    return isPilotNotePath(savedPath) ? savedPath : PILOT_START_PATH;
  } catch {
    return PILOT_START_PATH;
  }
}

export function savePilotLastNotePath(path) {
  if (!isPilotNotePath(path)) return;
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(PILOT_LAST_NOTE_STORAGE_KEY, path);
  } catch {
    // Keep navigation functional even when local storage is blocked.
  }
}

export const PILOT_PATH_LOCAL_STORAGE_KEY = PILOT_PATH_STORAGE_KEY;
