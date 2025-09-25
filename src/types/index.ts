import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import type { Todo } from "../store/slice/todosSlice";

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
