import { consoleSub } from "../common/console";

export const ioApi = {
  getParam(name: string): any {
    return;
  },
  getParams(): { [key: string]: any } {
    return [];
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
