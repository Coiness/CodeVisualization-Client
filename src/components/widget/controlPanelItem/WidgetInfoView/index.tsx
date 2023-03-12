import "./widgetInfo.css";
import { activeWidget, useStore } from "../../../../store";
import { WidgetTypeNameMap } from "../../widgets";

export function WidgetInfoView() {
  const [activeWidgetValue] = useStore(activeWidget);
  if (activeWidgetValue === null) {
    return null;
  }
  const { type } = activeWidgetValue;
  return <div className="widgetInfoView">{WidgetTypeNameMap[type]}</div>;
}
