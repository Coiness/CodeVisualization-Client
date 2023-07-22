import { widgetModelManager } from "../../../../components/widget";
import { BaseModel, WidgetType, getModelById } from "../../../../components/widget/widgets";
import { Snapshot } from "../../../../view/project";
import { BaseWidget } from "../../types/widget/Base";
import { AddStackWidgetParams, StackWidget } from "../../types/widget/Stack";
import { ModelKeyObj, modelKey } from "./common";
import { StackWidget as CompStackWidget, StackWidgetModel } from "../../../../components/widget/widgets/stackWidget";
import { WidgetRendererActionCreate, commitAction } from "../../../../core";

export function addStack(s: Snapshot, p: AddStackWidgetParams) {
  const info = {
    x: p.x,
    y: p.y,
    width: p.width ?? 100,
    height: p.height ?? 400,
    color: p.color ?? "rgb(255, 242, 213)",
    value: [],
    size() {
      let model = getModelById(action.data.model.id)! as StackWidgetModel;
      return model.value.length;
    },
    push(widget: BaseWidget) {
      const model = getModelById(id)!;
      const stack = widgetModelManager.getWidget(model) as CompStackWidget;
      stack.push((widget as ModelKeyObj)[modelKey] as BaseModel);
    },
    pop(): BaseWidget | null {
      const model = getModelById(id)!;
      const stack = widgetModelManager.getWidget(model) as CompStackWidget;
      const m = stack.pop();
      if (m) {
        return m;
      }
      return null;
    },
    peek(): BaseWidget | null {
      const model = getModelById(id)!;
      const stack = widgetModelManager.getWidget(model) as CompStackWidget;
      const m = stack.peek();
      if (m) {
        return m;
      }
      return null;
    },
  } as Omit<StackWidget, "id">;
  const action = WidgetRendererActionCreate.create(s.widgetManagerModel, {
    id: "",
    type: WidgetType.Stack,
    ...info,
  });
  commitAction(action);
  const id = action.data.model.id;
  return {
    id,
    [modelKey]: action.data.model,
    ...info,
  } as StackWidget;
}
