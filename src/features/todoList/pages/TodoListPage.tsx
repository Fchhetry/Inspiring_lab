/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store/Store";
import { setData, addCard, editCard } from "../../../store/slice/todosSlice";
import type { CardType } from "../../KanbanBoard/types";

import { Paper, Stack, Title, TextInput, Button, Group } from "@mantine/core";
import TodoItem from "../components/TodoItem/Index";

const TodoList: React.FC = () => {
  const kanbanData = useSelector((state: RootState) => state.kanban);
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState("");

  console.log("kanbanData:", kanbanData);

  const todos =
    kanbanData.lists?.["todo-list"]?.cardIds?.map((id) => ({
      id,
      text: kanbanData.cards[id]?.content || "",
      done: false,
    })) || [];

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;

    const newCard: CardType = {
      id: Date.now().toString(),
      content: newTodo,
    };

    dispatch(addCard({ listId: "todo-list", card: newCard }));
    setNewTodo("");
  };

  const handleDeleteTodo = (id: string) => {
    const updatedCardIds =
      kanbanData.lists?.["todo-list"]?.cardIds.filter(
        (cardId) => cardId !== id
      ) || [];

    const updatedCards = { ...kanbanData.cards };
    delete updatedCards[id];

    dispatch(
      setData({
        ...kanbanData,
        cards: updatedCards,
        lists: {
          ...kanbanData.lists,
          "todo-list": {
            ...kanbanData.lists?.["todo-list"],
            cardIds: updatedCardIds,
          },
        },
      })
    );
  };

  const handleTextChange = (id: string, text: string) => {
    dispatch(editCard({ cardId: id, content: text }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedCardIds = Array.from(
      kanbanData.lists?.["todo-list"]?.cardIds || []
    );
    const [moved] = updatedCardIds.splice(result.source.index, 1);
    updatedCardIds.splice(result.destination.index, 0, moved);

    dispatch(
      setData({
        ...kanbanData,
        lists: {
          ...kanbanData.lists,
          "todo-list": {
            ...kanbanData.lists?.["todo-list"],
            cardIds: updatedCardIds,
          },
        },
      })
    );
  };

  return (
    <Paper
      shadow="md"
      radius="md"
      p="lg"
      withBorder
      style={{ maxWidth: 400, margin: "0 auto" }}
    >
      <Title order={3} mb="md">
        📝 To-Do List
      </Title>

      <Group mb="md">
        <TextInput
          placeholder="Add a new task..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.currentTarget.value)}
          style={{ flex: 1 }}
        />
        <Button onClick={handleAddTodo}>Add</Button>
      </Group>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <Stack
              {...provided.droppableProps}
              ref={provided.innerRef}
              gap="sm"
            >
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <TodoItem
                      todo={todo}
                      provided={provided}
                      snapshot={snapshot}
                      onTextChange={(text) => handleTextChange(todo.id, text)}
                      onDelete={() => handleDeleteTodo(todo.id)}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  );
};

export default TodoList;
