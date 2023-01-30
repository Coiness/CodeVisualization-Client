import { Subject } from "../../common/utils";
import { BaseModel } from "../../components/widget/widgets";
import { ChangeSet } from "../diff/objDiff";
import { getCS } from "../undo";
import { BaseAction } from "./baseAction";

export type ValueActionData = {
  id: string;
  type: "assignment"; // 赋值
  change: { value: unknown };
};

type CreateValueActionParams = {
  value: unknown;
};

interface ValueWidgetExecerParams {
  action: ValueAction;
  setStop: (s: () => void) => void;
  end: () => void;
}

export const valueWidgetExecer = new Subject<ValueWidgetExecerParams>();

export class ValueAction extends BaseAction {
  private stopFun: () => void = () => {};
  private stoped: boolean = false;

  constructor(data: ValueActionData, cs: ChangeSet) {
    super(data, cs, "Value");
  }

  static create(model: BaseModel, params: CreateValueActionParams) {
    const { value } = params;
    const data = {
      id: model.id,
      type: "assignment",
      change: { value },
    };
    let cs = getCS(model, [["value", value]]);
    return new ValueAction(data as ValueActionData, cs);
  }

  async play() {
    const p: Promise<void> = new Promise((resolve) => {
      this.stoped = false;
      valueWidgetExecer.next({
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
