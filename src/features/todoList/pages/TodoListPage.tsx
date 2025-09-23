
import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../store/Store";
import {
  setTodos,
  updateTodoText,
  type Todo,
} from "../../../store/slice/todosSlice";

import { Paper, Stack, Title } from "@mantine/core";
import TodoItem from "../components/TodoItem";

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
                    <TodoItem
                      todo={todo}
                      provided={provided}
                      snapshot={snapshot}
                      onTextChange={(text) =>
                        dispatch(
                          updateTodoText({
                            id: todo.id,
                            text,
                          })
                        )
                      }
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
