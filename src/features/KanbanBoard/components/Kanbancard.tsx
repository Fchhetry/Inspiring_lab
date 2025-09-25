import React, { useState } from "react";
import type { DraggableProvided } from "@hello-pangea/dnd";
import type { CardType } from "../types";
import { useDispatch } from "react-redux";
import { editCard } from "../../../store/Store";
import { IconEdit } from "@tabler/icons-react";
import { Card, Textarea, Text, ActionIcon, Group } from "@mantine/core";

interface CardProps {
  card: CardType;
  provided: DraggableProvided;
  isCombining?: boolean;
  isDragging?: boolean;
}

const KanbanCard: React.FC<CardProps> = ({
  card,
  provided,
  isCombining,
  isDragging,
}) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(card.content);

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() !== card.content) {
      dispatch(editCard({ cardId: card.id, content: value }));
    }
  };

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="md"
      withBorder
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        marginBottom: "8px",
        background: isDragging ? "#e3f2fd" : "white",
        border: "1px solid #e2e8f0",
        opacity: isCombining ? 0.7 : 1,
        transition: "background 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {isEditing ? (
        <Textarea
          autosize
          minRows={2}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          onBlur={handleBlur}
          placeholder="Edit card content"
        />
      ) : (
        <Group gap="apart" align="center">
          <Text>{card.content}</Text>
          <ActionIcon onClick={() => setIsEditing(true)} variant="light">
            <IconEdit size={16} />
          </ActionIcon>
        </Group>
      )}
    </Card>
  );
};

export default KanbanCard;
