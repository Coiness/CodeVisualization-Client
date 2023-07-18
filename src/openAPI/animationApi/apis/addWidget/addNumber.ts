import { WidgetType, getModelById } from "../../../../components/widget/widgets";
import { WidgetRendererActionCreate, commitAction } from "../../../../core";
import { Snapshot } from "../../../../view/project";
import { AddNumberWidgetParams, NumberWidget } from "../../types/widget/Number";
import { modelKey } from "./common";

export function addNumber(s: Snapshot, p: AddNumberWidgetParams) {
  const info = {
    x: p.x,
    y: p.y,
    width: p.width ?? 90,
    height: p.height ?? 40,
    color: p.color ?? "#a7b0ff",
    value: p.numberValue,
  } as Omit<NumberWidget, "id">;

  const action = WidgetRendererActionCreate.create(s.widgetManagerModel, {
    id: "",
    type: WidgetType.Number,
    ...info,
  });

  commitAction(action);
  const id = action.data.model.id;
  const res = {
    id,
    [modelKey]: action.data.model,
    ...info,
  } as NumberWidget;
  const proxy = new Proxy(res, {
    get(target, p) {
      if (p === "id") {
        return id;
      }
      if (p === modelKey || typeof p === "symbol") {
        return action.data.model;
      }
      const model = getModelById(id);
      if (model?.[p]) {
        return model[p];
      } else {
        return null;
      }
    },
  });
  return proxy;
}