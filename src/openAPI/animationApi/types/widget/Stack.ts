import { BaseAddWidgetParams, BaseWidget, BaseWidgetType } from "./Base";

export interface StackWidget extends BaseWidget {
  size(): number;
  push(widget: BaseWidget): void;
  pop(): BaseWidget | null;
}
export interface AddStackWidgetParams extends BaseAddWidgetParams {
  type: "stack";
}
export interface StackWidgetType extends BaseWidgetType {
  addWidgetParams: AddStackWidgetParams;
  addWidgetResult: StackWidget;
}
