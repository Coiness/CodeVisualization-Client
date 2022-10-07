import "./widget.css";
import { WidgetModel, WidgetMap, WidgetProps } from "./widgets";

export interface WidgetManagerModel {
  widgets: WidgetModel[];
  width: number;
  height: number;
  color: string;
}

export interface WidgetManagerProps {
  model: WidgetManagerModel;
}

export function Widget(props: WidgetProps) {
  const { model } = props;
  const WidgetComp = WidgetMap[model.type]();
  const WidgetCompRender = WidgetComp.render;
  return <WidgetCompRender {...props} />;
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
