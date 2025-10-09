import { configureStore } from "@reduxjs/toolkit";
import todosReducer from "./slice/todosSlice";

const store = configureStore({
  reducer: {
    kanban: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
