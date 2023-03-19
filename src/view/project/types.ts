import { WidgetRendererModel } from "../../components/widget";
import { HistoryInfo } from "../../core";

export interface Snapshot {
  widgetManagerModel: WidgetRendererModel;
}

export type ProjectInfoKey =
  | "id"
  | "name"
  | "account"
  | "snapshot"
  | "permission"
  | "descrition";

export type ProjectInfo = {
  id: string;
  account: string;
  name: string;
  snapshot: Snapshot;
  historyInfo?: HistoryInfo;
  permission: number;
  descrition: string;
};
