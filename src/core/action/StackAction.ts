import { Subject } from "../../common/utils";
import { BaseModel, WidgetModel } from "../../components/widget/widgets";
import { ChangeSet } from "../diff/objDiff";
import { getCS } from "../undo";
import { BaseAction } from "./baseAction";

export type StackActionData =
  | {
      id: string;
    } & (
      | {
          type: "push";
          info: {
            fromWidgetId: string;
            newWidgetModel: WidgetModel;
          };
        }
      | {
          type: "pop";
          change: { value: unknown };
        }
    );

type CreateStackActionParams = {
  value: unknown;
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

  static create(model: BaseModel, params: CreateStackActionParams) {
    const { value } = params;
    const data = {
      id: model.id,
      type: "assignment",
      change: { value },
    };
    let cs = getCS(model, [["value", value]]);
    return new StackAction(data as StackActionData, cs);
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
