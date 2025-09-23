import React from "react";
import { Group, TextInput } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import type { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import type { Todo } from "../../Constants/todosSlice";

type TodoItemProps = {
  todo: Todo;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  onTextChange: (text: string) => void;
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, provided, snapshot, onTextChange }) => {
  return (
    <Group
      ref={provided.innerRef}
      {...provided.draggableProps}
      gap="sm"
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        background: snapshot.isDragging ? "#d1fae5" : "#fff",
        borderRadius: "6px",
        marginBottom: "6px",
        display: "flex",
        alignItems: "center",
        ...provided.draggableProps.style,
      }}
    >
      <span
        {...provided.dragHandleProps}
        style={{ cursor: "grab" }}
      >
        <IconGripVertical size={24} stroke={2} />
      </span>

      <TextInput
        value={todo.text}
        onChange={(e) => onTextChange(e.currentTarget.value)}
        variant="unstyled"
        styles={{
          input: {
            border: "none",
            outline: "none",
            boxShadow: "none",
            background: "transparent",
            padding: 0,
            margin: 0,
            fontSize: "16px",
          },
        }}
        style={{
          flex: 1,
          width: "100%",
          textDecoration: todo.done ? "line-through" : "none",
        }}
      />
    </Group>
  );
};

export default TodoItem;
