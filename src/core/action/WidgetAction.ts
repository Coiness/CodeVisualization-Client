import { BaseModel } from "../../components/widget/widgets";
import { ChangeSet } from "../diff/objDiff";
import { getCS } from "../undo";
import { BaseAction } from "./baseAction";

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
}
