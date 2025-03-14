import { createStatus } from "./status";
import { WidgetInfo, WidgetType } from "../components/widget/widgets";
import { DisplayMode } from "../core";
import { HistoryInfo } from "../core/undo";
import { Snapshot } from "../view/project";

export const activeWidget = createStatus<WidgetInfo | null>(null);
export const activeWidgetType = createStatus<WidgetType | null>(null);
export const snapshot = createStatus<Snapshot | null>(null);
export const historyInfo = createStatus<HistoryInfo>({
  history: [],
  index: 0,
});
export const mode = createStatus<DisplayMode>("edit");
export const animateSpeed = createStatus<number>(1);
