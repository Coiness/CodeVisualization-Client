import { snapshot } from "../../../../store";
import { BaseWidgetType } from "../../types/widget";
import { AddNumberWidgetParams } from "../../types/widget/Number";
import { AddStackWidgetParams } from "../../types/widget/Stack";
import { AddStringWidgetParams } from "../../types/widget/String";
import { addNumber } from "./addNumber";
import { addStack } from "./addStack";
import { addString } from "./addString";

export function addWidget<T extends BaseWidgetType>(params: T["addWidgetParams"]) {
  const s = snapshot.get();
  if (s === null) {
    throw new Error("animation api addWidget: snapshot is null");
  }
  if (params.type === "number") {
    return addNumber(s, params as AddNumberWidgetParams);
  } else if (params.type === "string") {
    return addString(s, params as AddStringWidgetParams);
  } else if (params.type === "stack") {
    return addStack(s, params as AddStackWidgetParams);
  } else {
    throw new Error("animationApi addWidget: params.type illegal");
  }
}
