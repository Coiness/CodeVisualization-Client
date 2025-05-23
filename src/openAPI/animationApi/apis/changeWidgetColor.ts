import { getModelById } from "../../../components/widget/widgets";
import { WidgetActionChangeColor, commitAction } from "../../../core";
import { ChangeWidgetColorParams } from "../types/widget/Base";

export function changeWidgetColor(params: ChangeWidgetColorParams) {
  const model = getModelById(params.id);
  const color = params.color;
  if (model === null) {
    // TODO 给用户提示 model id 不存在
    return;
  }
  const action = WidgetActionChangeColor.create(model, color);
  commitAction(action);
}
