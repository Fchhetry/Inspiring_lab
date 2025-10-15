import React from "react";
import { Modal, Title, Text, Button, Group } from "@mantine/core";
import type { CardType } from "../../KanbanBoard/types";

interface ViewCardProps {
  opened: boolean;
  onClose: () => void;
  card: CardType | null;
}

const ViewCard: React.FC<ViewCardProps> = ({ opened, onClose, card }) => {
  if (!card) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={4}>{card.title || "Card Details"}</Title>}
      centered
      overlayProps={{ backgroundOpacity: 0.4, blur: 3 }}
    >
      <div style={{ padding: "10px 0" }}>
        <Text
          dangerouslySetInnerHTML={{
            __html: card.description || "<i>No description</i>",
          }}
        />
      </div>

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={() => {
            onClose();
            window.dispatchEvent(
              new CustomEvent("open-edit-modal", { detail: card })
            );
          }}
        >
          Edit
        </Button>
      </Group>
    </Modal>
  );
};

export default ViewCard;
