import { Snapshot } from "../../view/project";
import { Action } from "../action";

export interface Step {
  actions: Action[];
}

export interface Video {
  snapshot: Snapshot;
  steps: Step[];
}
