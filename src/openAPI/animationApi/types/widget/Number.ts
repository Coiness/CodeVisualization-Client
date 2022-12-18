import { BaseWidget, BaseWidgetType } from "./Base";

export interface NumberWidget extends BaseWidget {
  value: number;
}
export interface AddNumberWidgetParams {
  numberValue: number;
}
export interface NumberWidgetType extends BaseWidgetType {
  addWidgetParams: AddNumberWidgetParams;
  addWidgetResult: NumberWidget;
}
