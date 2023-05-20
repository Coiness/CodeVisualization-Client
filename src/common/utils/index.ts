import { useEffect, useState } from "react";

export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export interface Subscription {
  unsubscribe: () => void;
}

export class Subject<T> {
  private map = new Map<Symbol, (value: T) => void>();
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

export function cls(...args: any[]) {
  const arr = args.filter((item) => !!item);
  return arr.join(" ");
}

const LinearAnimationStepTime = 16;

/**
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
    [attr: string]: [
      start: number,
      end: number,
      toString: (now: number) => string
    ];
  },
  time: number,
  callback?: () => void
) {
  let step: [string, number, number, (now: number) => string][] = [];
  let count = time / LinearAnimationStepTime;
  for (let s in style) {
    step.push([
      s,
      style[s][0],
      (style[s][1] - style[s][0]) / count,
      style[s][2],
    ]);
  }
  const timer = setInterval(() => {
    count--;
    for (let item of step) {
      item[1] += item[2];
      const key = item[0];
      dom.style[key as any] = item[3](item[1]);
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

export function checkNil(obj: any) {
  for (let x in obj) {
    if (obj[x] === null || obj[x] === undefined) {
      return false;
    }
  }
  return true;
}

export function getLocationQuery(attr: string, s?: string) {
  if (!s) {
    s = window.location.search;
  }
  let t = s.substr(1).match(new RegExp("(^|&)" + attr + "=([^&]*)(&|$)"));
  return t != null ? t[2] : null;
}

export function getDoubleRandom(l: number, r: number) {
  return l + Math.random() * (r - l + 1);
}

export function getIntRandom(l: number, r: number) {
  return parseInt(`${getDoubleRandom(l, r)}`, 10);
}

export function randomColor(l: number, r: number) {
  return (
    "rgb(" +
    getIntRandom(l, r) +
    "," +
    getIntRandom(l, r) +
    "," +
    getIntRandom(l, r) +
    ")"
  );
}

export function getDateString(date: number) {
  let res = "";
  const dateObj = new Date(date);
  res += dateObj.getFullYear();
  res += "/";
  const M = dateObj.getMonth() + 1;
  res += M < 10 ? "0" + M : M;
  res += "/";
  res += dateObj.getDate();
  res += " ";
  const h = dateObj.getHours();
  res += h < 10 ? "0" + h : h;
  res += ":";
  const m = dateObj.getMinutes();
  res += m < 10 ? "0" + m : m;
  return res;
}

export function useReload() {
  const [flag, setFlag] = useState<boolean>(false);
  return () => {
    setFlag(!flag);
  };
}

export function useDomPropertyListener(
  dom: HTMLDivElement | null,
  property: string
): any {
  const [value, setValue] = useState(null);
  useEffect(() => {
    const timer = setInterval(() => {
      if (dom === null) {
        if (value !== null) {
          setValue(null);
        }
      }
      let v = (dom as any)[property];
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

export async function readUploadFileContent(file: File): Promise<string> {
  return new Promise((resolve) => {
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      resolve(reader.result as string);
    };
  });
}

export function observeDomSize(
  dom: HTMLElement,
  callback: (width: number, height: number) => void
) {
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

export function nav(url: string): void {
  window.location.href = url;
}
