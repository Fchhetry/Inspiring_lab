import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import store from "./store/Store";
import AppRoutes from "./routes";
import "@mantine/core/styles.css";
import "react-contexify/ReactContexify.css";
import "@mantine/tiptap/styles.css";

function App() {
  return (
    <Provider store={store}>
      <MantineProvider>
        <Router>
          <AppRoutes />
        </Router>
      </MantineProvider>
    </Provider>
  );
}

export default App;
