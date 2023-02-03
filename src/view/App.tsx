import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./home/Home";
import { Project } from "./project";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="project" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
