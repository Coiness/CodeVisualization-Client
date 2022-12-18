import { BaseWidgetType } from "./widget";

export interface AnimationApi {
  addWidget: <T extends BaseWidgetType>(
    p: T["addWidgetParams"]
  ) => T["addWidgetResult"];
}
