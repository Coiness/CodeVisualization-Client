export interface BaseWidget {
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
}

export interface BaseWidgetType {
  addWidgetParams: unknown;
  addWidgetResult: unknown;
}
