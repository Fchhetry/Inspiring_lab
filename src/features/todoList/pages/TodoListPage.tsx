import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Paper,
  Stack,
  TextInput,
  Button,
  ActionIcon,
  Container,
  Affix,
  Menu,
  Group,
} from "@mantine/core";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { IconListCheck } from "@tabler/icons-react";
import type { RootState } from "../../../store/Store";
import { setData, addCard, editCard } from "../../../store/slice/todosSlice";
import type { CardType } from "../../KanbanBoard/types";
import TodoItem from "../components/TodoItem/Index";
import CreateEditCard from "../../components/CreateEditCard";

const TodoList: React.FC = () => {
  const kanbanData = useSelector((state: RootState) => state.kanban);
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);

  const todos =
    kanbanData.lists?.["todo-list"]?.cardIds?.map((id) => ({
      id,
      text: kanbanData.cards[id]?.content || "",
      description: kanbanData.cards[id]?.description || "",
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

  const handleEditOpen = (todo: any) => {
    setEditingCard({
      id: todo.id,
      title: todo.text,
      content: todo.text,
      description: todo.description || "",
    });
    setEditModalOpen(true);
  };

  // const handleEditSubmit = (updated: any) => {
  //   dispatch(
  //     editCard({
  //       cardId: updated.id,
  //       content: updated.title || updated.content,
  //       description: updated.description || "",
  //     })
  //   );
  //   setEditModalOpen(false);
  // };

  return (
    <>
      <Container size="md">
        <Paper shadow="md" radius="md" p="xl" withBorder bg="#f8fafc">
          <h2 style={{ color: "#1d4ed8", marginBottom: "12px" }}>
            Welcome to the Dashboard
          </h2>
          <p>Click the floating checklist icon to open your To-Do list.</p>
        </Paper>
      </Container>

      <Affix bottom={20} right={20}>
        <Menu shadow="md" width={400} position="top-end" keepMounted>
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

          <Menu.Dropdown
            style={{
              padding: "10px",
              width: "420px",
              minHeight: "250px",
              maxHeight: "600px",
            }}
          >
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

              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  paddingRight: 4,
                }}
              >
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
                                onEditClick={() => handleEditOpen(todo)}
                              />
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Stack>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </Paper>
          </Menu.Dropdown>
        </Menu>
      </Affix>

   {editModalOpen && editingCard && (
  <CreateEditCard
    listId="todo-list"
    editingCard={editingCard}
    setEditingCard={setEditingCard}
    opened={editModalOpen}
    setOpened={setEditModalOpen}
    isEditMode={true}
    setIsEditMode={() => {}}
 
  />
)}


    </>
  );
};

export default TodoList;
