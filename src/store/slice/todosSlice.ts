import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CardType, KanbanData } from "../../features/KanbanBoard/types";
import type { Todo } from "../../types";

const initialTodos: Todo[] = JSON.parse(
  localStorage.getItem("todos") ||
    `[{
      "id":"1","text":"Learn React","description":"Start from docs","done":false
    },
    {"id":"2","text":"Practice TypeScript","description":"Review types","done":false},
    {"id":"3","text":"Build a To-do App","description":"Integrate Redux","done":false},
    {"id":"4","text":"Read about Vite","description":"Compare with CRA","done":false},
    {"id":"5","text":"Install dependencies","description":"Run npm install","done":false},
    {"id":"6","text":"Create components","description":"Design UI layout","done":false},
    {"id":"7","text":"Test drag and drop","description":"Use hello-pangea/dnd","done":false},
    {"id":"8","text":"Style with CSS","description":"Polish UI","done":false}]`
);

const todoCards: Record<string, CardType> = initialTodos.reduce((acc, todo) => {
  acc[todo.id] = {
    id: todo.id,
    content: todo.text,
    title: todo.text,
    description: todo.description ?? "",
  };
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
const updateTodosFromCards = (cards: Record<string, CardType>) => {
  const todos: Todo[] = Object.values(cards).map((card) => ({
    id: card.id,
    text: card.title || card.content,
    description: card.description ?? "",
    done: false,
  }));
  localStorage.setItem("todos", JSON.stringify(todos));
};
const todosSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<KanbanData>) => {
      localStorage.setItem("kanban-data", JSON.stringify(action.payload));
      updateTodosFromCards(action.payload.cards);
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
      updateTodosFromCards(state.cards);
    },

    deleteCard: (state, action: PayloadAction<{ cardId: string }>) => {
      const { cardId } = action.payload;
      delete state.cards[cardId];
      Object.values(state.lists).forEach((list) => {
        list.cardIds = list.cardIds.filter((id) => id !== cardId);
      });
      localStorage.setItem("kanban-data", JSON.stringify(state));
      updateTodosFromCards(state.cards);
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
      updateTodosFromCards(state.cards);
    },
  },
});

export const { setData, addCard, editCard, deleteCard } = todosSlice.actions;
export default todosSlice.reducer;