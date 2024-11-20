//定义websocket的类型和接口

//这个Obj是一个对象类型，key是string或者number，value是any
import { Obj } from "../core";

export enum WSType {
  Project = "Project",
}

export interface WS {
  type: WSType;
  onMessage(data: string): void;
  send(data: string): void;
  close(): void;
}

const WS_HOST = "ws://localhost:3001";

//测试websocket
export function testWS() {
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

export async function createWS(type: WSType, data: Obj): Promise<WS> {
  const websocket = new WebSocket(WS_HOST);
  websocket.onopen = function () {
    websocket.send(
      JSON.stringify({
        type: "init",
        data: {
          type: type,
          ...data,
        },
      }),
    );
  };

  let resolve: (value: WS | PromiseLike<WS>) => void = () => {};

  const ws: WS = {
    type,
    onMessage: (data: string) => {},
    send(data: string) {
      let s = JSON.stringify({
        type: "message",
        data,
      });
      websocket.send(s);
    },
    close() {
      websocket.close();
    },
  };

  websocket.onmessage = function (msg) {
    let data = JSON.parse(msg.data);
    if (data.type === "ready") {
      resolve(ws);
    } else if (data.type === "message") {
      ws.onMessage(data.data);
    }
  };

  return new Promise((reso) => {
    resolve = reso;
  });
}
