import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type { DroppableProvided, DraggableProvided } from "@hello-pangea/dnd";
import type { CardType, ListType } from "../types";
import KanbanCard from "./Kanbancard";
import { useDispatch } from "react-redux";
import { addCard } from "../../../store/Store";
import { Paper, Title, Button, Stack } from "@mantine/core";

interface ListProps {
  list: ListType;
  cards: Record<string, CardType>;
  dragHandleProps?: DraggableProvided["dragHandleProps"];
}

const KanbanList: React.FC<ListProps> = ({ list, cards, dragHandleProps }) => {
  const dispatch = useDispatch();

  const handleAddCard = () => {
    const newId = `card-${Date.now()}`;
    dispatch(
      addCard({
        listId: list.id,
        card: { id: newId, content: "New card" },
      })
    );
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
        maxHeight: "80vh",
      }}
    >
      <Title
        order={4}
        {...(dragHandleProps ?? {})}
        style={{ marginBottom: 16 }}
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
            {list.cardIds.map((cardId, index) => (
              <Draggable draggableId={cardId} index={index} key={cardId}>
                {(prov: DraggableProvided, cardSnapshot) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.draggableProps}
                    {...prov.dragHandleProps}
                  >
                    <KanbanCard
                      card={cards[cardId]}
                      provided={prov}
                      isCombining={!!cardSnapshot.combineTargetFor}
                      isDragging={cardSnapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            <Button
              fullWidth
              mt="sm"
              variant="light"
              color="gray"
              radius="sm"
              onClick={handleAddCard}
              style={{ marginTop: "auto" }}
            >
              + Add a card
            </Button>
          </Stack>
        )}
      </Droppable>
    </Paper>
  );
};

export default KanbanList;
