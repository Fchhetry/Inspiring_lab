import React from "react";
import { Modal, Title, Group, Button } from "@mantine/core";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { CardType } from "../../KanbanBoard/types";
import { useEffect } from "react";

interface ViewCardProps {
  opened: boolean;
  onClose: () => void;
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: () => void;
}

const ViewCard: React.FC<ViewCardProps> = ({
  opened,
  onClose,
  card,
  onEdit,
  onDelete,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: card?.description || "<p><i>No description</i></p>",
    editable: false,
  });
  useEffect(() => {
    if (editor && card?.description) {
      editor.commands.setContent(card.description);
    }
  }, [card?.description, editor]);

  if (!card) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={4}>{card.title || "Card Details"}</Title>}
      centered
      overlayProps={{ backgroundOpacity: 0.4, blur: 3 }}
      withCloseButton
      size={500}
    >
      <div style={{ marginBottom: 20 }}>
        {editor && (
          <RichTextEditor editor={editor} style={{ border: "none" }}>
            <RichTextEditor.Content />
          </RichTextEditor>
        )}
      </div>

      <Group align="right" gap="sm">
        <Button color="red" onClick={onDelete}>
          Delete
        </Button>
        <Button color="blue" onClick={() => onEdit(card)}>
          Edit
        </Button>
      </Group>
    </Modal>
  );
};

export default ViewCard;
