import React, { useState, useRef, useEffect } from "react";
import {
  TextInput,
  ActionIcon,
  Tooltip,
  Modal,
  Button,
  Textarea,
  Stack,
} from "@mantine/core";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { useDispatch } from "react-redux";
import { editCard, deleteCard } from "../../../../store/slice/todosSlice";
import type { TodoItemProps, EditableTextProps, Todo } from "../../../../types";

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
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const { show } = useContextMenu({ id: MENU_ID });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    show({ event, props: { todo } });
  };

  const handleTextChange = (newValue: string) => {
    onTextChange?.(newValue);
    dispatch(editCard({ cardId: todo.id, title: newValue, content: newValue }));
  };

  const handleDelete = (id: string | number) => {
    onDelete?.(id);
    dispatch(deleteCard({ cardId: String(id) }));
  };

  const handleEditOpen = (t: Todo) => {
    setEditTitle(t.text);
    setEditDescription(t.description ?? "");
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    dispatch(
      editCard({
        cardId: todo.id,
        title: editTitle,
        content: editTitle,
        description: editDescription,
      })
    );
    setEditModalOpen(false);
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
          onChange={handleTextChange}
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
            onClick={() => handleDelete(todo.id)}
            title="Delete todo"
          >
            <IconTrash size={18} />
          </ActionIcon>
        </div>
      </div>

      <Menu id={MENU_ID}>
        <Item onClick={({ props }) => handleEditOpen(props.todo)}>Edit</Item>
        <Item onClick={({ props }) => handleDelete(props.todo.id)}>Delete</Item>
      </Menu>

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Todo"
        centered
        zIndex={2000}
      >
        <Stack>
          <TextInput
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.currentTarget.value)}
          />
          <Textarea
            label="Description"
            minRows={3}
            value={editDescription}
            onChange={(e) => setEditDescription(e.currentTarget.value)}
          />
          <Button onClick={handleSaveEdit} color="blue" mt="sm">
            update
          </Button>
        </Stack>
      </Modal>
    </>
  );
};

export default TodoItem;
