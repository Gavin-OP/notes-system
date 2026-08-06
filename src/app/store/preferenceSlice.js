import { createSlice } from "@reduxjs/toolkit";

function loadLanguage() {
  try {
    const saved = window.localStorage.getItem("notes-system:language");
    return ["cn", "tw", "en"].includes(saved) ? saved : "cn";
  } catch {
    return "cn";
  }
}

const initialState = {
  language: loadLanguage(),
  theme: "light",
  isMobile: window.innerWidth < 768,
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
