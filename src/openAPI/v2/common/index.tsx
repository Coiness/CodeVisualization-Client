import { commonApi } from "../../common";

export function next(...args: number[]) {
  commonApi.nextStep(...args);
}
