import { API } from "..";
import { Subscription } from "../../common/utils";
import { InputContent } from "../../components/inputList";
import { actionCommitter, modelSwitcher, Video } from "../../core";
import { initVideoInfo } from "../../store";
import { ShowCodeInfo } from "../../view/algorithmEdit/ShowCode";
import { actions } from "../common/actions";
import { getDefaultSnapshot } from "../common/snapshot";
import { $, APIV2 } from "../v2";
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

export type EL = { error: Error | null; logs: string[][] };

function executeSafely(code: string, allowAttrs: string[], params: { [key: string]: unknown }): EL {
  let paramsKeys = Object.keys(params);
  let paramsStr = paramsKeys.join(",");
  let paramsValueStr = paramsKeys
    .map((item) => {
      return `params["${item}"]`;
    })
    .join(",");

  let attrs = getAllkeys(window);  //获取全局对象的所有属性
  attrs = attrs.filter((item) => {
    // 过滤掉允许使用的属性，只保留需要屏蔽的属性
    //不在特点黑名单中的属性，不包含连字符的属性，不在白名单的属性，不是控制台对象
    return !["eval"].includes(item) && !item.includes("-") && !allowAttrs.includes(item) && item !== "console";
  });
  let publicAttrs = allowAttrs;
  let attrsStr = attrs.join(",");//过滤后的属性列表，将这些属性名拼接成字符串
  let publicAttrsStr = publicAttrs.join(",");

  let logs: string[][] = [];
  let myConsole = {
    log(...args: string[]) {
      logs.push(args);
    },
  };
  // myConsole = console;
  let error: Error | null = null;

  try {
    //将过滤器中得到的不需要的属性，通过fill替换为undefined，创建一个安全的环境
    let c = `window.runCode = (params, myConsole) => {
							(function(${attrsStr}, ${publicAttrs}, ${paramsStr}, console){${code}})(
								${new Array(attrs.length).fill("undefined")},
								${publicAttrsStr},
								${paramsValueStr},
								myConsole
							)
					}`;
    eval(c);
    (window as unknown as { runCode: (...args: unknown[]) => void }).runCode(params, myConsole);
    API.commonApi.end();
  } catch (e) {
    error = e as Error;
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
  description: string = "";

  start(
    code: string,
    showCode: ShowCodeInfo | null,
    description: string,
    initData?: InputContent[],
  ): Promise<true | { error: Error | null; logs: string[][] }> {
    // 1.准备环境
    modelSwitcher.pushModel(getDefaultSnapshot());
    // 2.订阅动作收集器
    this.sub = actionCommitter.subscribe((action) => {
      actions.push(action);
    });

    // 3.处理输入参数
    this.initData = {};
    initData?.forEach((item) => {
      if (this.initData) {
        this.initData[item.key] = item.value;
      }
    });

    // 4.设置展示代码和描述
    this.showCode = showCode ?? null;
    this.description = description;

    // 5.初始化API
    if (this.showCode) {
      API.commonApi.start(this.showCode.list.map((item) => item.lang));
    } else {
      API.commonApi.start();
    }

    // 6.创造结果Promise
    let res = new Promise((resolve) => {
      this.r = resolve;
    }) as Promise<true | EL>;

    // 7.安全执行代码
    let { error, logs } = executeSafely(code, allowAttrs, { $ });

    // 8.处理错误
    if (error !== null) {
      console.log("DEBUG: ", error, logs);
      // 弹出报错框
      this.end(null, { error, logs });
    }

    return res;
  }

  end(v: Video | null, el: EL | null) {
    // 1.清理资源
    this.sub?.unsubscribe();
    modelSwitcher.popModel();

    // 2.处理执行失败的情况
    if (v === null) {
      this.r(el!);
      return;
    }

    // 3.处理成功的情况
    v.showCode = this.showCode;

    // 4.生成视频数据
    initVideoInfo.set({
      id: "",
      account: "",
      name: "",
      video: v,
      permission: 0,
      description: "",
    });

    // 5.解析Promise
    this.r(true);
  }
}

export const ApiDriver = new APIDriver();
