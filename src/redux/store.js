import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "./navigationSlice";
import preferenceReducer from "./preferenceSlice";

const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    preference: preferenceReducer,
  },
});

export default store;
