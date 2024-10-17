import { Generator } from "./pages/Generator";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Detail from "./pages/Detail";
import { useState } from "react";

const App = () => {
  const [id, setId] = useState(null);
  return (
    <>{id ? <Detail id={id} setId={setId} /> : <Generator setId={setId} />}</>
  );
};

export default App;
