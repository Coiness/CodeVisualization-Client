import { sleep, Subject } from "../../common/utils";
import { ChangeSet } from "../diff/objDiff";
import { execDo } from "../undo";

export interface Action {
  id: string;
  data: unknown;
  cs: ChangeSet;
}

let nowPrefix = "";
let count = 0;

function createId(): string {
  let prefix = String(Date.now());
  if (prefix === nowPrefix) {
    nowPrefix = prefix;
    count = 0;
  } else {
    count++;
  }
  return `${prefix}:${count}`;
}

export class BaseAction implements Action {
  id: string;
  data: unknown;
  cs: ChangeSet;
  constructor(data: unknown, cs: ChangeSet) {
    this.id = createId();
    this.data = data;
    this.cs = cs;
  }
}

export const actionCommitter = new Subject<Action>();

// export function changeModel() {}

/**
 * 应用 action
 *
 * 收到长链通知或者播放录像时触发
 *
 * @param action
 */
export function applyAction(action: Action) {
  (async () => {
    // 将 action 交给对应拿着 model 的组件处理
    await sleep(1000);
    // 组件执行动画之后应用其中的 cs
    const { cs } = action;
    execDo(cs);
  })();
}

export function commitAction(action: Action) {
  actionCommitter.next(action);
  // 应用其中的 cs
  const { cs } = action;
  execDo(cs);
  sendAction(action);
}

export function sendAction(action: Action) {
  // 发送 action
}

export function awaitAction(action: Action): Promise<boolean> {
  return new Promise((resolve) => {
    resolve(true);
  });
}
