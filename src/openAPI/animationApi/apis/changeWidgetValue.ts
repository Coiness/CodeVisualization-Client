import { WidgetType, getModelById } from "../../../components/widget/widgets";
import { ValueAction, commitAction } from "../../../core";
import { ChangeWidgetValueParams } from "../types/widget/Base";

export function changeWidgetValue(params: ChangeWidgetValueParams) {
  const model = getModelById(params.id);
  const value = params.value;
  if (model === null) {
    // TODO 给用户提示 model id 不存在
    return;
  }
  let action: ValueAction;
  if (model.type === WidgetType.Number) {
    if (typeof value !== "number") {
      // TODO 给用户提示 参数 value 类型错误
      return;
    }
    action = ValueAction.create(model, {
      value,
    });
  } else if (model.type === WidgetType.String) {
    if (typeof value !== "string") {
      // TODO 给用户提示 参数 value 类型错误
      return;
    }
    action = ValueAction.create(model, {
      value,
    });
  } else {
    // TODO 给用户提示 该类型不可直接修改 value
    return;
  }
  commitAction(action);
}
