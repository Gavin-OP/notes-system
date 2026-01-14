import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchNotesIndex = createAsyncThunk(
  "notesIndex/fetchNotesIndex",
  async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}notes-index.json`);
    if (!response.ok) throw new Error("Failed to fetch notes index");
    return await response.json();
  }
);

const notesIndexSlice = createSlice({
  name: "notesIndex",
  initialState: {
    data: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotesIndex.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotesIndex.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchNotesIndex.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default notesIndexSlice.reducer;
