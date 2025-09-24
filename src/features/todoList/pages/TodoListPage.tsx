import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/Store";
import { setData, editCard, type Todo } from "../../../store/slice/todosSlice";

import { Paper, Stack, Title } from "@mantine/core";
import TodoItem from "../../components/TodoItem";

const TodoList: React.FC = () => {
  const kanban = useSelector((state: RootState) => state.kanban);
  const dispatch = useDispatch<AppDispatch>();

  const todos: Todo[] = Object.values(kanban.cards).map((card) => ({
    id: card.id,
    text: card.content,
    done: false,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedTodos = Array.from(todos);
    const [moved] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, moved);

    const updatedCards = { ...kanban.cards };
    updatedTodos.forEach((t) => {
      updatedCards[t.id] = { id: t.id, content: t.text };
    });

    const updatedKanban = { ...kanban, cards: updatedCards };

    dispatch(setData(updatedKanban));
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
        To-Do List
      </Title>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <Stack
              {...provided.droppableProps}
              ref={provided.innerRef}
              gap="sm"
            >
              {todos.map((todo: Todo, index: number) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <Group
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      gap="sm"
                      style={{
                        border: "1px solid #ccc",
                        padding: "10px",
                        background: snapshot.isDragging ? "#d1fae5" : "#fff",
                        borderRadius: "6px",
                        marginBottom: "6px",
                        display: "flex",
                        alignItems: "center",
                        cursor: "grab",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <IconGripVertical size={24} stroke={2} />

                      <TextInput
                        value={todo.text}
                        onChange={(e) =>
                          dispatch(
                            editCard({
                              cardId: todo.id,
                              content: e.currentTarget.value,
                            })
                          )
                        }
                        variant="unstyled"
                        styles={{
                          input: {
                            border: "none",
                            outline: "none",
                            boxShadow: "none",
                            background: "transparent",
                            padding: 0,
                            margin: 0,
                            fontSize: "16px",
                          },
                        }}
                        style={{
                          flex: 1,
                          width: "100%",
                          textDecoration: todo.done ? "line-through" : "none",
                        }}
                      />
                    </Group>
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
