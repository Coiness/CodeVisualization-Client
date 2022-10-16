import "./widget.css";
import { WidgetModel, WidgetMap, WidgetProps, WidgetType } from "./widgets";
import { activeWidget, useStore } from "../../store";
import { SelectDrag } from "./selectDrag";

export interface WidgetManagerModel {
  widgets: WidgetModel[];
  width: number;
  height: number;
  color: string;
}

export interface WidgetManagerProps {
  model: WidgetManagerModel;
}

export type WidgetInfo = {
  type: WidgetType;
  id: string;
} | null;

export function Widget(props: WidgetProps) {
  const { model } = props;
  const WidgetComp = WidgetMap[model.type]();
  const WidgetCompRender = WidgetComp.render;
  const { x, y, width, height, color } = model;
  const [activeWidgetValue, setActiveWidget] =
    useStore<WidgetInfo>(activeWidget);
  const isActive = activeWidgetValue?.id === model.id;
  return (
    <div
      className="widget"
      onClick={() => {
        setActiveWidget({ type: model.type, id: model.id });
      }}
      style={{ left: x, top: y, width, height, backgroundColor: color }}
    >
      <WidgetCompRender {...props} />
      {isActive && <SelectDrag></SelectDrag>}
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
