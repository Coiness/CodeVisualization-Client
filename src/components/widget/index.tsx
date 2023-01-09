import "./widget.css";
import {
  WidgetModel,
  WidgetMap,
  WidgetProps,
  WidgetInfo,
  WidgetRenderMap,
  IWidget,
  BaseModel,
  WidgetType,
} from "./widgets";
import { activeWidget, useStore } from "../../store";
import { SelectDrag } from "./selectDrag";
import { useEffect, useRef, useState } from "react";
import { WidgetAction, WidgetActionData } from "../../core/action/WidgetAction";
import { actionExeter, commitAction } from "../../core/action";
import { modelChange } from "../../core/diff/objDiff";
import { linearAnimation } from "../../common/utils";

export interface WidgetRendererModel {
  widgets: WidgetModel[];
  width: number;
  height: number;
  color: string;
}

export interface WidgetRendererProps {
  model: WidgetRendererModel;
}

export interface createWidgetParams {
  type: WidgetType;
  x?: number;
  y?: number;
}

export class WidgetModelManager {
  private widgetModels: { [id: string]: IWidget };
  constructor() {
    this.widgetModels = {};
  }
  getModel(model: WidgetModel) {
    if (this.widgetModels.hasOwnProperty(model.id)) {
      return this.widgetModels[model.id];
    }

    const widgetModel = WidgetMap[model.type](model);
    this.widgetModels[model.id] = widgetModel;
    return widgetModel;
  }
  createWidget(params: createWidgetParams) {}
}

export const widgetModelManager = new WidgetModelManager();

export function useModelChange(model: BaseModel) {
  const [m, s] = useState({ ...model });

  // 监听对应 model 的 change
  useEffect(() => {
    const sub = modelChange.subscribe((newModel) => {
      if ((newModel as BaseModel).id === m.id) {
        s({
          ...newModel,
        });
      }
    });
    return () => {
      sub.unsubscribe();
    };
  });

  // 监听 props 传过来的 change
  useEffect(() => {
    s({ ...model });
  }, [model]);

  return m;
}

export function useWidgetAnimation(model: BaseModel) {
  const dom = useRef<HTMLDivElement>(null);
  const { x, y, width, height } = model;
  useEffect(() => {
    const sub = actionExeter.subscribe((data) => {
      const { action, end } = data;
      if (action.type !== "Widget") {
        return;
      }
      const actionData = action.data as WidgetActionData;
      const { id } = actionData;
      if (id !== model.id) {
        return;
      }
      const el = dom.current;
      if (!el) {
        return;
      }
      if (actionData.type === "move") {
        linearAnimation(
          el,
          {
            top: [y, actionData.change.y, (n) => `${n}px`],
            left: [x, actionData.change.x, (n) => `${n}px`],
          },
          200,
          end
        );
      } else if (actionData.type === "resize") {
        linearAnimation(
          el,
          {
            width: [width, actionData.change.w, (n) => `${n}px`],
            height: [height, actionData.change.h, (n) => `${n}px`],
          },
          200,
          end
        );
      } else {
        throw new Error("widget exec action: action data type error");
      }
    });
    return () => {
      sub.unsubscribe();
    };
  });
  return dom;
}

export function Widget(props: WidgetProps) {
  const model = useModelChange(props.model);
  const WidgetModel = widgetModelManager.getModel(model);
  const WidgetCompRender = WidgetRenderMap[model.type];
  const { x, y, width, height, color } = model;
  const [activeWidgetValue, setActiveWidget] =
    useStore<WidgetInfo>(activeWidget);
  const isActive = activeWidgetValue?.id === model.id;
  const dom = useWidgetAnimation(model);
  if (!(x && y && width && height && color)) {
    return null;
  }
  return (
    <div
      className="widget"
      onClick={() => {
        setActiveWidget({
          type: model.type,
          id: model.id,
          widget: WidgetModel,
        });
      }}
      style={{ left: x, top: y, width, height, backgroundColor: color }}
      ref={dom}
    >
      <WidgetCompRender
        className="widgetComp"
        {...props}
        widget={WidgetModel}
      />
      {isActive && (
        <SelectDrag
          dragInfo={{
            x,
            y,
            onDrag: (nx: number, ny: number) => {
              const action = WidgetAction.create(model, {
                type: "move",
                change: { x: nx, y: ny },
              });
              commitAction(action);
            },
          }}
          resizeInfo={{
            width,
            height,
            onResize: (nw: number, nh: number) => {
              const action = WidgetAction.create(model, {
                type: "resize",
                change: { w: nw, h: nh },
              });
              commitAction(action);
            },
          }}
        ></SelectDrag>
      )}
    </div>
  );
}

export function WidgetRenderer(props: WidgetRendererProps) {
  const { model } = props;
  const { widgets, width, height, color } = model;

  return (
    <div
      className="widgetManager"
      style={{ width, height, backgroundColor: color }}
    >
      {widgets.map((widgetModel) => {
        return <Widget key={widgetModel.id} model={widgetModel}></Widget>;
      })}
    </div>
  );
}
