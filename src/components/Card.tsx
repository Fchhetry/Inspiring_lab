import React from "react";
import type { DraggableProvided } from "@hello-pangea/dnd";
import type { CardType } from "../types";

interface CardProps {
  card: CardType;
  provided: DraggableProvided;
  isCombining?: boolean;
  isDragging?: boolean;
}

const Card: React.FC<CardProps> = ({
  card,
  provided,
  isCombining,
  isDragging,
}) => {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="card"
      style={{
        ...provided.draggableProps.style,
        userSelect: "none",
        padding: 10,
        marginBottom: 8,
        minHeight: 48,
        backgroundColor: isCombining ? "#e6f7ff" : "#fff",
        border: isDragging ? "2px solid #91d5ff" : "1px solid rgba(0,0,0,0.06)",
        borderRadius: 6,
        boxShadow: isDragging
          ? "0 6px 12px rgba(0,0,0,0.12)"
          : "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      {card.content}
    </div>
  );
};

export default Card;
