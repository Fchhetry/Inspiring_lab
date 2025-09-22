import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const initialTodos: Todo[] = JSON.parse(
  localStorage.getItem("todos") ||
    `[
    {"id":"1","text":"Learn React","done":false},
    {"id":"2","text":"Practice TypeScript","done":false},
    {"id":"3","text":"Build a To-do App","done":false},
    {"id":"4","text":"Read about Vite","done":false},
    {"id":"5","text":"Install dependencies","done":false},
    {"id":"6","text":"Create components","done":false},
    {"id":"7","text":"Test drag and drop","done":false},
    {"id":"8","text":"Style with CSS","done":false}
  ]`
);

const todosSlice = createSlice({
  name: "todos",
  initialState: initialTodos,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      localStorage.setItem("todos", JSON.stringify(action.payload));
      return action.payload;
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.find((t) => t.id === action.payload);
      if (todo) todo.done = !todo.done;
      localStorage.setItem("todos", JSON.stringify(state));
    },
    updateTodoText: (
      state,
      action: PayloadAction<{ id: string; text: string }>
    ) => {
      const todo = state.find((t) => t.id === action.payload.id);
      if (todo) todo.text = action.payload.text;
      localStorage.setItem("todos", JSON.stringify(state));
    },
  },
});

export const { setTodos, toggleTodo, updateTodoText } = todosSlice.actions;
export default todosSlice.reducer;
