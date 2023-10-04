import { Obj } from "../../../core";
import { snapshot } from "../../../store";
import { LineWidgetControlPanel } from "./lineWidget";
import { NumberWidgetControlPanel } from "./numberWidget";
import { StackWidgetControlPanel } from "./stackWidget";
import { StringWidgetControlPanel } from "./stringWidget";
import { BaseModel, WidgetType } from "./type";

export * from "./type";
export * from "./widgetRenders";
export * from "./numberWidget";

export function getModelById(id: string): BaseModel | null {
  const s = snapshot.get();
  if (s === null) {
    throw new Error("get model by id: snapshot is null");
  }
  return getModelByIdDfs(id, s);
}

function getModelByIdDfs(id: string, now: Obj | null): BaseModel | null {
  if (!now) {
    return null;
  }
  if (now["id"] === id) {
    return now as BaseModel;
  }
  for (let attr in now) {
    if (typeof now[attr] === "object") {
      const res = getModelByIdDfs(id, now[attr]);
      if (res !== null) {
        return res;
      }
    }
  }
  return null;
}

const WidgetControlPanelMap: Record<WidgetType, () => JSX.Element> = {
  [WidgetType.Number]: NumberWidgetControlPanel,
  [WidgetType.String]: StringWidgetControlPanel,
  [WidgetType.Stack]: StackWidgetControlPanel,
  [WidgetType.Line]: LineWidgetControlPanel,
};

export function getWidgetControlPanel(type: WidgetType) {
  return WidgetControlPanelMap[type];
}
