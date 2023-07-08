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
  CommonModel,
} from "./widgets";
import { activeWidget, animateSpeed, useStore } from "../../store";
import { SelectDrag } from "./selectDrag";
import { useEffect, useRef, useState } from "react";
import { WidgetAction, WidgetActionData } from "../../core/action/WidgetAction";
import { widgetActionExeter, commitAction } from "../../core/action";
import { modelChange } from "../../core/diff/objDiff";
import { checkNil, linearAnimation } from "../../common/utils";
import {
  needSelectWidget,
  selectWidget,
} from "./controlPanelItem/SelectWidget";

export interface WidgetRendererModel extends CommonModel {
  widgets: (WidgetModel | null)[];
  width: number;
  height: number;
  color: string;
}

export interface WidgetRendererProps {
  model: WidgetRendererModel;
  editable: boolean;
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
  getWidget(model: WidgetModel) {
    if (this.widgetModels.hasOwnProperty(model.id)) {
      return this.widgetModels[model.id];
    }
    const widgetModel = WidgetMap[model.type](model);
    this.widgetModels[model.id] = widgetModel;
    widgetModel.setDiscard(() => {
      delete this.widgetModels[model.id];
    });
    return widgetModel;
  }

  /**
   * 暂未实现
   * @param params
   */
  createWidget(params: createWidgetParams) {}
}

export const widgetModelManager = new WidgetModelManager();

export function listenModelChange<T extends CommonModel>(
  model: T,
  callback: (model: T) => void
) {
  const sub = modelChange.subscribe((newModel) => {
    if ((newModel as T).id === model.id) {
      callback(newModel as T);
    }
  });
  return sub.unsubscribe;
}

// TODO 将这里变合理
export function useModelChange<T extends CommonModel>(model: T): T {
  const now = useRef<T>(model);
  const [m, s] = useState({ ...model });

  // 监听对应 model 的 change
  useEffect(() => {
    const sub = modelChange.subscribe((newModel) => {
      if ((newModel as T).id === m.id) {
        // console.log("DEBUG: model change");
        s({
          ...(newModel as T),
        });
        now.current = newModel as T;
      }
    });
    return sub.unsubscribe;
  }, [m.id]);

  // 监听 props 传过来的 change
  useEffect(() => {
    s({ ...model });
  }, [model]);

  if (now.current !== model) {
    now.current = model;
    // s({ ...model });
  }
  return now.current;
}

export function useWidgetAnimation(model: BaseModel) {
  const dom = useRef<HTMLDivElement>(null);
  const { x, y, width, height } = model;
  useEffect(() => {
    const sub = widgetActionExeter.subscribe((data) => {
      const { action, setStop, end } = data;
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
        setStop(
          linearAnimation(
            el,
            {
              top: [y, actionData.change.y, (n) => `${n}px`],
              left: [x, actionData.change.x, (n) => `${n}px`],
            },
            200 / animateSpeed.get(),
            end
          )
        );
      } else if (actionData.type === "resize") {
        setStop(
          linearAnimation(
            el,
            {
              width: [width, actionData.change.w, (n) => `${n}px`],
              height: [height, actionData.change.h, (n) => `${n}px`],
            },
            200 / animateSpeed.get(),
            end
          )
        );
      } else if (actionData.type === "changeColor") {
        setStop(() => {});
        end();
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
  const WidgetModel = widgetModelManager.getWidget(model);
  const WidgetCompRender = WidgetRenderMap[model.type];
  const { x, y, width, height, color } = model;
  const [activeWidgetValue, setActiveWidget] =
    useStore<WidgetInfo>(activeWidget);
  const isActive = activeWidgetValue?.id === model.id;
  const dom = useWidgetAnimation(model);
  const editable = props.editable;

  if (!checkNil({ x, y, width, height, color })) {
    console.log("ERROR: ", "参数缺失");
    return null;
  }
  return (
    <div
      className="widget"
      onMouseDown={() => {
        if (editable) {
          if (needSelectWidget.get()) {
            selectWidget.next(WidgetModel);
            return;
          }
          setActiveWidget({
            type: model.type,
            id: model.id,
            widget: WidgetModel,
          });
        }
      }}
      style={{
        left: x,
        top: y,
        width,
        height,
        backgroundColor: color,
        zIndex: isActive ? 99999 : 0,
      }}
      ref={dom}
    >
      <WidgetCompRender
        className="widgetComp"
        {...props}
        widget={WidgetModel}
      />
      <SelectDrag
        isActive={isActive}
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
    </div>
  );
}

export function WidgetRenderer(props: WidgetRendererProps) {
  const model = useModelChange(props.model);
  const widgetRendererRef = useRef<HTMLDivElement | null>(null);
  const { widgets, width, height, color } = model;
  const [, setActiveWidget] = useStore<WidgetInfo>(activeWidget);
  useEffect(() => {
    if (!props.editable) {
      setActiveWidget(null);
    }
  }, [props.editable, setActiveWidget]);

  return (
    <div
      className="widgetRenderer"
      ref={widgetRendererRef}
      style={{ width, height, backgroundColor: color }}
      onClick={(e) => {
        if(e.target === widgetRendererRef.current){
          activeWidget.set(null);
        }
      }}
    >
      {widgets.map((widgetModel) => {
        if (widgetModel === null) {
          return null;
        }
        return (
          <Widget
            key={widgetModel.id}
            model={widgetModel}
            editable={props.editable}
          ></Widget>
        );
      })}
    </div>
  );
}
