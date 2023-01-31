import { BaseWidgetType } from "./widget";
import { MoveWidgetParams, ResizeWidgetParams } from "./widget/Base";

export interface AnimationApi {
  addWidget: <T extends BaseWidgetType>(
    p: T["addWidgetParams"]
  ) => T["addWidgetResult"];
  moveWidget: (p: MoveWidgetParams) => void;
  resizeWidget: (p: ResizeWidgetParams) => void;
}
