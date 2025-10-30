import React, { useState, useRef, useEffect } from "react";
import { ActionIcon, Tooltip, TextInput } from "@mantine/core";
import { IconGripVertical, IconTrash } from "@tabler/icons-react";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import { useDispatch } from "react-redux";
import { editCard, deleteCard } from "../../../../store/slice/todosSlice";
import type { TodoItemProps, EditableTextProps } from "../../../../types";
import CreateEditCard from "../../../components/CreateEditCard";
import type { Editor } from "@tiptap/react";
import type { ItemParams } from "react-contexify";

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
      onChange={onChange ? (e) => onChange(e.currentTarget.value) : undefined}
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

const TodoItem: React.FC<TodoItemProps & { editor: Editor | null }> = ({
  todo,
  provided,
  snapshot,
  onTextChange,
  onDelete,
  editor,
}) => {
  const dispatch = useDispatch();
  const [hovered, setHovered] = useState(false);
  const [editing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const { show, hideAll } = useContextMenu({ id: MENU_ID });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
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

 
  const handleEditOpen = (params: ItemParams) => {
    params.event?.stopPropagation();
    params.event?.preventDefault();

    hideAll();
    setEditTitle(todo.text);
    setEditDescription(todo.description ?? "");
    setEditModalOpen(true);
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
          padding: 4,
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
          onChange={editModalOpen ? () => {} : handleTextChange}
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
        <Item onClick={handleEditOpen}>Edit</Item>
        <Item onClick={() => handleDelete(todo.id)}>Delete</Item>
      </Menu>

      {editModalOpen && (
        <CreateEditCard
          listId=""
          editingCard={{
            id: todo.id,
            title: editTitle,
            content: editTitle,
            description: editDescription,
          }}
          setEditingCard={() => setEditModalOpen(false)}
          opened={editModalOpen}
          setOpened={setEditModalOpen}
          isEditMode={true}
          setIsEditMode={() => {}}
          editor={editor}
        />
      )}
    </>
  );
};

export default TodoItem;
