/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Group, TextInput, ActionIcon } from "@mantine/core";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import type { TodoItemProps, EditableTextProps } from "../../../types";

const DragHandle: React.FC<{ dragHandleProps: any }> = ({
  dragHandleProps,
}) => (
  <span {...dragHandleProps} style={{ cursor: "grab" }}>
    <IconGripVertical size={20} stroke={2} />
  </span>
);

const EditableText: React.FC<EditableTextProps> = ({
  value,
  done,
  onChange,
}) => (
  <TextInput
    value={value}
    onChange={(e) => onChange(e.currentTarget.value)}
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
      textDecoration: done ? "line-through" : "none",
    }}
  />
);

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  provided,
  snapshot,
  onTextChange,
  onDelete,
}) => {
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
        width: "100%",
      }}
    >
      <DragHandle dragHandleProps={provided.dragHandleProps} />

      <EditableText
        value={todo.text}
        done={todo.done}
        onChange={onTextChange}
      />

      <ActionIcon
        color="red"
        variant="subtle"
        onClick={() => onDelete?.(todo.id)}
        title="Delete todo"
      >
        <IconTrash size={18} />
      </ActionIcon>
    </Group>
  );
};

export default TodoItem;
