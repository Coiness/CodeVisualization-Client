import { API } from "../..";
import { StackWidget, StackWidgetType } from "../../animationApi/types/widget/Stack";
import { createBaseWidget, createBaseWidgetProps } from "./baseWidget";

export interface createStackProps extends createBaseWidgetProps {}

export function Stack(props: createStackProps) {
  const stackWidget = API.animationApi.addWidget<StackWidgetType>({
    type: "stack",
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    color: props.color,
  });
  createStackWidget(stackWidget as StackWidget);
  return stackWidget;
}

function createStackWidget(obj: StackWidget) {
  createBaseWidget(obj);
}
