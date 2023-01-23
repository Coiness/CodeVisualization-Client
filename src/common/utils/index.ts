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
