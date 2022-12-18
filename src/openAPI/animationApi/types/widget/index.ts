import { NumberWidgetType } from "./Number";
import { StringWidgetType } from "./String";

export type { BaseWidgetType } from "./Base";

export type WidgetType = {
  Number: NumberWidgetType;
  String: StringWidgetType;
};
