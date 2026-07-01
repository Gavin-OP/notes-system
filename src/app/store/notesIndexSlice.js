import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { normalizeUrl, replaceSubjectFolderWithGraphNotes } from "../../features/navigation/lib/notesIndexUtils";

function applySubjectOverrides(baseNotesIndex, subjectOverrides) {
  if (!Array.isArray(baseNotesIndex)) return [];
  if (!subjectOverrides || typeof subjectOverrides !== "object") {
    return baseNotesIndex;
  }

  return Object.entries(subjectOverrides).reduce((currentData, [subjectId, graphNotesIndex]) => {
    return replaceSubjectFolderWithGraphNotes(currentData, subjectId, graphNotesIndex);
  }, baseNotesIndex);
}

function collectFileNoteUrls(items, urls = new Set()) {
  if (!Array.isArray(items)) return urls;
  items.forEach((item) => {
    if (!item || typeof item !== "object") return;
    if (item.type === "file" && typeof item.url === "string") {
      urls.add(normalizeUrl(item.url));
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      collectFileNoteUrls(item.children, urls);
    }
  });
  return urls;
}

function countFileItems(items) {
  if (!Array.isArray(items)) return 0;
  let count = 0;
  items.forEach((item) => {
    if (!item || typeof item !== "object") return;
    if (item.type === "file") {
      count += 1;
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      count += countFileItems(item.children);
    }
  });
  return count;
}

