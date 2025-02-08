import { get, post } from "./request";

// 定义消息类型
export interface MessageInfo {
  id: number;
  content: string;
  role: "user" | "assistant";
}

export interface Chat {
  id: number;
  name: string;
  time: string;
}

// 定义接收消息的响应结构
export interface GetMessageResponseData {
  messages: MessageInfo[];
}

// 获取消息
export async function getMessage(): Promise<GetMessageResponseData> {
  let res = await get("message/get", {});
  return res.data;
}

// 发送消息
//todo: 实现流式传输
export async function sendMessage(content: string) {
  let res = await post("message/send", { content });
  return res.flag;
}
