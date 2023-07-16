import { getModelById } from "../../../components/widget/widgets";
import { WidgetRendererAction, WidgetRendererActionDelete, commitAction } from "../../../core";
import { snapshot } from "../../../store";
import { DeleteWidgetParams } from "../types/widget/Base";

export function deleteWidget(params: DeleteWidgetParams) {
  const s = snapshot.get();
  if (s === null) {
    throw new Error("animation api deleteWidget: snapshot is null");
  }
  const model = getModelById(params.id);
  if (model === null) {
    // TODO 给用户提示 model id 不存在
    return;
  }
  const action = WidgetRendererActionDelete.create(s.widgetManagerModel, model);
  commitAction(action);
}
