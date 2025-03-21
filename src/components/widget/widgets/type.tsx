import type { Subject } from "../../../common/utils";

export interface CommonModel {
  id: string;
  [key: string]: unknown;
}

export interface BaseModel extends CommonModel {
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export type WidgetModel = BaseModel;

export interface WidgetProps {
  model: WidgetModel;
  editable: boolean;
}

// todo 治理此处 any
export type CommonWidgetValue = any;

export interface IWidget {
  setDiscard: (discard: () => void) => void;
  setValue: (value: unknown) => void;
  getValue: () => unknown;
  toStringValue: () => string;
  getModel: () => WidgetModel;
  value$: Subject<CommonWidgetValue>;
}

export enum WidgetType {
  Number = "Number",
  String = "String",
  Stack = "Stack",
  Line = "Line",
}

export const WidgetTypeNameMap = {
  [WidgetType.Number]: "数字",
  [WidgetType.String]: "字符串",
  [WidgetType.Stack]: "栈",
  [WidgetType.Line]: "线",
};

export interface WidgetRenderProps {
  className: string;
  widget: IWidget;
  model: WidgetModel;
}

export type WidgetInfo = {
  // store用
  type: WidgetType;
  id: string;
  widget: IWidget;
} | null;
