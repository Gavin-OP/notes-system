import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  meta: null,
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
  },
});

export const { setCurrentNoteMeta, clearCurrentNoteMeta } =
  currentNoteSlice.actions;
export default currentNoteSlice.reducer;
