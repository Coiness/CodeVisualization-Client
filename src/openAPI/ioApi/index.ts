import { consoleSub } from "../common/console";
import { ApiDriver } from "../driver";

export const ioApi = {
  getParam(name: string): unknown {
    return ApiDriver.initData?.[name] ?? undefined;
  },
  getParams(): { [key: string]: unknown } {
    return ApiDriver.initData ?? {};
  },
  print(str: string): void {
    consoleSub.next({
      type: "print",
      content: str,
    });
  },
  println(str: string): void {
    consoleSub.next({
      type: "println",
      content: str,
    });
  },
};
