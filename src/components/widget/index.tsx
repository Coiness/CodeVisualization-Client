import "./widget.css";
import {
  WidgetModel,
  WidgetMap,
  WidgetProps,
  WidgetInfo,
  WidgetRenderMap,
  IWidget,
} from "./widgets";
import { activeWidget, useStore } from "../../store";
import { SelectDrag } from "./selectDrag";
import { useCallback, useState } from "react";
import { xSet } from "../../core/undo";

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

type MiniModel = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
};

export function Widget(props: WidgetProps) {
  const { model } = props;
  const WidgetModel = widgetModelManager.getModel(model);
  const WidgetCompRender = WidgetRenderMap[model.type];
  const [m, setM] = useState<MiniModel>(model);
  const { x, y, width, height, color } = m;
  const [activeWidgetValue, setActiveWidget] =
    useStore<WidgetInfo>(activeWidget);
  const isActive = activeWidgetValue?.id === model.id;
  const updateModel = useCallback(() => {
    setM({
      ...model,
    });
  }, [setM, model]);
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
          onDrag={(nx: number, ny: number) => {
            xSet(
              model,
              [
                ["x", x + nx],
                ["y", y + ny],
              ],
              updateModel
            );
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
