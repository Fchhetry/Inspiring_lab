import { MantineProvider, Center } from "@mantine/core";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import store from "./store/Store";
import TodoList from "./features/todoList/pages/TodoListPage";
import KanbanBoard from "./features/KanbanBoard/pages/KanbanBoardPage";

function App() {
  return (
    <Provider store={store}>
      <MantineProvider>
        <Router>
          <Center style={{ width: "100vw", height: "100vh" }}>
            <Routes>
              <Route path="/todos" element={<TodoList />} />
              <Route path="/kanban" element={<KanbanBoard />} />
            </Routes>
          </Center>
        </Router>
      </MantineProvider>
    </Provider>
  );
}

export default App;
