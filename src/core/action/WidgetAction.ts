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

export type WidgetActionData =
  | {
      id: string;
      type: "resize";
      change: { w: number; h: number };
    }
  | {
      id: string;
      type: "move";
      change: { x: number; y: number };
    };

type CreateWidgetActionParams =
  | {
      type: "resize";
      change: { w: number; h: number };
    }
  | {
      type: "move";
      change: { x: number; y: number };
    };

export class WidgetAction extends BaseAction {
  private stopFun: () => void = () => {};
  private over: boolean = false;

  constructor(data: WidgetActionData, cs: ChangeSet) {
    super(data, cs, "Widget");
  }

  static create(model: BaseModel, params: CreateWidgetActionParams) {
    const { type, change } = params;
    const data = {
      id: model.id,
      type: type,
      change: change,
    };
    let cs: ChangeSet;
    if (type === "move") {
      cs = getCS(model, [
        ["x", change.x],
        ["y", change.y],
      ]);
    } else if (type === "resize") {
      cs = getCS(model, [
        ["width", change.w],
        ["height", change.h],
      ]);
    } else {
      throw new Error("create WidgetAction type error");
    }
    return new WidgetAction(data as WidgetActionData, cs);
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
