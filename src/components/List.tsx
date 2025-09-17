import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type { DroppableProvided, DraggableProvided } from "@hello-pangea/dnd";
import type { CardType, ListType } from "../types";
import Card from "./Card";

interface ListProps {
  list: ListType;
  cards: Record<string, CardType>;
  dragHandleProps?: DraggableProvided["dragHandleProps"];
}

const List: React.FC<ListProps> = ({ list, cards, dragHandleProps }) => {
  return (
    <div className="list">
      <h3 {...(dragHandleProps ?? {})} style={{ cursor: "grab", margin: 0 }}>
        {list.title}
      </h3>

      <Droppable droppableId={list.id} type="card" isCombineEnabled={true}>
        {(provided: DroppableProvided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="card-list"
            style={{
              minHeight: 80,
              paddingTop: 8,
              paddingBottom: 8,
              background: snapshot.isDraggingOver
                ? "rgba(0,0,0,0.03)"
                : "transparent",
              transition: "background 120ms linear",
            }}
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
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default List;
