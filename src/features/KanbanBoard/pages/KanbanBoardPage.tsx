// import React from "react";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
// import type {
//   DropResult,
//   DroppableProvided,
//   DraggableProvided,
// } from "@hello-pangea/dnd";
// import KanbanList from "../components/KanbanList";
// import type { DataType } from "../types";
// import { useSelector, useDispatch } from "react-redux";
// import { setData, type RootState } from "../../../store/Store";

// const KanbanBoard: React.FC = () => {
//   const data = useSelector((state: RootState) => state.kanban);
//   const dispatch = useDispatch();

//   const onDragEnd = (result: DropResult) => {
//     const { destination, source, draggableId, type } = result;
//     if (!destination) return;

//     let newData: DataType = data;

//     if (type === "list") {
//       const newListOrder = Array.from(data.listOrder);
//       newListOrder.splice(source.index, 1);
//       newListOrder.splice(destination.index, 0, draggableId);
//       newData = { ...data, listOrder: newListOrder };
//       dispatch(setData(newData));
//       return;
//     }

//     if (type === "card") {
//       const sourceList = data.lists[source.droppableId];
//       const destList = data.lists[destination.droppableId];

//       if (sourceList === destList) {
//         const newCardIds = Array.from(sourceList.cardIds);
//         newCardIds.splice(source.index, 1);
//         newCardIds.splice(destination.index, 0, draggableId);
//         const newList = { ...sourceList, cardIds: newCardIds };
//         newData = { ...data, lists: { ...data.lists, [newList.id]: newList } };
//         dispatch(setData(newData));
//         return;
//       }

//       const sourceCardIds = Array.from(sourceList.cardIds);
//       sourceCardIds.splice(source.index, 1);
//       const newSourceList = { ...sourceList, cardIds: sourceCardIds };

//       const destCardIds = Array.from(destList.cardIds);
//       destCardIds.splice(destination.index, 0, draggableId);
//       const newDestList = { ...destList, cardIds: destCardIds };

//       newData = {
//         ...data,
//         lists: {
//           ...data.lists,
//           [newSourceList.id]: newSourceList,
//           [newDestList.id]: newDestList,
//         },
//       };
//       dispatch(setData(newData));
//     }
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <Droppable droppableId="all-lists" direction="horizontal" type="list">
//         {(provided: DroppableProvided) => (
//           <div
//             ref={provided.innerRef}
//             {...provided.droppableProps}
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               gap: 16,
//               padding: "16px",
//               overflowX: "auto",
//               minHeight: "80vh",
//             }}
//           >
//             {data.listOrder.map((listId, index) => {
//               const list = data.lists[listId];
//               return (
//                 <Draggable draggableId={list.id} index={index} key={list.id}>
//                   {(prov: DraggableProvided) => (
//                     <div
//                       ref={prov.innerRef}
//                       {...prov.draggableProps}
//                       style={{
//                         ...prov.draggableProps.style,
//                         display: "flex",
//                         flexDirection: "column",
//                         minWidth: 300,
//                       }}
//                     >
//                       <KanbanList
//                         list={list}
//                         cards={data.cards}
//                         dragHandleProps={prov.dragHandleProps}
//                       />
//                     </div>
//                   )}
//                 </Draggable>
//               );
//             })}
//             {provided.placeholder}
//           </div>
//         )}
//       </Droppable>
//     </DragDropContext>
//   );
// };

// export default KanbanBoard;

import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type {
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "@hello-pangea/dnd";
import KanbanList from "../components/KanbanList";
import type { DataType, CardType } from "../types";
import { useSelector, useDispatch } from "react-redux";
import { setData, type RootState } from "../../../store/Store";
import { type Todo } from "../../../store/slice/todosSlice";

const KanbanBoard: React.FC = () => {
  const data = useSelector((state: RootState) => state.kanban);
  const todos = useSelector((state: RootState) => state.todos) as Todo[];
  const dispatch = useDispatch();

  const todoCards: Record<string, CardType> = todos.reduce((acc, todo) => {
    acc[todo.id] = { id: todo.id, content: todo.text };
    return acc;
  }, {} as Record<string, CardType>);

  const todoList = {
    id: "todo-list",
    title: "To Do",
    cardIds: todos.map((todo) => todo.id),
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;

    let newData: DataType = data;

    if (type === "list") {
      const newListOrder = Array.from(data.listOrder);
      newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, draggableId);
      newData = { ...data, listOrder: newListOrder };
      dispatch(setData(newData));
      return;
    }

    if (type === "card") {
      const sourceList = data.lists[source.droppableId];
      const destList = data.lists[destination.droppableId];

      if (!sourceList || !destList) return;

      if (sourceList === destList) {
        const newCardIds = Array.from(sourceList.cardIds);
        newCardIds.splice(source.index, 1);
        newCardIds.splice(destination.index, 0, draggableId);
        const newList = { ...sourceList, cardIds: newCardIds };
        newData = { ...data, lists: { ...data.lists, [newList.id]: newList } };
        dispatch(setData(newData));
        return;
      }

      const sourceCardIds = Array.from(sourceList.cardIds);
      sourceCardIds.splice(source.index, 1);
      const newSourceList = { ...sourceList, cardIds: sourceCardIds };

      const destCardIds = Array.from(destList.cardIds);
      destCardIds.splice(destination.index, 0, draggableId);
      const newDestList = { ...destList, cardIds: destCardIds };

      newData = {
        ...data,
        lists: {
          ...data.lists,
          [newSourceList.id]: newSourceList,
          [newDestList.id]: newDestList,
        },
      };
      dispatch(setData(newData));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-lists" direction="horizontal" type="list">
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 16,
              padding: "16px",
              overflowX: "auto",
              minHeight: "80vh",
            }}
          >
            <KanbanList list={todoList} cards={todoCards} />

            {data.listOrder.map((listId, index) => {
              const list = data.lists[listId];
              if (!list) return null;

              return (
                <Draggable draggableId={list.id} index={index} key={list.id}>
                  {(prov: DraggableProvided) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      style={{
                        ...prov.draggableProps.style,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 300,
                      }}
                    >
                      <KanbanList
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

export default KanbanBoard;
