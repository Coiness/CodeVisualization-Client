import { steps } from "./steps";
import { actions } from "./actions";
import { defaultSnapshot } from "./snapshot";
import { cloneDeep } from "lodash";
import { ApiDriver } from "../driver";
import { ConsoleContent } from "../../core";
import { consoleSub } from "./console";

export class CommonApi {
  private console: ConsoleContent | null = null;
  private consoles: (ConsoleContent | null)[] = [];

  constructor() {
    consoleSub.subscribe((c) => {
      this.console = c;
    });
  }

  nextStep() {
    steps.push({ actions: cloneDeep(actions) });
    this.consoles.push(this.console);
    this.console = null;
    actions.length = 0;
  }

  end() {
    ApiDriver.end({
      snapshot: defaultSnapshot,
      steps: cloneDeep(steps),
      consoles: this.consoles,
    });
    steps.length = 0;
  }
}

export const commonApi = new CommonApi();
