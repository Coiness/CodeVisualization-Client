import { API } from "../../";
import { BaseWidget } from "../../animationApi/types/widget/Base";

export interface createBaseWidgetProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export function createBaseWidget(obj: BaseWidget) {
  Object.defineProperty(obj, "width", {
    set(v) {
      API.animationApi.resizeWidget({
        id: obj.id,
        width: v,
        height: obj.height,
      });
    },
  });

  Object.defineProperty(obj, "height", {
    set(v) {
      API.animationApi.resizeWidget({
        id: obj.id,
        width: obj.width,
        height: v,
      });
    },
  });

  Object.defineProperty(obj, "x", {
    set(v) {
      API.animationApi.moveWidget({
        id: obj.id,
        x: v,
        y: obj.y,
      });
    },
  });

  Object.defineProperty(obj, "y", {
    set(v) {
      API.animationApi.moveWidget({
        id: obj.id,
        x: obj.x,
        y: v,
      });
    },
  });

  Object.defineProperty(obj, "color", {
    set(v) {
      API.animationApi.changeWidgetColor({
        id: obj.id,
        color: v,
      });
    },
  });
}
