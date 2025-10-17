import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CardType, KanbanData } from "../../features/KanbanBoard/types";

export type Todo = {
  id: string;
  text: string;
  done: boolean;
};

const initialTodos: Todo[] = JSON.parse(
  localStorage.getItem("todos") ||
    `[{
      "id":"1","text":"Learn React","done":false
    },
    {"id":"2","text":"Practice TypeScript","done":false},
    {"id":"3","text":"Build a To-do App","done":false},
    {"id":"4","text":"Read about Vite","done":false},
    {"id":"5","text":"Install dependencies","done":false},
    {"id":"6","text":"Create components","done":false},
    {"id":"7","text":"Test drag and drop","done":false},
    {"id":"8","text":"Style with CSS","done":false}]`
);

const todoCards: Record<string, CardType> = initialTodos.reduce((acc, todo) => {
  acc[todo.id] = { id: todo.id, content: todo.text };
  return acc;
}, {} as Record<string, CardType>);

const initialState: KanbanData = JSON.parse(
  localStorage.getItem("kanban-data") ||
    JSON.stringify({
      lists: {
        "todo-list": {
          id: "todo-list",
          title: "To Do",
          cardIds: initialTodos.map((t) => t.id),
        },
        "list-2": { id: "list-2", title: "In Progress", cardIds: [] },
        "list-3": { id: "list-3", title: "Done", cardIds: [] },
      },
      cards: todoCards,
      listOrder: ["todo-list", "list-2", "list-3"],
    })
);

const todosSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<KanbanData>) => {
      localStorage.setItem("kanban-data", JSON.stringify(action.payload));
      return action.payload;
    },
    addCard: (
      state,
      action: PayloadAction<{ listId: string; card: CardType }>
    ) => {
      const { listId, card } = action.payload;

      state.cards[card.id] = {
        id: card.id,
        content: card.content,
        title: card.title ?? card.content,
        description: card.description ?? "",
      };

      state.lists[listId].cardIds.push(card.id);
      localStorage.setItem("kanban-data", JSON.stringify(state));
    },

    deleteCard: (state, action: PayloadAction<{ cardId: string }>) => {
      const { cardId } = action.payload;
      delete state.cards[cardId];
      Object.values(state.lists).forEach((list) => {
        list.cardIds = list.cardIds.filter((id) => id !== cardId);
      });
      localStorage.setItem("kanban-data", JSON.stringify(state));
    },

    editCard: (
      state,
      action: PayloadAction<{
        cardId: string;
        title?: string;
        content?: string;
        description?: string;
      }>
    ) => {
      const { cardId, title, content, description } = action.payload;
      const card = state.cards[cardId];

      if (card) {
        state.cards = {
          ...state.cards,
          [cardId]: {
            ...card,
            title: title ?? card.title,
            content: content ?? card.content,
            description: description ?? card.description,
          },
        };
      }

      localStorage.setItem("kanban-data", JSON.stringify(state));
    },
  },
});

export const { setData, addCard, editCard, deleteCard } = todosSlice.actions;
export default todosSlice.reducer;
