import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Group,
  Title,
  Paper,
  Stack,
  TextInput,
  Button,
  ActionIcon,
  Container,
  Affix,
  Menu,
  NavLink,
  ScrollArea,
} from "@mantine/core";
import { IconListCheck } from "@tabler/icons-react";
import type { RootState } from "../../../store/Store";
import { setData, addCard, editCard } from "../../../store/slice/todosSlice";
import type { CardType } from "../../KanbanBoard/types";
import TodoItem from "../components/TodoItem/Index";

const TodoList: React.FC = () => {
  const kanbanData = useSelector((state: RootState) => state.kanban);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [newTodo, setNewTodo] = useState("");

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppShell
      header={{ height: 65 }}
      navbar={{ width: 200, breakpoint: "sm" }}
      padding="md"
    >
      <AppShellHeader
        style={{
          background:
            "linear-gradient(90deg, rgba(37,99,235,1) 0%, rgba(99,102,241,1) 100%)",
          color: "white",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          <Title
            order={3}
            fw={700}
            style={{ color: "white", cursor: "pointer" }}
            onClick={() => navigate("/todos")}
          >
            Inspiring Lab
          </Title>
        </Group>
      </AppShellHeader>

      <AppShellNavbar p="md">
        <ScrollArea type="auto" style={{ height: "100%" }}>
          <Stack gap="xs">
            <NavLink
              label="Todo"
              active={isActive("/todos")}
              onClick={() => navigate("/todos")}
              styles={{
                root: {
                  borderRadius: "8px",
                  fontWeight: 600,
                  backgroundColor: isActive("/todos")
                    ? "#e0e7ff"
                    : "transparent",
                  color: isActive("/todos") ? "#1e3a8a" : "#374151",
                  transition: "all 0.2s ease",
                },
              }}
            />
            <NavLink
              label="Kanban"
              active={isActive("/kanban")}
              onClick={() => navigate("/kanban")}
              styles={{
                root: {
                  borderRadius: "8px",
                  fontWeight: 600,
                  backgroundColor: isActive("/kanban")
                    ? "#e0e7ff"
                    : "transparent",
                  color: isActive("/kanban") ? "#1e3a8a" : "#374151",
                  transition: "all 0.2s ease",
                },
              }}
            />
          </Stack>
        </ScrollArea>
      </AppShellNavbar>

      <AppShellMain>
        <Container size="md">
          <Paper shadow="md" radius="md" p="xl" withBorder bg="#f8fafc">
            <Title order={2} mb="md" c="blue.7">
              Welcome to the Dashboard
            </Title>
            <p>Click the floating checklist icon to open your To-Do list.</p>
          </Paper>
        </Container>
      </AppShellMain>

      <Affix bottom={20} right={20}>
        <Menu shadow="md" width={400} position="top-end">
          <Menu.Target>
            <ActionIcon
              size="xl"
              radius="xl"
              variant="gradient"
              gradient={{ from: "blue", to: "indigo" }}
              title="Open To-Do Menu"
            >
              <IconListCheck size={28} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Paper shadow="md" radius="md" p="md" withBorder>
              <Group mb="md">
                <TextInput
                  placeholder="Add a new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.currentTarget.value)}
                  style={{ flex: 1 }}
                />
                <Button onClick={handleAddTodo} color="blue">
                  Add
                </Button>
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
          </Menu.Dropdown>
        </Menu>
      </Affix>
    </AppShell>
  );
};

export default TodoList;
