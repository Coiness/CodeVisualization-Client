import { animationApi } from "./animationApi";
import { commonApi } from "./common";
import { ioApi } from "./ioApi";

export * from "./type";
export * from "./animationApi";
export * from "./common";

export const API = {
  commonApi: commonApi,
  animationApi: animationApi,
  ioApi: ioApi,
};
