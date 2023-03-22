import { ShowCodeInfo } from "../../view/algorithmEdit/ShowCode";
import { Snapshot } from "../../view/project";
import { BaseAction } from "../action";

export interface Step {
  actions: BaseAction[];
}

export interface ConsoleContent {
  type: "print" | "println";
  content: string;
}

export interface Video {
  snapshot: Snapshot;
  steps: Step[];
  consoles: (ConsoleContent | null)[] | null;
  heightlines: { [key: string]: number[] } | null;
  showCode: ShowCodeInfo | null;
}
