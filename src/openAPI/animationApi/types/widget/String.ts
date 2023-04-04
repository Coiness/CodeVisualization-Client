import { BaseAddWidgetParams, BaseWidget, BaseWidgetType } from "./Base";
export interface StringWidget extends BaseWidget {
  value: string;
}
export interface AddStringWidgetParams extends BaseAddWidgetParams {
  type: "string";
  stringValue: string;
}
export interface StringWidgetType extends BaseWidgetType {
  addWidgetParams: AddStringWidgetParams;
  addWidgetResult: StringWidget;
}
