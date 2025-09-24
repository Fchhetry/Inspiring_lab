import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import type { Todo } from "../store/slice/todosSlice";
export interface CardType {
  id: string;
  content: string;
}

export interface ListType {
  id: string;
  title: string;
  cardIds: string[];
}

export interface DataType {
  lists: Record<string, ListType>;
  cards: Record<string, CardType>;
  listOrder: string[];
}

export type TodoItemProps = {
  todo: Todo;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  onTextChange: (text: string) => void;
};

export type EditableTextProps = {
  value: string;
  done: boolean;
  onChange: (text: string) => void;
};
