import { BaseAction } from "./baseAction";
import { StackAction, StackActionData } from "./StackAction";
import { ValueAction, ValueActionData } from "./ValueAction";
import { WidgetAction, WidgetActionData } from "./WidgetAction";
import { WidgetRendererAction, WidgetRendererActionData } from "./WidgetRendererAction";

export * from "./baseAction";
export * from "./ValueAction";
export * from "./WidgetAction";
export * from "./WidgetRendererAction";

export function cloneAction(action: BaseAction): BaseAction {
  if (action.type === "Value") {
    return new ValueAction(action.data as ValueActionData, action.cs);
  } else if (action.type === "Widget") {
    return new WidgetAction(action.data as WidgetActionData, action.cs);
  } else if (action.type === "WidgetRenderer") {
    return new WidgetRendererAction(action.data as WidgetRendererActionData, action.cs);
  } else if (action.type === "Stack") {
    return new StackAction(action.data as StackActionData, action.cs);
  } else {
    throw new Error("clone action: action type error");
  }
}
