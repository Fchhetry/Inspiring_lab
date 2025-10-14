import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import type { Todo } from "../store/slice/todosSlice";

export type TodoItemProps = {
  todo: Todo;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  onDelete: (id: number | string) => void;
  onUpdate?: (id: number | string, text: string) => void;
  onTextChange: (text: string) => void;
  // onDelete?: (id: string) => void;
};

export type EditableTextProps = {
  value: string;
  done: boolean;
  onChange: (text: string) => void;
};
