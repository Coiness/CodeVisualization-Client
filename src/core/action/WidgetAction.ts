import { Subject } from "../../common/utils";
import { BaseModel } from "../../components/widget/widgets";
import { ChangeSet } from "../diff/objDiff";
import { getCS } from "../undo";
import { Action, BaseAction } from "./baseAction";

export const widgetActionExeter = new Subject<{
  action: Action;
  setStop: (s: () => void) => void;
  end: () => void;
}>();

export interface WidgetActionResizeData {
  id: string;
  type: "resize";
  change: { w: number; h: number };
}

export interface WidgetActionMoveData {
  id: string;
  type: "move";
  change: { x: number; y: number };
}

export interface WidgetActionChangeColorData {
  id: string;
  type: "changeColor";
  change: string;
}

export type WidgetActionData = WidgetActionResizeData | WidgetActionMoveData | WidgetActionChangeColorData;

export class WidgetAction extends BaseAction {
  private stopFun: () => void = () => {};
  private over: boolean = false;

  constructor(data: WidgetActionData, cs: ChangeSet) {
    super(data, cs, "Widget");
  }

  async play() {
    const p: Promise<void> = new Promise(async (resolve) => {
      this.over = false;
      // 将 action 交给对应拿着 model 的组件处理
      widgetActionExeter.next({
        action: this,
        setStop: (s: () => void) => {
          this.stopFun = s;
        },
        end: () => {
          this.over = true;
          // 组件执行动画之后应用其中的 cs
          resolve();
        },
      });
    });

    return p;
  }

  stop() {
    this.stopFun();

    // 停止动画时如果动画还没执行完，就立即 commit action
    if (!this.over) {
      this.over = true;
      this.commit();
    }
  }
}

export class WidgetActionResize extends WidgetAction {
  static create(model: BaseModel, change: { w: number; h: number }) {
    const data = {
      id: model.id,
      type: "resize",
      change: change,
    };
    const cs = getCS(model, [
      ["width", change.w],
      ["height", change.h],
    ]);
    return new WidgetAction(data as WidgetActionResizeData, cs);
  }
}

export class WidgetActionMove extends WidgetAction {
  static create(model: BaseModel, change: { x: number; y: number }) {
    const data = {
      id: model.id,
      type: "move",
      change: change,
    };
    const cs = getCS(model, [
      ["x", change.x],
      ["y", change.y],
    ]);
    return new WidgetAction(data as WidgetActionMoveData, cs);
  }
}

export class WidgetActionChangeColor extends WidgetAction {
  static create(model: BaseModel, color: string) {
    const data = {
      id: model.id,
      type: "changeColor",
      change: color,
    };
    const cs = getCS(model, [["color", color]]);
    return new WidgetAction(data as WidgetActionChangeColorData, cs);
  }
}
