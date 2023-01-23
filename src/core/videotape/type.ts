import { Snapshot } from "../../view/project";
import { BaseAction } from "../action";

export interface Step {
  actions: BaseAction[];
}

export interface Video {
  snapshot: Snapshot;
  steps: Step[];
}
