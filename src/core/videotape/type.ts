import { Snapshot } from "../../view/project";
import { Action } from "../action";

export interface Video {
  snapshot: Snapshot;
  actions: Action[];
}
