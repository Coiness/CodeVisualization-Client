import { cloneDeep } from "lodash";
import { createOnlyId, Subject } from "../../common/utils";
import { BaseModel, WidgetModel } from "../../components/widget/widgets";
import { StackWidgetModel } from "../../components/widget/widgets/stackWidget";
import { ChangeSet } from "../diff/objDiff";
import { CSType, getCS } from "../undo";
import { BaseAction } from "./baseAction";

export type StackActionData =
  | {
      id: string;
      type: "push";
      info: {
        fromWidgetId: string;
        newWidgetModel: WidgetModel;
      };
    }
  | {
      id: string;
      type: "pop";
    };

export type CreateStackActionParams =
  | {
      type: "push";
      info: { fromWidgetModel: WidgetModel };
    }
  | {
      type: "pop";
    };

interface StackWidgetExecerParams {
  action: StackAction;
  setStop: (s: () => void) => void;
  end: () => void;
}

export const stackWidgetExecer = new Subject<StackWidgetExecerParams>();

export class StackAction extends BaseAction {
  private stopFun: () => void = () => {};
  private stoped: boolean = false;

  constructor(data: StackActionData, cs: ChangeSet) {
    super(data, cs, "Stack");
  }

  static create(model: StackWidgetModel, params: CreateStackActionParams) {
    const { type } = params;
    let data: StackActionData;
    let cs: ChangeSet;

    if (type === "push") {
      const info = params.info;
      const newModel = cloneDeep(info.fromWidgetModel);

      newModel.id = createOnlyId("widget");
      newModel.x = 0;
      newModel.y = 0;

      data = {
        id: model.id,
        type: "push",
        info: {
          fromWidgetId: info.fromWidgetModel.id,
          newWidgetModel: newModel,
        },
      };
      cs = getCS(model.value, [[model.value.length, newModel]], model);
    } else if (type === "pop") {
      data = {
        id: model.id,
        type: "pop",
      };
      cs = getCS(
        model.value,
        [
          [model.value.length - 1, CSType.DELETE], // 先删除元素
          ["length", model.value.length - 1], // 再改变数组长度
        ],
        model
      );
    } else {
      throw new Error("Stack Action: params.type error");
    }
    return new StackAction(data, cs);
  }

  async play() {
    const p: Promise<void> = new Promise((resolve) => {
      this.stoped = false;
      stackWidgetExecer.next({
        action: this,
        setStop: (s: () => void) => {
          this.stoped = true;
          this.stopFun = s;
        },
        end: () => {
          resolve();
        },
      });
      resolve();
    });
    return p;
  }

  stop() {
    if (!this.stoped) {
      this.stoped = true;
      this.commit();
    }
    this.stopFun();
  }
}
