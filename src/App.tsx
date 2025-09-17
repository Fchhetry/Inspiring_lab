import React, { useState } from "react";
import Board from "./components/Board";
import "./App.css";
import type { DataType } from "./types";

const initialData: DataType = {
  lists: {
    "list-1": { id: "list-1", title: "To Do", cardIds: ["card-1", "card-2"] },
    "list-2": { id: "list-2", title: "In Progress", cardIds: ["card-3"] },
    "list-3": { id: "list-3", title: "Done", cardIds: [] },
  },
  cards: {
    "card-1": { id: "card-1", content: "Task 1" },
    "card-2": { id: "card-2", content: "Task 2" },
    "card-3": { id: "card-3", content: "Task 3" },
  },
  listOrder: ["list-1", "list-2", "list-3"],
};

function App() {
  const [data, setData] = useState<DataType>(initialData);

  return (
    <div className="App">
      <Board data={data} setData={setData} />
    </div>
  );
}

export default App;
