import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "./navigationSlice";
import preferenceReducer from "./preferenceSlice";
import notesIndexReducer from "./notesIndexSlice";

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    preference: preferenceReducer,
    notesIndex: notesIndexReducer,
  },
});

export default store;
