import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  AppShell,
  AppShellHeader,
  AppShellMain,
  Group,
  Title,
  Paper,
  Stack,
  TextInput,
  Button,
  Drawer,
  ActionIcon,
  Container,
} from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import type { RootState } from "../../../store/Store";
import { setData, addCard, editCard } from "../../../store/slice/todosSlice";
import type { CardType } from "../../KanbanBoard/types";
import TodoItem from "../components/TodoItem/Index";

const TodoList: React.FC = () => {
  const kanbanData = useSelector((state: RootState) => state.kanban);
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState("");
  const [opened, setOpened] = useState(false);

  const todos =
    kanbanData.lists?.["todo-list"]?.cardIds?.map((id) => ({
      id,
      text: kanbanData.cards[id]?.content || "",
      done: false,
    })) || [];

  const handleAddTodo = () => {
    if (!newTodo.trim()) return;
    const newCard: CardType = { id: Date.now().toString(), content: newTodo };
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
    <AppShell header={{ height: 60 }} padding="md">
      <AppShellHeader>
        <Group h="100%" px="md" justify="space-between">
          <Title order={3} fw={600}>
            Inspiring Lab
          </Title>
          <ActionIcon
            size="lg"
            radius="xl"
            variant="filled"
            color="blue"
            onClick={() => setOpened(true)}
            title="Open To-Do List"
          >
            <IconListCheck size={22} />
          </ActionIcon>
        </Group>
      </AppShellHeader>

      <AppShellMain>
        <Container size="md">
          <Paper shadow="md" radius="md" p="xl" withBorder bg="#e2e8f0">
            <Title order={2} mb="md">
              Welcome to the Dashboard
            </Title>
            <p>
              Click the checklist icon on the top-right to open your To-Do list.
            </p>
          </Paper>
        </Container>
      </AppShellMain>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title="📝 To-Do List"
        padding="md"
        position="right"
        size="xl"
      >
        <Paper shadow="md" radius="md" p="md" withBorder>
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
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <TodoItem
                          todo={todo}
                          provided={provided}
                          snapshot={snapshot}
                          onTextChange={(text) =>
                            handleTextChange(todo.id, text)
                          }
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
      </Drawer>
    </AppShell>
  );
};

export default TodoList;
