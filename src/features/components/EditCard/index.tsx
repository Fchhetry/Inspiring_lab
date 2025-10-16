import React, { useState, useEffect } from "react";
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
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { CardType } from "../../KanbanBoard/types";
import { useDispatch } from "react-redux";
import { addCard, editCard } from "../../../store/slice/todosSlice";

interface EditCardProps {
  opened: boolean;
  onClose: () => void;
  isEditMode: boolean;
  listId: string;
  editingCard: CardType | null;
}

const EditCard: React.FC<EditCardProps> = ({
  opened,
  onClose,
  isEditMode,
  listId,
  editingCard,
}) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  useEffect(() => {
    if (!editor) return;

    if (opened) {
      if (editingCard) {
        setTitle(editingCard.title || "");
        editor.commands.setContent(editingCard.description || "");
      } else {
        setTitle("");
        editor.commands.setContent("");
      }
    }
  }, [opened, editingCard, editor]);

  const handleCancel = () => {
    setTitle("");
    editor?.commands.setContent("");
    onClose();
  };

  const handleSave = () => {
    if (!editor) return;

    const trimmedTitle = title.trim();
    const descriptionHTML = editor.getHTML();

    if (!trimmedTitle) return;

    if (editingCard) {
      dispatch(
        editCard({
          cardId: editingCard.id,
          content: trimmedTitle,
          title: trimmedTitle,
          description: descriptionHTML,
        })
      );
    } else {
      const newCard: CardType = {
        id: `card-${Date.now()}`,
        content: trimmedTitle,
        title: trimmedTitle,
        description: descriptionHTML,
      };
      dispatch(addCard({ listId, card: newCard }));
    }

    handleCancel();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleCancel}
      withCloseButton={false}
      centered
      withinPortal
      keepMounted
      transitionProps={{ transition: "fade", duration: 150 }}
      overlayProps={{ backgroundOpacity: 0.25, blur: 2 }}
      styles={{
        content: {
          position: "relative",
          width: "100%",
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: 8,
          padding: 20,
          boxShadow: "none",
        },
      }}
    >
      <Group justify="space-between" align="center" mb="md">
        <Title order={3} fw={600}>
          {isEditMode ? "Edit Card" : "Add New Card"}
        </Title>
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
          label="Title *"
          placeholder="Enter card title"
          value={title}
          onChange={(e) => {
            if (e.currentTarget.value.length <= 50) {
              setTitle(e.currentTarget.value);
            }
          }}
          required
          maxLength={50}
          description={`${title.length}/50 characters`}
        />

        <div>
          <Title order={6} mb={4}>
            Description
          </Title>
          <div
            style={{
              border: "1px solid #dee2e6",
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            <RichTextEditor editor={editor} style={{ minHeight: 150 }}>
              <RichTextEditor.Toolbar sticky stickyOffset={0}>
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
        </div>

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={handleCancel}>
            Cancel
          </Button>
          <Button color="blue" onClick={handleSave}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EditCard;
