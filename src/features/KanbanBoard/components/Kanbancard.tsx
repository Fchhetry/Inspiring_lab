import React, { useState } from "react";
import type { DraggableProvided } from "@hello-pangea/dnd";
import type { CardType } from "../types";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/Store";
import {
  editCard,
  deleteCard,
  copyCard,
} from "../../../store/slice/todosSlice";
import { IconCopy, IconTrash } from "@tabler/icons-react";
import { Card, Textarea, Text } from "@mantine/core";
import { Menu, Item, useContextMenu } from "react-contexify";
import "react-contexify/ReactContexify.css";
import ViewCard from "../../components/ViewCard";

interface CardProps {
  card: CardType;
  provided: DraggableProvided;
  isCombining?: boolean;
  isDragging?: boolean;
}

const MENU_ID = "kanban-card-menu";

const KanbanCard: React.FC<CardProps> = ({
  card,
  provided,
  isCombining,
  isDragging,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(card.content);
  const [viewOpened, setViewOpened] = useState(false);
  const { show } = useContextMenu({ id: MENU_ID });

  const handleBlur = () => {
    setIsEditing(false);
    if (value.trim() !== card.content) {
      dispatch(editCard({ cardId: card.id, content: value }));
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    show({ event: e, props: { card } });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".edit-icon")) return;
    setViewOpened(true);
  };

  return (
    <>
      <div onContextMenu={handleContextMenu}>
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
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
            </div>
          )}
        </Card>
      </div>

      <Menu id={MENU_ID}>
        <Item
          onClick={({ props }) =>
            props?.card && dispatch(copyCard({ cardId: props.card.id }))
          }
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconCopy size={14} />
            <span>Copy</span>
          </div>
        </Item>

        <Item
          onClick={({ props }) =>
            props?.card && dispatch(deleteCard({ cardId: props.card.id }))
          }
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "red",
            }}
          >
            <IconTrash size={14} />
            <span>Delete</span>
          </div>
        </Item>
      </Menu>

      <ViewCard
        opened={viewOpened}
        onClose={() => setViewOpened(false)}
        card={card}
      />
    </>
  );
};

export default KanbanCard;
