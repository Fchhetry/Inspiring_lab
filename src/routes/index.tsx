import React from "react";
import { Routes, Route ,Navigate } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import TodoList from "../features/todoList/pages/TodoListPage";
import KanbanBoard from "../features/KanbanBoard/pages/KanbanBoardPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/todos" replace />} />
        <Route path="/todos" element={<TodoList />} />
        <Route path="/kanban" element={<KanbanBoard />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
