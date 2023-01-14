export interface BaseWidget {
  width: number;
  height: number;
  x: number;
  y: number;
  color: string;
}

export interface BaseAddWidgetParams {
  type: string;
}

export interface BaseWidgetType {
  addWidgetParams: BaseAddWidgetParams;
  addWidgetResult: BaseWidget;
}
