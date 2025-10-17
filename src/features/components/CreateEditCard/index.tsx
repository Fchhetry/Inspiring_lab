import React, { useEffect, useState } from "react";
import {
  Modal,
  Title,
  Group,
  Button,
  ActionIcon,
  Stack,
  TextInput,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { RichTextEditor } from "@mantine/tiptap";
import type { Editor } from "@tiptap/react";
import type { CardType } from "../../KanbanBoard/types";
import { useDispatch } from "react-redux";
import { addCard, editCard, deleteCard } from "../../../store/slice/todosSlice";

interface CreateEditCardProps {
  listId: string;
  editingCard: CardType | null;
  setEditingCard: (card: CardType | null) => void;
  opened: boolean;
  setOpened: (value: boolean) => void;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
  editor: Editor | null;
}

const CreateEditCard: React.FC<CreateEditCardProps> = ({
  listId,
  editingCard,
  setEditingCard,
  opened,
  setOpened,
  isEditMode,
  setIsEditMode,
  editor,
}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (!editor) return;

    if (editingCard) {
      setIsEditMode(true);
      setTitle(editingCard.title || "");
      editor.commands.setContent(editingCard.description || "");
      if (!opened) setOpened(true);
    }
  }, [editingCard, editor]);

  const handleCancel = () => {
    setOpened(false);

    setTimeout(() => {
      setTitle("");
      editor?.commands.clearContent();
      setEditingCard(null);
      setIsEditMode(false);
    }, 200);
  };

  const handleSave = () => {
    if (!editor) return;

    const trimmedTitle = title.trim();
    const descriptionHTML = editor.getHTML();
    if (!trimmedTitle) return;

    if (isEditMode && editingCard) {
      dispatch(
        editCard({
          cardId: editingCard.id,
          title: trimmedTitle,
          content: trimmedTitle,
          description: descriptionHTML,
        })
      );
    } else {
      const newCard: CardType = {
        id: `card-${Date.now()}`,
        title: trimmedTitle,
        content: trimmedTitle,
        description: descriptionHTML,
      };
      dispatch(addCard({ listId, card: newCard }));
    }

    handleCancel();
  };

  const handleDelete = () => {
    if (editingCard) {
      dispatch(deleteCard({ cardId: editingCard.id }));
      handleCancel();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      withCloseButton={false}
      centered
      overlayProps={{ backgroundOpacity: 0.25, blur: 2 }}
      styles={{
        content: {
          width: "100%",
          maxWidth: 500,
          padding: 20,
          borderRadius: 8,
        },
      }}
    >
      <Group align="apart" mb="md">
        <Title order={3}>{isEditMode ? "Edit Card" : "Add New Card"}</Title>

        <ActionIcon
          variant="subtle"
          color="gray"
          onClick={handleCancel}
          size="lg"
          radius="xl"
        >
          <IconX size={20} stroke={2} />
        </ActionIcon>
      </Group>

      <Stack gap="sm">
        <TextInput
          label="Title"
          placeholder="Enter card title"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
        />
        <div>
          <label
            style={{
              display: "block",
              fontWeight: 500,
              marginBottom: 6,
              fontSize: 14,
              color: "#212529",
            }}
          >
            Description
          </label>

          <div
            style={{
              border: "1px solid #dee2e6",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <RichTextEditor editor={editor} style={{ minHeight: 150 }}>
              <RichTextEditor.Toolbar sticky>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content />
            </RichTextEditor>
          </div>
          <p style={{ fontSize: 12, color: "#868e96", marginTop: 4 }}>
            Write a short description about the task.
          </p>
        </div>

        <Group align="right" mt="md" gap="sm">
          {isEditMode && (
            <Button color="red" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button color="blue" onClick={handleSave}>
            {isEditMode ? "Update" : "Save"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default CreateEditCard;
