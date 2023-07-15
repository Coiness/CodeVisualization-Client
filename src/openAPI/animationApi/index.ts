import { AnimationApi } from "./types";
import { addWidget } from "./apis/addWidget";
import { deleteWidget } from "./apis/deleteWidget";
import { moveWidget } from "./apis/moveWidget";
import { resizeWidget } from "./apis/resizeWidget";
import { changeWidgetColor } from "./apis/changeWidgetColor";
import { changeWidgetValue } from "./apis/changeWidgetValue";

export const animationApi: AnimationApi = {
  addWidget,
  deleteWidget,
  moveWidget,
  resizeWidget,
  changeWidgetValue,
  changeWidgetColor,
};

export * from "./types";
