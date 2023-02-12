import { BaseAction } from "./baseAction";
import { ValueAction } from "./ValueAction";
import { WidgetAction } from "./WidgetAction";
import { WidgetRendererAction } from "./WidgetRendererAction";

export * from "./baseAction";
export * from "./ValueAction";
export * from "./WidgetAction";
export * from "./WidgetRendererAction";

export function cloneAction(action: BaseAction): BaseAction {
  if (action.type === "Value") {
    return new ValueAction(action.data as any, action.cs);
  } else if (action.type === "Widget") {
    return new WidgetAction(action.data as any, action.cs);
  } else if (action.type === "WidgetRenderer") {
    return new WidgetRendererAction(action.data as any, action.cs);
  } else {
    throw new Error("clone action: action type error");
  }
}
