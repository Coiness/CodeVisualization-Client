import type { Subject } from "../../../common/utils";

export interface BaseModel {
  id: string;
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
}

export interface IWidget {
  setValue: (value: unknown) => void;
  getValue: () => unknown;
  value$: Subject<any>;
}

export enum WidgetType {
  Number = "Number",
  String = "String",
}

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
