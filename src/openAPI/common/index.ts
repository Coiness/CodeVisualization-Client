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
  private nowRow: number = 1;
  private rows: number[] = [1];

  constructor() {
    consoleSub.subscribe((c) => {
      this.console = c;
    });
  }

  nextStep(row?: number) {
    steps.push({ actions: cloneDeep(actions) });
    this.consoles.push(this.console);
    if (row) {
      this.nowRow = row;
    }
    this.rows.push(this.nowRow);
    this.console = null;
    actions.length = 0;
  }

  end() {
    ApiDriver.end({
      snapshot: defaultSnapshot,
      steps: cloneDeep(steps),
      consoles: this.consoles,
      heightlines: this.rows,
    });
    steps.length = 0;
    this.console = null;
    this.consoles = [];
    this.nowRow = 1;
    this.rows = [1];
  }
}

export const commonApi = new CommonApi();
