import { getModelById, WidgetType } from "../../components/widget/widgets";
import {
  BaseAction,
  commitAction,
  WidgetAction,
  WidgetRendererAction,
} from "../../core";
import { actions } from "../common/actions";
import { AnimationApi } from "./types";
import {
  BaseWidgetType,
  MoveWidgetParams,
  ResizeWidgetParams,
} from "./types/widget/Base";
import { AddNumberWidgetParams } from "./types/widget/Number";
import { AddStringWidgetParams } from "./types/widget/String";
import { snapshot } from "../../store";

export const animationApi: AnimationApi = {
  addWidget<T extends BaseWidgetType>(params: T["addWidgetParams"]) {
    const s = snapshot.get();
    if (s === null) {
      throw new Error("animation api addWidget: snapshot is null");
    }
    let action: BaseAction | null = null;
    if (params.type === "number") {
      const p = params as AddNumberWidgetParams;
      action = WidgetRendererAction.create(s.widgetManagerModel, {
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
    } else if (params.type === "string") {
      const p = params as AddStringWidgetParams;
      action = WidgetRendererAction.create(s.widgetManagerModel, {
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
    } else {
      throw new Error("animationApi addWidget: params.type illegal");
    }
    if (action !== null) {
      actions.push(action);
      commitAction(action);
      return {
        id: (action.data as any).model.id,
        value: (action.data as any).model.value,
      } as T["addWidgetResult"];
    }
    return {} as T["addWidgetResult"];
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
    actions.push(action);
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
    actions.push(action);
    commitAction(action);
  },
};

export * from "./types";
