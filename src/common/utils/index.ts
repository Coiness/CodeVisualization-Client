import { useEffect, useState } from "react";

export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export interface Subscription {
  unsubscribe: () => void;
}

//Symbol 是一种基本数据类型，它是唯一的并且是不可改变的
//Symbol() 函数会返回 symbol 类型的值，该类型具有静态属性和静态方法
//Symbol.for() 函数会被全局 symbol 注册表中的 symbol 返回
export class Subject<T> {
  //Map 对象保存键值对，并且能记住键的原始插入顺序。任何值(对象或者原始值) 都可以作为一个键或一个值。
  //第一个是键的类型，第二个是值的类型，这里是Symbol和(value: T) => void
  private map = new Map<Symbol, (value: T) => void>();

  //将值传递给所有的订阅者（此处是函数f）
  next(value: T): void {
    const map = this.map;
    map.forEach((f) => {
      f(value);
    });
  }

  subscribe(f: (value: T) => void): Subscription {
    const map = this.map;
    const key = Symbol();
    map.set(key, f);

    return {
      unsubscribe: () => {
        map.delete(key);
      },
    };
  }
}

//过滤掉假值
export function cls(...args: string[]) {
  const arr = args.filter((item) => !!item);
  return arr.join(" ");
}

//动画常量
const LinearAnimationStepTime = 16;

/**参数说明
 * 线性变化动画函数
 * @param dom 需要执行动画的 dom 元素
 * @param style 需要改变的样式
 * @param time 动画执行时间
 * @param callback 动画执行结束回调
 * @returns 停止执行动画
 */
export function linearAnimation(
  dom: HTMLElement,
  style: {
    [attr: string]: [start: number, end: number, toString: (now: number) => string];
  },
  time: number,
  callback?: () => void,
) {
  let step: [string, number, number, (now: number) => string][] = [];
  let count = time / LinearAnimationStepTime;
  for (let s in style) {
    step.push([s, style[s][0], (style[s][1] - style[s][0]) / count, style[s][2]]);
  }
  const timer = setInterval(() => {
    count--;
    for (let item of step) {
      item[1] += item[2];
      setDomStyle(dom.style, item[0] as keyof CSSStyleDeclaration, item[3](item[1]));
    }
    if (count <= 0) {
      clearInterval(timer);
      callback && callback();
    }
  }, LinearAnimationStepTime);
  return () => {
    clearInterval(timer);
  };
}

//设置DOM元素的样式
function setDomStyle<T extends object, K extends keyof T>(style: T, key: K, value: T[K]) {
  style[key] = value;
}

export const createOnlyId = (() => {
  let nowPrefix = "";
  let count = 0;
  return (pre = "default") => {
    let time = String(Date.now());
    if (time === nowPrefix) {
      count++;
    } else {
      nowPrefix = time;
      count = 0;
    }
    return `${pre}:${nowPrefix}:${count}`;
  };
})();

//检查对象是否所有属性都不为空
export function checkNil(obj: { [key: string]: unknown }) {
  for (let x in obj) {
    if (obj[x] === null || obj[x] === undefined) {
      return false;
    }
  }
  return true;
}

//获取URL中的参数
export function getLocationQuery(attr: string, s?: string) {
  if (!s) {
    s = window.location.search;
  }
  let t = s.substr(1).match(new RegExp("(^|&)" + attr + "=([^&]*)(&|$)"));
  return t != null ? t[2] : null;
}

//随机浮点数[l,r]
export function getDoubleRandom(l: number, r: number) {
  return l + Math.random() * (r - l + 1);
}

//随机整数[l,r]
export function getIntRandom(l: number, r: number) {
  return parseInt(`${getDoubleRandom(l, r)}`, 10);
}

//随机颜色
export function randomColor(l: number, r: number) {
  return "rgb(" + getIntRandom(l, r) + "," + getIntRandom(l, r) + "," + getIntRandom(l, r) + ")";
}

//日期字符串格式化（将时间戳转换为YYYY/MM/DD HH：MM）
export function getDateString(date: number) {
  let res = "";
  const dateObj = new Date(date);
  res += dateObj.getFullYear();
  res += "/";
  res += String(dateObj.getMonth() + 1).padStart(2, "0");
  res += "/";
  res += String(dateObj.getDate()).padStart(2, "0");
  res += " ";
  res += String(dateObj.getHours()).padStart(2, "0");
  res += ":";
  res += String(dateObj.getMinutes()).padStart(2, "0");
  return res;
}

//自定义hook，用于组件重新渲染
export function useReload() {
  const [flag, setFlag] = useState<boolean>(false);
  return () => {
    setFlag(!flag);
  };
}

//自定义hook，用于监听DOM属性的变化
export function useDomPropertyListener(dom: HTMLDivElement | null, property: keyof HTMLDivElement): unknown {
  const [value, setValue] = useState<unknown>(null);
  useEffect(() => {
    const timer = setInterval(() => {
      if (dom === null) {
        if (value !== null) {
          setValue(null);
        }
        return;
      }
      let v = dom[property];
      if (v !== value) {
        setValue(v);
      }
    }, 60);
    return () => {
      clearInterval(timer);
    };
  });
  return value;
}

// 下载字符串到本地文件
export function downloadString(fileName: string, str: string) {
  const blob = new Blob([str], {
    type: "text/plain;charset=utf-8",
  });
  const objectURL = URL.createObjectURL(blob);
  const aTag = document.createElement("a");
  aTag.href = objectURL;
  aTag.download = fileName;
  aTag.click();
  URL.revokeObjectURL(objectURL);
}

// 读取上传文件的内容
export async function readUploadFileContent(file: File): Promise<string> {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      resolve(reader.result as string);
    };
  });
}

// 监听DOM元素的大小变化
export function observeDomSize(dom: HTMLElement, callback: (width: number, height: number) => void) {
  const myObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      callback(entry.contentRect.width, entry.contentRect.height);
    });
  });

  myObserver.observe(dom);
  return function unobserve() {
    console.log("un");
    myObserver.unobserve(dom);
  };
}

// 导航到指定URL
export function nav(url: string): void {
  window.location.href = url;
}

// 创建一个可手动解决的Promise对象
export function createPromise(): [Promise<unknown>, Function] {
  let resolve: Function = () => {};
  let promise = new Promise((r) => {
    resolve = r;
  });
  return [promise, resolve];
}
