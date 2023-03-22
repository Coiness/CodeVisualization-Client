import { steps } from "./steps";
import { actions } from "./actions";
import { defaultSnapshot } from "./snapshot";
import { cloneDeep } from "lodash";
import { ApiDriver } from "../driver";
import { ConsoleContent } from "../../core";
import { consoleSub } from "./console";
import { ShowCodeLanguage } from "../../view/algorithmEdit/type";

export class CommonApi {
  private console: ConsoleContent | null = null;
  private consoles: (ConsoleContent | null)[] = [];
  private langs: ShowCodeLanguage[] = [];
  private nowRow: { [key: string]: number } = {};
  private rows: { [key: string]: number[] } = {};
  private isConsoleEnable: boolean = false;

  constructor() {
    consoleSub.subscribe((c) => {
      this.console = c;
    });
  }

  start(langs?: ShowCodeLanguage[]) {
    this.console = null;
    this.isConsoleEnable = false;
    if (langs) {
      this.langs = langs;
      this.langs.forEach((lang) => {
        this.nowRow[lang] = 1;
        this.rows[lang] = [1];
      });
    }
  }

  nextStep(...args: number[]) {
    steps.push({ actions: cloneDeep(actions) });
    if (this.console !== null) {
      this.isConsoleEnable = true;
    }
    this.consoles.push(this.console);

    if (this.isShowCodeEnable()) {
      if (args.length > 0) {
        if (args.length === this.langs.length) {
          for (let i = 0; i < args.length; i++) {
            this.nowRow[this.langs[i]] = args[i];
          }
        }
      }
      for (let i = 0; i < this.langs.length; i++) {
        this.rows[this.langs[i]].push(this.nowRow[this.langs[i]]);
      }
    }

    this.console = null;
    actions.length = 0;
  }

  isShowCodeEnable() {
    return this.langs.length !== 0;
  }

  end() {
    ApiDriver.end({
      snapshot: defaultSnapshot,
      steps: cloneDeep(steps),
      consoles: this.isConsoleEnable ? this.consoles : null,
      heightlines: this.isShowCodeEnable() ? this.rows : null,
      showCode: null,
    });
    steps.length = 0;
    this.console = null;
    this.consoles = [];
    this.nowRow = {};
    this.rows = {};
    this.langs = [];
  }
}

export const commonApi = new CommonApi();
