import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type {
  DropResult,
  DroppableProvided,
  DraggableProvided,
} from "@hello-pangea/dnd";
import KanbanList from "../components/KanbanList";
import type { DataType, ListType } from "../types";
import { useSelector, useDispatch } from "react-redux";
import { setData } from "../../../store/slice/todosSlice";
import { type RootState } from "../../../store/Store";
import { Button, Modal, TextInput, Group, Select } from "@mantine/core";

const KanbanBoard: React.FC = () => {
  const data = useSelector((state: RootState) => state.kanban);
  const dispatch = useDispatch();

  const [opened, setOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [selectedListToDelete, setSelectedListToDelete] = useState<
    string | null
  >(null);

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

  const handleSaveNewList = () => {
    if (!newColumnTitle.trim()) return;

    const newListId = `list-${Date.now()}`;
    const newList: ListType = {
      id: newListId,
      title: newColumnTitle.trim(),
      cardIds: [],
    };

    const newData: DataType = {
      ...data,
      lists: { ...data.lists, [newListId]: newList },
      listOrder: [...data.listOrder, newListId],
    };

    dispatch(setData(newData));
    setOpened(false);
    setNewColumnTitle("");
  };

  const handleDeleteList = () => {
    if (!selectedListToDelete) return;

    const newLists = { ...data.lists };
    delete newLists[selectedListToDelete];

    const newListOrder = data.listOrder.filter(
      (id) => id !== selectedListToDelete
    );

    const newData: DataType = {
      ...data,
      lists: newLists,
      listOrder: newListOrder,
    };

    dispatch(setData(newData));
    setSelectedListToDelete(null);
    setDeleteOpened(false);
  };

  const deletableLists = data.listOrder
    .map((id) => data.lists[id])
    .filter((list) => list.title !== "To Do");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "8px",
          padding: "16px",
          borderBottom: "1px solid #eee",
        }}
      >
        <Button variant="filled" color="blue" onClick={() => setOpened(true)}>
          + Add New Card
        </Button>
        <Button
          variant="outline"
          color="red"
          onClick={() => setDeleteOpened(true)}
        >
          Delete Card
        </Button>
      </div>

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
              <KanbanList list={data.lists["todo-list"]} cards={data.cards} />

              {data.listOrder.map((listId, index) => {
                const list = data.lists[listId];
                if (list.title === "To Do") return null;

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

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add New Card"
        centered
      >
        <TextInput
          label="Card Title"
          placeholder="Enter card name"
          value={newColumnTitle}
          onChange={(e) => setNewColumnTitle(e.currentTarget.value)}
        />
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveNewList}>Save</Button>
        </Group>
      </Modal>

      <Modal
        opened={deleteOpened}
        onClose={() => setDeleteOpened(false)}
        title="Delete a Card"
        centered
      >
        <Select
          label="Select Card to Delete"
          placeholder="Choose card"
          data={deletableLists.map((list) => ({
            value: list.id,
            label: list.title,
          }))}
          value={selectedListToDelete}
          onChange={setSelectedListToDelete}
        />
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={() => setDeleteOpened(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDeleteList}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default KanbanBoard;
