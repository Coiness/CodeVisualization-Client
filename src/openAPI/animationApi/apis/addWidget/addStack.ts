import { widgetModelManager } from "../../../../components/widget";
import { BaseModel, WidgetType, getModelById } from "../../../../components/widget/widgets";
import { Snapshot } from "../../../../view/project";
import { BaseWidget } from "../../types/widget/Base";
import { AddStackWidgetParams, StackWidget } from "../../types/widget/Stack";
import { modelKey } from "./common";
import { StackWidget as StackWidgetModel } from "../../../../components/widget/widgets/stackWidget";
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
      let model = getModelById((action!.data as any).model.id)!;
      return model.value.length;
    },
    push(widget: BaseWidget) {
      const model = getModelById(id)!;
      const stack = widgetModelManager.getWidget(model) as StackWidgetModel;
      stack.push((widget as any)[modelKey] as BaseModel);
    },
    pop(): BaseWidget | null {
      const model = getModelById(id)!;
      const stack = widgetModelManager.getWidget(model) as StackWidgetModel;
      const m = stack.pop();
      if (m) {
        return m;
      }
      return null;
    },
    peek(): BaseWidget | null {
      const model = getModelById(id)!;
      const stack = widgetModelManager.getWidget(model) as StackWidgetModel;
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
  const res = {
    id,
    ...info,
  } as StackWidget;
  const proxy = new Proxy(res, {
    get(target, p) {
      if (p === "id") {
        return id;
      }
      const model = getModelById(id);
      if (typeof p === "symbol") {
        return null;
      } else if (model?.[p]) {
        return model[p];
      } else if ((info as any)[p]) {
        return (info as any)[p];
      } else {
        return null;
      }
    },
  });
  return proxy;
}
