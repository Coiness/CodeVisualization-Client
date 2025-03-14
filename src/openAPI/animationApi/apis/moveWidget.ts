import { getModelById } from "../../../components/widget/widgets";
import { WidgetActionMove, commitAction } from "../../../core";
import { MoveWidgetParams } from "../types/widget/Base";

export function moveWidget(params: MoveWidgetParams) {
  const model = getModelById(params.id);
  if (model === null) {
    // TODO 给用户提示 model id 不存在
    return;
  }
  const action = WidgetActionMove.create(model, {
    x: params.x,
    y: params.y,
  });
  commitAction(action);
}
