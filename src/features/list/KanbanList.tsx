import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type { DroppableProvided, DraggableProvided } from "@hello-pangea/dnd";
import type { CardType, ListType } from "../../Constants/types";
import Card from "./KanbanCard";
import { useDispatch } from "react-redux";
import { addCard } from "../../Constants/Store";
import "../../App.css";

interface ListProps {
  list: ListType;
  cards: Record<string, CardType>;
  dragHandleProps?: DraggableProvided["dragHandleProps"];
}

const List: React.FC<ListProps> = ({ list, cards, dragHandleProps }) => {
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
    <div className="list">
      <h3 {...(dragHandleProps ?? {})}>{list.title}</h3>

      <Droppable droppableId={list.id} type="card" isCombineEnabled={true}>
        {(provided: DroppableProvided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`card-list ${
              snapshot.isDraggingOver ? "dragging-over" : ""
            }`}
          >
            {list.cardIds.map((cardId, index) => (
              <Draggable draggableId={cardId} index={index} key={cardId}>
                {(prov: DraggableProvided, cardSnapshot) => (
                  <Card
                    card={cards[cardId]}
                    provided={prov}
                    isCombining={!!cardSnapshot.combineTargetFor}
                    isDragging={cardSnapshot.isDragging}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            <button className="add-card-btn" onClick={handleAddCard}>
              + Add a card
            </button>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default List;
