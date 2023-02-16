import { WidgetRendererModel } from "../../components/widget";

export interface Snapshot {
  widgetManagerModel: WidgetRendererModel;
}

export type ProjectInfoKey =
  | "id"
  | "name"
  | "account"
  | "snapshot"
  | "permission";

export type ProjectInfo = {
  id: string;
  account: string;
  name: string;
  snapshot: Snapshot;
  permission: number;
};
