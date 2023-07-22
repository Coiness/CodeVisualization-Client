import { API } from "../..";
import { StringWidget, StringWidgetType } from "../../animationApi/types/widget/String";
import { createBaseWidget, createBaseWidgetProps, getModelGetter } from "./baseWidget";

export interface createStringProps extends createBaseWidgetProps {
  value: string;
}

export function String(props: createStringProps) {
  const stringWidget = API.animationApi.addWidget<StringWidgetType>({
    type: "string",
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    stringValue: props.value,
  });
  createStringWidget(stringWidget as StringWidget);
  return stringWidget;
}

function createStringWidget(obj: StringWidget) {
  createBaseWidget(obj);
  const getModel = getModelGetter(obj.id);
  Object.defineProperty(obj, "value", {
    set(v) {
      API.animationApi.changeWidgetValue({
        id: obj.id,
        value: v,
      });
    },
    get() {
      return getModel().value;
    },
  });
}
