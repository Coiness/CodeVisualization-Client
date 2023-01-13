import { Subject, Subscription } from "../common/utils";
import { WidgetInfo, WidgetType } from "../components/widget/widgets";
import { DisplayMode } from "../core";
import { HistoryInfo } from "../core/undo";
import { Snapshot } from "../view/project";

export interface Status<T> {
  get: () => T;
  set: (v: T) => void;
  subscribe: (f: (v: T) => void) => Subscription;
}

function createStatus<T>(defaultValue: T) {
  let value = defaultValue;
  const subject = new Subject<T>();
  return {
    get(): T {
      return value;
    },
    set(v: T) {
      value = v;
      subject.next(value);
    },
    subscribe(f: (v: T) => void) {
      return subject.subscribe(f);
    },
  };
}

export const activeWidget = createStatus<WidgetInfo>(null);
export const activeWidgetType = createStatus<WidgetType | null>(null);
export const snapshot = createStatus<Snapshot | null>(null);
export const historyInfo = createStatus<HistoryInfo>({
  history: [],
  index: 0,
});
export const mode = createStatus<DisplayMode>("edit");

const stores = {
  activeWidget,
  activeWidgetType,
  snapshot,
  historyInfo,
  mode,
};

(window as any).stores = stores;
