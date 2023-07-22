import { API } from "../../";
import { getModelById } from "../../../components/widget/widgets";
import { BaseWidget } from "../../animationApi/types/widget/Base";

export interface createBaseWidgetProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

// todo 这里每次获取 model 都要 get 一次，如果不这么做会拿不到最新的 model 的值，这种方式比较消耗性能，看看能不能优化一下
export function getModelGetter(id: string) {
  return function () {
    const m = getModelById(id);
    if (!m) {
      throw new Error("getModelGetter: model is undefined");
    }
    return m;
  };
}

export function createBaseWidget(obj: BaseWidget) {
  const getModel = getModelGetter(obj.id);
  Object.defineProperty(obj, "width", {
    set(v) {
      const model = getModel();
      API.animationApi.resizeWidget({
        id: model.id,
        width: v,
        height: model.height,
      });
    },
    get() {
      return getModel().width;
    },
  });

  Object.defineProperty(obj, "height", {
    set(v) {
      const model = getModel();
      API.animationApi.resizeWidget({
        id: model.id,
        width: model.width,
        height: v,
      });
    },
    get() {
      return getModel().height;
    },
  });

  Object.defineProperty(obj, "x", {
    set(v) {
      const model = getModel();
      API.animationApi.moveWidget({
        id: model.id,
        x: v,
        y: model.y,
      });
    },
    get() {
      return getModel().x;
    },
  });

  Object.defineProperty(obj, "y", {
    set(v) {
      const model = getModel();
      API.animationApi.moveWidget({
        id: model.id,
        x: model.x,
        y: v,
      });
    },
    get() {
      return getModel().y;
    },
  });

  Object.defineProperty(obj, "color", {
    set(v) {
      const model = getModel();
      API.animationApi.changeWidgetColor({
        id: model.id,
        color: v,
      });
    },
    get() {
      return getModel().color;
    },
  });
}
