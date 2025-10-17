import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import type { Todo } from "../store/slice/todosSlice";
import type { CardType } from "../features/KanbanBoard/types";
import type { Editor } from "@tiptap/react";

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

export interface CreateEditCardProps {
  listId: string;
  editingCard: CardType | null;
  setEditingCard: (card: CardType | null) => void;
  opened: boolean;
  setOpened: (value: boolean) => void;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  editor: Editor | null;
}

export interface CardProps {
  card: CardType;
  provided: DraggableProvided;
  isCombining?: boolean;
  isDragging?: boolean;
  setEditingCard: (card: CardType | null) => void;
  setIsEditMode: (value: boolean) => void;
  setOpened: (value: boolean) => void;
}
