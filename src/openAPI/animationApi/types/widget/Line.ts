import { BaseAddWidgetParams, BaseWidget, BaseWidgetType } from "./Base";
export interface LineWidget extends BaseWidget {
  size: number;
  startNodeId: string;
  endNodeId: string;
}
export interface AddLineWidgetParams extends BaseAddWidgetParams {
  type: "line";
  size: number;
  startNodeId: string;
  endNodeId: string;
}
export interface LineWidgetType extends BaseWidgetType {
  addWidgetParams: AddLineWidgetParams;
  addWidgetResult: LineWidget;
}
