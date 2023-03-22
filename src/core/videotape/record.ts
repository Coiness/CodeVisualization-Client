import { cloneDeep } from "lodash";
import { Subscription } from "../../common/utils";
import { snapshot } from "../../store";
import { Snapshot } from "../../view/project";
import { actionCommitter } from "../action";
import { Step, Video } from "./type";

export class Recorder {
  private snapshot: Snapshot = {} as Snapshot;
  private steps: Step[] = [];
  private recording: boolean = false;
  private actionsSub: Subscription = {} as Subscription;

  start() {
    const s = snapshot.get();
    if (s) {
      this.snapshot = cloneDeep(s);
      this.recording = true;
      this.actionsSub = actionCommitter.subscribe((action) => {
        this.steps.push({
          actions: [action],
        });
      });
    } else {
      throw new Error("start record: snapshot is null");
    }
  }

  end(): Video {
    console.log("DEBUG: ", "end");
    if (!this.recording) {
      throw new Error("end record: record not start");
    }
    this.recording = false;
    this.actionsSub.unsubscribe();

    return {
      snapshot: this.snapshot,
      steps: this.steps,
      consoles: null,
      heightlines: null,
      showCode: null,
    };
  }
}
