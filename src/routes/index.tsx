import React from "react";
import { Routes, Route } from "react-router-dom";

import TodoList from "../features/todoList/pages/TodoListPage";
import KanbanBoard from "../features/KanbanBoard/pages/KanbanBoardPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/todos" element={<TodoList />} />
      <Route path="/kanban" element={<KanbanBoard />} />
    </Routes>
  );
};

export default AppRoutes;
