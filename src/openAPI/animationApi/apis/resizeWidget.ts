import { getModelById } from "../../../components/widget/widgets";
import { WidgetActionResize, commitAction } from "../../../core";
import { ResizeWidgetParams } from "../types/widget/Base";

export function resizeWidget(params: ResizeWidgetParams) {
  const model = getModelById(params.id);
  if (model === null) {
    // TODO 给用户提示 model id 不存在
    return;
  }
  const action = WidgetActionResize.create(model, {
    w: params.width,
    h: params.height,
  });
  commitAction(action);
}
