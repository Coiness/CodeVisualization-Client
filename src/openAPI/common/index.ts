import { steps } from "./steps";
import { actions } from "./actions";
import { getDefaultSnapshot } from "./snapshot";
import { cloneDeep } from "lodash";
import { ApiDriver } from "../driver";
import { ConsoleContent } from "../../core";
import { consoleSub } from "./console";
import { ShowCodeLanguage } from "../../view/algorithmEdit/type";

export class CommonApi {
  private console: ConsoleContent | null = null;
  private currentStepConsole: ConsoleContent[] = [];
  private consoles: (ConsoleContent | null)[] = [];
  private langs: ShowCodeLanguage[] = [];
  private nowRow: { [key: string]: number } = {};
  private rows: { [key: string]: number[] } = {};
  private isConsoleEnable: boolean = false;

  constructor() {
    //创建一个数组来存储控制台的输出
    this.currentStepConsole = [];

    consoleSub.subscribe((c) => {
      //不覆盖，而是添加到当前步骤的控制台输出中
      this.currentStepConsole.push(c);
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

    //如果有控制台输出，则将其添加到当前步骤的控制台输出中
    if (this.currentStepConsole.length > 0){
      this.isConsoleEnable = true;

      for(const console of this.currentStepConsole){
        this.consoles.push(console);
      }

      this.consoles.push(null);

      this.currentStepConsole = [];
    }else{
      this.consoles.push(null);
    }
    


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
    ApiDriver.end(
      {
        snapshot: getDefaultSnapshot(),
        steps: cloneDeep(steps),
        consoles: this.isConsoleEnable ? this.consoles : null,
        heightlines: this.isShowCodeEnable() ? this.rows : null,
        showCode: null,
      },
      null
    );
    steps.length = 0;
    this.console = null;
    this.consoles = [];
    this.nowRow = {};
    this.rows = {};
    this.langs = [];
  }
}

export const commonApi = new CommonApi();
