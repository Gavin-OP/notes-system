import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { replaceSubjectFolderWithGraphNotes } from "../utils/notesIndexUtils";

function applySubjectOverrides(baseNotesIndex, subjectOverrides) {
  if (!Array.isArray(baseNotesIndex)) return [];
  if (!subjectOverrides || typeof subjectOverrides !== "object") {
    return baseNotesIndex;
  }

  return Object.entries(subjectOverrides).reduce((currentData, [subjectId, graphNotesIndex]) => {
    return replaceSubjectFolderWithGraphNotes(currentData, subjectId, graphNotesIndex);
  }, baseNotesIndex);
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
    } catch (error) {
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

export const fetchNotesIndex = createAsyncThunk(
  "notesIndex/fetchNotesIndex",
  async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}notes-index.json`);
    if (!response.ok) throw new Error("Failed to fetch notes index");
    const baseNotesIndex = await response.json();

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
        } catch (error) {
          // Ignore per-subject graph failure at boot, keep base notes-index visible.
        }
      })
    );

    return {
      defaultData: baseNotesIndex,
      data: applySubjectOverrides(baseNotesIndex, subjectNotesOverrides),
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

    return {
      subjectId,
      graphNotesIndex: graphData?.notesIndex ?? [],
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
