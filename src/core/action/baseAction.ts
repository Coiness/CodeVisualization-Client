import { createOnlyId, Subject } from "../../common/utils";
import { ChangeSet } from "../diff/objDiff";
import { execDo } from "../undo";
import { WS } from "../../net";

export interface Action {
  type: string;
  id: string;
  data: unknown;
  cs: ChangeSet;
}

export abstract class BaseAction implements Action {
  type: string;
  id: string;
  data: unknown;
  cs: ChangeSet;

  constructor(data: unknown, cs: ChangeSet, type: string) {
    this.id = createOnlyId("action");
    this.type = type;
    this.data = data;
    this.cs = cs;
  }

  /**
   * 落地 action
   */
  commit() {
    applyAction(this);
  }

  /**
   * 执行动画 (player 使用)
   */
  abstract play(): Promise<void>;

  /**
   * 停止执行动画 (player 使用)
   */
  abstract stop(): void;
}

export const actionCommitter = new Subject<BaseAction>();

// export function changeModel() {}

/**
 * 应用 action
 *
 * 收到长链通知或者播放录像时触发
 *
 * @param action
 */
export function applyAction(action: Action) {
  const { cs } = action;
  execDo(cs);
}

export function commitAction(action: BaseAction) {
  actionCommitter.next(action);
  // 应用其中的 cs
  const { cs } = action;
  execDo(cs);
  sendAction(action);
}

export function awaitAction(action: Action): Promise<boolean> {
  return new Promise((resolve) => {
    resolve(true);
  });
}

export interface IO {
  setWS(ws: WS): void;
}

export class IO {
  private ws: WS | null = null;
  private handlerActioin: ((action: Action) => void) | null = null;

  setWS(ws: WS) {
    this.ws = ws;
    ws.onMessage = (str: string) => {
      let data = JSON.parse(str);
      if (data.type === "newAction") {
        if (this.handlerActioin !== null) {
          this.handlerActioin(data.action as Action);
        }
      }
    };
  }

  setHandlerAction(handlerAction: (action: Action) => void) {
    this.handlerActioin = handlerAction;
  }

  submitAction(action: Action) {
    if (this.ws === null) {
      return;
    }
    this.ws.send(
      JSON.stringify({
        type: "newAction",
        action: action,
      })
    );
  }
}

const io = new IO();
io.setHandlerAction(applyAction);

export const actionIO = io;

export function sendAction(action: Action) {
  // 发送 action
  actionIO.submitAction(action);
}
