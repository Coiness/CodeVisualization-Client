import { CreateNumberWidget, NumberWidgetModel } from "./numberWidget";

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
  render: (props: WidgetProps) => JSX.Element;
}

export enum WidgetType {
  Number = "Number",
  // String = "String",
}

export const WidgetMap: Record<WidgetType, () => IWidget> = {
  [WidgetType.Number]: CreateNumberWidget,
  // [WidgetType.String]: CreateNumberWidget,
};
