import { widgetModelManager } from "../../../components/widget";
import { BaseModel, WidgetType, getModelById } from "../../../components/widget/widgets";
import { StackWidget as StackWidgetModel } from "../../../components/widget/widgets/stackWidget";
import { BaseAction, WidgetRendererAction, commitAction } from "../../../core";
import { snapshot } from "../../../store";
import { BaseWidgetType } from "../types/widget";
import { BaseWidget } from "../types/widget/Base";
import { AddNumberWidgetParams, NumberWidget } from "../types/widget/Number";
import { AddStackWidgetParams, StackWidget } from "../types/widget/Stack";
import { AddStringWidgetParams, StringWidget } from "../types/widget/String";
import { modelKey } from "./common";

export function addWidget<T extends BaseWidgetType>(params: T["addWidgetParams"]) {
  const s = snapshot.get();
  if (s === null) {
    throw new Error("animation api addWidget: snapshot is null");
  }
  if (params.type === "number") {
    const p = params as AddNumberWidgetParams;
    const info = {
      x: p.x,
      y: p.y,
      width: p.width ?? 90,
      height: p.height ?? 40,
      color: p.color ?? "#a7b0ff",
      value: p.numberValue,
    } as Omit<NumberWidget, "id">;

    const action = WidgetRendererAction.create(s.widgetManagerModel, {
      type: "create",
      model: {
        id: "",
        type: WidgetType.Number,
        ...info,
      },
    });

    commitAction(action);
    const id = (action.data as any).model.id;
    const res = {
      id,
      [modelKey]: (action.data as any).model,
      ...info,
    } as NumberWidget;
    const proxy = new Proxy(res, {
      get(target, p) {
        if (p === "id") {
          return id;
        }
        if (p === modelKey || typeof p === "symbol") {
          return (action.data as any).model;
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
  } else if (params.type === "string") {
    const p = params as AddStringWidgetParams;
    const info = {
      x: p.x,
      y: p.y,
      width: p.width ?? 90,
      height: p.height ?? 40,
      color: p.color ?? "#d5ff80",
      value: p.stringValue,
    } as Omit<StringWidget, "id">;
    const action = WidgetRendererAction.create(s.widgetManagerModel, {
      type: "create",
      model: {
        id: "",
        type: WidgetType.String,
        ...info,
      },
    });
    commitAction(action);
    const id = (action.data as any).model.id;
    const res = {
      id,
      [modelKey]: (action.data as any).model,
      ...info,
    } as StringWidget;
    const proxy = new Proxy(res, {
      get(target, p) {
        if (p === "id") {
          return id;
        }
        if (p === modelKey || typeof p === "symbol") {
          return (action.data as any).model;
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
  } else if (params.type === "stack") {
    const p = params as AddStackWidgetParams;
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
    const action = WidgetRendererAction.create(s.widgetManagerModel, {
      type: "create",
      model: {
        id: "",
        type: WidgetType.Stack,
        ...info,
      },
    });
    const id = (action!.data as any).model.id;
    const res = {
      id,
      [modelKey]: (action.data as any).model,
      ...info,
    } as StackWidget;
    const proxy = new Proxy(res, {
      get(target, p) {
        if (p === "id") {
          return id;
        }
        if (p === modelKey || typeof p === "symbol") {
          return (action.data as any).model;
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
  } else {
    throw new Error("animationApi addWidget: params.type illegal");
  }
}
