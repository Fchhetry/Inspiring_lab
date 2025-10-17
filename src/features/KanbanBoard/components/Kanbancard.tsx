import React, { useState } from "react";
import type { CardType } from "../types";
import { useDispatch } from "react-redux";
import { deleteCard } from "../../../store/slice/todosSlice";

import { Card, Text } from "@mantine/core";

import "react-contexify/ReactContexify.css";
import ViewCard from "../../components/ViewCard";
import type { CardProps } from "../../../types";

const KanbanCard: React.FC<CardProps> = ({
  card,
  provided,
  isCombining,
  isDragging,
  setEditingCard,
  setIsEditMode,
  setOpened,
}) => {
  const dispatch = useDispatch();
  const [viewOpened, setViewOpened] = useState(false);

  const handleCardClick = () => {
    setViewOpened(true);
  };

  const handleEditFromView = (card: CardType) => {
    setViewOpened(false);
    setEditingCard(card);
    setIsEditMode(true);
    setOpened(true);
  };

  const handleDelete = () => {
    dispatch(deleteCard({ cardId: card.id }));
    setViewOpened(false);
  };

  return (
    <>
      <Card
        shadow="sm"
        padding="sm"
        radius="md"
        withBorder
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        onClick={handleCardClick}
        style={{
          marginBottom: 8,
          background: isDragging ? "#e3f2fd" : "white",
          border: "1px solid #e2e8f0",
          opacity: isCombining ? 0.7 : 1,
          transition: "background 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
        }}
      >
        <Text
          style={{
            flex: 1,
            wordBreak: "break-word",
            fontSize: 14,
            color: "#1a1a1a",
            lineHeight: 1.4,
          }}
        >
          {card.title || card.content}
        </Text>
      </Card>

      <ViewCard
        opened={viewOpened}
        onClose={() => setViewOpened(false)}
        card={card}
        onEdit={handleEditFromView}
        onDelete={handleDelete}
      />
    </>
  );
};

export default KanbanCard;
