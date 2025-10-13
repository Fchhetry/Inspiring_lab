import { MantineProvider, Center } from "@mantine/core";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import store from "./store/Store";
import AppRoutes from "./routes";
import "@mantine/core/styles.css";
function App() {
  return (
    <Provider store={store}>
      <MantineProvider>
        <Router>
          <Center style={{ width: "100vw", height: "100vh" }}>
            <AppRoutes />
          </Center>
        </Router>
      </MantineProvider>
    </Provider>
  );
}

export default App;
