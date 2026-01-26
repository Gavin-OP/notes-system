import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meta: null,
  outline: [],
};

const currentNoteSlice = createSlice({
  name: "currentNote",
  initialState,
  reducers: {
    setCurrentNoteMeta(state, action) {
      state.meta = action.payload;
    },
    clearCurrentNoteMeta(state) {
      state.meta = null;
    },
    setCurrentNoteOutline(state, action) {
      state.outline = action.payload;
    },
  },
});

export const {
  setCurrentNoteMeta,
  clearCurrentNoteMeta,
  setCurrentNoteOutline,
} = currentNoteSlice.actions;
export default currentNoteSlice.reducer;
