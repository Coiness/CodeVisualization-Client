import { Snapshot } from "../../view/project";
import { applyAction } from "../action";
import { modelSwitcher } from "../modelSwitcher";
import { execUndo } from "../undo";
import { Step, Video } from "./type";

export class Player {
  private snapshot: Snapshot = {} as Snapshot;
  private steps: Step[] = [];
  private index: number = 0;

  start(video: Video) {
    this.snapshot = video.snapshot;
    this.steps = video.steps;
    this.index = 0;
    modelSwitcher.pushModel(this.snapshot);
  }

  next() {
    if (this.index === this.steps.length) {
      console.log("DEBUG: ", "next end");
      return;
    }
    for (let action of this.steps[this.index].actions) {
      applyAction(action);
    }
    this.index++;
  }

  last() {
    if (this.index === 0) {
      console.log("DEBUG: ", "last end");
      return;
    }
    const len = this.steps[this.index - 1].actions.length;
    for (let i = 0; i < len; i++) {
      execUndo();
    }
    this.index--;
  }

  end() {}
}
