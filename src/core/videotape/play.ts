import { message } from "antd";
import { Subject } from "../../common/utils";
import { Snapshot } from "../../view/project";
import { modelSwitcher } from "../modelSwitcher";
import { execUndo } from "../undo";
import { Step, Video } from "./type";

export class Player {
  private snapshot: Snapshot = {} as Snapshot;
  private steps: Step[] = [];
  private index: number = 0;

  progress = new Subject<number>();

  start(video: Video) {
    this.snapshot = video.snapshot;
    this.steps = video.steps;
    this.index = 0;
    this.progress.next(this.index);
    modelSwitcher.pushModel(this.snapshot);
  }

  next() {
    if (this.index === this.steps.length) {
      message.info("已经是最后一帧了！");
      return;
    }
    // 执行新动画时，停止之前的动画
    if (this.index !== 0) {
      for (let action of this.steps[this.index - 1].actions) {
        action.stop();
      }
    }
    // 执行新动画
    for (let action of this.steps[this.index].actions) {
      action.play().then(() => {
        action.commit();
      });
    }
    this.index++;
    this.progress.next(this.index);
  }

  last() {
    if (this.index === 0) {
      message.info("已经是第一帧了！");
      return;
    }
    const len = this.steps[this.index - 1].actions.length;
    for (let i = 0; i < len; i++) {
      execUndo();
    }
    this.index--;
    this.progress.next(this.index);
  }

  getStepCount() {
    return this.steps.length;
  }

  go(index: number) {
    while (this.index !== index) {
      if (this.index < index) {
        this.next();
      } else if (this.index > index) {
        this.last();
      }
    }
  }

  getSnapshot() {
    return this.snapshot;
  }

  end() {}
}
