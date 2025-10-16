import React from "react";
import { Button } from "@mantine/core";
import type { Editor } from "@tiptap/react";

interface AddCardProps {
  opened: boolean;
  setOpened: (value: boolean) => void;
  editor: Editor | null;
  setIsEditMode: (value: boolean) => void;
  setEditingCard: (card: null) => void;
}

const AddCard: React.FC<AddCardProps> = ({
  opened,
  setOpened,
  editor,
  setIsEditMode,
  setEditingCard,
}) => {
  if (opened) return null;

  return (
    <Button
      fullWidth
      mt="sm"
      variant="light"
      color="gray"
      radius="sm"
      onClick={() => {
        setEditingCard(null);
        editor?.commands.setContent("");
        setOpened(true);
        setIsEditMode(false);
      }}
      style={{ minHeight: 36 }}
    >
      + Add a card
    </Button>
  );
};

export default AddCard;
