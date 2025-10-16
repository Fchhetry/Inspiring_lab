import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Group,
  Title,
  Stack,
  NavLink,
  ScrollArea,
} from "@mantine/core";

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
                },
              }}
            />
          </Stack>
        </ScrollArea>
      </AppShellNavbar>

      <AppShellMain>
        <Outlet />
      </AppShellMain>
    </AppShell>
  );
};

export default DashboardLayout;
