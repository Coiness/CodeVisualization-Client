import { message } from "antd";
import { cloneDeep } from "lodash";
import { Subject } from "../../common/utils";
import { ShowCodeLanguage } from "../../view/algorithmEdit/type";
import { Snapshot } from "../../view/project";
import { modelSwitcher } from "../modelSwitcher";
import { ConsoleContent, Step, Video } from "./type";

export class Player {
  private snapshot: Snapshot = {} as Snapshot;
  private steps: Step[] = [];
  private consoles: (ConsoleContent | null)[] | null = null;
  private heightlines: { [lang: string]: number[] } | null = null;
  private index: number = 0;

  progress = new Subject<number>();

  start(video: Video) {
    video = cloneDeep(video);
    this.snapshot = video.snapshot;
    this.steps = video.steps;
    this.consoles = video.consoles;
    this.heightlines = video.heightlines;
    this.index = 0;
    this.progress.next(this.index);
    modelSwitcher.pushModel(this.snapshot);
  }

  next(execAnimation = true) {
    if (this.index === this.steps.length) {
      message.info("已经是最后一步了！");
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
      if (execAnimation) {
        action.play().then(() => {
          action.commit();
        });
      } else {
        action.commit();
      }
    }
    this.index++;
    this.progress.next(this.index);
  }

  last() {
    if (this.index === 0) {
      message.info("已经是第一步了！");
      return;
    }
    const len = this.steps[this.index - 1].actions.length;
    for (let i = 0; i < len; i++) {
      this.steps[this.index - 1].actions[i].reload();
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
        this.next(false);
      } else if (this.index > index) {
        this.last();
      }
    }
  }

  getSnapshot() {
    return this.snapshot;
  }

  getConsoles(): string[] {
    let index = this.index;
    let res: string[] = [];
    let p = 0;
    let ln = true;
    console.log("index", index,"consoles:", this.consoles);
    if (!this.consoles) {
      return res;
    }
    for (let i = 0; i < this.consoles.length; i++) {
      if (i >= index) {
        break;
      }

      if (this.consoles[i] === null) {
        continue;
      }

      if (ln) {
        res[p++] = this.consoles[i]!.content;
      } else {
        res[p] += this.consoles[i]!.content;
      }

      if (this.consoles[i]!.type === "print") {
        ln = false;
      } else if (this.consoles[i]!.type === "println") {
        ln = true;
      }
    }
    return res;
  }

  getHeightLine(lang: ShowCodeLanguage): number {
    return this.heightlines?.[lang][this.index] ?? 0;
  }

  end() {}
}
