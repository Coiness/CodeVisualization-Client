import { WidgetType } from "../../../../components/widget/widgets";
import { WidgetRendererActionCreate, commitAction } from "../../../../core";
import { Snapshot } from "../../../../view/project";
import { AddLineWidgetParams, LineWidget } from "../../types/widget/Line";
import { modelKey } from "./common";

export function addLine(s: Snapshot, p: AddLineWidgetParams) {
  const info = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: p.color ?? "#d5ff80",
    size: p.size,
    startNodeId: p.startNodeId,
    endNodeId: p.endNodeId,
  } as Omit<LineWidget, "id">;

  const action = WidgetRendererActionCreate.create(s.widgetManagerModel, {
    id: "",
    type: WidgetType.Line,
    ...info,
  });
  commitAction(action);
  const id = action.data.model.id;
  return {
    id,
    [modelKey]: action.data.model,
    ...info,
  } as LineWidget;
}
