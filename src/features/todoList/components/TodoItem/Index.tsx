import React from "react";
import { TextInput, ActionIcon, Tooltip } from "@mantine/core";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import type { TodoItemProps, EditableTextProps } from "../../../../types";

const DragHandle: React.FC<{ dragHandleProps: any }> = ({
  dragHandleProps,
}) => (
  <span {...dragHandleProps} style={{ cursor: "grab", display: "flex" }}>
    <IconGripVertical size={20} stroke={2} />
  </span>
);

const EditableText: React.FC<EditableTextProps> = ({
  value,
  done,
  onChange,
}) => (
  <Tooltip label={value} position="top" withArrow>
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
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
      }}
      style={{
        flex: 1,
        width: "100%",
        textDecoration: done ? "line-through" : "none",
      }}
    />
  </Tooltip>
);

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  provided,
  snapshot,
  onTextChange,
  onDelete,
}) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      style={{
        ...provided.draggableProps.style,
        background: snapshot.isDragging ? "#d1fae5" : "#fff",
        border: "1px solid #ccc",
        borderRadius: 6,
        padding: "4px 8px",
        marginBottom: 4,
        display: "flex",
        alignItems: "center",
        minHeight: 36,
      }}
    >
      <DragHandle dragHandleProps={provided.dragHandleProps} />

      <EditableText
        value={todo.text}
        done={todo.done ?? false}
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
    </div>
  );
};

export default TodoItem;
