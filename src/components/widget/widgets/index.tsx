import { Obj } from "../../../core";
import { snapshot } from "../../../store";
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

export function getWidgetControlPanel(type: WidgetType) {
  if (type === WidgetType.Number) {
    return NumberWidgetControlPanel;
  } else if (type === WidgetType.String) {
    return StringWidgetControlPanel;
  } else if (type === WidgetType.Stack) {
    return StackWidgetControlPanel;
  } else {
    throw new Error("get widget control panel: widget type error");
  }
}
