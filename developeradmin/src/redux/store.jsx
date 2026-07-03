import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "./getData.jsx";

export const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
});
