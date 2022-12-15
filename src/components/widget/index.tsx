import "./widget.css";
import {
  WidgetModel,
  WidgetMap,
  WidgetProps,
  WidgetInfo,
  WidgetRenderMap,
  IWidget,
  BaseModel,
} from "./widgets";
import { activeWidget, useStore } from "../../store";
import { SelectDrag } from "./selectDrag";
import { useCallback, useEffect, useState } from "react";
import { xSet } from "../../core/undo";
import { WidgetAction } from "../../core/action/WidgetAction";
import { commitAction } from "../../core/action";
import { modelChange } from "../../core/diff/objDiff";

export interface WidgetManagerModel {
  widgets: WidgetModel[];
  width: number;
  height: number;
  color: string;
}

export interface WidgetManagerProps {
  model: WidgetManagerModel;
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
}

export const widgetModelManager = new WidgetModelManager();

export function useModelChange(model: BaseModel) {
  const [m, s] = useState({ ...model });
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
  return m;
}

export function Widget(props: WidgetProps) {
  const model = useModelChange(props.model);
  const WidgetModel = widgetModelManager.getModel(model);
  const WidgetCompRender = WidgetRenderMap[model.type];
  const { x, y, width, height, color } = model;
  const [activeWidgetValue, setActiveWidget] =
    useStore<WidgetInfo>(activeWidget);
  const isActive = activeWidgetValue?.id === model.id;
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

export function WidgetManager(props: WidgetManagerProps) {
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
