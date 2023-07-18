import { cloneDeep } from "lodash";
import { createOnlyId, Subject } from "../../common/utils";
import { WidgetModel } from "../../components/widget/widgets";
import { StackWidgetModel } from "../../components/widget/widgets/stackWidget";
import { ChangeSet } from "../diff/objDiff";
import { CSType, getCS } from "../undo";
import { BaseAction } from "./baseAction";

export interface StackActionPushData {
  id: string;
  type: "push";
  info: {
    fromWidgetId: string;
    newWidgetModel: WidgetModel;
  };
}

export interface StackActionPopData {
  id: string;
  type: "pop";
}

export type StackActionData = StackActionPushData | StackActionPopData;

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
    });
    return p;
  }

  stop() {
    // if (!this.stoped) {
    //   this.stoped = true;
    //   this.commit();
    // }
    // this.stopFun();
  }
}

export class StackActionPush extends StackAction {
  data: StackActionPushData;
  static create(model: StackWidgetModel, info: { fromWidgetModel: WidgetModel }) {
    const newModel = cloneDeep(info.fromWidgetModel);

    newModel.id = createOnlyId("widget");
    newModel.x = 0;
    newModel.y = 0;

    const data: StackActionPushData = {
      id: model.id,
      type: "push",
      info: {
        fromWidgetId: info.fromWidgetModel.id,
        newWidgetModel: newModel,
      },
    };
    const cs = getCS(
      model.value,
      [
        ["length", model.value.length + 1], // 改变数组长度
        [model.value.length, newModel], // 再添加元素
      ],
      model,
    );
    return new StackActionPush(data, cs);
  }

  constructor(data: StackActionPushData, cs: ChangeSet) {
    super(data, cs);
    this.data = data;
  }
}

export class StackActionPop extends StackAction {
  data: StackActionPopData;
  static create(model: StackWidgetModel) {
    const data: StackActionPopData = {
      id: model.id,
      type: "pop",
    };
    const cs = getCS(
      model.value,
      [
        [model.value.length - 1, CSType.DELETE], // 先删除元素
        ["length", model.value.length - 1], // 再改变数组长度
      ],
      model,
    );
    return new StackActionPop(data, cs);
  }

  constructor(data: StackActionPopData, cs: ChangeSet) {
    super(data, cs);
    this.data = data;
  }
}
