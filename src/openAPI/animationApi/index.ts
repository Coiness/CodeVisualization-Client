import { AnimationApi } from "./types";
import { BaseWidgetType } from "./types/widget/Base";

const animationApi: AnimationApi = {
  addWidget<T extends BaseWidgetType>(params: T["addWidgetParams"]) {
    return {} as T["addWidgetResult"];
  },
};

export * from "./types";
