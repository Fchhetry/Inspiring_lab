import React, { useState, useRef, useEffect } from "react";
import { TextInput, ActionIcon, Tooltip } from "@mantine/core";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import type { TodoItemProps, EditableTextProps } from "../../../../types";

const MENU_ID = "TODO_CONTEXT_MENU";

const DragHandle: React.FC<{ dragHandleProps: any }> = ({
  dragHandleProps,
}) => (
  <span {...dragHandleProps} style={{ cursor: "grab", display: "flex" }}>
    <IconGripVertical size={20} stroke={2} />
  </span>
);

const EditableText: React.FC<EditableTextProps & { focus?: boolean }> = ({
  value,
  done,
  onChange,
  focus,
}) => {
  const [isOverflowed, setIsOverflowed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (el) setIsOverflowed(el.scrollWidth > el.clientWidth);
  }, [value]);

  useEffect(() => {
    if (focus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [focus]);

  const textInput = (
    <TextInput
      ref={inputRef}
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
  );

  return isOverflowed ? (
    <Tooltip label={value} position="top" withArrow>
      {textInput}
    </Tooltip>
  ) : (
    textInput
  );
};

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  provided,
  snapshot,
  onTextChange,
  onDelete,
}) => {
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const { show } = useContextMenu({ id: MENU_ID });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    show({ event, props: { todo } });
  };

  return (
    <>
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        onContextMenu={handleContextMenu}
        style={{
          ...provided.draggableProps.style,
          background: snapshot.isDragging ? "#d1fae5" : "#fff",
          border: "1px solid #ccc",
          borderRadius: 6,
          padding: "4px",
          marginBottom: 4,
          display: "flex",
          alignItems: "center",
          minHeight: 36,
          cursor: "pointer",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <DragHandle dragHandleProps={provided.dragHandleProps} />

        <EditableText
          value={todo.text}
          done={todo.done ?? false}
          onChange={onTextChange}
          focus={editing}
        />

        <div
          style={{
            marginLeft: 8,
            display: "flex",
            alignItems: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          <ActionIcon
            color="red"
            variant="subtle"
            onClick={() => onDelete?.(todo.id)}
            title="Delete todo"
          >
            <IconTrash size={18} />
          </ActionIcon>
        </div>
      </div>

      <Menu id={MENU_ID}>
        <Item onClick={() => setEditing(true)}>Edit</Item>
        <Item onClick={({ props }) => onDelete?.(props.todo.id)}> Delete</Item>
      </Menu>
    </>
  );
};

export default TodoItem;
