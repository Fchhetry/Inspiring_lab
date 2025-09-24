import { MantineProvider, Center } from "@mantine/core";
import { Provider } from "react-redux";
import store from "./store/Store";
import TodoList from "./features/todoList/pages/TodoListPage";

function App() {
  return (
    <Provider store={store}>
      <MantineProvider>
        <Center style={{ width: "100vw", height: "100vh" }}>
          <TodoList />
        </Center>
      </MantineProvider>
    </Provider>
  );
}

export default App;
