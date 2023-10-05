import { API } from "../..";
import { LineWidget, LineWidgetType } from "../../animationApi/types/widget/Line";
import { createBaseWidget, createBaseWidgetProps } from "./baseWidget";

export interface createLineProps extends createBaseWidgetProps {
  size: number;
  startNodeId: string;
  endNodeId: string;
  directional?: boolean;
}

export function Line(props: createLineProps) {
  const lineWidget = API.animationApi.addWidget<LineWidgetType>({
    type: "line",
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    color: props.color,
    size: props.size,
    startNodeId: props.startNodeId,
    endNodeId: props.endNodeId,
    directional: props.directional ?? true,
  });
  createLineWidget(lineWidget as LineWidget);
  return lineWidget;
}

function createLineWidget(obj: LineWidget) {
  createBaseWidget(obj);
}
