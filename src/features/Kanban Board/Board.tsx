import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type {
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "@hello-pangea/dnd";

import List from "./List";
import type { DataType } from "../../types";

interface BoardProps {
  data: DataType;
  setData: (newData: DataType) => void;
}

const Board: React.FC<BoardProps> = ({ data, setData }) => {
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type, combine } = result;
    if (!destination && !combine) return;

    //lists reordering
    if (type === "list") {
      if (!destination) return;
      const newListOrder = Array.from(data.listOrder);
      newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, draggableId);
      setData({ ...data, listOrder: newListOrder });
      return;
    }
    //drop inside another card
    if (combine) {
      const combineWithId = combine.draggableId;
      const targetListId = Object.keys(data.lists).find((lid) =>
        data.lists[lid].cardIds.includes(combineWithId)
      );
      if (!targetListId) return;
      // Remove dragged card from its source list
      const sourceList = data.lists[source.droppableId];
      const newSourceCardIds = Array.from(sourceList.cardIds).filter(
        (id) => id !== draggableId
      );
      const newSourceList = { ...sourceList, cardIds: newSourceCardIds };

      // Insert dragged card at the index of the combine target
      const targetList = data.lists[targetListId];
      const targetIndex = targetList.cardIds.indexOf(combineWithId);
      const newTargetCardIds = Array.from(targetList.cardIds);
      // insert the draggableId at targetIndex (before the target)
      newTargetCardIds.splice(targetIndex, 0, draggableId);
      const newTargetList = { ...targetList, cardIds: newTargetCardIds };

      setData({
        ...data,
        lists: {
          ...data.lists,
          [newSourceList.id]: newSourceList,
          [newTargetList.id]: newTargetList,
        },
      });

      return;
    }
    // Normal card move (within or between lists)
    if (!destination) return;
    const startList = data.lists[source.droppableId];
    const endList = data.lists[destination.droppableId];

    //Moving within the same list
    if (startList === endList) {
      const newCardIds = Array.from(startList.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);
      const newList = { ...startList, cardIds: newCardIds };
      setData({ ...data, lists: { ...data.lists, [newList.id]: newList } });
      return;
    }

    // Moving to another list
    const startCardIds = Array.from(startList.cardIds);
    startCardIds.splice(source.index, 1);
    const newStart = { ...startList, cardIds: startCardIds };

    const endCardIds = Array.from(endList.cardIds);
    endCardIds.splice(destination.index, 0, draggableId);
    const newEnd = { ...endList, cardIds: endCardIds };

    setData({
      ...data,
      lists: { ...data.lists, [newStart.id]: newStart, [newEnd.id]: newEnd },
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-lists" direction="horizontal" type="list">
        {(provided: DroppableProvided) => (
          <div
            className="board"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {data.listOrder.map((listId, index) => {
              const list = data.lists[listId];
              return (
                <Draggable draggableId={list.id} index={index} key={list.id}>
                  {(prov: DraggableProvided) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className="list-container"
                      style={prov.draggableProps.style}
                    >
                      <List
                        list={list}
                        cards={data.cards}
                        dragHandleProps={prov.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
