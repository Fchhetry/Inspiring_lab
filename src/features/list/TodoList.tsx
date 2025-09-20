import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/stores";
import { setTodos, toggleTodo, updateTodoText } from "../slice/todosSlice";
import type { Todo } from "../slice/todosSlice";

import { Paper, TextInput, Stack, Title, Group } from "@mantine/core";
import { IconSquare, IconSquareCheck } from "@tabler/icons-react";

const TodoList: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const updatedTodos = Array.from(todos);
    const [moved] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, moved);
    dispatch(setTodos(updatedTodos));
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
                        ...provided.draggableProps.style,
                      }}
                    >
                      {todo.done ? (
                        <IconSquareCheck
                          size={24}
                          stroke={2}
                          color="green"
                          onClick={() => dispatch(toggleTodo(todo.id))}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <IconSquare
                          size={24}
                          stroke={2}
                          onClick={() => dispatch(toggleTodo(todo.id))}
                          style={{ cursor: "pointer" }}
                        />
                      )}

                      <TextInput
                        value={todo.text}
                        onChange={(e) =>
                          dispatch(
                            updateTodoText({
                              id: todo.id,
                              text: e.currentTarget.value,
                            })
                          )
                        }
                        variant="unstyled"
                        styles={{ input: { border: "none", padding: 0 } }}
                        style={{ flex: 1, width: "100%" }}
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
