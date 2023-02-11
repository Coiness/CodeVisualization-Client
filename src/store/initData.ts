import { AlgorithmInfo } from "../view/algorithmEdit";
import { ProjectInfo } from "../view/project";
import { VideoInfo } from "../view/videoPlay";
import { createStatus } from "./status";

export const initProjectInfo = createStatus<ProjectInfo | null>(null);
export const initVideoInfo = createStatus<VideoInfo | null>(null);
export const initAlgorithmInfo = createStatus<AlgorithmInfo | null>(null);
