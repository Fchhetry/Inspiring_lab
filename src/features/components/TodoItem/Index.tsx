import React from "react";
import { Group, TextInput } from "@mantine/core";
import { IconGripVertical } from "@tabler/icons-react";
import type { TodoItemProps, EditableTextProps } from "../../../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        fontSize: "16px",
        textDecoration: done ? "line-through" : "none",
      },
    }}
    style={{ flex: 1, width: "100%" }}
  />
);

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  provided,
  snapshot,
  onTextChange,
}) => (
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
    <DragHandle dragHandleProps={provided.dragHandleProps} />
    <EditableText value={todo.text} done={todo.done} onChange={onTextChange} />
  </Group>
);

export default TodoItem;
