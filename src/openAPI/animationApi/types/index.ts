import { BaseWidgetType } from "./widget";
import {
  ChangeWidgetValueParams,
  ChangeWidgetColorParams,
  DeleteWidgetParams,
  MoveWidgetParams,
  ResizeWidgetParams,
} from "./widget/Base";

export interface AnimationApi {
  addWidget: <T extends BaseWidgetType>(p: T["addWidgetParams"]) => T["addWidgetResult"];
  deleteWidget: (p: DeleteWidgetParams) => void;
  moveWidget: (p: MoveWidgetParams) => void;
  resizeWidget: (p: ResizeWidgetParams) => void;
  changeWidgetValue: (p: ChangeWidgetValueParams) => void;
  changeWidgetColor: (p: ChangeWidgetColorParams) => void;
}
