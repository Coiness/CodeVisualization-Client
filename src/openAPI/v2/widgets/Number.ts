import { API } from "../..";
import { NumberWidget, NumberWidgetType } from "../../animationApi/types/widget/Number";
import { createBaseWidget, createBaseWidgetProps } from "./baseWidget";

export interface createNumberProps extends createBaseWidgetProps {
  value: number;
}

export function Number(props: createNumberProps) {
  const numberWidget = API.animationApi.addWidget<NumberWidgetType>({
    type: "number",
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    numberValue: props.value,
  });
  createNumberWidget(numberWidget as NumberWidget);
  return numberWidget;
}

function createNumberWidget(obj: NumberWidget) {
  createBaseWidget(obj);
  Object.defineProperty(obj, "value", {
    set(v) {
      API.animationApi.changeWidgetValue({
        id: obj.id,
        value: v,
      });
    },
  });
}
