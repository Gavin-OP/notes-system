import { createSlice } from "@reduxjs/toolkit";
import { isMobileViewport } from "../utils/breakpoints";

const initialState = {
  language: "en",
  theme: "light",
  isMobile: isMobileViewport(),
};

const preferenceSlice = createSlice({
  name: "preference",
  initialState,
  reducers: {
    setLanguage(state, action) {
      state.language = action.payload;
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    setIsMobile(state, action) {
      state.isMobile = action.payload;
    },
  },
});

export const { setLanguage, setTheme, setIsMobile } = preferenceSlice.actions;
export default preferenceSlice.reducer;
