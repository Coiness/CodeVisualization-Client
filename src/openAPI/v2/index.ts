import { Number } from "./widgets/Number";
import { String } from "./widgets/String";
import { Stack } from "./widgets/Stack";
import { next } from "./common";
import { getParam, getParams, print, println } from "./io";

export const APIV2 = {
  Number,
  String,
  Stack,
  next,
  getParam,
  getParams,
  print,
  println,
};
export const $ = APIV2;
