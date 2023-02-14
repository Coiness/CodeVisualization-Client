import { Button } from "antd";
import { activeWidget, useStore } from "../../../store";
import { WidgetType } from "../widgets";
import { StringWidget } from "../widgets/stringWidget";
import "./stringControl.css";
export function StringControl() {
  const [activeWidgetValue] = useStore(activeWidget);
  if (!activeWidgetValue) {
    return null;
  }
  const { type, widget } = activeWidgetValue;
  if (type !== WidgetType.String) {
    return null;
  }

  return (
    <div className="stringControl">
      <Button
        onClick={() => {
          (widget as StringWidget).reverse();
        }}
      >
        反转
      </Button>
    </div>
  );
}
