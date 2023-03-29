import {
  BaseModel,
  getModelById,
  WidgetType,
} from "../../components/widget/widgets";
import {
  BaseAction,
  commitAction,
  WidgetAction,
  WidgetRendererAction,
} from "../../core";
import { AnimationApi } from "./types";
import {
  BaseWidget,
  BaseWidgetType,
  ChangeWidgetColorParams,
  DeleteWidgetParams,
  MoveWidgetParams,
  ResizeWidgetParams,
} from "./types/widget/Base";
import { AddNumberWidgetParams } from "./types/widget/Number";
import { AddStringWidgetParams } from "./types/widget/String";
import { snapshot } from "../../store";
import { AddStackWidgetParams } from "./types/widget/Stack";
import { widgetModelManager } from "../../components/widget";
import { StackWidget } from "../../components/widget/widgets/stackWidget";

const modelKey = Symbol("modelKey");

export const animationApi: AnimationApi = {
  addWidget<T extends BaseWidgetType>(params: T["addWidgetParams"]) {
    const s = snapshot.get();
    if (s === null) {
      throw new Error("animation api addWidget: snapshot is null");
    }
    let action: BaseAction | null = null;
    let info: { [ket: string]: any };
    if (params.type === "number") {
      const p = params as AddNumberWidgetParams;
      action = WidgetRendererAction.create(s.widgetManagerModel, {
        type: "create",
        model: {
          id: "",
          type: WidgetType.Number,
          x: p.x,
          y: p.y,
          width: p.width ?? 100,
          height: p.height ?? 30,
          color: p.color ?? "#a7b0ff",
          value: p.numberValue,
        },
      });
      info = {
        value: p.numberValue,
      };
    } else if (params.type === "string") {
      const p = params as AddStringWidgetParams;
      action = WidgetRendererAction.create(s.widgetManagerModel, {
        type: "create",
        model: {
          id: "",
          type: WidgetType.String,
          x: p.x,
          y: p.y,
          width: p.width ?? 100,
          height: p.height ?? 30,
          color: p.color ?? "#d5ff80",
          value: p.stringValue,
        },
      });
      info = {
        value: p.stringValue,
      };
    } else if (params.type === "stack") {
      const p = params as AddStackWidgetParams;
      action = WidgetRendererAction.create(s.widgetManagerModel, {
        type: "create",
        model: {
          id: "",
          type: WidgetType.Stack,
          x: p.x,
          y: p.y,
          width: p.width ?? 100,
          height: p.height ?? 400,
          color: p.color ?? "rgb(255, 242, 213)",
          value: [],
        },
      });
      const id = (action!.data as any).model.id;
      info = {
        size() {
          let model = getModelById((action!.data as any).model.id)!;
          return model.value.length;
        },
        push(widget: BaseWidget) {
          const model = getModelById(id)!;
          const stack = widgetModelManager.getWidget(model) as StackWidget;
          stack.push((widget as any)[modelKey] as BaseModel);
        },
        pop(): BaseWidget | null {
          const model = getModelById(id)!;
          const stack = widgetModelManager.getWidget(model) as StackWidget;
          const m = stack.pop();
          if (m) {
            return m;
          }
          return null;
        },
      };
    } else {
      throw new Error("animationApi addWidget: params.type illegal");
    }
    if (action !== null) {
      commitAction(action);
      const id = (action.data as any).model.id;
      const res = {
        id,
        [modelKey]: (action.data as any).model,
        ...info,
      } as T["addWidgetResult"];
      return res;
    }
    return {} as T["addWidgetResult"];
  },

  deleteWidget(params: DeleteWidgetParams) {
    const s = snapshot.get();
    if (s === null) {
      throw new Error("animation api deleteWidget: snapshot is null");
    }
    const model = getModelById(params.id);
    if (model === null) {
      // TODO 给用户提示 model id 不存在
      return;
    }
    const action = WidgetRendererAction.create(s.widgetManagerModel, {
      type: "delete",
      model,
    });
    commitAction(action);
  },

  moveWidget(params: MoveWidgetParams) {
    const model = getModelById(params.id);
    if (model === null) {
      // TODO 给用户提示 model id 不存在
      return;
    }
    const action = WidgetAction.create(model, {
      type: "move",
      change: {
        x: params.x,
        y: params.y,
      },
    });
    commitAction(action);
  },

  resizeWidget(params: ResizeWidgetParams) {
    const model = getModelById(params.id);
    if (model === null) {
      // TODO 给用户提示 model id 不存在
      return;
    }
    const action = WidgetAction.create(model, {
      type: "resize",
      change: {
        w: params.width,
        h: params.height,
      },
    });
    commitAction(action);
  },

  changeWidgetColor(params: ChangeWidgetColorParams) {
    const model = getModelById(params.id);
    const color = params.color;
    if (model === null) {
      // TODO 给用户提示 model id 不存在
      return;
    }
    const action = WidgetAction.create(model, {
      type: "changeColor",
      change: color,
    });
    commitAction(action);
  },
};

export * from "./types";
