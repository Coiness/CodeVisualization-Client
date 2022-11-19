import { CreateNumberWidget, NumberWidgetRender } from "./numberWidget";
import { CreateStringWidget, StringWidgetRender } from "./stringWidget";

import { IWidget, WidgetModel, WidgetRenderProps, WidgetType } from "./type";

export const WidgetMap: Record<WidgetType, (model: WidgetModel) => IWidget> = {
  [WidgetType.Number]: CreateNumberWidget,
  [WidgetType.String]: CreateStringWidget,
};

export const WidgetRenderMap: Record<
  WidgetType,
  (props: WidgetRenderProps) => JSX.Element
> = {
  [WidgetType.Number]: NumberWidgetRender,
  [WidgetType.String]: StringWidgetRender,
};
