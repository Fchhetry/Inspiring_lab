import React from "react";
import Board from "./features/Kanban Board/Board";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store";
import { setData } from "./store";
import "./App.css";
function App() {
  const data = useSelector((state: RootState) => state.kanban);
  const dispatch = useDispatch();
  return (
    <div className="App">
      <Board data={data} setData={(newData) => dispatch(setData(newData))} />
    </div>
  );
}

export default App;
