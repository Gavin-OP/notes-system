import { configureStore } from "@reduxjs/toolkit";
import preferenceReducer from "./preferenceSlice";
import notesIndexReducer from "./notesIndexSlice";

const store = configureStore({
  reducer: {
    preference: preferenceReducer,
    notesIndex: notesIndexReducer,
  },
});

export default store;
