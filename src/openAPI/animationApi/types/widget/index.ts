import { NumberWidgetType } from "./Number";
import { StringWidgetType } from "./String";
import { StackWidgetType } from "./Stack";
import { LineWidgetType } from "./Line";

export type { BaseWidgetType } from "./Base";

export type WidgetType = {
  Number: NumberWidgetType;
  String: StringWidgetType;
  Stack: StackWidgetType;
  Line: LineWidgetType;
};
