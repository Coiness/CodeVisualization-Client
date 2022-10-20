import { Subject } from "../../../common/utils";
import {
  CreateNumberWidget,
  NumberWidgetModel,
  NumberWidgetRender,
} from "./numberWidget";

export interface BaseModel {
  id: string;
  type: WidgetType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export type WidgetModel = BaseModel & NumberWidgetModel;

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
  // String = "String",
}

export const WidgetMap: Record<WidgetType, (model: WidgetModel) => IWidget> = {
  [WidgetType.Number]: CreateNumberWidget,
  // [WidgetType.String]: CreateNumberWidget,
};

export interface WidgetRenderProps {
  widget: IWidget;
  model: WidgetModel;
}

export const WidgetRenderMap: Record<
  WidgetType,
  (props: WidgetRenderProps) => JSX.Element
> = {
  [WidgetType.Number]: NumberWidgetRender,
  // [WidgetType.String]: CreateNumberWidget,
};

export type WidgetInfo = {
  // store用
  type: WidgetType;
  id: string;
  widget: IWidget;
} | null;
