import { WidgetType } from "../../../../components/widget/widgets";
import { WidgetRendererActionCreate, commitAction } from "../../../../core";
import { Snapshot } from "../../../../view/project";
import { AddStringWidgetParams, StringWidget } from "../../types/widget/String";
import { modelKey } from "./common";

export function addString(s: Snapshot, p: AddStringWidgetParams) {
  const info = {
    x: p.x,
    y: p.y,
    width: p.width ?? 90,
    height: p.height ?? 40,
    color: p.color ?? "#d5ff80",
    value: p.stringValue,
  } as Omit<StringWidget, "id">;
  const action = WidgetRendererActionCreate.create(s.widgetManagerModel, {
    id: "",
    type: WidgetType.String,
    ...info,
  });
  commitAction(action);
  const id = action.data.model.id;
  return {
    id,
    [modelKey]: action.data.model,
    ...info,
  } as StringWidget;
}
