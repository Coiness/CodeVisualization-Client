import { ioApi } from "../../ioApi";

export function getParam(name: string) {
  return ioApi.getParam(name);
}

export function getParams() {
  return ioApi.getParams();
}

export function print(str: string) {
  ioApi.print(str);
}

export function println(str: string) {
  ioApi.println(str);
}
