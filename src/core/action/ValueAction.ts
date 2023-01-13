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

export class ValueAction extends BaseAction {
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
}