function noteUrlToAssetPath(noteUrl) {
  if (typeof noteUrl !== "string" || !noteUrl.startsWith("/note/")) return null;
  let relativePath = noteUrl.replace(/^\/note\//, "");
  if (!relativePath) return null;
  if (relativePath.endsWith("/index")) {
    relativePath = relativePath.replace(/\/index$/, "/_index.md");
  } else if (!relativePath.endsWith(".md")) {
    relativePath = `${relativePath}.md`;
  }
  return `${import.meta.env.BASE_URL}notes/${relativePath}`;
}

async function validateNoteUrl(noteUrl) {
  const assetPath = noteUrlToAssetPath(noteUrl);
  if (!assetPath) return false;
  try {
    const response = await fetch(assetPath, { cache: "no-store" });
    if (!response.ok) return false;
    const contentType = (response.headers.get("content-type") || "").toLowerCase();
    // Vite dev fallback can return index.html with 200; treat it as missing note.
    if (contentType.includes("text/html")) {
      const text = await response.text();
      const looksLikeAppShell =
        /<title>\s*notes-system\s*<\/title>/i.test(text) ||
        /@vite\/client/i.test(text);
      if (looksLikeAppShell) return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function buildValidNoteUrlSet(items) {
  const fileUrls = [...collectFileNoteUrls(items)];
  const results = await Promise.all(
    fileUrls.map(async (noteUrl) => ({
      noteUrl,
      valid: await validateNoteUrl(noteUrl),
    })),
  );
  return new Set(
    results
      .filter((entry) => entry.valid)
      .map((entry) => normalizeUrl(entry.noteUrl)),
  );
}

function pruneNotesIndexByValidUrls(items, validUrls) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      if (item.type === "file") {
        return validUrls.has(normalizeUrl(item.url)) ? item : null;
      }
      if (Array.isArray(item.children)) {
        const nextChildren = pruneNotesIndexByValidUrls(item.children, validUrls);
        if (item.type === "folder" && nextChildren.length === 0) {
          return null;
        }
        return {
          ...item,
          children: nextChildren,
        };
      }
      return item;
    })
    .filter(Boolean);
}

async function sanitizeNotesIndex(items) {
  const validUrls = await buildValidNoteUrlSet(items);
  const sanitized = pruneNotesIndexByValidUrls(items, validUrls);
  // Some static hosts (e.g. GitHub Pages with Jekyll processing) can make .md probing unreliable.
  // If validation prunes everything, keep original index as a safe fallback.
  if (countFileItems(items) > 0 && countFileItems(sanitized) === 0) {
    return items;
  }
  return sanitized;
}

function collectSubjectIdsFromNotesIndex(items, subjectIds = new Set()) {
  if (!Array.isArray(items)) return subjectIds;
  items.forEach((item) => {
    if (!item || typeof item !== "object") return;
    if (item.type === "folder" && typeof item.url === "string") {
      const match = item.url.match(/^\/note\/([^/]+)$/);
      if (match?.[1]) {
        subjectIds.add(match[1]);
      }
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      collectSubjectIdsFromNotesIndex(item.children, subjectIds);
    }
  });
  return subjectIds;
}

async function fetchSubjectGraphData(subjectId) {
  const configuredApiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const apiPaths = [
    configuredApiBase ? `${configuredApiBase}/api/subjects/${subjectId}/graph` : null,
    `${import.meta.env.BASE_URL}api/subjects/${subjectId}/graph`,
    `/api/subjects/${subjectId}/graph`,
  ].filter(Boolean);
  const staticPath = `${import.meta.env.BASE_URL}graphs/${subjectId}-graph.json`;

  const tryFetchJson = async (path) => {
    try {
      const response = await fetch(path);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  };

  for (const apiPath of apiPaths) {
    const apiData = await tryFetchJson(apiPath);
    if (apiData) {
      return apiData;
    }
  }

  return await tryFetchJson(staticPath);
}

async function fetchNotesIndexJson() {
  const configuredBase = import.meta.env.BASE_URL || "/";
  const normalizedBase = configuredBase.endsWith("/") ? configuredBase : `${configuredBase}/`;
  const candidatePaths = Array.from(
    new Set([
      `${normalizedBase}notes-index.json`,
      "/notes-system/notes-index.json",
      "/notes-index.json",
      "notes-index.json",
    ])
  );

  for (const path of candidatePaths) {
    try {
      const response = await fetch(path, { cache: "no-store" });
      if (!response.ok) continue;
      const payload = await response.json();
      if (Array.isArray(payload)) return payload;
    } catch {
      // try next candidate
    }
  }

  throw new Error("Failed to fetch notes index");
}

export const fetchNotesIndex = createAsyncThunk(
  "notesIndex/fetchNotesIndex",
  async () => {
    const baseNotesIndex = await fetchNotesIndexJson();

    const subjectIds = Array.from(collectSubjectIdsFromNotesIndex(baseNotesIndex)).sort();
    const subjectNotesOverrides = {};
    await Promise.all(
      subjectIds.map(async (subjectId) => {
        try {
          const graphData = await fetchSubjectGraphData(subjectId);
          const graphNotesIndex = Array.isArray(graphData?.notesIndex)
            ? graphData.notesIndex
            : [];
          if (graphNotesIndex.length > 0) {
            subjectNotesOverrides[subjectId] = graphNotesIndex;
          }
        } catch {
          // Ignore per-subject graph failure at boot, keep base notes-index visible.
        }
      })
    );

    const dataWithOverrides = applySubjectOverrides(baseNotesIndex, subjectNotesOverrides);
    const sanitizedData = await sanitizeNotesIndex(dataWithOverrides);

    return {
      defaultData: baseNotesIndex,
      data: sanitizedData,
      subjectNotesOverrides,
    };
  }
);

export const fetchSubjectNotesIndexFromGraph = createAsyncThunk(
  "notesIndex/fetchSubjectNotesIndexFromGraph",
  async (subjectId) => {
    if (!subjectId) {
      throw new Error("Missing subjectId");
    }

    const graphData = await fetchSubjectGraphData(subjectId);
    if (!graphData) {
      throw new Error("Failed to fetch subject graph for notes index");
    }

    const rawGraphNotesIndex = Array.isArray(graphData?.notesIndex) ? graphData.notesIndex : [];
    const uniqueNoteUrls = new Set();
    rawGraphNotesIndex.forEach((entry) => {
      const noteUrl = normalizeUrl(String(entry?.noteUrl || "").split("#")[0]);
      if (typeof noteUrl === "string" && noteUrl.startsWith("/note/")) {
        uniqueNoteUrls.add(noteUrl);
      }
    });
    const validationResults = await Promise.all(
      [...uniqueNoteUrls].map(async (noteUrl) => ({
        noteUrl,
        valid: await validateNoteUrl(noteUrl),
      })),
    );
    const validNoteUrls = new Set(
      validationResults.filter((entry) => entry.valid).map((entry) => entry.noteUrl),
    );
    let sanitizedGraphNotesIndex = rawGraphNotesIndex.filter((entry) => {
      const noteUrl = normalizeUrl(String(entry?.noteUrl || "").split("#")[0]);
      return validNoteUrls.has(noteUrl);
    });
    if (rawGraphNotesIndex.length > 0 && sanitizedGraphNotesIndex.length === 0) {
      sanitizedGraphNotesIndex = rawGraphNotesIndex;
    }

    return {
      subjectId,
      graphNotesIndex: sanitizedGraphNotesIndex,
    };
  }
);

const notesIndexSlice = createSlice({
  name: "notesIndex",
  initialState: {
    data: null,
    defaultData: null,
    subjectNotesOverrides: {},
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    restoreDefaultNotesIndex(state) {
      if (state.defaultData) {
        state.data = applySubjectOverrides(state.defaultData, state.subjectNotesOverrides);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotesIndex.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotesIndex.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.defaultData = action.payload.defaultData;
        state.subjectNotesOverrides = action.payload.subjectNotesOverrides ?? {};
        state.data = action.payload.data ?? action.payload.defaultData;
      })
      .addCase(fetchNotesIndex.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSubjectNotesIndexFromGraph.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchSubjectNotesIndexFromGraph.fulfilled, (state, action) => {
        const subjectId = action.payload?.subjectId;
        const graphNotesIndex = Array.isArray(action.payload?.graphNotesIndex)
          ? action.payload.graphNotesIndex
          : [];

        if (subjectId) {
          state.subjectNotesOverrides[subjectId] = graphNotesIndex;
        }

        if (Array.isArray(state.defaultData)) {
          state.data = applySubjectOverrides(state.defaultData, state.subjectNotesOverrides);
        }
      })
      .addCase(fetchSubjectNotesIndexFromGraph.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { restoreDefaultNotesIndex } = notesIndexSlice.actions;
export default notesIndexSlice.reducer;
