import { configureStore, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { DataType, CardType } from "./types";

//Load from localStorage
const loadState = (): DataType | undefined => {
  try {
    const serialized = localStorage.getItem("kanban-data");
    return serialized ? JSON.parse(serialized) : undefined;
  } catch {
    return undefined;
  }
};

//Save to localStorage
const saveState = (state: DataType) => {
  try {
    localStorage.setItem("kanban-data", JSON.stringify(state));
  } catch {
    //ignores errors
  }
};

const initialState: DataType = loadState() || {
  lists: {
    "list-1": { id: "list-1", title: "To Do", cardIds: ["card-1", "card-2"] },
    "list-2": { id: "list-2", title: "In Progress", cardIds: ["card-3"] },
    "list-3": { id: "list-3", title: "Done", cardIds: [] },
  },
  cards: {
    "card-1": { id: "card-1", content: "Task 1" },
    "card-2": { id: "card-2", content: "Task 2" },
    "card-3": { id: "card-3", content: "Task 3" },
  },
  listOrder: ["list-1", "list-2", "list-3"],
};

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<DataType>) => action.payload,
    addCard: (
      state,
      action: PayloadAction<{ listId: string; card: CardType }>
    ) => {
      const { listId, card } = action.payload;
      state.cards[card.id] = card;
      state.lists[listId].cardIds.push(card.id);
    },
    editCard: (
      state,
      action: PayloadAction<{ cardId: string; content: string }>
    ) => {
      state.cards[action.payload.cardId].content = action.payload.content;
    },
  },
});

export const { setData, addCard, editCard } = kanbanSlice.actions;

const store = configureStore({
  reducer: {
    kanban: kanbanSlice.reducer,
  },
});

store.subscribe(() => {
  saveState(store.getState().kanban);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
