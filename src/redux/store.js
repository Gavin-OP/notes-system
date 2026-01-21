import { configureStore, current } from "@reduxjs/toolkit";
import preferenceReducer from "./preferenceSlice";
import notesIndexReducer from "./notesIndexSlice";
import currentNoteReducer from "./currentNoteSlice";

const store = configureStore({
  reducer: {
    preference: preferenceReducer,
    notesIndex: notesIndexReducer,
    currentNote: currentNoteReducer,
  },
});

export default store;
