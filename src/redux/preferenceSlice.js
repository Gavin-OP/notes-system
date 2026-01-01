import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: "en",
  theme: "light",
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
  },
});

export const { setLanguage, setTheme } = preferenceSlice.actions;
export default preferenceSlice.reducer;
