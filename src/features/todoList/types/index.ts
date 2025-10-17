import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import type { Todo } from "../../../types";

export type TodoItemProps = {
  todo: Todo;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  onTextChange: (text: string) => void;
  onDelete?: (id: string) => void;
};

export type EditableTextProps = {
  value: string;
  done: boolean;
  onChange: (text: string) => void;
};
