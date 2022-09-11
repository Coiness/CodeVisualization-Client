import "./widget.css";

interface WidgetModel {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  value: unknown;
}

export interface WidgetManagerModel {
  widgets: WidgetModel[];
  width: number;
  height: number;
  color: string;
}

interface WidgetProps {
  model: WidgetModel;
}

interface WidgetManagerProps {
  model: WidgetManagerModel;
}

export function Widget(props: WidgetProps) {
  const { model } = props;
  const { x, y, width, height, color } = model;
  return (
    <div
      className="widget"
      style={{ left: x, top: y, width, height, backgroundColor: color }}
    ></div>
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
        return <Widget model={widgetModel}></Widget>;
      })}
    </div>
  );
}
