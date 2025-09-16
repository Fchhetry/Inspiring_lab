import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { Paper, Text, Stack, Title } from "@mantine/core";

type Todo = {
  id: string;
  text: string;
};

const initialTodos: Todo[] = [
  { id: "1", text: "Learn React" },
  { id: "2", text: "Practice TypeScript" },
  { id: "3", text: "Build a To-do App" },
  { id: "4", text: "Read about Vite" },
  { id: "5", text: "Install dependencies" },
  { id: "6", text: "Create components" },
  { id: "7", text: "Test drag and drop" },
  { id: "8", text: "Style with CSS" },
];

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedTodos = Array.from(todos);
    const [movedItem] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, movedItem);

    setTodos(updatedTodos);
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
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        padding: "10px",
                        background: snapshot.isDragging ? "#dbeafe" : "#f3f4f6",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        ...provided.draggableProps.style,
                      }}
                    >
                      <div
                        {...provided.dragHandleProps}
                        style={{
                          cursor: "grab",
                          marginRight: 10,
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        •
                      </div>
                      <Text>{todo.text}</Text>
                    </Paper>
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
