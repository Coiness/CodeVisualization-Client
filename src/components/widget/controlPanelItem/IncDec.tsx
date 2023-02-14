import "./incdec.css";
import { Button } from "antd";
import { activeWidget, useStore } from "../../../store";
import { NumberWidget, WidgetType } from "../widgets";

export function IncDec() {
  const [activeWidgetValue] = useStore(activeWidget);
  if (!activeWidgetValue) {
    return null;
  }
  const { type, widget } = activeWidgetValue;
  if (type !== WidgetType.Number) {
    return null;
  }

  return (
    <div className="incdec">
      <Button
        onClick={() => {
          (widget as NumberWidget).inc();
        }}
      >
        自增
      </Button>
      <Button
        onClick={() => {
          (widget as NumberWidget).dec();
        }}
      >
        自减
      </Button>
    </div>
  );
}
