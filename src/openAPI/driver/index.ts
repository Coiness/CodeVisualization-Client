import { cloneDeep } from "lodash";
import { API } from "..";
import { Subscription } from "../../common/utils";
import { InputContent } from "../../components/inputList";
import { actionCommitter, modelSwitcher, Video } from "../../core";
import { initVideoInfo } from "../../store";
import { ShowCodeInfo } from "../../view/algorithmEdit/ShowCode";
import { actions } from "../common/actions";
import { defaultSnapshot } from "../common/snapshot";
import { allowAttrs } from "./allowAttrs";

// 获取对象中除 Symbol 外所有属性
function getAllkeys(obj: Object): string[] {
  const keys: string[] = [];
  let temp = obj;
  while (temp) {
    keys.push.apply(keys, Object.getOwnPropertyNames(temp));
    temp = Object.getPrototypeOf(temp); // 返回指定对象的原型（内部[[Prototype]]属性的值）
  }
  let s = new Set(keys);
  let arr: string[] = [];
  s.forEach((key) => {
    arr.push(key);
  });
  return arr;
}

export type EL = { error: Error | null; logs: any[][] };

function executeSafely(
  code: string,
  allowAttrs: string[],
  params: { [key: string]: any }
): EL {
  let paramsKeys = Object.keys(params);
  let paramsStr = paramsKeys.join(",");
  let paramsValueStr = paramsKeys
    .map((item) => {
      return `params["${item}"]`;
    })
    .join(",");

  let attrs = getAllkeys(window);
  attrs = attrs.filter((item) => {
    return (
      !["eval"].includes(item) &&
      !item.includes("-") &&
      !allowAttrs.includes(item) &&
      item !== "console"
    );
  });
  let publicAttrs = allowAttrs;
  let attrsStr = attrs.join(",");
  let publicAttrsStr = publicAttrs.join(",");

  let logs: any[][] = [];
  let myConsole = {
    log(...args: any[]) {
      logs.push(args);
    },
  };
  let error: Error | null = null;

  try {
    let c = `window.runCode = (params, myConsole, API) => {
						(function(${attrsStr}, ${publicAttrs}, ${paramsStr}, console){${code}})(
							${new Array(attrs.length).fill("undefined")},
							${publicAttrsStr},
							${paramsValueStr},
							myConsole
						)
						API.commonApi.end();
				}`;
    eval(c);
    (window as any).runCode(params, myConsole, API);
  } catch (e: any) {
    error = e;
  } finally {
    return { error, logs };
  }
}

// API 驱动
export class APIDriver {
  r: (value: true | EL) => void = () => {};
  initData: { [key: string]: string } | undefined = undefined;
  showCode: ShowCodeInfo | null = null;
  sub: Subscription | null = null;
  descrition: string = "";

  start(
    code: string,
    showCode: ShowCodeInfo | null,
    descrition: string,
    initData?: InputContent[]
  ): Promise<true | { error: Error | null; logs: any[][] }> {
    modelSwitcher.pushModel(cloneDeep(defaultSnapshot));
    this.sub = actionCommitter.subscribe((action) => {
      actions.push(action);
    });
    this.initData = {};
    initData?.forEach((item) => {
      if (this.initData) {
        this.initData[item.key] = item.value;
      }
    });

    this.showCode = showCode ?? null;
    this.descrition = descrition;

    if (this.showCode) {
      API.commonApi.start(this.showCode.list.map((item) => item.lang));
    } else {
      API.commonApi.start();
    }

    let res = new Promise((resolve) => {
      this.r = resolve;
    }) as Promise<true | EL>;

    let { error, logs } = executeSafely(code, allowAttrs, { API });

    if (error !== null) {
      console.log("DEBUG: ", error, logs);
      // 弹出报错框
      this.end(null, { error, logs });
    }

    return res;
  }

  end(v: Video | null, el: EL | null) {
    this.sub?.unsubscribe();
    modelSwitcher.popModel();

    if (v === null) {
      this.r(el!);
      return;
    }

    v.showCode = this.showCode;

    initVideoInfo.set({
      id: "",
      account: "",
      name: "",
      video: v,
      permission: 0,
      descrition: "",
    });

    this.r(true);
  }
}

export const ApiDriver = new APIDriver();
