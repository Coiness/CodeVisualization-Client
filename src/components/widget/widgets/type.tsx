import type { Subject } from "../../../common/utils";

export interface CommonModel {
  id: string;
}

export interface BaseModel extends CommonModel {
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  [key: string]: any;
}

export type WidgetModel = BaseModel;

export interface WidgetProps {
  model: WidgetModel;
  editable: boolean;
}

export interface IWidget {
  setDiscard: (discard: () => void) => void;
  setValue: (value: unknown) => void;
  getValue: () => unknown;
  value$: Subject<any>;
}

export enum WidgetType {
  Number = "Number",
  String = "String",
  Stack = "Stack",
}

export const WidgetTypeNameMap = {
  [WidgetType.Number]: "数字",
  [WidgetType.String]: "字符串",
  [WidgetType.Stack]: "栈",
};

export interface WidgetRenderProps {
  className: any;
  widget: IWidget;
  model: WidgetModel;
}

export type WidgetInfo = {
  // store用
  type: WidgetType;
  id: string;
  widget: IWidget;
} | null;
