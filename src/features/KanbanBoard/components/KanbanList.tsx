import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type { DroppableProvided, DraggableProvided } from "@hello-pangea/dnd";
import type { CardType, ListType } from "../types";
import KanbanCard from "./Kanbancard";
import { Paper, Title, Stack, Button } from "@mantine/core";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CreateEditCard from "../../components/CreateEditCard";

interface ListProps {
  list: ListType;
  cards: Record<string, CardType>;
  dragHandleProps?: DraggableProvided["dragHandleProps"];
}

const KanbanList: React.FC<ListProps> = ({ list, cards, dragHandleProps }) => {
  const [opened, setOpened] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);

  const editor = useEditor({ extensions: [StarterKit], content: "" });

  const handleAddNewCard = () => {
    setEditingCard(null);
    setIsEditMode(false);
    setOpened(true);
  };

  return (
    <Paper
      shadow="md"
      radius="lg"
      p="md"
      withBorder
      style={{
        width: 300,
        backgroundColor: "#bfd9f3ff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        maxHeight: "80vh",
      }}
    >
      <Title
        order={4}
        {...(dragHandleProps ?? {})}
        style={{ marginBottom: 16, textAlign: "center" }}
      >
        {list.title}
      </Title>

      <Droppable droppableId={list.id} type="card" isCombineEnabled>
        {(provided: DroppableProvided, snapshot) => (
          <Stack
            gap="sm"
            mt="md"
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              flexGrow: 1,
              minHeight: 50,
              background: snapshot.isDraggingOver ? "#f1f3f5" : "transparent",
              borderRadius: 6,
              padding: 4,
              transition: "background 0.2s ease",
              overflowY: "auto",
            }}
          >
            {list.cardIds.map((cardId, index) => {
              const card = cards[cardId];
              if (!card) return null;
              return (
                <Draggable draggableId={cardId} index={index} key={cardId}>
                  {(prov: DraggableProvided, cardSnapshot) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                    >
                      <KanbanCard
                        card={card}
                        provided={prov}
                        isCombining={!!cardSnapshot.combineTargetFor}
                        isDragging={cardSnapshot.isDragging}
                        setEditingCard={setEditingCard}
                        setIsEditMode={setIsEditMode}
                        setOpened={setOpened}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Stack>
        )}
      </Droppable>

      <Button
        fullWidth
        mt="sm"
        variant="light"
        color="gray"
        radius="sm"
        onClick={handleAddNewCard}
      >
        + Add new task
      </Button>

      <CreateEditCard
        listId={list.id}
        editingCard={editingCard}
        setEditingCard={setEditingCard}
        opened={opened}
        setOpened={setOpened}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        editor={editor}
      />
    </Paper>
  );
};

export default KanbanList;
