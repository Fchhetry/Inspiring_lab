import React, { useState } from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import type { DroppableProvided, DraggableProvided } from "@hello-pangea/dnd";
import type { CardType, ListType } from "../types";
import KanbanCard from "./Kanbancard";
import { useDispatch } from "react-redux";
import { addCard } from "../../../store/slice/todosSlice";
import {
  Paper,
  Title,
  Button,
  Stack,
  Modal,
  TextInput,
  Group,
  ActionIcon,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface ListProps {
  list: ListType;
  cards: Record<string, CardType>;
  dragHandleProps?: DraggableProvided["dragHandleProps"];
}

const KanbanList: React.FC<ListProps> = ({ list, cards, dragHandleProps }) => {
  const dispatch = useDispatch();

  const [opened, setOpened] = useState(false);
  const [title, setTitle] = useState("");
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const handleSaveCard = () => {
    const trimmedTitle = title.trim();
    const descriptionHTML = editor?.getHTML() ?? "";

    if (!title.trim()) return;

    const newCard: CardType = {
      id: `card-${Date.now()}`,
      content: trimmedTitle,
      title: trimmedTitle,
      description: descriptionHTML,
    };

    dispatch(addCard({ listId: list.id, card: newCard }));

    setTitle("");
    editor?.commands.setContent("");
    setOpened(false);
  };

  return (
    <>
      <Paper
        shadow="md"
        radius="lg"
        p="md"
        withBorder
        style={{
          width: 300,
          backgroundColor: "#bfd9f3ff",
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
        }}
      >
        <Title
          order={4}
          {...(dragHandleProps ?? {})}
          style={{ marginBottom: 16, textAlign: "center" }}
        >
          {list.title}
        </Title>

        <Droppable droppableId={list.id} type="card" isCombineEnabled>
          {(provided: DroppableProvided, snapshot) => (
            <Stack
              gap="sm"
              mt="md"
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                flexGrow: 1,
                minHeight: 50,
                background: snapshot.isDraggingOver ? "#f1f3f5" : "transparent",
                borderRadius: 6,
                padding: 4,
                transition: "background 0.2s ease",
                overflowY: "auto",
              }}
            >
              {list.cardIds.map((cardId, index) => {
                const card = cards[cardId];
                if (!card) {
                  console.warn(
                    `Card with ID "${cardId}" not found in cards for list "${list.title}"`
                  );
                  return null;
                }
                return (
                  <Draggable draggableId={cardId} index={index} key={cardId}>
                    {(prov: DraggableProvided, cardSnapshot) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                      >
                        <KanbanCard
                          card={cards[cardId]}
                          provided={prov}
                          isCombining={!!cardSnapshot.combineTargetFor}
                          isDragging={cardSnapshot.isDragging}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}

              {!opened && (
                <Button
                  fullWidth
                  mt="sm"
                  variant="light"
                  color="gray"
                  radius="sm"
                  onClick={() => setOpened(true)}
                  style={{ marginTop: "auto" }}
                >
                  + Add a card
                </Button>
              )}
            </Stack>
          )}
        </Droppable>
      </Paper>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        withinPortal={false}
        transitionProps={{ transition: "fade", duration: 150 }}
        overlayProps={{ backgroundOpacity: 0 }}
        styles={{
          content: {
            position: "relative",
            width: "100%",
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: 8,
            padding: 20,
            boxShadow: "none",
          },
        }}
      >
        <Group justify="space-between" align="center" mb="md">
          <Title order={3} fw={600}>
            Add New Card
          </Title>
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => setOpened(false)}
            size="lg"
            radius="xl"
          >
            <IconX size={20} stroke={2} />
          </ActionIcon>
        </Group>

        <Stack gap="sm">
          <TextInput
            label="Title *"
            placeholder="Enter card title"
            value={title}
            onChange={(e) => {
              if (e.currentTarget.value.length <= 50) {
                setTitle(e.currentTarget.value);
              }
            }}
            required
            maxLength={50}
            description={`${title.length}/50 characters`}
          />

          <div>
            <Title order={6} mb={4}>
              Description
            </Title>
            <RichTextEditor editor={editor} style={{ minHeight: 150 }}>
              <RichTextEditor.Toolbar sticky>
                <RichTextEditor.ControlsGroup>
                  <RichTextEditor.Bold />
                  <RichTextEditor.Italic />
                  <RichTextEditor.Underline />
                  <RichTextEditor.BulletList />
                  <RichTextEditor.OrderedList />
                </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>

              <RichTextEditor.Content />
            </RichTextEditor>
          </div>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleSaveCard}>
              Save
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default KanbanList;
