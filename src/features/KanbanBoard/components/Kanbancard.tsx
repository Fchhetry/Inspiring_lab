import React, { useState } from "react";
import type { DraggableProvided } from "@hello-pangea/dnd";
import type { CardType } from "../../../types";
import { useDispatch } from "react-redux";
import { editCard } from "../../../store/Store";
import { IconEdit } from "@tabler/icons-react";
import "../../App.css";

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
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`card ${isDragging ? "dragging" : ""} ${
        isCombining ? "combining" : ""
      }`}
    >
      {isEditing ? (
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          className="card-textarea"
          title="Edit card content"
          placeholder="Enter card content"
        />
      ) : (
        <div className="card-content">
          <span>{card.content}</span>
          <IconEdit
            size={16}
            className="edit-icon"
            onClick={() => setIsEditing(true)}
          />
        </div>
      )}
    </div>
  );
};

export default Card;
