import { createSlice } from "@reduxjs/toolkit";

const navigationSlice = createSlice({
  name: "navigation",
  initialState: {
    currentPage: "",
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setCurrentPage } = navigationSlice.actions;
export default navigationSlice.reducer;
