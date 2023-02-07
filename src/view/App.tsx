import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./home/Home";
import { Project } from "./project";
import { ProjectCenter } from "./projectCenter";
import { VideoCenter } from "./videoCenter";
import { AlgorithmCenter } from "./algorithmCenter";
import { Login } from "../components/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="project" element={<Project />} />
        <Route path="projectCenter" element={<ProjectCenter />} />
        <Route path="videoCenter" element={<VideoCenter />} />
        <Route path="algorithmCenter" element={<AlgorithmCenter />} />
      </Routes>
      <Login></Login>
    </BrowserRouter>
  );
}

export default App;
