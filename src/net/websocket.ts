import { Obj } from "../core";

export enum WSType {
  Project = "Project",
}

export interface WS {
  type: WSType;
  send(data: string): void;
  close(): void;
}

const WS_HOST = "ws://localhost:3001";

export function testWS() {
  console.log("DEBUG: ", "testWS");

  // 浏览器提供 WebSocket 对象
  var ws = new WebSocket(WS_HOST);

  // 发送
  ws.onopen = function () {
    ws.send("hello");
  };

  // 接收
  ws.onmessage = function (mes) {
    if (mes.data === "hello") {
      ws.close();
    }
  };
}

export async function createWS(
  type: WSType,
  onMessage: (data: string) => void,
  data: Obj
): Promise<WS> {
  const websocket = new WebSocket(WS_HOST);
  websocket.onopen = function () {
    ws.send(
      JSON.stringify({
        type: "init",
        data: {
          type: type,
          ...data,
        },
      })
    );
  };

  let resolve: (value: WS | PromiseLike<WS>) => void = () => {};

  const ws: WS = {
    type,
    send(data: string) {
      ws.send(
        JSON.stringify({
          type: "message",
          data,
        })
      );
    },
    close() {
      ws.close();
    },
  };

  websocket.onmessage = function (msg) {
    let data = JSON.parse(msg.data);
    if (data.type === "ready") {
      resolve(ws);
    } else if (data.type === "message") {
      onMessage(data.data);
    }
  };

  return new Promise((reso) => {
    resolve = reso;
  });
}
