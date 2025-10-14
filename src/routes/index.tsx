import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import TodoList from "../features/todoList/pages/TodoListPage";
import KanbanBoard from "../features/KanbanBoard/pages/KanbanBoardPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/todos" />} />
      <Route path="/todos" element={<TodoList />} />
      <Route path="/kanban" element={<KanbanBoard />} />
    </Routes>
  );
};

export default AppRoutes;
