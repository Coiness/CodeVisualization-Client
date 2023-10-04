import { CreateLineWidget, LineWidgetRender } from "./lineWidget";
import { CreateNumberWidget, NumberWidgetRender } from "./numberWidget";
import { CreateStackWidget, StackWidgetRender } from "./stackWidget";
import { CreateStringWidget, StringWidgetRender } from "./stringWidget";

import { IWidget, WidgetModel, WidgetRenderProps, WidgetType } from "./type";

export const WidgetMap: Record<WidgetType, (model: WidgetModel) => IWidget> = {
  [WidgetType.Number]: CreateNumberWidget,
  [WidgetType.String]: CreateStringWidget,
  [WidgetType.Stack]: CreateStackWidget,
  [WidgetType.Line]: CreateLineWidget,
};

export const WidgetRenderMap: Record<WidgetType, (props: WidgetRenderProps) => JSX.Element> = {
  [WidgetType.Number]: NumberWidgetRender,
  [WidgetType.String]: StringWidgetRender,
  [WidgetType.Stack]: StackWidgetRender,
  [WidgetType.Line]: LineWidgetRender,
};
