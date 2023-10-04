import { Number } from "./widgets/Number";
import { String } from "./widgets/String";
import { Stack } from "./widgets/Stack";
import { Line } from "./widgets/Line";
import { next } from "./common";
import { getParam, getParams, print, println } from "./io";

export const APIV2 = {
  Number,
  String,
  Stack,
  Line,
  next,
  getParam,
  getParams,
  print,
  println,
};
export const $ = APIV2;
