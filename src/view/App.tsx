import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./home/Home";
import { Project } from "./project";
import { ProjectCenter } from "./projectCenter";
import { VideoCenter } from "./videoCenter";
import { AlgorithmCenter } from "./algorithmCenter";
import { Dialogs } from "./dialogs/dialog";
import { AlgorithmEdit } from "./algorithmEdit";
import { VideoPlay } from "./videoPlay";
import { UserInfo } from "./userInfo/UserInfo";
import AiAssistant from "./aiassistant";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="project" element={<Project />} />
        <Route path="projectCenter" element={<ProjectCenter />} />
        <Route path="videoCenter" element={<VideoCenter />} />
        <Route path="algorithmCenter" element={<AlgorithmCenter />} />
        <Route path="algorithmEdit" element={<AlgorithmEdit />} />
        <Route path="videoPlay" element={<VideoPlay />} />
        <Route path="userInfo" element={<UserInfo />} />
      </Routes>
      <AiAssistant></AiAssistant>
      <Dialogs></Dialogs>
    </BrowserRouter>
  );
}

export default App;
