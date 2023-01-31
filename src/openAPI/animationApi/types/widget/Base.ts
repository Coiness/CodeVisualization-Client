export interface BaseWidget {
  id: string;
}

export interface BaseAddWidgetParams {
  type: string;
  color?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export interface BaseWidgetType {
  addWidgetParams: BaseAddWidgetParams;
  addWidgetResult: BaseWidget;
}

export interface MoveWidgetParams {
  id: string;
  x: number;
  y: number;
}

export interface ResizeWidgetParams {
  id: string;
  width: number;
  height: number;
}
